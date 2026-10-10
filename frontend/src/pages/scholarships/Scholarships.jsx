import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageBanner from '../../components/courses/PageBanner.jsx'
export default function Scholarships() {
  const { session } = useAuth(); const [rows, setRows] = useState([]); const [level, setLevel] = useState('')
  useEffect(() => { let q = supabase.from('scholarships').select('*').order('deadline'); if (level) q = q.eq('education_level', level); q.then(({ data }) => setRows(data || [])) }, [level])
  const save = id => supabase.from('saved_scholarships').upsert({ user_id: session.user.id, scholarship_id: id })
  return (<><PageBanner image="scholarship" title="Scholarships for students" text="Find verified scholarships that match your level and state, save them and apply before the deadline." actions={[{ to: '/courses', label: 'Upskill with free courses', kind: 'yel' }]} />
    <select value={level} onChange={e => setLevel(e.target.value)}><option value="">All levels</option><option>Diploma</option><option>Undergraduate</option></select>
    {rows.length === 0 && <p>No verified scholarships yet. An admin can add them in Supabase.</p>}
    {rows.map(s => (<div className="card" key={s.id}><b>{s.name}</b><p>{s.amount} · {s.education_level} · {s.state}</p>
      <p>Deadline: {s.deadline || 'See official site'} · <a href={s.source_url} target="_blank" rel="noreferrer">Source</a>{s.last_verified ? ` · Verified ${s.last_verified}` : ''}</p><button onClick={() => save(s.id)}>Save</button></div>))}</>)
}
