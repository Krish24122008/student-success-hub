import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageBanner from '../../components/courses/PageBanner.jsx'
import CourseSearch from '../../components/courses/CourseSearch.jsx'
import CourseCard from '../../components/courses/CourseCard.jsx'
import { categories, courseTotals, courses } from '../../data/courses/index.js'
import { searchCourses } from '../../data/courses/search.js'

const perks = [['📖', 'Study notes & code', 'Easy Hinglish explanations with examples.'], ['📝', 'Quizzes', 'Test yourself after every module.'], ['🛠️', 'Real projects', 'Build a portfolio you can show.'], ['🚀', 'Career path', 'Roadmap, internships and scholarships.']]

export default function Courses() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [cat, setCat] = useState('All')
  const results = useMemo(() => searchCourses(q).filter(r => cat === 'All' || r.course.category === cat), [q, cat])
  const lessonHits = results.flatMap(r => r.lessons.map(l => ({ course: r.course, lesson: l }))).slice(0, 6)
  const t = courseTotals()
  return (<>
    <PageBanner image="courses" title="Top 10 courses to build your career"
      text={`Search any skill and start learning for free. ${t.courses} courses · ${t.lessons} lessons · quizzes · projects.`}>
      <CourseSearch initial={q} onChange={v => setParams(v ? { q: v } : {}, { replace: true })} />
    </PageBanner>
    <div className="cchips" role="tablist" aria-label="Course categories">
      {categories.map(c => <button type="button" key={c} role="tab" aria-selected={cat === c} className={'chip' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>)}
    </div>
    <p className="cresult">{q ? <>Showing <b>{results.length}</b> result{results.length === 1 ? '' : 's'} for “{q}”</> : <>Showing all <b>{results.length}</b> courses</>}</p>
    {results.length === 0
      ? (<div className="card" style={{ textAlign: 'center' }}><h3>No course found</h3><p>Try a different word like python, web, design, cloud or marketing.</p>
          <div className="cchips" style={{ justifyContent: 'center' }}>{courses.slice(0, 5).map(c => <Link key={c.slug} className="chip" to={`/courses/${c.slug}`}>{c.icon} {c.title}</Link>)}</div></div>)
      : <div className="cgrid">{results.map(r => <CourseCard key={r.course.slug} course={r.course} />)}</div>}
    {q && lessonHits.length > 0 && (<section className="sec"><h2>Matching lessons</h2>
      <div className="grid">{lessonHits.map(({ course, lesson }) => (<Link key={course.slug + lesson.id} className="tile" to={`/courses/${course.slug}/study?lesson=${lesson.id}`}>
        <b>📖 {lesson.t}</b><p style={{ margin: 0 }}>{course.title} · {lesson.min} min</p></Link>))}</div></section>)}
    <section className="sec"><h2>Why learn with Student Success Hub</h2>
      <div className="grid">{perks.map(([ic, t2, d]) => <div className="tile" key={t2}><div className="ic">{ic}</div><h3>{t2}</h3><p style={{ margin: 0 }}>{d}</p></div>)}</div></section>
  </>)
}
