import express from 'express'
import { supabase } from '../config/supabaseClient.js'

const router = express.Router()

// SIGNUP
router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: 'candidate'
      }
    }
  })

  if (error) return res.status(400).json({ error: error.message })
  if (!data?.user?.id) {
    return res.status(400).json({ error: 'Unable to create user account' })
  }

  const userId = data.user.id

  // 1) Ensure profile exists (safe even if trigger already inserted it)
  const { error: profileUpsertError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        role: 'candidate',
        email,
        full_name: `${firstName} ${lastName}`
      },
      { onConflict: 'id' }
    )

  if (profileUpsertError) {
    return res.status(400).json({ error: profileUpsertError.message })
  }

  // 2) Create candidate (also idempotent)
  const { error: candidateError } = await supabase
    .from('candidates')
    .upsert(
      { user_id: userId },
      { onConflict: 'user_id' }
    )

  if (candidateError) {
    return res.status(400).json({ error: candidateError.message })
  }

  res.json({ user: data.user })
})

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) return res.status(400).json({ error: error.message })

  const user = data.user

  // get role from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return res.status(404).json({ error: "Profile not found for this user" })
  }

  res.json({
    user,
    role: profile.role
  })
})

export default router