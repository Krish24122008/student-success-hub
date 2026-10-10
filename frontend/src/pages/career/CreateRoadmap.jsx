import { useState } from 'react'
import { api } from '../../services/api.js'
import PageBanner from '../../components/courses/PageBanner.jsx'
import { courses } from '../../data/courses/index.js'
export default function CreateRoadmap() {
  const [f, setF] = useState({ goal: 'Full Stack Developer', skills: '', hours: 10 }); const [steps, setSteps] = useState([]); const [msg, setMsg] = useState('')
  async function go(e) { e.preventDefault(); setMsg('Building…'); try { const r = await api('/api/ai/roadmap', f); setSteps(r.steps); setMsg('') } catch (x) { setMsg(x.message) } }
  return (<><PageBanner image="roadmap" title="Your career roadmap" text="Pick a goal and get a month-by-month plan. Every plan can start with one of our free courses." actions={[{ to: '/courses', label: 'See courses', kind: 'yel' }]} />
    <div className="cchips">{courses.map(c => <button type="button" key={c.slug} className="chip" onClick={() => setF({ ...f, goal: c.careers[0] })}>{c.icon} {c.careers[0]}</button>)}</div>
    <form onSubmit={go}><h2>Create your roadmap</h2>
    <input value={f.goal} onChange={e => setF({ ...f, goal: e.target.value })} placeholder="Career goal" />
    <input value={f.skills} onChange={e => setF({ ...f, skills: e.target.value })} placeholder="Current skills" />
    <input type="number" value={f.hours} onChange={e => setF({ ...f, hours: e.target.value })} placeholder="Hours per week" />
    <button>Generate roadmap</button></form><p>{msg}</p>
    {steps.map((s, i) => <div className="card" key={i}><b>Month {i + 1}:</b> {s}</div>)}</>)
}
