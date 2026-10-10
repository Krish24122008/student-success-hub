import { supabase } from './supabase.js'
export const signUp = (email, password) => supabase.auth.signUp({ email, password })
export const verifyCode = (email, token) => supabase.auth.verifyOtp({ email, token, type: 'signup' })
export const resendCode = (email) => supabase.auth.resend({ type: 'signup', email })
export const logIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
export const logOut = () => supabase.auth.signOut()
