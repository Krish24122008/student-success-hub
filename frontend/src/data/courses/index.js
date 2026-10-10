import web from './webDevelopment.js'
import design from './uiUxDesign.js'
import python from './pythonProgramming.js'
import java from './javaDsa.js'
import ai from './aiMachineLearning.js'
import cyber from './cybersecurity.js'
import app from './appDevelopment.js'
import cloud from './cloudDevops.js'
import video from './videoEditing.js'
import marketing from './digitalMarketingSeo.js'

// Add a banner path + stable ids to every lesson / module so progress can be saved.
// To use your own banner image (like the PW-style banner), set `image: 'https://...'` on a course.
const raw = [web, design, python, java, ai, cyber, app, cloud, video, marketing]

export const courses = raw.map(c => ({
  ...c,
  banner: c.image || `/images/courses/${c.slug}.svg`,
  fallbackBanner: `/images/courses/${c.slug}.svg`,
  modules: c.modules.map((m, mi) => ({
    ...m, id: `m${mi + 1}`,
    lessons: m.lessons.map((l, li) => ({ ...l, id: `m${mi + 1}l${li + 1}` }))
  }))
}))

export const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))]
export const getCourse = slug => courses.find(c => c.slug === slug)
export const allLessons = c => c.modules.flatMap(m => m.lessons)
export const totalLessons = c => allLessons(c).length
export const totalMinutes = c => allLessons(c).reduce((s, l) => s + (l.min || 0), 0)
export const studyHours = c => Math.max(1, Math.round(totalMinutes(c) / 60))
export const courseTotals = () => ({ courses: courses.length, lessons: courses.reduce((s, c) => s + totalLessons(c), 0) })
