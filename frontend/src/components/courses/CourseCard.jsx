import { Link } from 'react-router-dom'
import CourseBanner from './CourseBanner.jsx'
import EnrollButton from './EnrollButton.jsx'
import ProgressBar from './ProgressBar.jsx'
import { useCourseProgress } from '../../services/courseProgress.js'
import { studyHours, totalLessons } from '../../data/courses/index.js'

export default function CourseCard({ course }) {
  const { isEnrolled, percent } = useCourseProgress()
  return (<article className="ccard">
    <Link to={`/courses/${course.slug}`} className="ccard-img" aria-label={`Open ${course.title}`}>
      <CourseBanner course={course} /><span className="cpill">{course.category}</span></Link>
    <div className="ccard-body">
      <h3><Link to={`/courses/${course.slug}`}>{course.title}</Link></h3>
      <p>{course.short}</p>
      <div className="cmeta"><span>⏱ {studyHours(course)}h lessons</span><span>📚 {totalLessons(course)} lessons</span><span>🎯 {course.level.split(' ')[0]}</span><span className="free">FREE</span></div>
      {isEnrolled(course.slug) && <ProgressBar value={percent(course)} />}
      <EnrollButton course={course} />
    </div></article>)
}
