import { supabase } from './supabase.js'
export async function api(path, body) {
  const { data } = await supabase.auth.getSession()
  const res = await fetch(import.meta.env.VITE_API_URL + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token}` },
    body: JSON.stringify(body) })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Request failed')
  return json
}
