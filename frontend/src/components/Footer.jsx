import { Link } from 'react-router-dom'
export default function Footer() {
  return (<footer className="ftr"><div className="ftr-in">
    <div><h4>Student Success Hub</h4><p style={{ color: '#c9ccea' }}>Study, scholarships, internships and careers in one place.</p></div>
    <div><h4>Learn</h4><Link to="/courses">All Courses</Link><Link to="/study">Study Assistant</Link><Link to="/roadmap/create">Career Roadmap</Link></div>
    <div><h4>Opportunities</h4><Link to="/scholarships">Scholarships</Link><Link to="/internships">Internships</Link></div>
    <div><h4>Community</h4><Link to="/feedback">Student Feedback</Link></div>
    <div><h4>Account</h4><Link to="/login">Login</Link><Link to="/signup">Register</Link></div>
  </div><small>© 2026 Student Success Hub. All rights reserved.</small></footer>)
}
