import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../services/supabase.js'
import { api } from '../../services/api.js'
const bubble = me => ({
  maxWidth: '85%', padding: '10px 14px', borderRadius: 14, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
  alignSelf: me ? 'flex-end' : 'flex-start', background: me ? 'var(--pri)' : '#fff', color: me ? '#fff' : 'var(--ink)',
  border: me ? 'none' : '1px solid var(--line)' })
export default function Chat() {
  const [mats, setMats] = useState([]); const [mat, setMat] = useState('')
  const [msgs, setMsgs] = useState([{ role: 'ai', text: 'Hi! Ask me anything about your studies. Pick a PDF above and I will answer from your notes.' }])
  const [text, setText] = useState(''); const [busy, setBusy] = useState(false); const end = useRef(null)
  useEffect(() => { supabase.from('study_materials').select('id,title').order('created_at', { ascending: false }).then(({ data }) => setMats(data || [])) }, [])
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, busy])
  async function send(e) {
    e.preventDefault()
    const q = text.trim(); if (!q || busy) return
    const history = msgs.filter(m => m.role !== 'err').slice(1).map(m => ({ role: m.role === 'user' ? 'user' : 'ai', text: m.text }))
    setMsgs(m => [...m, { role: 'user', text: q }]); setText(''); setBusy(true)
    try { const r = await api('/api/ai/chat', { message: q, history, materialId: mat || undefined }); setMsgs(m => [...m, { role: 'ai', text: r.reply }]) }
    catch (x) { setMsgs(m => [...m, { role: 'err', text: 'Error: ' + x.message }]) }
    setBusy(false)
  }
  return (<><h2>AI Chat</h2>
    <label>Answer from</label>
    <select value={mat} onChange={e => { setMat(e.target.value) }}>
      <option value="">General knowledge</option>
      {mats.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}</select>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 280, maxHeight: '55vh', overflowY: 'auto', padding: 12, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 14, marginBottom: 12 }}>
      {msgs.map((m, i) => <div key={i} style={m.role === 'err' ? { ...bubble(false), color: '#c2412d', borderColor: '#c2412d' } : bubble(m.role === 'user')}>{m.text}</div>)}
      {busy && <div style={bubble(false)}>Thinking…</div>}
      <div ref={end} /></div>
    <form onSubmit={send} style={{ display: 'flex', gap: 8, maxWidth: 'none', margin: 0, padding: 0, border: 0, background: 'none' }}>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Ask a question…" maxLength={1500} style={{ margin: 0 }} />
      <button disabled={busy || !text.trim()}>Send</button></form></>)
}
