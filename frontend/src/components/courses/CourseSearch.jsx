import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { suggest } from '../../data/courses/search.js'

// Search box with live suggestions. Pick a suggestion to jump straight to the course (or lesson).
// Press Enter to see all matching courses on the Courses page.
export default function CourseSearch({ initial = '', onChange, placeholder = 'Search courses, e.g. python, hacking, video, seo…', autoFocus = false }) {
  const nav = useNavigate()
  const [q, setQ] = useState(initial)
  const [open, setOpen] = useState(false)
  const box = useRef(null)
  useEffect(() => setQ(initial), [initial])
  useEffect(() => {
    const away = e => { if (box.current && !box.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', away); return () => document.removeEventListener('mousedown', away)
  }, [])
  const s = suggest(q)
  const go = () => { setOpen(false); nav('/courses' + (q.trim() ? `?q=${encodeURIComponent(q.trim())}` : '')) }
  return (<div className="csearch" ref={box} role="search">
    <span className="csearch-ic" aria-hidden="true">🔎</span>
    <input value={q} autoFocus={autoFocus} placeholder={placeholder} aria-label="Search courses"
      onChange={e => { setQ(e.target.value); setOpen(true); onChange && onChange(e.target.value) }}
      onFocus={() => setOpen(true)}
      onKeyDown={e => { if (e.key === 'Enter') go(); if (e.key === 'Escape') setOpen(false) }} />
    {q && <button type="button" className="csearch-x" aria-label="Clear search" onClick={() => { setQ(''); onChange && onChange('') }}>×</button>}
    <button type="button" className="csearch-go" onClick={go}>Search</button>
    {open && q.trim() && (<div className="csuggest">
      {s.courses.length === 0 && <div className="csuggest-empty">No course found for “{q}”. Try python, web, design, cloud…</div>}
      {s.courses.map(c => (<button type="button" key={c.slug} className="csuggest-row" onClick={() => { setOpen(false); nav(`/courses/${c.slug}`) }}>
        <span>{c.icon}</span><b>{c.title}</b><small>{c.category}</small></button>))}
      {s.lessons.length > 0 && <div className="csuggest-h">Lessons</div>}
      {s.lessons.map(({ course, lesson }) => (<button type="button" key={lesson.id + course.slug} className="csuggest-row" onClick={() => { setOpen(false); nav(`/courses/${course.slug}/study?lesson=${lesson.id}`) }}>
        <span>📖</span><b>{lesson.t}</b><small>{course.title}</small></button>))}
    </div>)}
  </div>)
}
