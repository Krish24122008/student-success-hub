import { Link } from 'react-router-dom'

// Big attractive header with a background image, used on Home, Dashboard, Courses,
// Scholarships, Internships and Career Roadmap pages.
// image = file name inside /public/images/backgrounds (without .svg)
export default function PageBanner({ image = 'home', title, text, actions = [], children }) {
  return (<section className="pbanner" style={{ backgroundImage: `url(/images/backgrounds/${image}.svg)` }}>
    <div className="pbanner-in">
      <h1>{title}</h1>
      {text && <p>{text}</p>}
      {actions.length > 0 && <div className="row">{actions.map(a => (<Link key={a.to} to={a.to} className={'btn ' + (a.kind || '')}>{a.label}</Link>))}</div>}
      {children}
    </div></section>)
}
