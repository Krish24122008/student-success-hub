import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
// Plays one quiz: shows questions, marks answers, saves the score.
export default function QuizRunner({ quizId, questions, onExit }) {
  const { session } = useAuth()
  const [s, setS] = useState({ i: 0, correct: 0, picked: null, weak: [], done: false, score: 0, saveErr: '' })
  const q = questions[s.i]
  function pick(j) {
    if (s.picked !== null) return
    const ok = j === q.answer
    setS({ ...s, picked: j, correct: s.correct + (ok ? 1 : 0), weak: ok || !q.topic ? s.weak : [...s.weak, q.topic] })
  }
  async function next() {
    if (s.i + 1 < questions.length) return setS({ ...s, i: s.i + 1, picked: null })
    const score = Math.round((s.correct / questions.length) * 100)
    let saveErr = ''
    if (quizId) {
      const { error } = await supabase.from('quiz_attempts').insert({ quiz_id: quizId, user_id: session.user.id, score, weak_topics: [...new Set(s.weak)] })
      if (error) saveErr = 'Score could not be saved: ' + error.message
    }
    setS({ ...s, done: true, score, saveErr })
  }
  if (s.done) return (<><h2>Quiz result: {s.score}%</h2>
    <p>{s.correct} of {questions.length} correct.</p>
    {s.saveErr && <p className="err">{s.saveErr}</p>}
    {s.weak.length > 0 && <div className="card"><b>Revise these topics:</b><p>{[...new Set(s.weak)].join(', ')}</p></div>}
    <button onClick={onExit}>Back</button>{' '}<Link to="/dashboard" className="btn alt">Dashboard</Link></>)
  return (<><h2>Question {s.i + 1} of {questions.length}</h2><p style={{ color: 'var(--ink)' }}>{q.question}</p>
    {q.options.map((o, j) => <button key={j} className={'opt' + (s.picked !== null ? (j === q.answer ? ' right' : j === s.picked ? ' wrong' : '') : '')} onClick={() => pick(j)}>{o}</button>)}
    {s.picked !== null && <button onClick={next}>{s.i + 1 < questions.length ? 'Next question' : 'See result'}</button>}
    {' '}<button className="btn alt" style={{ background: '#fff', color: 'var(--pri)', border: '2px solid var(--pri)' }} onClick={onExit}>Quit quiz</button></>)
}
