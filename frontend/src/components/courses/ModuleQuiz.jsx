import { useState } from 'react'

// Short quiz at the end of every module. Score is saved with the learner's progress.
export default function ModuleQuiz({ module, previous, onFinish }) {
  const [picked, setPicked] = useState({})
  const [done, setDone] = useState(false)
  const score = module.quiz.reduce((s, q, i) => s + (picked[i] === q.a ? 1 : 0), 0)
  const finish = () => { setDone(true); onFinish && onFinish(score, module.quiz.length) }
  return (<div className="cquiz">
    <h3>📝 Quiz: {module.title}</h3>
    {previous && !done && <p className="note">Last score: {previous.score}/{previous.total}. Try again to improve it.</p>}
    {module.quiz.map((q, i) => (<div className="card" key={i}><b>{i + 1}. {q.q}</b>
      {q.o.map((o, j) => {
        const cls = done ? (j === q.a ? 'opt right' : picked[i] === j ? 'opt wrong' : 'opt') : (picked[i] === j ? 'opt picked' : 'opt')
        return <button type="button" key={j} className={cls} disabled={done} onClick={() => setPicked({ ...picked, [i]: j })}>{o}</button>
      })}</div>))}
    {!done
      ? <button type="button" disabled={Object.keys(picked).length < module.quiz.length} onClick={finish}>Submit answers</button>
      : <div className="next"><b>You scored {score} / {module.quiz.length}</b>
          <p style={{ margin: '4px 0 10px', color: 'var(--ink)' }}>{score === module.quiz.length ? 'Perfect! Move on to the next module. 🎉' : 'Good try. Review the lessons and attempt again.'}</p>
          <button type="button" className="btn alt" onClick={() => { setPicked({}); setDone(false) }}>Retry quiz</button></div>}
  </div>)
}
