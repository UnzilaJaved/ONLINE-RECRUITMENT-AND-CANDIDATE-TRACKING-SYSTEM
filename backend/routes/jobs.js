import express from 'express'
import { supabase } from '../config/supabaseClient.js'

const router = express.Router()

// ─── GET /api/jobs ────────────────────────────────────────────────────────────
// Returns all open jobs. Supports optional query params:
//   search   – matches title, description, or department (case-insensitive)
//   type     – exact match on type ('Full Time', 'Part Time', 'Remote', 'Contract')
//   location – exact match on location
//
// Returns a flat array so the existing Jobs.jsx (setJobs(data)) works unchanged.
//
// jobs columns: id, title, description, department, location, status,
//               created_by, created_at, type, salary, experience
router.get('/', async (req, res) => {
  const { search = '', type = '', location = '' } = req.query

  let query = supabase
    .from('jobs')
    .select('id, title, description, department, location, type, salary, experience, created_at')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,department.ilike.%${search}%`
    )
  }

  if (type && type !== 'All') {
    query = query.eq('type', type)
  }

  if (location && location !== 'All') {
    query = query.eq('location', location)
  }

  const { data, error } = await query

  if (error) {
    console.error('Jobs fetch error:', error)
    return res.status(400).json({ error: error.message })
  }

  res.json(data || [])
})

// ─── GET /api/jobs/:id ────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('jobs')
    .select('id, title, description, department, location, type, salary, experience, created_at')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return res.status(404).json({ error: 'Job not found' })
    return res.status(400).json({ error: error.message })
  }

  res.json(data)
})

export default router