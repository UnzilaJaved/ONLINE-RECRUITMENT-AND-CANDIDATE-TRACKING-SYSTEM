import express from 'express'
import { supabase } from '../config/supabaseClient.js'

const router = express.Router()

router.get('/dashboard/:userId', async (req, res) => {
  const { userId } = req.params

  // get candidate id
  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('user_id', userId)
    .single()

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      jobs(title),
      interviews(interview_date, mode)
    `)
    .eq('candidate_id', candidate.id)

  if (error) return res.status(400).json(error)

  res.json(data)
})

export default router