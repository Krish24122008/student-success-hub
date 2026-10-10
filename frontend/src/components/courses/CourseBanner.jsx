import { useState } from 'react'

// Shows the course banner. If a custom image URL fails to load, the built-in banner is used.
export default function CourseBanner({ course, className = '', alt }) {
  const [src, setSrc] = useState(course.banner)
  return <img className={'cbanner ' + className} src={src} alt={alt || `${course.title} course banner`} loading="lazy"
    onError={() => src !== course.fallbackBanner && setSrc(course.fallbackBanner)} />
}
