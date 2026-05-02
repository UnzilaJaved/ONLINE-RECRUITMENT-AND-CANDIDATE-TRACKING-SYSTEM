import express from 'express'
import { supabase } from '../config/supabaseClient.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const {
    userId,
    jobId,
    fullName,
    email,
    phone,
    city,
    education,
    experience,
    skills,
    coverLetter
  } = req.body

  // get candidate
  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('user_id', userId)
    .single()

  // insert application
  const { data, error } = await supabase
    .from('applications')
    .insert({
      candidate_id: candidate.id,
      job_id: jobId,
      status: 'applied'
    })

  if (error) return res.status(400).json(error)

  res.json(data)
})

export default router