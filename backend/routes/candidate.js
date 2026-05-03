import express from 'express'
import { supabase } from '../config/supabaseClient.js'

const router = express.Router()

router.get('/dashboard/:userId', async (req, res) => {
  const { userId } = req.params

  // get candidate id
  const { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select('id')
    .eq('user_id', userId)
    .single()

  let candidateId = candidate?.id

  // Backfill missing candidate row for users created before candidate upsert was added.
  if (candidateError && candidateError.code === 'PGRST116') {
    const { data: createdCandidate, error: createCandidateError } = await supabase
      .from('candidates')
      .upsert({ user_id: userId }, { onConflict: 'user_id' })
      .select('id')
      .single()

    if (createCandidateError) {
      return res.status(400).json({ error: createCandidateError.message })
    }

    candidateId = createdCandidate?.id
  } else if (candidateError) {
    return res.status(400).json({ error: candidateError.message })
  }

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      location,
      jobs(id, title, location, type, department),
      interviews(interview_date, mode)
    `)
    .eq('candidate_id', candidateId)

  if (error) return res.status(400).json({ error: error.message })

  res.json(data || [])
})

export default router