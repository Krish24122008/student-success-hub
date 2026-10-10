import { Router } from 'express'
import { requireUser } from '../middleware/auth.js'
import { admin } from '../config/supabase.js'
import { ask } from '../services/gemini.service.js'
import { materialText } from '../services/pdf.service.js'
const r = Router(); r.use(requireUser)
const wrap = fn => (req, res, next) => fn(req, res).catch(next)

r.post('/summarize', wrap(async (req, res) => {
  const { material, text } = await materialText(req.body.materialId, req.user.id)
  const summary = await ask(`Summarize these study notes in 8 short bullet points:\n\n${text}`)
  await admin.from('study_materials').update({ summary }).eq('id', material.id)
  res.json({ summary })
}))
r.post('/quiz', wrap(async (req, res) => {
  const { material, text } = await materialText(req.body.materialId, req.user.id)
  const questions = await ask(`Write 5 multiple-choice questions from these notes. Return JSON: [{"question":"","options":["","","",""],"answer":0,"topic":""}]\n\n${text}`, true)
  const { data: quiz, error } = await admin.from('quizzes').insert({ material_id: material.id, user_id: req.user.id, questions }).select('id').single()
  if (error) throw new Error(error.message)
  res.json({ quizId: quiz.id, questions })
}))
r.post('/roadmap', wrap(async (req, res) => {
  const { goal, skills, hours } = req.body
  const steps = await ask(`Create a 6-month roadmap for a student aiming to become a ${goal}. Current skills: ${skills || 'none'}. Hours per week: ${hours}. Return JSON: an array of 6 short strings, one per month.`, true)
  await admin.from('roadmaps').insert({ user_id: req.user.id, goal, steps })
  res.json({ steps })
}))
export default r
