import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import candidateRoutes from './routes/candidate.js'
import jobsRoutes from './routes/jobs.js'
import applicationRoutes from './routes/application.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/candidate', candidateRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/applications', applicationRoutes)

app.get('/', (req, res) => {
  res.send('API running...')
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})