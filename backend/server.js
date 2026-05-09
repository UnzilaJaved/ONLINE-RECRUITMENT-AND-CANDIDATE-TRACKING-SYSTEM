import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import authRoutes             from './routes/auth.js'
import jobsRoutes             from './routes/jobs.js'
import applicationRoutes      from './routes/application.js'
import candidateRoutes        from './routes/candidate.js'
import adminRoutes            from './routes/admin/admin.js'
import adminApplicationRoutes from './routes/admin/admin-applications.js'
import adminJobRoutes         from './routes/admin/admin-jobs.js'
import adminInterviewRoutes   from './routes/admin/admin-interviews.js'
import adminFeedbackRoutes    from './routes/admin/admin-feedback.js'
import adminReportsRoutes     from './routes/admin/admin-reports.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// ─── Ensure resume upload folder exists ───────────────────────────────────────
const uploadDir = path.join(__dirname, 'uploads/resumes')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))

// Parse JSON for all routes except multipart (multer handles that in application route)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded resumes statically (HR panel can access them)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/candidate', candidateRoutes)

// Admin routes
app.use('/api/admin',                    adminRoutes)
app.use('/api/admin/applications',       adminApplicationRoutes)
app.use('/api/admin/jobs',               adminJobRoutes)
app.use('/api/admin/interviews',         adminInterviewRoutes)
app.use('/api/admin/feedback',           adminFeedbackRoutes)
app.use('/api/admin/reports',            adminReportsRoutes)

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))