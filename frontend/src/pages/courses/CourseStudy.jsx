import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import CodeBlock from '../../components/courses/CodeBlock.jsx'
import ModuleQuiz from '../../components/courses/ModuleQuiz.jsx'
import ProgressBar from '../../components/courses/ProgressBar.jsx'
import { allLessons, getCourse } from '../../data/courses/index.js'
import { useCourseProgress } from '../../services/courseProgress.js'

export default function CourseStudy() {
  const { slug } = useParams(); const course = getCourse(slug); const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const p = useCourseProgress()
  const lessons = useMemo(() => (course ? allLessons(course) : []), [course])
  const quizId = params.get('quiz')
  const current = lessons.find(l => l.id === (params.get('lesson') || p.lastLesson(slug))) || lessons[0]
  const idx = lessons.indexOf(current)

  useEffect(() => { if (course) p.enroll(slug) }, [slug])                       // opening Study enrols you
  useEffect(() => { if (course && !quizId && current) p.setLast(slug, current.id) }, [current?.id, quizId])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [current?.id, quizId])

  if (!course) return (<div className="card"><h2>Course not found</h2><Link to="/courses" className="btn">Browse courses</Link></div>)
  const go = id => setParams({ lesson: id })
  const pct = p.percent(course)
  const quizModule = quizId && course.modules.find(m => m.id === quizId)
  const modOfCurrent = course.modules.find(m => m.lessons.includes(current))
  const lastInModule = modOfCurrent && modOfCurrent.lessons[modOfCurrent.lessons.length - 1] === current
  const next = lessons[idx + 1], prev = lessons[idx - 1]
  const completeAndNext = () => {
    p.toggleLesson(slug, current.id, true)
    if (lastInModule) setParams({ quiz: modOfCurrent.id }); else if (next) go(next.id)
  }

  return (<>
    <p className="crumbs"><Link to="/courses">Courses</Link> › <Link to={`/courses/${slug}`}>{course.title}</Link> › Study</p>
    <div className="cstudy-top"><div><h2 style={{ margin: 0 }}>{course.icon} {course.title}</h2><ProgressBar value={pct} /></div>
      <Link to={`/courses/${slug}`} className="btn alt">Course overview</Link></div>
    {pct === 100 && (<div className="next"><b>🎉 Course completed!</b><p style={{ margin: '4px 0 10px', color: 'var(--ink)' }}>Great job. Now build a project, update your profile and apply for internships.</p>
      <Link to="/internships" className="btn">Find internships</Link> <Link to="/roadmap/create" className="btn alt">Create roadmap</Link></div>)}
    <div className="cstudy">
      <aside className="cside"><details open>
        <summary>Course content</summary>
        {course.modules.map((m, mi) => (<div key={m.id} className="cside-mod"><b>{mi + 1}. {m.title}</b>
          {m.lessons.map(l => (<button type="button" key={l.id} className={'cside-l' + (!quizId && l.id === current.id ? ' on' : '')} onClick={() => go(l.id)}>
            <span>{p.isDone(slug, l.id) ? '✅' : '○'}</span>{l.t}</button>))}
          <button type="button" className={'cside-l quiz' + (quizId === m.id ? ' on' : '')} onClick={() => setParams({ quiz: m.id })}>
            <span>{p.quizResult(slug, m.id) ? '🏅' : '📝'}</span>Quiz{p.quizResult(slug, m.id) ? ` (${p.quizResult(slug, m.id).score}/${p.quizResult(slug, m.id).total})` : ''}</button></div>))}
      </details></aside>

      <article className="cmain">
        {quizModule
          ? <ModuleQuiz key={quizModule.id} module={quizModule} previous={p.quizResult(slug, quizModule.id)} onFinish={(s, t) => p.saveQuiz(slug, quizModule.id, s, t)} />
          : (<>
            <small className="note">Lesson {idx + 1} of {lessons.length} · ⏱ {current.min} min</small>
            <h2>{current.t}</h2>
            <p className="clesson">{current.text}</p>
            <div className="card"><h3>🔑 Key points</h3><ul className="clist">{current.pts.map(x => <li key={x}>{x}</li>)}</ul></div>
            {current.code && <CodeBlock lang={current.code[0]} code={current.code[1]} />}
            <div className="cnavbtns">
              <button type="button" className="btn alt" disabled={!prev} onClick={() => prev && go(prev.id)}>← Previous</button>
              <button type="button" className="btn alt" onClick={() => p.toggleLesson(slug, current.id)}>{p.isDone(slug, current.id) ? '✅ Completed (undo)' : 'Mark complete'}</button>
              <button type="button" className="btn" onClick={completeAndNext}>{lastInModule ? 'Complete & take quiz →' : next ? 'Complete & next →' : 'Finish course 🎉'}</button>
            </div></>)}
        {quizModule && <div className="cnavbtns"><button type="button" className="btn alt" onClick={() => { const m = course.modules.indexOf(quizModule); const nl = course.modules[m + 1]?.lessons[0]; nl ? go(nl.id) : nav(`/courses/${slug}`) }}>{course.modules.indexOf(quizModule) < course.modules.length - 1 ? 'Next module →' : 'Back to overview'}</button></div>}
      </article>
    </div></>)
}
