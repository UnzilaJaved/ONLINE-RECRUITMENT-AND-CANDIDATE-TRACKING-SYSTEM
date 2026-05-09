import express from 'express'
import { supabase } from '../../config/supabaseClient.js'

const router = express.Router()

// ─── Schema reference ─────────────────────────────────────────────────────────
// feedback     : id, interview_id, comments, recommendation ('hire'|'reject'),
//                created_by, created_at
// interviews   : id, application_id, interview_date, mode, interviewer_id, status
//
// FeedbackDecision.jsx stores: technicalScore, communicationScore,
// confidenceScore, cultureFit, finalDecision, feedback (detailed text).
// The DB only has 'comments' and 'recommendation' ('hire'|'reject').
// We JSON-stringify all score fields into comments and map finalDecision
// → recommendation before inserting.

function toRecommendation(finalDecision) {
  return (finalDecision || '').toLowerCase() === 'selected' ? 'hire' : 'reject'
}

// ─── GET /api/admin/feedback ──────────────────────────────────────────────────
// Powers FeedbackDecision.jsx — returns completed interviews awaiting decision,
// joined with candidate name, job title. Also returns stats.
router.get('/', async (req, res) => {
  try {
    // ── Stats ───────────────────────────────────────────────────────────────
    const [
      { count: pendingDecisions },
      { count: hireCount },
      { count: rejectCount },
      { count: finalRound },
    ] = await Promise.all([
      // Pending = completed interviews with no feedback yet
      supabase.from('interviews').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('feedback').select('*',   { count: 'exact', head: true }).eq('recommendation', 'hire'),
      supabase.from('feedback').select('*',   { count: 'exact', head: true }).eq('recommendation', 'reject'),
      supabase.from('interviews').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
    ])

    // ── Completed interviews (decision queue) ───────────────────────────────
    const { data: interviews, error: ivError } = await supabase
      .from('interviews')
      .select(`
        id,
        interview_date,
        mode,
        status,
        application_id,
        interviewer_id,
        applications(
          id,
          jobs(title),
          candidates(profiles(full_name))
        ),
        feedback(id, recommendation, comments, created_at)
      `)
      .order('interview_date', { ascending: false })

    if (ivError) return res.status(400).json({ error: ivError.message })

    // ── Resolve interviewer names (if present) ──────────────────────────────
    const interviewerIds = [...new Set(
      (interviews || [])
        .map((iv) => iv.interviewer_id)
        .filter(Boolean)
    )]

    let interviewerMap = {}
    if (interviewerIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', interviewerIds)
      ;(profiles || []).forEach((p) => { interviewerMap[p.id] = p.full_name })
    }

    const queue = (interviews || []).map((iv) => ({
      id:              iv.id,
      interviewDate:   iv.interview_date,
      mode:            iv.mode === 'onsite' ? 'On-site' : 'Google Meet',
      ivStatus:        iv.status,
      applicationId:   iv.application_id,
      candidateName:   iv.applications?.candidates?.profiles?.full_name ?? 'Unknown',
      jobTitle:        iv.applications?.jobs?.title                      ?? '—',
      interviewer:     interviewerMap[iv.interviewer_id] ?? 'Not assigned',
      decisionStatus:  iv.feedback?.length > 0
        ? (iv.feedback[0].recommendation === 'hire' ? 'Selected' : 'Rejected')
        : 'Pending Decision',
      existingFeedback: iv.feedback?.length > 0 ? iv.feedback[0] : null,
    }))

    res.json({
      stats: {
        pending:    pendingDecisions ?? 0,
        selected:   hireCount        ?? 0,
        rejected:   rejectCount      ?? 0,
        finalRound: finalRound       ?? 0,
      },
      queue,
    })
  } catch (err) {
    console.error('Admin feedback fetch error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ─── POST /api/admin/feedback ─────────────────────────────────────────────────
// Powers "Save Final Decision" in FeedbackDecision.jsx.
// We store all form scores in 'comments' as JSON alongside the detailed text.
// recommendation is mapped from finalDecision → 'hire' | 'reject'.
router.post('/', async (req, res) => {
  const {
    interviewId,
    createdBy,
    technicalScore,
    communicationScore,
    confidenceScore,
    cultureFit,
    finalDecision,
    feedback: detailedFeedback,
  } = req.body

  if (!interviewId || !finalDecision) {
    return res.status(400).json({ error: 'interviewId and finalDecision are required' })
  }

  const recommendation = toRecommendation(finalDecision)

  // Build a JSON payload for comments so no data is lost
  const commentsPayload = JSON.stringify({
    technicalScore:     technicalScore     ?? null,
    communicationScore: communicationScore ?? null,
    confidenceScore:    confidenceScore    ?? null,
    cultureFit:         cultureFit         ?? null,
    finalDecision,
    detailedFeedback:   detailedFeedback   ?? '',
  })

  // Upsert — one feedback record per interview
  const { data, error } = await supabase
    .from('feedback')
    .upsert(
      {
        interview_id:    interviewId,
        recommendation,
        comments:        commentsPayload,
        created_by:      createdBy ?? null,
      },
      { onConflict: 'interview_id' }
    )
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })

  // Update linked application status based on decision
  // First resolve the application_id via the interview row
  const { data: iv } = await supabase
    .from('interviews')
    .select('application_id')
    .eq('id', interviewId)
    .single()

  if (iv?.application_id) {
    const newStatus = recommendation === 'hire' ? 'offered' : 'rejected'
    await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', iv.application_id)
      .then(() => {}).catch(() => {})
  }

  res.status(201).json(data)
})

// ─── GET /api/admin/feedback/:interviewId ────────────────────────────────────
// Returns existing feedback for an interview (for pre-filling the form).
router.get('/:interviewId', async (req, res) => {
  const { interviewId } = req.params

  const { data, error } = await supabase
    .from('feedback')
    .select('id, interview_id, recommendation, comments, created_at, created_by')
    .eq('interview_id', interviewId)
    .maybeSingle()

  if (error) return res.status(400).json({ error: error.message })
  if (!data)  return res.json(null)

  // Parse comments JSON back into fields for the form
  let parsed = {}
  try { parsed = JSON.parse(data.comments || '{}') } catch {}

  res.json({
    id:                 data.id,
    interviewId:        data.interview_id,
    recommendation:     data.recommendation,
    createdAt:          data.created_at,
    technicalScore:     parsed.technicalScore      ?? '',
    communicationScore: parsed.communicationScore  ?? '',
    confidenceScore:    parsed.confidenceScore     ?? '',
    cultureFit:         parsed.cultureFit          ?? '',
    finalDecision:      parsed.finalDecision       ?? '',
    detailedFeedback:   parsed.detailedFeedback    ?? '',
  })
})

export default router