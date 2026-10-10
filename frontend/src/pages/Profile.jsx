import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
export default function Profile() {
  const { session } = useAuth(); const nav = useNavigate()
  const [p, setP] = useState({ full_name: '', education_level: 'Diploma', state: '', skills: '', career_goal: 'Full Stack Developer' })
  useEffect(() => { supabase.from('profiles').select('*').eq('id', session.user.id).single()
    .then(({ data }) => data && setP(prev => ({ ...prev, ...data, skills: (data.skills || []).join(', ') }))) }, [])
  const set = k => e => setP({ ...p, [k]: e.target.value })
  async function save(e) {
    e.preventDefault()
    await supabase.from('profiles').update({ full_name: p.full_name, education_level: p.education_level, state: p.state,
      career_goal: p.career_goal, skills: p.skills.split(',').map(s => s.trim()).filter(Boolean) }).eq('id', session.user.id)
    nav('/dashboard')
  }
  return (<form onSubmit={save}><h2>Your profile</h2>
    <input placeholder="Name" value={p.full_name || ''} onChange={set('full_name')} />
    <select value={p.education_level || ''} onChange={set('education_level')}><option>Diploma</option><option>Undergraduate</option></select>
    <input placeholder="State" value={p.state || ''} onChange={set('state')} />
    <input placeholder="Skills, comma separated" value={p.skills} onChange={set('skills')} />
    <input placeholder="Career goal" value={p.career_goal || ''} onChange={set('career_goal')} />
    <button>Save profile</button></form>)
}
