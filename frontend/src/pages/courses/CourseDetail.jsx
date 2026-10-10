import { Link, useParams } from 'react-router-dom'
import CourseBanner from '../../components/courses/CourseBanner.jsx'
import CourseCard from '../../components/courses/CourseCard.jsx'
import EnrollButton from '../../components/courses/EnrollButton.jsx'
import ProgressBar from '../../components/courses/ProgressBar.jsx'
import { courses, getCourse, studyHours, totalLessons, totalMinutes } from '../../data/courses/index.js'
import { useCourseProgress } from '../../services/courseProgress.js'

const nav = [['overview', 'Overview'], ['curriculum', 'Curriculum'], ['projects', 'Projects'], ['career', 'Career'], ['roadmap', 'Roadmap'], ['resources', 'Resources']]

export default function CourseDetail() {
  const { slug } = useParams(); const course = getCourse(slug)
  const { isEnrolled, percent, isDone } = useCourseProgress()
  if (!course) return (<div className="card"><h2>Course not found</h2><p>This course does not exist.</p><Link to="/courses" className="btn">Browse all courses</Link></div>)
  const more = courses.filter(c => c.slug !== slug).slice(0, 3)
  return (<>
    <p className="crumbs"><Link to="/courses">Courses</Link> › {course.title}</p>
    <section className="cdetail-hero">
      <CourseBanner course={course} className="cdetail-img" />
      <div className="cdetail-info">
        <span className="cpill static">{course.category}</span>
        <h1>{course.title}</h1><p>{course.short}</p>
        <div className="cmeta"><span>⏱ {studyHours(course)} hours of lessons</span><span>📚 {totalLessons(course)} lessons</span><span>🗓 ~{course.weeks} weeks pace</span><span>🎯 {course.level}</span><span className="free">FREE</span></div>
        {isEnrolled(course.slug) && <ProgressBar value={percent(course)} />}
        <EnrollButton course={course} size="lg" />
      </div></section>
    <div className="cchips sticky" role="navigation" aria-label="Course sections">{nav.map(([id, t]) => <a key={id} className="chip" href={`#${id}`}>{t}</a>)}</div>

    <section className="sec" id="overview"><h2>About this course</h2><p>{course.about}</p>
      <div className="cols">
        <div className="card"><h3>✅ What you will learn</h3><ul className="clist">{course.outcomes.map(o => <li key={o}>{o}</li>)}</ul></div>
        <div className="card"><h3>🧰 Tools you will use</h3><div className="ctags">{course.tools.map(t => <span key={t}>{t}</span>)}</div>
          <h3 style={{ marginTop: 14 }}>⏳ Total study time</h3><p style={{ margin: 0 }}>About {Math.round(totalMinutes(course) / 60)} hours of lessons plus practice and projects.</p></div>
      </div></section>

    <section className="sec" id="curriculum"><h2>Curriculum</h2><p>{course.modules.length} modules · {totalLessons(course)} lessons · a quiz after every module.</p>
      {course.modules.map((m, i) => (<details className="cmod" key={m.id} open={i === 0}>
        <summary><b>Module {i + 1}: {m.title}</b><span>{m.lessons.length} lessons</span></summary>
        <ul>{m.lessons.map(l => (<li key={l.id}><Link to={`/courses/${course.slug}/study?lesson=${l.id}`}>{isDone(course.slug, l.id) ? '✅' : '▶️'} {l.t}</Link><small>{l.min} min</small></li>))}
          <li><Link to={`/courses/${course.slug}/study?quiz=${m.id}`}>📝 Module quiz</Link><small>{m.quiz.length} questions</small></li></ul></details>))}</section>

    <section className="sec" id="projects"><h2>Projects you will build</h2>
      <div className="grid">{course.projects.map(([n, d], i) => <div className="tile" key={n}><b style={{ color: 'var(--pri)' }}>Project {i + 1}</b><h3>{n}</h3><p style={{ margin: 0 }}>{d}</p></div>)}</div></section>

    <section className="sec" id="career"><h2>Career, internships & scholarships</h2>
      <div className="cols">
        <div className="card"><h3>💼 Job roles</h3><ul className="clist">{course.careers.map(c => <li key={c}>{c}</li>)}</ul></div>
        <div className="card"><h3>🎯 Internship ideas</h3><ul className="clist">{course.internships.map(c => <li key={c}>{c}</li>)}</ul>
          <Link to="/internships" className="btn alt">Find internships</Link> <Link to="/scholarships" className="btn alt">Scholarships</Link></div>
      </div></section>

    <section className="sec" id="roadmap"><h2>Your 6-month roadmap</h2>
      <ol className="croad">{course.roadmap.map(r => <li key={r}>{r}</li>)}</ol>
      <Link to="/roadmap/create" className="btn">Create my personal roadmap</Link></section>

    <section className="sec" id="resources"><h2>Free resources</h2>
      <div className="grid">{course.resources.map(r => <a key={r.url} className="tile" href={r.url} target="_blank" rel="noreferrer"><b>🔗 {r.label}</b><p style={{ margin: 0 }}>Opens in a new tab</p></a>)}</div></section>

    <section className="cta"><h2>Ready to start {course.title}?</h2><p>Enroll for free and study at your own pace.</p><EnrollButton course={course} size="lg" /></section>
    <section className="sec"><h2>More courses for you</h2><div className="cgrid">{more.map(c => <CourseCard key={c.slug} course={c} />)}</div></section>
  </>)
}
