import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../components/courses/PageBanner.jsx'
import CourseSearch from '../components/courses/CourseSearch.jsx'
import CourseCard from '../components/courses/CourseCard.jsx'
import { courses, courseTotals } from '../data/courses/index.js'
import Stars from '../components/feedback/Stars.jsx'
import FeedbackCard from '../components/feedback/FeedbackCard.jsx'
import { getStats, listFeedback } from '../services/feedback.js'
const stats = [['Daily', 'Study with AI help'], ['Instant', 'Notes to quiz'], ['24 x 7', 'Learning anytime'], ['Free', 'Scholarship search']]

// The four big features, each with its own picture (public/images/home).
const features = [
  { tone: 'violet', img: 'dashboard', alt: 'Dashboard with study time chart, streak and monthly goal ring',
    title: 'Your progress on one screen', text: 'See what you studied, what is next and how close you are to your goal.',
    points: ['Courses, quizzes and streak together', 'A clear next step every day', 'Weekly study time at a glance'], to: '/dashboard', cta: 'Open dashboard' },
  { tone: 'gold', img: 'scholarship', alt: 'Graduation cap, certificate and coins for a scholarship',
    title: 'Scholarships that match you', text: 'Tell us your course and state. We show the scholarships you can apply to.',
    points: ['Filter by course, state and category', 'Deadlines and amounts in one list', 'Apply links to the official page'], to: '/scholarships', cta: 'Find scholarships' },
  { tone: 'teal', img: 'internship', alt: 'Laptop showing internship listings with stipend',
    title: 'Internships to start your career', text: 'Browse openings by skill, city and stipend, then apply in a few taps.',
    points: ['Remote and in-city internships', 'Stipend shown up front', 'Match them to your skills'], to: '/internships', cta: 'Browse internships' },
  { tone: 'coral', img: 'roadmap', alt: 'Winding career roadmap with monthly milestones to a dream job',
    title: 'A roadmap for your dream job', text: 'Pick a career goal and get a month-by-month plan, from basics to your first application.',
    points: ['What to learn each month', 'Projects that build your profile', 'Made for your goal and level'], to: '/roadmap/create', cta: 'Create my roadmap' }]

const more = [
  ['📘', 'Top 10 Courses', 'Web, Python, AI, Cyber, Design and more with notes and quizzes.', '/courses'],
  ['🧠', 'Study Assistant', 'Upload a PDF and get a summary and a quiz.', '/study'],
  ['📝', 'Quizzes', 'Test yourself on any topic and see what to revise.', '/quizzes'],
  ['🗒️', 'Notes', 'Keep your notes in one place and open them anytime.', '/notes']]
const quotes = [
  ['I turned my class notes into a quiz in a minute and finally knew what to revise.', 'Diploma student, Patna'],
  ['I found a scholarship I did not know existed and applied before the deadline.', 'B.Tech student, Bihar'],
  ['The roadmap told me what to learn each month for my first internship.', 'BCA student, Ranchi']]
export default function Home() {
  const [fb, setFb] = useState({ rows: [], stats: null })
  useEffect(() => {
    Promise.all([listFeedback({ sort: 'high', size: 3 }), getStats()]).then(([r, stats]) => setFb({ rows: r.rows, stats })).catch(() => {})
  }, [])
  return (<>
    <PageBanner image="home" title="Unlock your potential with the most helpful learning platform"
      text={`Learn ${courseTotals().courses} job-ready courses for free, study smarter with AI, and find scholarships and internships made for you.`}
      actions={[{ to: '/signup', label: 'Get Started', kind: 'yel' }, { to: '/courses', label: 'Explore Courses', kind: 'alt' }]}>
      <CourseSearch />
      <div className="hmini">{courses.slice(0, 5).map(c => <Link key={c.slug} to={`/courses/${c.slug}`}>{c.icon} {c.title.split(' &')[0]}</Link>)}</div>
    </PageBanner>
    <div className="grid">{stats.map(([a, b]) => <div className="stat" key={a}><b>{a}</b>{b}</div>)}</div>

    <section className="sec"><h2>Everything you need to get ahead</h2><p>Four tools, one place. Sign in to save your progress.</p>
      {features.map((f, i) => (
        <article className={`feat ${f.tone}${i % 2 ? ' flip' : ''}`} key={f.img}>
          <div className="feat-img"><img src={`/images/home/${f.img}.svg`} alt={f.alt} width="600" height="440" loading="lazy" /></div>
          <div className="feat-txt"><h3>{f.title}</h3><p>{f.text}</p>
            <ul>{f.points.map(p => <li key={p}>{p}</li>)}</ul>
            <Link to={f.to} className="btn">{f.cta}</Link></div>
        </article>))}
    </section>

    <section className="sec"><div className="sec-head"><h2>Top 10 courses for students</h2><Link to="/courses">View all →</Link></div>
      <p>Free courses with notes, quizzes, projects and a career roadmap. Click Study to start or Enroll to save it.</p>
      <div className="cgrid">{courses.slice(0, 6).map(c => <CourseCard key={c.slug} course={c} />)}</div></section>

    <section className="sec"><h2>Study tools</h2><p>Make every study hour count.</p>
      <div className="grid">{more.map(([ic, t, d, to]) => (<Link to={to} className="tile" key={t}><div className="ic">{ic}</div><h3>{t}</h3><p>{d}</p></Link>))}</div></section>

    <section className="sec"><h2>How it works</h2><div className="grid">
      {['Register with your email', 'Verify with the code we email you', 'Set up your profile', 'Study, apply and grow'].map((s, i) => <div className="tile" key={s}><b style={{ color: 'var(--pri)' }}>Step {i + 1}</b><p style={{ margin: 0 }}>{s}</p></div>)}</div></section>
    <section className="sec"><div className="sec-head"><h2>Students love it</h2><Link to="/feedback">Read all feedback →</Link></div>
      {fb.rows.length > 0 ? (<>
        <p style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><Stars value={fb.stats.avg} size="1.3rem" /><b style={{ color: 'var(--ink)' }}>{fb.stats.avg.toFixed(1)}</b> from {fb.stats.total} student feedback{fb.stats.total > 1 ? 's' : ''}</p>
        <div className="fgrid">{fb.rows.map(r => <FeedbackCard key={r.id} row={r} />)}</div></>)
      : (<><p>Example stories to show the layout. Real student feedback will appear here.</p>
        <div className="grid">{quotes.map(([q, a]) => <div className="quote" key={a}><p style={{ color: 'var(--ink)' }}>“{q}”</p><b>{a}</b></div>)}</div></>)}
      <p style={{ marginTop: 16 }}><Link to="/feedback" className="btn">Give your feedback</Link></p></section>
    <section className="cta"><h2>Join today</h2><p>Create your free account and get your first quiz in minutes.</p><Link to="/signup" className="btn">Register now</Link></section>
  </>)
}
