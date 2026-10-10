import PageBanner from '../../components/courses/PageBanner.jsx'
import MyLearning from '../../components/courses/MyLearning.jsx'
import CourseCard from '../../components/courses/CourseCard.jsx'
import { courses } from '../../data/courses/index.js'
import { useCourseProgress } from '../../services/courseProgress.js'

export default function MyCourses() {
  const { state } = useCourseProgress()
  const others = courses.filter(c => !state.enrolled[c.slug]).slice(0, 3)
  return (<>
    <PageBanner image="dashboard" title="My Courses" text="Continue where you stopped. Your progress is saved on this device." actions={[{ to: '/courses', label: 'Browse all courses', kind: 'yel' }]} />
    <MyLearning limit={10} />
    {others.length > 0 && (<section className="sec"><h2>Recommended for you</h2><div className="cgrid">{others.map(c => <CourseCard key={c.slug} course={c} />)}</div></section>)}
  </>)
}
