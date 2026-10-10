import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { logIn } from '../services/auth.js'
export default function Login() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [msg, setMsg] = useState(''); const nav = useNavigate(); const loc = useLocation()
  async function submit(e) { e.preventDefault(); const { error } = await logIn(email, password); error ? setMsg(error.message) : nav(loc.state?.from || '/dashboard') }
  return (<form onSubmit={submit}><h2>Log in</h2>
    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
    <p className="err">{msg}</p><button>Log in</button></form>)
}
