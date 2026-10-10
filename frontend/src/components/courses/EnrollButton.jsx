import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCourseProgress } from '../../services/courseProgress.js'

// Enroll = save the course to "My Courses". Visitors who are not logged in are sent to login first.
// Study = open the lessons (continues from the last lesson you opened).
export default function EnrollButton({ course, size = '' }) {
  const { session } = useAuth(); const nav = useNavigate(); const loc = useLocation()
  const { isEnrolled, enroll, lastLesson } = useCourseProgress()
  const enrolled = isEnrolled(course.slug)
  const study = () => nav(`/courses/${course.slug}/study` + (lastLesson(course.slug) ? `?lesson=${lastLesson(course.slug)}` : ''))
  const needLogin = () => nav('/login', { state: { from: loc.pathname } })
  return (<div className={'cbtns ' + size}>
    <button type="button" className="btn alt" onClick={() => (session ? study() : needLogin())}>📖 {enrolled ? 'Continue Study' : 'Study'}</button>
    {enrolled
      ? <span className="enrolled-tag">✓ Enrolled</span>
      : <button type="button" className="btn yel" onClick={() => { if (!session) return needLogin(); enroll(course.slug) }}>🚀 Enroll Now</button>}
  </div>)
}
