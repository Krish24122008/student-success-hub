export default function ProgressBar({ value = 0, label }) {
  return (<div className="cprog" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label || 'Course progress'}>
    <div className="bar good"><i style={{ width: value + '%' }} /></div>
    <small>{value}% complete</small></div>)
}
