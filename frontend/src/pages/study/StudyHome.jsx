import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase.js'
import { api } from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import QuizRunner from '../../components/QuizRunner.jsx'
export default function StudyHome() {
  const { session } = useAuth(); const uid = session.user.id
  const [list, setList] = useState([]); const [msg, setMsg] = useState(''); const [play, setPlay] = useState(null)
  const load = () => supabase.from('study_materials').select('*').order('created_at', { ascending: false }).then(({ data }) => setList(data || []))
  useEffect(() => { load() }, [])
  async function upload(e) {
    const f = e.target.files[0]; if (!f) return
    setMsg('Uploading…'); const path = `${uid}/${Date.now()}-${f.name}`
    const up = await supabase.storage.from('study-materials').upload(path, f)
    if (up.error) return setMsg(up.error.message)
    const { error } = await supabase.from('study_materials').insert({ user_id: uid, title: f.name, file_path: path, file_type: f.type, file_size: f.size })
    setMsg(error ? error.message : 'Uploaded.'); load()
  }
  async function summarize(m) { setMsg('Summarizing…'); try { await api('/api/ai/summarize', { materialId: m.id }); setMsg('Summary ready.'); load() } catch (e) { setMsg('Error: ' + e.message) } }
  async function makeQuiz(m) {
    setMsg('Making quiz… long PDFs can take up to a minute.')
    try { const r = await api('/api/ai/quiz', { materialId: m.id, count: 10 }); setMsg(''); setPlay({ quizId: r.quizId, questions: r.questions }) }
    catch (e) { setMsg('Error: ' + e.message) }
  }
  if (play) return <QuizRunner quizId={play.quizId} questions={play.questions} onExit={() => setPlay(null)} />
  return (<><h2>Study assistant</h2><input type="file" accept=".pdf" onChange={upload} /><p className={msg.startsWith('Error') ? 'err' : ''}>{msg}</p>
    {list.map(m => (<div className="card" key={m.id}><b>{m.title}</b><p style={{ whiteSpace: 'pre-wrap' }}>{m.summary || 'No summary yet.'}</p>
      <button onClick={() => summarize(m)}>Summarize</button>{' '}<button onClick={() => makeQuiz(m)}>Make quiz</button></div>))}
    <p>Saved quizzes are in the <Link to="/quizzes">Quizzes</Link> section.</p></>)
}
