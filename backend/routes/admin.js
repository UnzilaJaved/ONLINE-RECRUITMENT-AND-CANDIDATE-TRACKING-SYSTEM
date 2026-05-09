import express from 'express'
import { supabase } from '../config/supabaseClient.js'

const router = express.Router()

// ─── GET /api/admin/dashboard ─────────────────────────────────────────────────
// Returns all stats the AdminDashboard needs in one call:
//   - counts: total apps, open jobs, shortlisted, scheduled interviews
//   - pipeline: count per application status
//   - recentApplications: latest 8, joined with candidate name + job title
//   - upcomingInterviews: next 5 scheduled interviews from today onwards
router.get('/dashboard', async (req, res) => {
  try {
    // 1. Counts (run in parallel)
    const [
      { count: totalApps },
      { count: openJobs },
      { count: shortlisted },
      { count: scheduledInterviews },
    ] = await Promise.all([
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'shortlisted'),
      supabase.from('interviews').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
    ])

    // 2. Pipeline: count per status
    const statuses = ['applied', 'shortlisted', 'interview', 'offered', 'rejected']
    const pipelineCounts = await Promise.all(
      statuses.map((s) =>
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', s)
      )
    )
    const pipeline = statuses.map((status, i) => ({
      status,
      count: pipelineCounts[i].count ?? 0,
    }))

    // 3. Recent applications (latest 8)
    const { data: recentApps, error: recentError } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        applied_at,
        experience,
        jobs ( title ),
        candidates (
          user_id,
          profiles ( full_name )
        )
      `)
      .order('applied_at', { ascending: false })
      .limit(8)

    if (recentError) return res.status(400).json({ error: recentError.message })

    // 4. Upcoming interviews (from now, scheduled only, next 5)
    const { data: upcomingRaw, error: interviewError } = await supabase
      .from('interviews')
      .select(`
        id,
        interview_date,
        mode,
        applications (
          jobs ( title ),
          candidates (
            profiles ( full_name )
          )
        )
      `)
      .eq('status', 'scheduled')
      .gte('interview_date', new Date().toISOString())
      .order('interview_date', { ascending: true })
      .limit(5)

    if (interviewError) return res.status(400).json({ error: interviewError.message })

    res.json({
      counts: {
        totalApps:            totalApps            ?? 0,
        openJobs:             openJobs             ?? 0,
        shortlisted:          shortlisted          ?? 0,
        scheduledInterviews:  scheduledInterviews  ?? 0,
      },
      pipeline,
      recentApplications: (recentApps || []).map((app) => ({
        id:          app.id,
        candidateName: app.candidates?.profiles?.full_name ?? 'Unknown',
        jobTitle:    app.jobs?.title ?? '—',
        experience:  app.experience  ?? '—',
        status:      app.status,
        appliedAt:   app.applied_at,
      })),
      upcomingInterviews: (upcomingRaw || []).map((iv) => ({
        id:            iv.id,
        candidateName: iv.applications?.candidates?.profiles?.full_name ?? 'Unknown',
        jobTitle:      iv.applications?.jobs?.title ?? '—',
        interviewDate: iv.interview_date,
        mode:          iv.mode,
      })),
    })
  } catch (err) {
    console.error('Admin dashboard error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ─── GET /api/admin/profile/:userId ──────────────────────────────────────────
// Returns the HR admin's profile row for the top-bar display.
router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .eq('id', userId)
    .eq('role', 'hr')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return res.status(404).json({ error: 'Admin profile not found' })
    return res.status(400).json({ error: error.message })
  }

  res.json(profile)
})

export default router