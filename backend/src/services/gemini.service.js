import { env } from '../config/env.js'
export async function ask(prompt, json = false) {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.gemini },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: json ? { responseMimeType: 'application/json' } : {} }) })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'AI request failed')
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return json ? JSON.parse(text) : text
}
