import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import StudyHome from './pages/study/StudyHome.jsx'
import Scholarships from './pages/scholarships/Scholarships.jsx'
import Internships from './pages/internships/Internships.jsx'
import Quizzes from './pages/quizzes/Quizzes.jsx'
import Notes from './pages/notes/Notes.jsx'
import CreateRoadmap from './pages/career/CreateRoadmap.jsx'

function Private({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <p>Loading…</p>
  return session ? children : <Navigate to="/login" replace />
}
export default function App() {
  return (<><Navbar /><main><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/onboarding" element={<Private><Profile /></Private>} />
    <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
    <Route path="/profile" element={<Private><Profile /></Private>} />
    <Route path="/study" element={<Private><StudyHome /></Private>} />
    <Route path="/scholarships" element={<Private><Scholarships /></Private>} />
    <Route path="/internships" element={<Private><Internships /></Private>} />
    <Route path="/quizzes" element={<Private><Quizzes /></Private>} />
    <Route path="/notes" element={<Private><Notes /></Private>} />
    <Route path="/roadmap/create" element={<Private><CreateRoadmap /></Private>} />
  </Routes></main><Footer /></>)
}
