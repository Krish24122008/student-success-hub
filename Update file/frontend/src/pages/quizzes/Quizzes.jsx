import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase.js'
import { api } from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
export default function Quizzes() {
  const { session } = useAuth(); const [mats, setMats] = useState([]); const [msg, setMsg] = useState('')
  const [z, setZ] = useState(null)
  useEffect(() => { supabase.from('study_materials').select('id,title').order('created_at', { ascending: false }).then(({ data }) => setMats(data || [])) }, [])
  async function start(m) {
    setMsg('Making your quiz…')
    try { const r = await api('/api/ai/quiz', { materialId: m.id }); setMsg('')
      setZ({ quizId: r.quizId, questions: r.questions, i: 0, correct: 0, picked: null, weak: [], done: false })
    } catch (e) { setMsg(e.message) }
  }
  function pick(j) {
    if (z.picked !== null) return
    const q = z.questions[z.i], ok = j === q.answer
    setZ({ ...z, picked: j, correct: z.correct + (ok ? 1 : 0), weak: ok || !q.topic ? z.weak : [...z.weak, q.topic] })
  }
  async function next() {
    if (z.i + 1 < z.questions.length) return setZ({ ...z, i: z.i + 1, picked: null })
    const score = Math.round((z.correct / z.questions.length) * 100)
    await supabase.from('quiz_attempts').insert({ quiz_id: z.quizId, user_id: session.user.id, score, weak_topics: [...new Set(z.weak)] })
    setZ({ ...z, done: true, score })
  }
  if (z?.done) return (<><h2>Quiz result: {z.score}%</h2>
    <p>{z.correct} of {z.questions.length} correct.</p>
    {z.weak.length > 0 && <div className="card"><b>Revise these topics:</b><p>{[...new Set(z.weak)].join(', ')}</p></div>}
    <button onClick={() => setZ(null)}>Back to quizzes</button>{' '}<Link to="/dashboard" className="btn alt">Dashboard</Link></>)
  if (z) { const q = z.questions[z.i]
    return (<><h2>Question {z.i + 1} of {z.questions.length}</h2><p style={{ color: 'var(--ink)' }}>{q.question}</p>
      {q.options.map((o, j) => <button key={j} className={'opt' + (z.picked !== null ? (j === q.answer ? ' right' : j === z.picked ? ' wrong' : '') : '')} onClick={() => pick(j)}>{o}</button>)}
      {z.picked !== null && <button onClick={next}>{z.i + 1 < z.questions.length ? 'Next question' : 'See result'}</button>}</>) }
  return (<><h2>Quizzes</h2><p>Pick a study material to get a 5-question quiz made from it.</p><p>{msg}</p>
    {mats.length === 0 && <div className="card">No study material yet. <Link to="/study">Upload a PDF first</Link>.</div>}
    {mats.map(m => <div className="card" key={m.id}><b>{m.title}</b><div style={{ marginTop: 8 }}><button onClick={() => start(m)}>Start quiz</button></div></div>)}</>)
}
