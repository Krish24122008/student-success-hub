import { supabase } from './supabase.js'
// Opens a private study file in a new tab using a short-lived signed link.
export async function openMaterial(m) {
  const w = window.open('', '_blank') // open the tab first so pop-up blockers allow it
  const { data, error } = await supabase.storage.from('study-materials').createSignedUrl(m.file_path, 120)
  if (error || !data?.signedUrl) {
    if (w) w.close()
    throw new Error(error?.message || 'Could not open the file.')
  }
  if (w) { w.opener = null; w.location.href = data.signedUrl } else window.location.href = data.signedUrl
}
