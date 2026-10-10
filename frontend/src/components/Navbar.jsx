import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { logOut } from '../services/auth.js'

// Every page of the app lives inside the hamburger menu, grouped like folders.
const groups = [
  { title: 'Learn', items: [['📘', 'Courses', '/courses'], ['🧠', 'Study Assistant', '/study'], ['📝', 'Quizzes', '/quizzes'], ['🗒️', 'Notes', '/notes']] },
  { title: 'Grow', items: [['🎓', 'Scholarships', '/scholarships'], ['💼', 'Internships', '/internships'], ['🚀', 'Career Roadmaps', '/roadmap/create']] },
  { title: 'Community', items: [['⭐', 'Feedback', '/feedback']] }]
const mySpace = { title: 'My space', items: [['📊', 'Dashboard', '/dashboard'], ['📚', 'My Courses', '/my-courses'], ['👤', 'Profile', '/profile']] }

export default function Navbar() {
  const { session } = useAuth(); const nav = useNavigate(); const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const list = session ? [mySpace, ...groups] : groups

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open])

  const out = async e => { e.preventDefault(); setOpen(false); await logOut(); nav('/') }

  return (<>
    <header className="hdr"><div className="hdr-in">
      <button type="button" className="burger" aria-label="Open menu" aria-expanded={open} aria-controls="side-menu" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      <Link to="/" className="brand"><b>SH</b><span>Student Success Hub</span></Link>
      <div className="hdr-actions">
        {session ? (<><Link to="/profile" className="btn alt hide-sm">Profile</Link><a href="#" className="btn" onClick={out}>Log out</a></>)
          : (<><Link to="/login" className="btn alt">Login</Link><Link to="/signup" className="btn hide-sm">Register</Link></>)}
      </div>
    </div></header>

    <div className={'drawer-ov' + (open ? ' open' : '')} onClick={() => setOpen(false)} aria-hidden="true" />
    <nav id="side-menu" className={'drawer' + (open ? ' open' : '')} aria-label="Main menu">
      <div className="drawer-top">
        <Link to="/" className="brand"><b>SH</b><span>Student Success Hub</span></Link>
        <button type="button" className="burger" aria-label="Close menu" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <div className="drawer-body">
        <NavLink to="/" end className={({ isActive }) => 'dlink' + (isActive ? ' on' : '')}><span>🏠</span>Home</NavLink>
        {list.map(g => (<div className="dgroup" key={g.title}><h4>{g.title}</h4>
          {g.items.map(([ic, name, to]) => (<NavLink key={to} to={to} className={({ isActive }) => 'dlink' + (isActive ? ' on' : '')}><span>{ic}</span>{name}</NavLink>))}
        </div>))}
      </div>
      <div className="drawer-foot">
        {session ? <a href="#" className="btn" onClick={out}>Log out</a>
          : (<><Link to="/login" className="btn alt">Login</Link><Link to="/signup" className="btn">Register</Link></>)}
      </div>
    </nav>
  </>)
}
