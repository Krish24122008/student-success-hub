import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Stars, { RATING_WORDS } from '../../components/feedback/Stars.jsx'
import Avatar from '../../components/feedback/Avatar.jsx'
import FeedbackCard from '../../components/feedback/FeedbackCard.jsx'
import { deleteFeedback, fmtDate, friendlyError, getFeedback, listFeedback, sub, who } from '../../services/feedback.js'

// Full feedback + the full profile of the student who wrote it.
export default function FeedbackDetail() {
  const { id } = useParams(); const nav = useNavigate()
  const [row, setRow] = useState(undefined); const [more, setMore] = useState([]); const [err, setErr] = useState('')
  useEffect(() => {
    setRow(undefined); setErr('')
    getFeedback(id).then(async r => {
      setRow(r || null)
      if (r) listFeedback({ userId: r.user_id, excludeId: r.id, size: 4 }).then(x => setMore(x.rows)).catch(() => {})
    }).catch(e => { setErr(friendlyError(e)); setRow(null) })
  }, [id])

  if (row === undefined) return (<><div className="skel" /><div className="skel" /></>)
  if (!row) return (<><p className="crumbs"><Link to="/feedback">Feedback</Link></p><h2>Feedback not found</h2>
    <p>{err || 'It may have been deleted.'}</p><Link to="/feedback" className="btn">See all feedback</Link></>)

  const name = who(row)
  async function remove() {
    if (!window.confirm('Delete your feedback?')) return
    try { await deleteFeedback(row.id); nav('/feedback') } catch (e) { setErr(friendlyError(e)) }
  }
  return (<>
    <p className="crumbs"><Link to="/feedback">Feedback</Link> / {name}</p>
    <div className="fdetail">
      <article className="fmain">
        <div className="frate"><Stars value={row.rating} size="1.8rem" /><b>{row.rating}.0</b><span>{RATING_WORDS[row.rating]}</span></div>
        <span className="ftag">{row.category}</span>
        <p className="ffull">{row.comment}</p>
        <small className="fdate">Posted {fmtDate(row.created_at)}{row.updated_at && row.updated_at.slice(0, 16) !== row.created_at.slice(0, 16) ? `, edited ${fmtDate(row.updated_at)}` : ''}</small>
        {err && <p className="err">{err}</p>}
        <div className="row">
          <Link to="/feedback" className="btn alt">All feedback</Link>
          {row.is_mine && <><Link to="/feedback" state={{ edit: row.category }} className="btn">Edit</Link><button type="button" className="btn alt dangerbtn" onClick={remove}>Delete</button></>}
        </div>
      </article>

      <aside className="fprof" aria-label="Student profile">
        <Avatar name={name} id={row.user_id} size={72} />
        <h3>{name}{row.is_mine && <span className="ftag you">You</span>}</h3>
        <p>{sub(row) || 'Student'}</p>
        <dl>
          {row.education_level && <><dt>Education</dt><dd>{row.education_level}</dd></>}
          {row.state && <><dt>State</dt><dd>{row.state}</dd></>}
          {row.career_goal && <><dt>Career goal</dt><dd>{row.career_goal}</dd></>}
          {row.member_since && <><dt>Member since</dt><dd>{fmtDate(row.member_since)}</dd></>}
        </dl>
        {(row.skills || []).length > 0 && <><div className="flabel">Skills</div><div className="ctags">{row.skills.map(s => <span key={s}>{s}</span>)}</div></>}
      </aside>
    </div>

    {more.length > 0 && <section className="sec"><h2>More from {name.split(' ')[0]}</h2>
      <div className="fgrid">{more.map(r => <FeedbackCard key={r.id} row={r} />)}</div></section>}
  </>)
}
