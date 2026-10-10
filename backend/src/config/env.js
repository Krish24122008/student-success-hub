import 'dotenv/config'
export const env = { port: process.env.PORT || 5000, supabaseUrl: process.env.SUPABASE_URL, serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  gemini: process.env.GEMINI_API_KEY, frontend: process.env.FRONTEND_URL }
