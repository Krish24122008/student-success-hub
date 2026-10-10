import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { allLessons, totalLessons } from '../data/courses/index.js'

// Progress is saved in this browser, separately for each logged-in user.
// (Later you can move it to a Supabase table; only this file needs to change.)
const KEY = uid => `ssh_courses_v1_${uid || 'guest'}`
const EMPTY = () => ({ enrolled: {}, done: {}, quiz: {}, last: {} })

function read(uid) {
  try { return { ...EMPTY(), ...(JSON.parse(localStorage.getItem(KEY(uid))) || {}) } } catch { return EMPTY() }
}
function write(uid, data) {
  try { localStorage.setItem(KEY(uid), JSON.stringify(data)) } catch { /* storage full or blocked */ }
  window.dispatchEvent(new Event('ssh-courses'))
}

export function useCourseProgress() {
  const { session } = useAuth()
  const uid = session?.user?.id
  const [state, setState] = useState(() => read(uid))
  useEffect(() => {
    const sync = () => setState(read(uid))
    sync()
    window.addEventListener('ssh-courses', sync); window.addEventListener('storage', sync)
    return () => { window.removeEventListener('ssh-courses', sync); window.removeEventListener('storage', sync) }
  }, [uid])
  const change = fn => write(uid, fn(read(uid)))

  const doneIds = slug => state.done[slug] || []
  return {
    state,
    isEnrolled: slug => !!state.enrolled[slug],
    enroll: slug => change(s => ({ ...s, enrolled: { ...s.enrolled, [slug]: s.enrolled[slug] || Date.now() } })),
    unenroll: slug => change(s => { const e = { ...s.enrolled }; delete e[slug]; return { ...s, enrolled: e } }),
    doneIds,
    isDone: (slug, id) => doneIds(slug).includes(id),
    toggleLesson: (slug, id, value) => change(s => {
      const cur = new Set(s.done[slug] || []); const on = value ?? !cur.has(id)
      on ? cur.add(id) : cur.delete(id)
      return { ...s, enrolled: { ...s.enrolled, [slug]: s.enrolled[slug] || Date.now() }, done: { ...s.done, [slug]: [...cur] }, last: { ...s.last, [slug]: id } }
    }),
    setLast: (slug, id) => change(s => ({ ...s, last: { ...s.last, [slug]: id } })),
    lastLesson: slug => state.last[slug],
    saveQuiz: (slug, moduleId, score, total) => change(s => ({ ...s, quiz: { ...s.quiz, [`${slug}:${moduleId}`]: { score, total, at: Date.now() } } })),
    quizResult: (slug, moduleId) => state.quiz[`${slug}:${moduleId}`],
    percent: course => { const t = totalLessons(course); return t ? Math.round(doneIds(course.slug).filter(id => allLessons(course).some(l => l.id === id)).length / t * 100) : 0 },
    enrolledCount: () => Object.keys(state.enrolled).length
  }
}
