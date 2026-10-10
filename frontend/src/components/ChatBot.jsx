import { useEffect, useRef, useState } from 'react'
import { supabase } from '../services/supabase.js'
import { api } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

function Robot({ size = 34 }) {
  return (<svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <line x1="24" y1="6" x2="24" y2="11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="4.5" r="3" fill="#FFC83D" />
    <rect x="8" y="11" width="32" height="26" rx="9" fill="#fff" />
    <rect x="3" y="20" width="5" height="10" rx="2.5" fill="#fff" />
    <rect x="40" y="20" width="5" height="10" rx="2.5" fill="#fff" />
    <rect x="15" y="38" width="18" height="7" rx="3" fill="#fff" />
    <circle cx="17" cy="23" r="4" fill="#5A4BDA" /><circle cx="31" cy="23" r="4" fill="#5A4BDA" />
    <circle cx="18.3" cy="21.7" r="1.3" fill="#fff" /><circle cx="32.3" cy="21.7" r="1.3" fill="#fff" />
    <path d="M17 31 q7 5 14 0" stroke="#5A4BDA" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>)
}

const css = `
.sb-fab{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:50;width:62px;height:62px;border-radius:50%;
  background:var(--pri);border:3px solid #fff;box-shadow:0 6px 18px rgba(40,30,120,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}
.sb-fab:hover{background:var(--pri2)}
.sb-fab:focus-visible,.sb-x:focus-visible{outline:3px solid var(--yel);outline-offset:2px}
.sb-panel{position:fixed;right:16px;bottom:calc(90px + env(safe-area-inset-bottom,0px));z-index:50;width:340px;height:480px;max-height:calc(100vh - 120px);
  background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 12px 36px rgba(30,25,90,.28);display:flex;flex-direction:column;overflow:hidden}
.sb-head{background:var(--pri);color:#fff;padding:10px 12px;display:flex;align-items:center;gap:10px}
.sb-head b{flex:1;font-size:1rem}
.sb-x{background:none;border:0;color:#fff;font-size:1.5rem;line-height:1;padding:2px 8px;cursor:pointer}
.sb-x:hover{background:rgba(255,255,255,.18)}
.sb-sel{padding:8px 10px;border-bottom:1px solid var(--line);background:var(--bg)}
.sb-sel select{margin:0;padding:8px;font-size:.9rem}
.sb-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:var(--bg)}
.sb-m{max-width:88%;padding:8px 12px;border-radius:14px;white-space:pre-wrap;word-break:break-word;font-size:.95rem;line-height:1.45}
.sb-me{align-self:flex-end;background:var(--pri);color:#fff}
.sb-ai{align-self:flex-start;background:#fff;color:var(--ink);border:1px solid var(--line)}
.sb-err{align-self:flex-start;background:#fff;color:#c2412d;border:1px solid #c2412d}
.sb-form{display:flex;gap:6px;padding:10px;border-top:1px solid var(--line);margin:0;max-width:none;border-radius:0;border-width:1px 0 0 0;background:#fff}
.sb-form input{margin:0;padding:9px 10px}
.sb-form button{padding:9px 14px}
@media(max-width:480px){.sb-panel{left:8px;right:8px;width:auto;bottom:calc(86px + env(safe-area-inset-bottom,0px));height:min(72vh,520px)}}
@media(prefers-reduced-motion:no-preference){.sb-fab{animation:sbpop .5s ease-out}@keyframes sbpop{from{transform:scale(.6)}to{transform:scale(1)}}}
`

export default function ChatBot() {
  const { session } = useAuth()
  const [open, setOpen] = useState(false)
  const [mats, setMats] = useState([]); const [mat, setMat] = useState('')
  const [msgs, setMsgs] = useState([{ role: 'ai', text: 'Hi, I am Study Bot. Ask me anything about your studies. Pick a PDF above and I will answer from your notes.' }])
  const [text, setText] = useState(''); const [busy, setBusy] = useState(false)
  const end = useRef(null), input = useRef(null)
  useEffect(() => {
    if (!open || !session) return
    supabase.from('study_materials').select('id,title').order('created_at', { ascending: false }).then(({ data }) => setMats(data || []))
    input.current?.focus()
  }, [open, session])
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [msgs, busy, open])
  if (!session) return null

  async function send(e) {
    e.preventDefault()
    const q = text.trim(); if (!q || busy) return
    const history = msgs.filter(m => m.role !== 'err').slice(1).map(m => ({ role: m.role, text: m.text }))
    setMsgs(m => [...m, { role: 'user', text: q }]); setText(''); setBusy(true)
    try { const r = await api('/api/ai/chat', { message: q, history, materialId: mat || undefined }); setMsgs(m => [...m, { role: 'ai', text: r.reply }]) }
    catch (x) { setMsgs(m => [...m, { role: 'err', text: 'Error: ' + x.message }]) }
    setBusy(false)
  }
  const cls = r => 'sb-m ' + (r === 'user' ? 'sb-me' : r === 'err' ? 'sb-err' : 'sb-ai')

  return (<><style>{css}</style>
    {open && (<div className="sb-panel" role="dialog" aria-label="Study Bot chat" onKeyDown={e => e.key === 'Escape' && setOpen(false)}>
      <div className="sb-head"><Robot size={30} /><b>Study Bot</b>
        <button className="sb-x" onClick={() => setOpen(false)} aria-label="Close chat">×</button></div>
      <div className="sb-sel"><select value={mat} onChange={e => setMat(e.target.value)} aria-label="Answer from">
        <option value="">Answer from: general knowledge</option>
        {mats.map(m => <option key={m.id} value={m.id}>Answer from: {m.title}</option>)}</select></div>
      <div className="sb-msgs" aria-live="polite">
        {msgs.map((m, i) => <div key={i} className={cls(m.role)}>{m.text}</div>)}
        {busy && <div className="sb-m sb-ai">Thinking…</div>}
        <div ref={end} /></div>
      <form className="sb-form" onSubmit={send}>
        <input ref={input} value={text} onChange={e => setText(e.target.value)} placeholder="Ask a question…" maxLength={1500} aria-label="Your question" />
        <button disabled={busy || !text.trim()}>Send</button></form>
    </div>)}
    <button className="sb-fab" onClick={() => setOpen(o => !o)} aria-label={open ? 'Close Study Bot' : 'Open Study Bot chat'} aria-expanded={open}><Robot /></button></>)
}
