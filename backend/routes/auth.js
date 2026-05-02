import express from 'express'
import { supabase } from '../config/supabaseClient.js'

const router = express.Router()

// SIGNUP
router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) return res.status(400).json({ error: error.message })

  // create candidate record
  await supabase.from('candidates').insert({
    user_id: data.user.id
  })

  res.json(data)
})

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) return res.status(400).json({ error: error.message })

  res.json(data)
})

export default router