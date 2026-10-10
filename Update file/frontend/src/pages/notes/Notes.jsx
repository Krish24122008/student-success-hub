import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase.js'
export default function Notes() {
  const [rows, setRows] = useState([])
  useEffect(() => { supabase.from('study_materials').select('*').order('created_at', { ascending: false }).then(({ data }) => setRows(data || [])) }, [])
  return (<><h2>My Notes</h2><p>Your uploaded materials and their summaries.</p>
    {rows.length === 0 && <div className="card">No notes yet. <Link to="/study">Upload a PDF</Link> to get started.</div>}
    {rows.map(m => (<div className="card" key={m.id}><b>{m.title}</b>
      <p style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{m.summary || 'No summary yet. Open Study Assistant and press Summarize.'}</p></div>))}</>)
}
