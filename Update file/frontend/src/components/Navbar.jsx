import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { logOut } from '../services/auth.js'
const sections = [
  ['Study Assistant', '/study'], ['Scholarships', '/scholarships'], ['Internships', '/internships'],
  ['Career Roadmaps', '/roadmap/create'], ['Quizzes', '/quizzes'], ['Notes', '/notes']]
export default function Navbar() {
  const { session } = useAuth(); const nav = useNavigate()
  return (<><header className="hdr"><div className="hdr-in">
    <Link to="/" className="brand"><b>SH</b>Student Success Hub</Link>
    <div className="links">
      {session && <Link to="/dashboard">Dashboard</Link>}
    </div>
    {session ? (<><Link to="/profile" className="btn alt">Profile</Link>
      <a href="#" className="btn" onClick={async e => { e.preventDefault(); await logOut(); nav('/') }}>Log out</a></>)
      : (<><Link to="/login" className="btn alt">Login</Link><Link to="/signup" className="btn">Register</Link></>)}
  </div></header>
  <div className="exams"><div>{sections.map(([name, to]) => (
    <NavLink key={to} to={to} className={({ isActive }) => 'chip' + (isActive ? ' on' : '')}>{name}</NavLink>))}</div></div></>)
}
