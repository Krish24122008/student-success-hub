import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase.js'
import { api } from '../../services/api.js'
export default function Notes() {
  const [rows, setRows] = useState(null); const [err, setErr] = useState(''); const [msg, setMsg] = useState('')
  const load = () => supabase.from('study_materials').select('*').order('created_at', { ascending: false })
    .then(({ data, error }) => { if (error) setErr(error.message); setRows(data || []) })
  useEffect(() => { load() }, [])
  async function summarize(m) {
    setMsg('Summarizing ' + m.title + '…')
    try { await api('/api/ai/summarize', { materialId: m.id }); setMsg(''); load() } catch (e) { setMsg('Error: ' + e.message) }
  }
  if (rows === null) return <><div className="skel" /><div className="skel" /></>
  return (<><h2>My Notes</h2><p>Your uploaded materials and their summaries.</p>
    {err && <p className="err">Could not load notes: {err}</p>}
    {msg && <p className={msg.startsWith('Error') ? 'err' : ''}>{msg}</p>}
    {rows.length === 0 && !err && <div className="card">No notes yet. <Link to="/study">Upload a PDF</Link> to get started.</div>}
    {rows.map(m => (<div className="card" key={m.id}><b>{m.title}</b>
      <p style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{m.summary || 'No summary yet.'}</p>
      {!m.summary && <button onClick={() => summarize(m)}>Summarize now</button>}</div>))}</>)
}
