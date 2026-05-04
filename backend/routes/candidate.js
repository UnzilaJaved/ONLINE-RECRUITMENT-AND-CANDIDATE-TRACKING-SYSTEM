import express from 'express'
import { supabase } from '../config/supabaseClient.js'

const router = express.Router()

// ─── GET /api/candidate/dashboard/:userId ─────────────────────────────────────
// Returns all applications for the logged-in candidate, joined with job info
// and any scheduled interviews. Only selects columns that exist in the schema.
//
// applications : id, candidate_id, job_id, status, applied_at, updated_at
// jobs         : id, title, description, department, location, status, type, salary, experience
// interviews   : id, application_id, interview_date, mode, status
router.get('/dashboard/:userId', async (req, res) => {
  const { userId } = req.params

  // 1. Resolve (or backfill) candidate row
  let { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (candidateError && candidateError.code === 'PGRST116') {
    // Backfill for accounts created before the upsert logic was added
    const { data: created, error: createError } = await supabase
      .from('candidates')
      .upsert({ user_id: userId }, { onConflict: 'user_id' })
      .select('id')
      .single()

    if (createError) return res.status(400).json({ error: createError.message })
    candidate = created
  } else if (candidateError) {
    return res.status(400).json({ error: candidateError.message })
  }

  // 2. Fetch applications — only real columns
  const { data, error } = await supabase
  .from('applications')
  .select(`
    id,
    status,
    applied_at,
    updated_at,
    city,
    experience,
    skills,
    cover_letter,
    jobs(id, title, location, type, department, salary, experience),
    interviews(id, interview_date, mode, status)
  `)
  .eq('candidate_id', candidate.id)
  .order('applied_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })

  res.json(data || [])
})

// ─── GET /api/candidate/profile/:userId ──────────────────────────────────────
// Returns profile info from the profiles table, enriched with candidate details
// and computed application stats.
//
// profiles    : id, role, full_name, email, created_at
// candidates  : id, user_id, phone, education, resume_url
router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .eq('id', userId)
    .single()

  if (profileError) {
    if (profileError.code === 'PGRST116') return res.status(404).json({ error: 'Profile not found' })
    return res.status(400).json({ error: profileError.message })
  }

  // Fetch candidate row for phone, education, resume_url
  const { data: candidate } = await supabase
    .from('candidates')
    .select('id, phone, education, resume_url')
    .eq('user_id', userId)
    .single()

  let stats = { total: 0, shortlisted: 0, interviews: 0, offered: 0 }

  if (candidate) {
    const { data: apps } = await supabase
      .from('applications')
      .select('status')
      .eq('candidate_id', candidate.id)

    if (apps) {
      stats.total       = apps.length
      stats.shortlisted = apps.filter(a => a.status === 'shortlisted').length
      stats.interviews  = apps.filter(a => a.status === 'interview').length
      stats.offered     = apps.filter(a => a.status === 'offered').length
    }
  }

  res.json({
    ...profile,
    phone:      candidate?.phone      || null,
    education:  candidate?.education  || null,
    resume_url: candidate?.resume_url || null,
    stats
  })
})

// ─── PUT /api/candidate/profile/:userId ──────────────────────────────────────
// Updates candidate profile.
// - full_name lives on profiles
// - phone, education, resume_url live on candidates
router.put('/profile/:userId', async (req, res) => {
  const { userId } = req.params
  const { fullName, phone, education } = req.body

  if (!fullName && !phone && !education) {
    return res.status(400).json({ error: 'Provide at least one field to update' })
  }

  // Update profiles
  if (fullName) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() })
      .eq('id', userId)

    if (profileError) return res.status(400).json({ error: profileError.message })
  }

  // Update candidates
  const candidateUpdate = {}
  if (phone)     candidateUpdate.phone     = phone
  if (education) candidateUpdate.education = education

  if (Object.keys(candidateUpdate).length > 0) {
    const { error: candidateError } = await supabase
      .from('candidates')
      .update(candidateUpdate)
      .eq('user_id', userId)

    if (candidateError) return res.status(400).json({ error: candidateError.message })
  }

  res.json({ message: 'Profile updated successfully' })
})

// ─── GET /api/candidate/application/:applicationId ────────────────────────────
// Detailed view of one application, joining job info and interview info.
// Also joins the candidate row to include phone/education/resume_url.
router.get('/application/:applicationId', async (req, res) => {
  const { applicationId } = req.params

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      applied_at,
      updated_at,
      city,
      experience,
      skills,
      cover_letter,
      candidates(id, phone, education, resume_url, user_id),
      jobs(id, title, description, location, type, department, salary, experience),
      interviews(id, interview_date, mode, status)
    `)
    .eq('id', applicationId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return res.status(404).json({ error: 'Application not found' })
    return res.status(400).json({ error: error.message })
  }

  // Attach the candidate's profile (name, email) from profiles table
  let profileData = null
  if (data.candidates?.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', data.candidates.user_id)
      .single()
    profileData = profile
  }

  res.json({ ...data, profile: profileData })
})

// ─── DELETE /api/candidate/application/:applicationId ─────────────────────────
// Withdraw an application — only allowed while status is still 'applied'.
// Verifies that the application belongs to the requesting user.
router.delete('/application/:applicationId', async (req, res) => {
  const { applicationId } = req.params
  const { userId } = req.body

  if (!userId) return res.status(400).json({ error: 'userId is required' })

  // Verify ownership via candidate row
  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!candidate) return res.status(404).json({ error: 'Candidate not found' })

  const { data: application, error: fetchError } = await supabase
    .from('applications')
    .select('id, status, candidate_id')
    .eq('id', applicationId)
    .single()

  if (fetchError || !application) {
    return res.status(404).json({ error: 'Application not found' })
  }

  if (application.candidate_id !== candidate.id) {
    return res.status(403).json({ error: 'Unauthorized: this application does not belong to you' })
  }

  if (application.status !== 'applied') {
    return res.status(400).json({
      error: 'You can only withdraw applications that are still under initial review'
    })
  }

  const { error: deleteError } = await supabase
    .from('applications')
    .delete()
    .eq('id', applicationId)

  if (deleteError) return res.status(400).json({ error: deleteError.message })

  res.json({ message: 'Application withdrawn successfully' })
})

export default router