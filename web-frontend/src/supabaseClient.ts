import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// If not configured, create a no-op client pointing to a valid but non-existent URL
// This prevents DNS lookup failures crashing the app
const safeUrl = (supabaseUrl && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('placeholder'))
  ? supabaseUrl
  : 'https://no-supabase-configured.invalid'

const safeKey = supabaseAnonKey || 'no-key'

export const supabase = createClient(safeUrl, safeKey)
export const SUPABASE_CONFIGURED = safeUrl !== 'https://no-supabase-configured.invalid'
