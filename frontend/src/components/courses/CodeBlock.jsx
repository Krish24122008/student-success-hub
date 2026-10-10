import { useState } from 'react'

export default function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* clipboard blocked */ }
  }
  return (<div className="ccode"><div className="ccode-top"><span>{lang}</span><button type="button" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button></div>
    <pre><code>{code}</code></pre></div>)
}
