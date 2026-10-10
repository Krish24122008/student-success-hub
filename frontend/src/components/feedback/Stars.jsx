import { useState } from 'react'
export const RATING_WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']

// Read-only stars. Works with decimals, e.g. 4.6.
export default function Stars({ value = 0, size = '1.1rem' }) {
  const pct = Math.max(0, Math.min(5, value)) / 5 * 100
  return (<span className="stars" style={{ fontSize: size }} role="img" aria-label={`${value} out of 5 stars`}>
    <span aria-hidden="true">★★★★★<i style={{ width: pct + '%' }}>★★★★★</i></span></span>)
}

// Tap-to-rate stars used in the feedback form.
export function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (<div>
    <div className="starin" role="group" aria-label="Star rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(n => (
        <button type="button" key={n} className={'fstar' + (n <= shown ? ' on' : '')} aria-label={`${n} star${n > 1 ? 's' : ''}`} aria-pressed={value === n}
          onMouseEnter={() => setHover(n)} onFocus={() => setHover(n)} onBlur={() => setHover(0)} onClick={() => onChange(n)}>★</button>))}
      <span className="starword">{RATING_WORDS[shown] || 'Tap a star'}</span>
    </div></div>)
}
