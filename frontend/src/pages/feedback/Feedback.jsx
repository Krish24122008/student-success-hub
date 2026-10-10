import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PageBanner from '../../components/courses/PageBanner.jsx'
import Stars, { StarInput, RATING_WORDS } from '../../components/feedback/Stars.jsx'
import FeedbackCard from '../../components/feedback/FeedbackCard.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { CATEGORIES, PAGE, listFeedback, getStats, myFeedback, saveFeedback, deleteFeedback, friendlyError } from '../../services/feedback.js'

const MAX = 600
export default function Feedback() {
  const { session } = useAuth(); const uid = session?.user?.id
  const loc = useLocation(); const formRef = useRef(null)
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState({ rating: 0, category: 'All', sort: 'new' })
  const [list, setList] = useState({ rows: [], total: 0, loading: true })
  const [err, setErr] = useState('')
  const [mine, setMine] = useState([])
  const [form, setForm] = useState({ rating: 0, category: 'General', comment: '' })
  const [saving, setSaving] = useState(false)
  const [note, setNote] = useState(null)

  const load = useCallback(async (from = 0) => {
    setList(l => ({ ...l, loading: true }))
    try {
      const r = await listFeedback({ ...filter, from })
      setList(l => ({ rows: from ? [...l.rows, ...r.rows] : r.rows, total: r.total, loading: false })); setErr('')
    } catch (e) { setErr(friendlyError(e)); setList({ rows: [], total: 0, loading: false }) }
  }, [filter, uid])
  useEffect(() => { load(0) }, [load])

  const loadStats = () => getStats().then(setStats).catch(() => {})
  const loadMine = useCallback(() => (uid ? myFeedback().then(setMine).catch(() => {}) : setMine([])), [uid])
  useEffect(() => { loadStats() }, [])
  useEffect(() => { loadMine() }, [loadMine])

  // Pre-fill the form when you already gave feedback for the chosen topic
  useEffect(() => {
    const m = mine.find(x => x.category === form.category)
    setForm(f => ({ ...f, rating: m ? m.rating : 0, comment: m ? m.comment : '' }))
  }, [form.category, mine])
  useEffect(() => {
    if (loc.state?.edit) { setForm(f => ({ ...f, category: loc.state.edit })); formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  }, [loc.state])

  const existing = mine.find(x => x.category === form.category)
  const goForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const refresh = () => { loadStats(); loadMine(); load(0) }

  async function submit(e) {
    e.preventDefault(); setNote(null)
    if (!form.rating) return setNote({ bad: true, text: 'Tap a star to rate.' })
    if (form.comment.trim().length < 5) return setNote({ bad: true, text: 'Write at least 5 characters in your comment.' })
    setSaving(true)
    try { await saveFeedback(form); setNote({ text: existing ? 'Feedback updated. Thank you!' : 'Thank you! Your feedback is live.' }); refresh() }
    catch (x) { setNote({ bad: true, text: friendlyError(x) }) }
    setSaving(false)
  }
  const edit = r => { setForm({ rating: r.rating, category: r.category, comment: r.comment }); goForm() }
  async function remove(r) {
    if (!window.confirm('Delete your feedback?')) return
    try { await deleteFeedback(r.id); setNote({ text: 'Feedback deleted.' }); refresh() } catch (x) { setNote({ bad: true, text: friendlyError(x) }) }
  }

  const bars = stats ? [[5, stats.five], [4, stats.four], [3, stats.three], [2, stats.two], [1, stats.one]] : []
  const set = k => v => setFilter(f => ({ ...f, [k]: v }))
  return (<>
    <PageBanner image="feedback" title="What students say" text="Real feedback with star ratings from students like you. Share yours to help others choose.">
      <button type="button" className="btn yel" onClick={goForm}>Write feedback</button>
    </PageBanner>

    {err && <p className="err">{err}</p>}

    <section className="fsum">
      <div className="fsum-avg"><b>{stats?.total ? stats.avg.toFixed(1) : '–'}</b>
        <Stars value={stats?.avg || 0} size="1.4rem" /><small>{stats?.total ? `${stats.total} feedback${stats.total > 1 ? 's' : ''}` : 'No feedback yet'}</small></div>
      <div className="fsum-bars" aria-label="Filter by stars">{bars.map(([n, c]) => (
        <button type="button" key={n} className={'fbar' + (filter.rating === n ? ' on' : '')} onClick={() => set('rating')(filter.rating === n ? 0 : n)}>
          <span>{n} ★</span><i><em style={{ width: (stats.total ? c / stats.total * 100 : 0) + '%' }} /></i><span>{c}</span></button>))}</div>
    </section>

    <section className="fwrite" ref={formRef} id="write">
      <h2>{existing ? 'Edit your feedback' : 'Give your feedback'}</h2>
      {!session ? (<><p>Log in to rate and comment. Your name and profile are shown with your feedback.</p>
        <div className="row"><Link to="/login" className="btn">Login</Link><Link to="/signup" className="btn alt">Register</Link></div></>)
      : (<form className="fform" onSubmit={submit}>
        <label>What is your feedback about?
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
        <div className="flabel">Your rating</div>
        <StarInput value={form.rating} onChange={n => setForm({ ...form, rating: n })} />
        <label>Your comment
          <textarea rows="4" maxLength={MAX} placeholder={form.rating ? `${RATING_WORDS[form.rating]}. Tell others what you liked or what to improve.` : 'Tell others what you liked or what to improve.'}
            value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} /></label>
        <div className="fcount">{form.comment.length} / {MAX}</div>
        <p className="fhint">Shown with your profile. <Link to="/profile">Add your name, education and state</Link> so students know who you are.</p>
        {note && <p className={note.bad ? 'err' : 'fok'} role="status">{note.text}</p>}
        <div className="row"><button disabled={saving}>{saving ? 'Saving…' : existing ? 'Update feedback' : 'Submit feedback'}</button></div>
      </form>)}
    </section>

    <section className="sec">
      <div className="ftools">
        <h2>All feedback{list.total ? ` (${list.total})` : ''}</h2>
        <div className="ffilters">
          <select aria-label="Topic" value={filter.category} onChange={e => set('category')(e.target.value)}><option>All</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
          <select aria-label="Sort" value={filter.sort} onChange={e => set('sort')(e.target.value)}><option value="new">Newest</option><option value="high">Highest rating</option><option value="low">Lowest rating</option></select>
        </div>
      </div>
      {filter.rating > 0 && <p><button type="button" className="chip on" onClick={() => set('rating')(0)}>{filter.rating} stars ✕</button></p>}
      {list.loading && !list.rows.length && <><div className="skel" /><div className="skel" /></>}
      {!list.loading && !err && !list.rows.length && <div className="card"><b>No feedback here yet.</b><p style={{ margin: 0 }}>Be the first to share your thoughts above.</p></div>}
      <div className="fgrid">{list.rows.map(r => <FeedbackCard key={r.id} row={r} onEdit={edit} onDelete={remove} />)}</div>
      {list.rows.length < list.total && <p style={{ textAlign: 'center' }}><button type="button" disabled={list.loading} onClick={() => load(list.rows.length)}>{list.loading ? 'Loading…' : `Show more (${Math.min(PAGE, list.total - list.rows.length)} more)`}</button></p>}
    </section></>)
}
