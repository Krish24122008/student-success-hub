import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import PageBanner from '../components/courses/PageBanner.jsx'
import MyLearning from '../components/courses/MyLearning.jsx'
import CourseSearch from '../components/courses/CourseSearch.jsx'
import { useCourseProgress } from '../services/courseProgress.js'
const count = t => supabase.from(t).select('*', { count: 'exact', head: true }).then(r => r.count || 0)
export default function Dashboard() {
  const { session } = useAuth(); const [d, setD] = useState(null); const { enrolledCount } = useCourseProgress()
  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: att }, materials, schol, intern, roadmaps] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('quiz_attempts').select('score,weak_topics').order('created_at', { ascending: false }).limit(1),
        count('study_materials'), count('saved_scholarships'), count('saved_internships'), count('roadmaps')])
      setD({ p: p || {}, att: att?.[0] || null, materials, schol, intern, roadmaps })
    })()
  }, [])
  if (!d) return (<><div className="skel" /><div className="skel" /><div className="skel" /></>)
  const { p, att, materials, schol, intern, roadmaps } = d
  const fields = [p.full_name, p.education_level, p.state, (p.skills || []).length ? 'x' : '', p.career_goal]
  const profilePct = Math.round(fields.filter(Boolean).length / fields.length * 100)
  const next = materials === 0 ? ['Upload your first study material', '/study', 'Upload a PDF']
    : !att ? ['Take your first quiz to find weak topics', '/quizzes', 'Start a quiz']
    : roadmaps === 0 ? ['Build your career roadmap', '/roadmap/create', 'Create roadmap']
    : ['Keep going: review your weak topics and try another quiz', '/quizzes', 'Open quizzes']
  return (<>
    <PageBanner image="dashboard" title={`Welcome, ${p.full_name || 'student'} 👋`}
      text={p.career_goal ? `Goal: ${p.career_goal}` : 'Add a career goal in your profile.'}
      actions={[{ to: '/courses', label: 'Browse courses', kind: 'yel' }, { to: '/my-courses', label: 'My courses', kind: 'alt' }]}>
      <CourseSearch placeholder="Search a course or lesson…" />
    </PageBanner>
    <div className="next"><b>Next step</b><p style={{ margin: '4px 0 10px', color: 'var(--ink)' }}>{next[0]}</p><Link to={next[1]} className="btn">{next[2]}</Link></div>
    <div className="kpis">
      <div className="kpi"><div className="ic">📘</div><b>{enrolledCount()}</b><span>Courses enrolled</span></div>
      <div className="kpi"><div className="ic">📚</div><b>{materials}</b><span>Study materials</span></div>
      <div className="kpi"><div className="ic">🎓</div><b>{schol}</b><span>Saved scholarships</span></div>
      <div className="kpi"><div className="ic">💼</div><b>{intern}</b><span>Saved internships</span></div>
      <div className="kpi"><div className="ic">🚀</div><b>{roadmaps}</b><span>Roadmaps</span></div>
    </div>
    <section style={{ margin: '0 0 16px' }}><div className="sec-head"><h3 style={{ margin: 0 }}>Continue learning</h3><Link to="/my-courses">See all →</Link></div><MyLearning limit={3} /></section>
    <div className="dcard"><div className="top"><h3>📝 Latest quiz score</h3><b>{att ? att.score + '%' : 'No quiz yet'}</b></div>
      <div className="bar good"><i style={{ width: (att?.score || 0) + '%' }} /></div>
      {att?.weak_topics?.length > 0 && <p style={{ margin: 0 }}>Revise: {att.weak_topics.join(', ')}</p>}</div>
    <div className="dcard"><div className="top"><h3>👤 Profile completeness</h3><b>{profilePct}%</b></div>
      <div className="bar"><i style={{ width: profilePct + '%' }} /></div>
      {profilePct < 100 && <Link to="/profile" className="btn alt">Complete profile</Link>}</div>
    <div className="kpis">
      <Link to="/scholarships" className="tile"><div className="ic">🎓</div><h3>Scholarships</h3><p>Find ones that match you.</p></Link>
      <Link to="/internships" className="tile"><div className="ic">💼</div><h3>Internships</h3><p>Browse by skills.</p></Link>
      <Link to="/notes" className="tile"><div className="ic">🗒️</div><h3>Notes</h3><p>Your summaries.</p></Link>
    </div></>)
}
