import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'
import './styles/courses.css'
import './styles/home.css'
import './styles/feedback.css'
import './styles/background.css'
createRoot(document.getElementById('root')).render(
  <BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter>)
