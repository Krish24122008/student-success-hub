import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import ai from './routes/ai.routes.js'
import { errorHandler } from './middleware/error.js'
const app = express()
app.use(cors({ origin: env.frontend })); app.use(express.json())
app.get('/health', (_q, res) => res.json({ ok: true }))
app.use('/api/ai', ai); app.use(errorHandler)
app.listen(env.port, () => console.log(`API on ${env.port}`))
