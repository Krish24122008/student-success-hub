import { supabase } from './supabase.js'

export const CATEGORIES = ['General', 'Courses', 'Study Assistant', 'Scholarships', 'Internships', 'Career Roadmap', 'Quizzes', 'Notes']
export const PAGE = 10

export function friendlyError(e) {
  const m = e?.message || String(e || '')
  if (/does not exist|schema cache|feedback_public|feedback_stats/i.test(m))
    return 'Feedback is not set up yet. Run supabase/migrations/002_feedback.sql in the Supabase SQL editor.'
  return m || 'Something went wrong. Please try again.'
}
export const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
export const who = r => (r.full_name || '').trim() || 'Student'
export const sub = r => [r.education_level, r.state].filter(Boolean).join(', ')

export async function listFeedback({ rating = 0, category = 'All', sort = 'new', from = 0, userId = null, excludeId = null, size = PAGE } = {}) {
  let q = supabase.from('feedback_public').select('*', { count: 'exact' })
  if (rating) q = q.eq('rating', rating)
  if (category !== 'All') q = q.eq('category', category)
  if (userId) q = q.eq('user_id', userId)
  if (excludeId) q = q.neq('id', excludeId)
  if (sort === 'high') q = q.order('rating', { ascending: false }).order('created_at', { ascending: false })
  else if (sort === 'low') q = q.order('rating', { ascending: true }).order('created_at', { ascending: false })
  else q = q.order('created_at', { ascending: false })
  const { data, count, error } = await q.range(from, from + size - 1)
  if (error) throw error
  return { rows: data || [], total: count || 0 }
}
export async function getFeedback(id) {
  const { data, error } = await supabase.from('feedback_public').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}
export async function getStats() {
  const { data, error } = await supabase.from('feedback_stats').select('*').single()
  if (error) throw error
  return data
}
export async function myFeedback() {
  const { data: s } = await supabase.auth.getSession()
  if (!s.session) return []
  const { data, error } = await supabase.from('feedback').select('*').eq('user_id', s.session.user.id)
  if (error) throw error
  return data || []
}
export async function saveFeedback({ rating, category, comment }) {
  const { data: s } = await supabase.auth.getSession()
  if (!s.session) throw new Error('Please log in to give feedback.')
  const { error } = await supabase.from('feedback').upsert(
    { user_id: s.session.user.id, rating, category, comment: comment.trim(), updated_at: new Date().toISOString() },
    { onConflict: 'user_id,category' })
  if (error) throw error
}
export async function deleteFeedback(id) {
  const { error } = await supabase.from('feedback').delete().eq('id', id)
  if (error) throw error
}
