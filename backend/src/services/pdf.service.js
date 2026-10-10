import pdf from 'pdf-parse/lib/pdf-parse.js'
import { admin } from '../config/supabase.js'
const MAX = 30000
// Long PDFs: spread the text budget across the whole document (or focus on a topic) instead of using only the first pages.
function pick(text, topic) {
  if (text.length <= MAX) return text
  if (topic) {
    const key = topic.toLowerCase(), size = 3000, parts = []
    for (let i = 0; i < text.length; i += size) { const c = text.slice(i, i + size); if (c.toLowerCase().includes(key)) parts.push(c) }
    if (parts.length) return parts.join('\n').slice(0, MAX)
  }
  const n = 6, size = Math.floor(MAX / n), step = Math.floor((text.length - size) / (n - 1)), out = []
  for (let i = 0; i < n; i++) out.push(text.slice(i * step, i * step + size))
  return out.join('\n...\n')
}
export async function materialText(materialId, userId, topic) {
  const { data: m } = await admin.from('study_materials').select('*').eq('id', materialId).eq('user_id', userId).single()
  if (!m) throw new Error('Material not found.')
  const { data: file, error } = await admin.storage.from('study-materials').download(m.file_path)
  if (error) throw new Error(error.message)
  const { text } = await pdf(Buffer.from(await file.arrayBuffer()))
  const clean = (text || '').replace(/[ \t]+\n/g, '\n').trim()
  if (clean.length < 50) throw new Error('No readable text found. This PDF may be scanned images.')
  return { material: m, text: pick(clean, topic) }
}
