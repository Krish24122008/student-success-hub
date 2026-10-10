import { courses, allLessons } from './index.js'

const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9+#./ ]+/g, ' ').replace(/\s+/g, ' ').trim()

// A word matches when some word in the text STARTS with it ("pyth" finds python, "ml" does not match "html").
const has = (text, w) => (' ' + text).includes(' ' + w)

// Pre-build one searchable text per course (title, tags, category, about, lesson titles).
const index = courses.map(c => ({
  course: c,
  title: norm(c.title),
  keys: norm([c.title, c.category, c.level, ...c.tags].join(' ')),
  body: norm([c.short, c.about, ...c.outcomes, ...c.tools, ...c.careers].join(' ')),
  lessons: allLessons(c).map(l => ({ lesson: l, text: norm(l.t + ' ' + (l.pts || []).join(' ')) }))
}))

// Returns courses ranked by relevance. Every word of the query must match somewhere.
export function searchCourses(query) {
  const q = norm(query)
  if (!q) return courses.map(course => ({ course, score: 0, lessons: [] }))
  const words = q.split(' ')
  const out = []
  for (const it of index) {
    let score = 0, ok = true
    const lessonHits = new Set()
    for (const w of words) {
      let s = 0
      if (has(it.title, w)) s += 10
      if (has(it.keys, w)) s += 6
      if (has(it.body, w)) s += 2
      for (const l of it.lessons) if (has(l.text, w)) { s += 1; lessonHits.add(l.lesson) }
      if (!s) { ok = false; break }
      score += s
    }
    if (ok) out.push({ course: it.course, score, lessons: Array.from(lessonHits).slice(0, 4) })
  }
  return out.sort((a, b) => b.score - a.score)
}

// Quick suggestions for the dropdown: top courses + a few lesson matches.
export function suggest(query, limit = 5) {
  const res = searchCourses(query)
  if (!norm(query)) return { courses: [], lessons: [] }
  const lessons = []
  for (const r of res) for (const l of r.lessons) { if (lessons.length < 3) lessons.push({ course: r.course, lesson: l }) }
  return { courses: res.slice(0, limit).map(r => r.course), lessons }
}
