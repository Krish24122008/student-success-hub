// Round profile picture made from the student's initials (no upload needed).
export default function Avatar({ name, id, size = 44 }) {
  const initials = (name || 'S').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
  let h = 0; for (const c of String(id || name || 'x')) h = (h * 31 + c.charCodeAt(0)) % 360
  return (<span className="avatar" aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.38, background: `hsl(${h} 52% 40%)` }}>{initials}</span>)
}
