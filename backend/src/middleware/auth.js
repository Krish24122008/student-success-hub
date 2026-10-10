import { admin } from '../config/supabase.js'
export async function requireUser(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  const { data, error } = await admin.auth.getUser(token)
  if (error || !data.user) return res.status(401).json({ error: 'Please log in again.' })
  req.user = data.user; next()
}
