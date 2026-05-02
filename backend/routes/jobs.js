import express from 'express'
import { supabase } from '../config/supabaseClient.js'

const router = express.Router()

// GET ALL JOBS (only open)
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return res.status(400).json({ error: error.message })
  }

  res.json(data)
})


// GET JOB BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(error)

    // better error handling
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Job not found' })
    }

    return res.status(400).json({ error: error.message })
  }

  res.json(data)
})

export default router