import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ChatBot from './components/ChatBot.jsx'
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
import Courses from './pages/courses/Courses.jsx'
import CourseDetail from './pages/courses/CourseDetail.jsx'
import CourseStudy from './pages/courses/CourseStudy.jsx'
import MyCourses from './pages/courses/MyCourses.jsx'
import Feedback from './pages/feedback/Feedback.jsx'
import FeedbackDetail from './pages/feedback/FeedbackDetail.jsx'

function Private({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <p>Loading…</p>
  return session ? children : <Navigate to="/login" replace />
}
function NotFound() {
  return (<><h2>Page not found</h2><p>This page does not exist.</p><Link to="/" className="btn">Go home</Link></>)
}
export default function App() {
  return (<><Navbar /><main><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/onboarding" element={<Private><Profile /></Private>} />
    <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
    <Route path="/profile" element={<Private><Profile /></Private>} />
    <Route path="/courses" element={<Courses />} />
    <Route path="/courses/:slug" element={<CourseDetail />} />
    <Route path="/courses/:slug/study" element={<Private><CourseStudy /></Private>} />
    <Route path="/my-courses" element={<Private><MyCourses /></Private>} />
    <Route path="/study" element={<Private><StudyHome /></Private>} />
    <Route path="/scholarships" element={<Private><Scholarships /></Private>} />
    <Route path="/internships" element={<Private><Internships /></Private>} />
    <Route path="/quizzes" element={<Private><Quizzes /></Private>} />
    <Route path="/notes" element={<Private><Notes /></Private>} />
    <Route path="/roadmap/create" element={<Private><CreateRoadmap /></Private>} />
    <Route path="/feedback" element={<Feedback />} />
    <Route path="/feedback/:id" element={<FeedbackDetail />} />
    <Route path="*" element={<NotFound />} />
  </Routes></main><Footer /><ChatBot /></>)
}
