import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PageBanner from '../../components/courses/PageBanner.jsx'
export default function Internships() {
  const { session } = useAuth(); const [rows, setRows] = useState([])
  useEffect(() => { supabase.from('internships').select('*').then(({ data }) => setRows(data || [])) }, [])
  const save = id => supabase.from('saved_internships').upsert({ user_id: session.user.id, internship_id: id })
  return (<><PageBanner image="internship" title="Internships to start your career" text="Browse internships by skills, location and stipend. Finish a course first to build a stronger profile." actions={[{ to: '/courses', label: 'Build skills', kind: 'yel' }]} />{rows.length === 0 && <p>No verified internships yet.</p>}
    {rows.map(i => (<div className="card" key={i.id}><b>{i.title}</b><p>{i.location} · {i.stipend} · {i.duration}</p>
      <p>{(i.skills || []).join(', ')}{i.source_url && <> <a href={i.source_url} target="_blank" rel="noreferrer">Apply / details</a></>}</p><button onClick={() => save(i.id)}>Save</button></div>))}</>)
}
