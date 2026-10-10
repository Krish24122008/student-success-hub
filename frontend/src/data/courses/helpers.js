// Small helpers so each course file stays short and easy to edit.
// L = lesson, Q = quiz question, M = module, R = resource link
export const L = (t, min, text, pts, code) => ({ t, min, text, pts, code })
export const Q = (q, o, a) => ({ q, o, a })
export const M = (title, lessons, quiz) => ({ title, lessons, quiz })
export const R = (label, url) => ({ label, url })
