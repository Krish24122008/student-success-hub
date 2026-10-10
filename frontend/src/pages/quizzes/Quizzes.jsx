import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase.js'
import { api } from '../../services/api.js'
import QuizRunner from '../../components/QuizRunner.jsx'
export default function Quizzes() {
  const [mats, setMats] = useState([]); const [saved, setSaved] = useState([])
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false)
  const [count, setCount] = useState(10); const [topic, setTopic] = useState('')
  const [play, setPlay] = useState(null)
  const load = () => {
    supabase.from('study_materials').select('id,title').order('created_at', { ascending: false }).then(({ data }) => setMats(data || []))
    supabase.from('quizzes').select('id,questions,created_at,study_materials(title)').order('created_at', { ascending: false })
      .then(({ data }) => setSaved(data || []))
  }
  useEffect(() => { load() }, [])
  async function start(m) {
    setBusy(true); setMsg('Making your quiz… long PDFs can take up to a minute.')
    try { const r = await api('/api/ai/quiz', { materialId: m.id, count, topic }); setMsg(''); setPlay({ quizId: r.quizId, questions: r.questions }) }
    catch (e) { setMsg('Error: ' + e.message) }
    setBusy(false)
  }
  if (play) return <QuizRunner quizId={play.quizId} questions={play.questions} onExit={() => { setPlay(null); load() }} />
  return (<><h2>Quizzes</h2>
    <h3>Your saved quizzes</h3>
    {saved.length === 0 && <div className="card">No saved quizzes yet. Make one below, or press “Make quiz” in the Study Assistant.</div>}
    {saved.map(z => <div className="card" key={z.id}><b>{z.study_materials?.title || 'Quiz'}</b>
      <p style={{ margin: '4px 0 8px' }}>{z.questions.length} questions · {new Date(z.created_at).toLocaleDateString()}</p>
      <button onClick={() => setPlay({ quizId: z.id, questions: z.questions })}>Take quiz</button></div>)}
    <h3 style={{ marginTop: 24 }}>Make a new quiz</h3>
    <div className="card"><label>Number of questions</label>
      <select value={count} onChange={e => setCount(+e.target.value)}><option value={5}>5</option><option value={10}>10</option><option value={15}>15</option></select>
      <label>Focus on a topic (optional)</label>
      <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. JavaScript, CSS, React" /></div>
    <p className={msg.startsWith('Error') ? 'err' : ''}>{msg}</p>
    {mats.length === 0 && <div className="card">No study material yet. <Link to="/study">Upload a PDF first</Link>.</div>}
    {mats.map(m => <div className="card" key={m.id}><b>{m.title}</b><div style={{ marginTop: 8 }}><button disabled={busy} onClick={() => start(m)}>{busy ? 'Please wait…' : 'Make quiz'}</button></div></div>)}</>)
}
