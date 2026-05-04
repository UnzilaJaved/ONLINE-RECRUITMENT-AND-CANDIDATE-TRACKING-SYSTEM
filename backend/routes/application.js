import express from 'express'
import multer from 'multer'
import path from 'path'
import { supabase } from '../config/supabaseClient.js'

const router = express.Router()

// ─── Multer config ─────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/resumes/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) return cb(null, true)
    cb(new Error('Only PDF and Word documents are allowed'))
  }
})

// ─── POST /api/applications ─────────────────────────────────
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const userId = req.body.userId
    const jobId = req.body.jobId
    const phone = req.body.phone
    const education = req.body.education
    const city = req.body.city
    const experience = req.body.experience
    const skills = req.body.skills
    const coverLetter = req.body.coverLetter

    if (!userId || !jobId) {
      return res.status(400).json({ error: 'userId and jobId are required' })
    }

    // 1. Get candidate
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (candidateError || !candidate) {
      return res.status(404).json({ error: 'Candidate not found' })
    }

    // 2. Prevent duplicate
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('candidate_id', candidate.id)
      .eq('job_id', jobId)
      .maybeSingle()

    if (existing) {
      return res.status(409).json({ error: 'Already applied' })
    }

    // 3. Update candidate
    const candidateUpdate = {}
    if (phone) candidateUpdate.phone = phone
    if (education) candidateUpdate.education = education
    if (req.file) candidateUpdate.resume_url = req.file.path

    if (Object.keys(candidateUpdate).length > 0) {
      const { error: updateError } = await supabase
        .from('candidates')
        .update(candidateUpdate)
        .eq('id', candidate.id)

      if (updateError) {
        return res.status(400).json({ error: updateError.message })
      }
    }

    // 4. Insert application
    const { data, error } = await supabase
      .from('applications')
      .insert({
        candidate_id: candidate.id,
        job_id: jobId,
        city: city || null,
        experience: experience || null,
        skills: skills || null,
        cover_letter: coverLetter || null,
        resume_snapshot: req.file ? req.file.path : null,
        status: 'applied'
      })
      .select()
      .single()

    if (error) {
      console.error("INSERT ERROR:", JSON.stringify(error, null, 2))
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json(data)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ─── GET /api/applications/:id ──────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params

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
      jobs(id, title, description, location, type, department, salary, experience),
      interviews(id, interview_date, mode, status)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Application not found' })
    }
    return res.status(400).json({ error: error.message })
  }

  res.json(data)
})

export default router