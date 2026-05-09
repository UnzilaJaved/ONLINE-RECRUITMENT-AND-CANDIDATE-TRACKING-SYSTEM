import express from 'express'
import { supabase } from '../../config/supabaseClient.js'

const router = express.Router()

// ─── Schema reference ─────────────────────────────────────────────────────────
// jobs : id, title, description, department, location, status ('open'|'closed'),
//        created_by, created_at, type, salary, experience

// ─── GET /api/admin/jobs ──────────────────────────────────────────────────────
// Powers ManageJobs.jsx — returns all jobs (not just open ones) with stats.
// Each job includes applicant count via sub-select.
// Supports: search, status ('open'|'closed'|'All'), department, sort
router.get('/', async (req, res) => {
  const { search = '', status = '', department = '', sort = 'newest' } = req.query

  try {
    // ── Stats (parallel, always over all jobs) ──────────────────────────────
    const [
      { count: totalJobs },
      { count: activeJobs },
      { count: closedJobs },
    ] = await Promise.all([
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
    ])

    // ── Fetch jobs ──────────────────────────────────────────────────────────
    let query = supabase
      .from('jobs')
      .select(`
        id, title, description, department, location, status,
        type, salary, experience, created_at,
        applications(count)
      `)
      .order('created_at', { ascending: sort !== 'newest' })

    if (status && status !== 'All') query = query.eq('status', status)
    if (department && department !== 'All') query = query.eq('department', department)
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,department.ilike.%${search}%,location.ilike.%${search}%`
      )
    }

    const { data, error } = await query
    if (error) return res.status(400).json({ error: error.message })

    const jobs = (data || []).map((j) => ({
      id:          j.id,
      title:       j.title,
      description: j.description  ?? '',
      department:  j.department   ?? '—',
      location:    j.location     ?? '—',
      status:      j.status,
      type:        j.type         ?? '—',
      salary:      j.salary       ?? '—',
      experience:  j.experience   ?? '—',
      createdAt:   j.created_at,
      applicants:  j.applications?.length ?? 0,   // count from sub-select
    }))

    res.json({
      stats: {
        total:  totalJobs  ?? 0,
        active: activeJobs ?? 0,
        closed: closedJobs ?? 0,
        draft:  0, // schema only has open/closed — no draft status
      },
      jobs,
    })
  } catch (err) {
    console.error('Admin jobs fetch error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ─── POST /api/admin/jobs ─────────────────────────────────────────────────────
// Powers "Create New Job" button in ManageJobs.jsx.
router.post('/', async (req, res) => {
  const { title, description, department, location, type, salary, experience, createdBy } = req.body

  if (!title) return res.status(400).json({ error: 'Job title is required' })

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      title,
      description: description ?? null,
      department:  department  ?? null,
      location:    location    ?? null,
      type:        type        ?? null,
      salary:      salary      ?? null,
      experience:  experience  ?? null,
      status:      'open',
      created_by:  createdBy   ?? null,
    })
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })

  res.status(201).json(data)
})

// ─── GET /api/admin/jobs/:id ──────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('jobs')
    .select('id, title, description, department, location, status, type, salary, experience, created_at')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return res.status(404).json({ error: 'Job not found' })
    return res.status(400).json({ error: error.message })
  }

  res.json(data)
})

// ─── PUT /api/admin/jobs/:id ──────────────────────────────────────────────────
// Powers the "Edit" button on each job card in ManageJobs.jsx.
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { title, description, department, location, type, salary, experience, status } = req.body

  const allowedStatuses = ['open', 'closed']
  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status must be open or closed' })
  }

  const updates = {}
  if (title       !== undefined) updates.title       = title
  if (description !== undefined) updates.description = description
  if (department  !== undefined) updates.department  = department
  if (location    !== undefined) updates.location    = location
  if (type        !== undefined) updates.type        = type
  if (salary      !== undefined) updates.salary      = salary
  if (experience  !== undefined) updates.experience  = experience
  if (status      !== undefined) updates.status      = status

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields provided to update' })
  }

  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })

  res.json(data)
})

// ─── DELETE /api/admin/jobs/:id ───────────────────────────────────────────────
// Powers the "Delete" button in ManageJobs.jsx.
// ON DELETE CASCADE on applications + interviews means child rows are cleaned up.
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  // Check the job exists first for a clear 404
  const { data: existing, error: checkError } = await supabase
    .from('jobs')
    .select('id')
    .eq('id', id)
    .single()

  if (checkError || !existing) return res.status(404).json({ error: 'Job not found' })

  const { error } = await supabase.from('jobs').delete().eq('id', id)
  if (error) return res.status(400).json({ error: error.message })

  res.json({ message: 'Job deleted successfully' })
})

export default router