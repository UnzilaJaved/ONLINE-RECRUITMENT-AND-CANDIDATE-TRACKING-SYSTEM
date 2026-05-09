import express from 'express'
import { supabase } from '../../config/supabaseClient.js'

const router = express.Router()

// ─── Schema reference ─────────────────────────────────────────────────────────
// applications : id, candidate_id, job_id, status, applied_at, updated_at,
//                city, experience, skills, cover_letter, resume_snapshot
// candidates   : id, user_id, phone, education, resume_url
// profiles     : id, full_name, email, role
// jobs         : id, title, department, location, type, salary, experience, status
// interviews   : id, application_id, interview_date, mode, status

// ─── GET /api/admin/applications ─────────────────────────────────────────────
// Powers Applications.jsx table + stats cards.
// Supports optional query params: search, status, role (job title), page, limit
router.get('/', async (req, res) => {
  const { search = '', status = '', role = '', page = 1, limit = 50 } = req.query
  const offset = (parseInt(page) - 1) * parseInt(limit)

  try {
    // ── Stats (run in parallel, always unfiltered) ──────────────────────────
    const [
      { count: total },
      { count: pending },
      { count: shortlisted },
      { count: rejected },
    ] = await Promise.all([
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'applied'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'shortlisted'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    ])

    // ── Paginated, filterable list ──────────────────────────────────────────
    let query = supabase
      .from('applications')
      .select(`
        id,
        status,
        applied_at,
        experience,
        skills,
        city,
        cover_letter,
        jobs(id, title, department, location, type),
        candidates(id, user_id, education, resume_url, profiles(full_name, email))
      `, { count: 'exact' })
      .order('applied_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1)

    if (status && status !== 'All') query = query.eq('status', status)

    const { data, error, count } = await query
    if (error) return res.status(400).json({ error: error.message })

    // Client-side search on name/role/email (Supabase can't ilike across joins)
    let results = (data || []).map((app) => ({
      id:            app.id,
      status:        app.status,
      appliedAt:     app.applied_at,
      experience:    app.experience    ?? '—',
      skills:        app.skills        ?? '',
      city:          app.city          ?? '—',
      coverLetter:   app.cover_letter  ?? '',
      candidateName: app.candidates?.profiles?.full_name ?? 'Unknown',
      email:         app.candidates?.profiles?.email      ?? '—',
      education:     app.candidates?.education            ?? '—',
      resumeUrl:     app.candidates?.resume_url           ?? null,
      candidateId:   app.candidates?.id                   ?? null,
      jobId:         app.jobs?.id                         ?? null,
      jobTitle:      app.jobs?.title                      ?? '—',
      department:    app.jobs?.department                 ?? '—',
      location:      app.jobs?.location                   ?? '—',
      jobType:       app.jobs?.type                       ?? '—',
    }))

    if (search) {
      const q = search.toLowerCase()
      results = results.filter(
        (r) =>
          r.candidateName.toLowerCase().includes(q) ||
          r.jobTitle.toLowerCase().includes(q)      ||
          r.email.toLowerCase().includes(q)
      )
    }

    if (role && role !== 'All') {
      results = results.filter((r) => r.jobTitle === role)
    }

    res.json({
      stats: {
        total:       total       ?? 0,
        pending:     pending     ?? 0,
        shortlisted: shortlisted ?? 0,
        rejected:    rejected    ?? 0,
      },
      applications: results,
      totalCount:   count ?? 0,
      page:         parseInt(page),
      limit:        parseInt(limit),
    })
  } catch (err) {
    console.error('Admin applications error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ─── GET /api/admin/applications/:id ─────────────────────────────────────────
// Powers CandidateDetails.jsx — full detail view of one application.
router.get('/:id', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      applied_at,
      updated_at,
      experience,
      skills,
      city,
      cover_letter,
      resume_snapshot,
      jobs(id, title, description, department, location, type, salary, experience),
      candidates(
        id,
        user_id,
        phone,
        education,
        resume_url,
        profiles(full_name, email)
      ),
      interviews(id, interview_date, mode, status)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return res.status(404).json({ error: 'Application not found' })
    return res.status(400).json({ error: error.message })
  }

  res.json({
    id:            data.id,
    status:        data.status,
    appliedAt:     data.applied_at,
    updatedAt:     data.updated_at,
    experience:    data.experience     ?? '—',
    skills:        data.skills         ?? '',
    city:          data.city           ?? '—',
    coverLetter:   data.cover_letter   ?? '',
    resumeSnapshot: data.resume_snapshot ?? null,
    candidateName: data.candidates?.profiles?.full_name ?? 'Unknown',
    email:         data.candidates?.profiles?.email      ?? '—',
    phone:         data.candidates?.phone                ?? '—',
    education:     data.candidates?.education            ?? '—',
    resumeUrl:     data.candidates?.resume_url           ?? null,
    candidateId:   data.candidates?.id                   ?? null,
    job:           data.jobs,
    interviews:    data.interviews ?? [],
  })
})

// ─── PATCH /api/admin/applications/:id/status ────────────────────────────────
// Powers the "Update" button in Applications.jsx and ShortlistManagement.jsx.
// Validates against the DB check constraint before updating.
// Also creates a notification for the candidate on status change.
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const allowed = ['applied', 'shortlisted', 'interview', 'offered', 'rejected']
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` })
  }

  // Fetch the application to get candidate's user_id for notification
  const { data: app, error: fetchError } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      candidates(user_id),
      jobs(title)
    `)
    .eq('id', id)
    .single()

  if (fetchError || !app) return res.status(404).json({ error: 'Application not found' })
  if (app.status === status) return res.json({ message: 'Status unchanged', status })

  // Update status
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', id)
    .select('id, status, updated_at')
    .single()

  if (error) return res.status(400).json({ error: error.message })

  // Insert notification for candidate (non-blocking — ignore failure)
  const notifType = status === 'interview' ? 'interview'
    : status === 'offered'     ? 'offer'
    : status === 'rejected'    ? 'rejection'
    : null

  if (notifType && app.candidates?.user_id) {
    const messages = {
      interview:  `Your application for ${app.jobs?.title ?? 'a role'} has been moved to the interview stage.`,
      offer:      `Congratulations! You have received a job offer for ${app.jobs?.title ?? 'a role'}.`,
      rejection:  `Your application for ${app.jobs?.title ?? 'a role'} was not selected this time.`,
    }

    await supabase.from('notifications').insert({
      user_id: app.candidates.user_id,
      type:    notifType,
      message: messages[notifType],
    }).then(() => {}).catch(() => {}) // fire-and-forget
  }

  res.json(data)
})

export default router