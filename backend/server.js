// backend/server.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createClient } from '@supabase/supabase-js'
import removeBgRoutes from './routes/remove-bg.js'
import exportRoutes from './routes/export.js'
import projectRoutes from './routes/projects.js'
import templateRoutes from './routes/templates.js'
import creditRoutes from './routes/credits.js'
import paymentRoutes from './routes/payments.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Routes
app.use('/api/remove-bg', removeBgRoutes)
app.use('/api/export', exportRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/credits', creditRoutes)
app.use('/api/payments', paymentRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
})
