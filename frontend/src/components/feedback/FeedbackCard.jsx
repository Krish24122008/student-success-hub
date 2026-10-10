import { Link } from 'react-router-dom'
import Stars from './Stars.jsx'
import Avatar from './Avatar.jsx'
import { fmtDate, who, sub } from '../../services/feedback.js'

// One feedback with the student's profile. onEdit / onDelete only show on your own feedback.
export default function FeedbackCard({ row, onEdit, onDelete }) {
  const name = who(row)
  return (<article className="fcard">
    <header className="fhead">
      <Avatar name={name} id={row.user_id} />
      <div className="fwho">
        <div className="fnamerow"><Link to={`/feedback/${row.id}`} className="fname">{name}</Link>{row.is_mine && <span className="ftag you">You</span>}</div>
        <small>{sub(row) || 'Student'}</small>
      </div>
      <div className="fmeta"><Stars value={row.rating} /><small>{fmtDate(row.created_at)}</small></div>
    </header>
    <span className="ftag">{row.category}</span>
    <p className="fcomment">{row.comment}</p>
    <footer className="ffoot">
      <Link to={`/feedback/${row.id}`}>Read full feedback and profile</Link>
      {row.is_mine && onEdit && (<span className="fact"><button type="button" className="flink" onClick={() => onEdit(row)}>Edit</button>
        <button type="button" className="flink del" onClick={() => onDelete(row)}>Delete</button></span>)}
    </footer></article>)
}
