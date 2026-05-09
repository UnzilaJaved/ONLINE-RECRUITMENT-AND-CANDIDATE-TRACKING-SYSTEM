import express from 'express'
import { supabase } from '../config/supabaseClient.js'

const router = express.Router()

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
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

  // 1) Upsert profile (safe even if DB trigger already inserted it)
  const { error: profileError } = await supabase
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

  if (profileError) {
    return res.status(400).json({ error: profileError.message })
  }

  // 2) Upsert candidate row
  const { error: candidateError } = await supabase
    .from('candidates')
    .upsert(
      { user_id: userId },
      { onConflict: 'user_id' }
    )

  if (candidateError) {
    return res.status(400).json({ error: candidateError.message })
  }

  res.status(201).json({
    message: 'Account created successfully. Please check your email to confirm your account before logging in.',
    user: data.user
  })
})

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return res.status(400).json({ error: error.message })

  const user = data.user

  // Fetch role from profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return res.status(404).json({ error: 'Profile not found for this user' })
  }

  res.json({
    user,
    role: profile.role,
    fullName: profile.full_name
  })
})

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
// Invalidates the Supabase session server-side (best-effort)
router.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut()

  if (error) return res.status(400).json({ error: error.message })

  res.json({ message: 'Logged out successfully' })
})

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body

  if (!email) return res.status(400).json({ error: 'Email is required' })

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.CLIENT_URL}/reset-password`
  })

  if (error) return res.status(400).json({ error: error.message })

  // Always return success to avoid leaking whether the email exists
  res.json({ message: 'If an account with that email exists, a reset link has been sent.' })
})

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
// Called after user clicks the reset link (token comes from the URL hash on client)
router.post('/reset-password', async (req, res) => {
  const { accessToken, newPassword } = req.body

  if (!accessToken || !newPassword) {
    return res.status(400).json({ error: 'Access token and new password are required' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  // Set the session using the token from the email link
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: ''
  })

  if (sessionError) return res.status(400).json({ error: sessionError.message })

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) return res.status(400).json({ error: error.message })

  res.json({ message: 'Password updated successfully. You can now log in.' })
})

router.post('/admin-signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body
 
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' })
  }
 
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
 
  // 1) Create the Supabase Auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: 'hr'
      }
    }
  })
 
  if (error) return res.status(400).json({ error: error.message })
 
  if (!data?.user?.id) {
    return res.status(400).json({ error: 'Unable to create admin account' })
  }
 
  const userId = data.user.id
 
  // 2) Upsert profile with role = 'hr'
  //    (safe if a DB trigger already inserted the row)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        role: 'hr',
        email,
        full_name: `${firstName} ${lastName}`
      },
      { onConflict: 'id' }
    )
 
  if (profileError) {
    return res.status(400).json({ error: profileError.message })
  }
 
  // NOTE: No candidates row needed for HR accounts.
 
  res.status(201).json({
    message: 'Admin account created successfully. The new admin can now log in.'
  })
})

export default router