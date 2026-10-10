import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUp, verifyCode, resendCode } from '../services/auth.js'
export default function Signup() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [code, setCode] = useState(''); const [sent, setSent] = useState(false)
  const [msg, setMsg] = useState(''); const nav = useNavigate()
  async function send(e) {
    e.preventDefault(); setMsg('')
    if (password.length < 8) return setMsg('Password must be at least 8 characters.')
    const { error } = await signUp(email, password)
    error ? setMsg(error.message) : setSent(true)
  }
  async function verify(e) {
    e.preventDefault()
    const { error } = await verifyCode(email, code.trim())
    error ? setMsg('That code is wrong or expired. Request a new one.') : nav('/onboarding')
  }
  return sent ? (<form onSubmit={verify}><h2>Enter your 8-digit code</h2><p>We emailed it to {email}.</p>
    <input value={code} onChange={e => setCode(e.target.value)} inputMode="numeric" maxLength={8} required />
    <p className="err">{msg}</p><button>Verify email</button>{' '}
    <button type="button" onClick={() => resendCode(email)}>Resend code</button></form>)
  : (<form onSubmit={send}><h2>Create your account</h2>
    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
    <input type="password" placeholder="Password (8+ characters)" value={password} onChange={e => setPassword(e.target.value)} required />
    <p className="err">{msg}</p><button>Send verification code</button></form>)
}
