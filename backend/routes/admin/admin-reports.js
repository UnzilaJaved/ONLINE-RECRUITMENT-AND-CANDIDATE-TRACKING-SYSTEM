import express from 'express'
import { supabase } from '../../config/supabaseClient.js'

const router = express.Router()

// ─── GET /api/admin/reports ───────────────────────────────────────────────────
// Powers Reports.jsx — returns:
//   summary:    top 4 stat cards
//   byDept:     per-department table rows (applications, shortlisted, interviews, selected)
//   pipeline:   percentages for the visual pipeline bars
//   insights:   dynamically generated text bullets
router.get('/', async (req, res) => {
  try {
    // ── Summary counts (parallel) ───────────────────────────────────────────
    const [
      { count: totalApps },
      { count: shortlisted },
      { count: interviews },
      { count: offered },
    ] = await Promise.all([
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'shortlisted'),
      supabase.from('interviews').select('*',   { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'offered'),
    ])

    // ── All applications with job department info ────────────────────────────
    const { data: allApps, error: appsError } = await supabase
      .from('applications')
      .select('status, jobs(department)')

    if (appsError) return res.status(400).json({ error: appsError.message })

    // ── Build per-department breakdown ──────────────────────────────────────
    const deptMap = {}

    for (const app of (allApps || [])) {
      const dept = app.jobs?.department ?? 'General'
      if (!deptMap[dept]) {
        deptMap[dept] = { applications: 0, shortlisted: 0, interviews: 0, selected: 0 }
      }
      deptMap[dept].applications++
      if (app.status === 'shortlisted') deptMap[dept].shortlisted++
      if (app.status === 'interview')   deptMap[dept].interviews++
      if (app.status === 'offered')     deptMap[dept].selected++
    }

    // Map interviews to their department via application → job chain
    // interviews table doesn't have status on applications, so we count
    // applications with status='interview' as the interview count per dept
    const byDept = Object.entries(deptMap)
      .sort(([, a], [, b]) => b.applications - a.applications)
      .map(([department, counts]) => ({ department, ...counts }))

    // ── Pipeline percentages (relative to totalApps) ─────────────────────
    const safe = totalApps || 1
    const pipeline = [
      { label: 'Applications', value: '100%' },
      {
        label: 'Shortlisted',
        value: `${Math.round(((shortlisted ?? 0) / safe) * 100)}%`,
      },
      {
        label: 'Interviewed',
        value: `${Math.round(((interviews ?? 0) / safe) * 100)}%`,
      },
      {
        label: 'Selected',
        value: `${Math.round(((offered ?? 0) / safe) * 100)}%`,
      },
    ]

    // ── Insights (dynamic, data-driven) ────────────────────────────────────
    const topDept = byDept[0]?.department ?? 'Engineering'
    const conversionRate = totalApps
      ? `${Math.round(((shortlisted ?? 0) / totalApps) * 100)}%`
      : '0%'

    const insights = [
      `${topDept} roles received the highest volume of applications this cycle.`,
      `Shortlist conversion rate is currently ${conversionRate} across all departments.`,
      interviews > 0
        ? `${interviews} interview${interviews > 1 ? 's' : ''} conducted — ${offered ?? 0} offer${offered !== 1 ? 's' : ''} released so far.`
        : 'No interviews have been conducted yet this cycle.',
      offered > 0
        ? `Final offers are out — ensure onboarding is coordinated with the operations team.`
        : 'No offers released yet — advance shortlisted candidates to interviews.',
    ]

    res.json({
      summary: {
        totalApps:   totalApps   ?? 0,
        shortlisted: shortlisted ?? 0,
        interviews:  interviews  ?? 0,
        offered:     offered     ?? 0,
      },
      byDept,
      pipeline,
      insights,
    })
  } catch (err) {
    console.error('Admin reports error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router