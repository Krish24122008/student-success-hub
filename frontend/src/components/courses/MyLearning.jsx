import { Link } from 'react-router-dom'
import CourseBanner from './CourseBanner.jsx'
import ProgressBar from './ProgressBar.jsx'
import { courses } from '../../data/courses/index.js'
import { useCourseProgress } from '../../services/courseProgress.js'

// "Continue learning" list for the dashboard and My Courses page. Shows suggestions when nothing is enrolled yet.
export default function MyLearning({ limit = 3 }) {
  const { state, percent, lastLesson } = useCourseProgress()
  const mine = courses.filter(c => state.enrolled[c.slug]).sort((a, b) => state.enrolled[b.slug] - state.enrolled[a.slug]).slice(0, limit)
  if (mine.length === 0) return (<div className="next"><b>Start learning</b><p style={{ margin: '4px 0 10px', color: 'var(--ink)' }}>You have not enrolled in a course yet. Pick one of our top 10 courses.</p><Link to="/courses" className="btn">Browse courses</Link></div>)
  return (<div className="cgrid">{mine.map(c => (<article className="ccard" key={c.slug}>
    <Link to={`/courses/${c.slug}`} className="ccard-img"><CourseBanner course={c} /></Link>
    <div className="ccard-body"><h3>{c.title}</h3><ProgressBar value={percent(c)} />
      <Link className="btn" to={`/courses/${c.slug}/study` + (lastLesson(c.slug) ? `?lesson=${lastLesson(c.slug)}` : '')}>▶ Continue</Link></div></article>))}</div>)
}
