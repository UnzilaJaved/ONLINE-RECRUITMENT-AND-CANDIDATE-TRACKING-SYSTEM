import express from 'express'
import { supabase } from '../../config/supabaseClient.js'

const router = express.Router()

// ─── Schema reference ─────────────────────────────────────────────────────────
// interviews : id, application_id, interview_date, mode ('online'|'onsite'),
//              interviewer_id, status ('scheduled'|'completed'), created_at
// No 'notes', 'duration', or 'stage' columns exist on interviews.
// InterviewSchedule.jsx collects mode as "Google Meet"/"On-site" — we map these
// to 'online'/'onsite' before inserting.

function toDbMode(uiMode) {
  const m = (uiMode || '').toLowerCase()
  if (m.includes('site') || m.includes('onsite')) return 'onsite'
  return 'online'
}

function toUiMode(dbMode) {
  return dbMode === 'onsite' ? 'On-site' : 'Google Meet'
}

// ─── GET /api/admin/interviews ────────────────────────────────────────────────
// Powers Interview Schedule queue + stats cards.
// Returns scheduled/upcoming interviews with candidate name, job title.
router.get('/', async (req, res) => {
  const { status = '', upcoming = '' } = req.query

  try {
    // ── Stats (always unfiltered) ───────────────────────────────────────────
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayIso     = today.toISOString()
    const tomorrowIso  = new Date(today.getTime() + 86400000).toISOString()
    const weekEndIso   = new Date(today.getTime() + 7 * 86400000).toISOString()

    const [
      { count: todayCount },
      { count: weekCount },
      { count: confirmedCount },
      { count: pendingCount },
    ] = await Promise.all([
      supabase.from('interviews').select('*', { count: 'exact', head: true })
        .gte('interview_date', todayIso).lt('interview_date', tomorrowIso),
      supabase.from('interviews').select('*', { count: 'exact', head: true })
        .gte('interview_date', todayIso).lte('interview_date', weekEndIso),
      supabase.from('interviews').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('interviews').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
    ])

    // ── List ────────────────────────────────────────────────────────────────
    let query = supabase
      .from('interviews')
      .select(`
        id,
        interview_date,
        mode,
        status,
        application_id,
        interviewer_id,
        applications(
          id,
          jobs(title),
          candidates(profiles(full_name))
        )
      `)
      .order('interview_date', { ascending: true })

    if (status && status !== 'All') query = query.eq('status', status)
    if (upcoming === 'true') query = query.gte('interview_date', new Date().toISOString())

    const { data, error } = await query
    if (error) return res.status(400).json({ error: error.message })

    const interviews = (data || []).map((iv) => ({
      id:            iv.id,
      interviewDate: iv.interview_date,
      mode:          toUiMode(iv.mode),
      status:        iv.status,
      applicationId: iv.application_id,
      interviewerId: iv.interviewer_id,
      candidateName: iv.applications?.candidates?.profiles?.full_name ?? 'Unknown',
      jobTitle:      iv.applications?.jobs?.title                      ?? '—',
    }))

    res.json({
      stats: {
        today:     todayCount     ?? 0,
        thisWeek:  weekCount      ?? 0,
        confirmed: confirmedCount ?? 0,
        pending:   pendingCount   ?? 0,
      },
      interviews,
    })
  } catch (err) {
    console.error('Admin interviews error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ─── POST /api/admin/interviews ───────────────────────────────────────────────
// Powers "Confirm Schedule" in InterviewSchedule.jsx.
// Requires applicationId, interviewDate, mode. interviewerId is optional.
// Also automatically moves the linked application status to 'interview'.
router.post('/', async (req, res) => {
  const { applicationId, interviewDate, mode, interviewerId } = req.body

  if (!applicationId || !interviewDate || !mode) {
    return res.status(400).json({ error: 'applicationId, interviewDate, and mode are required' })
  }

  const dbMode = toDbMode(mode)

  // Prevent duplicate interview for the same application
  const { data: existing } = await supabase
    .from('interviews')
    .select('id')
    .eq('application_id', applicationId)
    .eq('status', 'scheduled')
    .maybeSingle()

  if (existing) {
    return res.status(409).json({
      error: 'An interview is already scheduled for this application. Edit the existing one instead.'
    })
  }

  const { data, error } = await supabase
    .from('interviews')
    .insert({
      application_id: applicationId,
      interview_date: interviewDate,
      mode:           dbMode,
      interviewer_id: interviewerId ?? null,
      status:         'scheduled',
    })
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })

  // Move application to 'interview' status (fire-and-forget on error)
  await supabase
    .from('applications')
    .update({ status: 'interview' })
    .eq('id', applicationId)
    .then(() => {}).catch(() => {})

  res.status(201).json({
    ...data,
    mode: toUiMode(data.mode),
  })
})

// ─── GET /api/admin/interviews/:id ────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('interviews')
    .select(`
      id,
      interview_date,
      mode,
      status,
      application_id,
      interviewer_id,
      applications(
        id,
        jobs(title),
        candidates(profiles(full_name, email))
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return res.status(404).json({ error: 'Interview not found' })
    return res.status(400).json({ error: error.message })
  }

  res.json({
    id:            data.id,
    interviewDate: data.interview_date,
    mode:          toUiMode(data.mode),
    status:        data.status,
    applicationId: data.application_id,
    interviewerId: data.interviewer_id,
    candidateName: data.applications?.candidates?.profiles?.full_name ?? 'Unknown',
    email:         data.applications?.candidates?.profiles?.email      ?? '—',
    jobTitle:      data.applications?.jobs?.title                      ?? '—',
  })
})

// ─── PUT /api/admin/interviews/:id ────────────────────────────────────────────
// Powers the "Edit" button on each interview card in InterviewSchedule.jsx.
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { interviewDate, mode, status, interviewerId } = req.body

  const allowedStatuses = ['scheduled', 'completed']
  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Status must be 'scheduled' or 'completed'" })
  }

  const updates = {}
  if (interviewDate !== undefined) updates.interview_date  = interviewDate
  if (mode          !== undefined) updates.mode            = toDbMode(mode)
  if (status        !== undefined) updates.status          = status
  if (interviewerId !== undefined) updates.interviewer_id  = interviewerId

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields provided to update' })
  }

  const { data, error } = await supabase
    .from('interviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })

  res.json({ ...data, mode: toUiMode(data.mode) })
})

export default router