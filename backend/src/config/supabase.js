import { createClient } from '@supabase/supabase-js'
import { env } from './env.js'
export const admin = createClient(env.supabaseUrl, env.serviceKey)
