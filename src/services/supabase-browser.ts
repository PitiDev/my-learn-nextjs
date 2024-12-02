// services/supabase-browser.ts
import { createBrowserClient } from '@supabase/ssr'
import { type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// シングルトンパターンでクライアントを生成
let clientSingleton: SupabaseClient | null = null

export const createClientComponentClient = () => {
  if (clientSingleton) return clientSingleton

  clientSingleton = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return clientSingleton
}

export const supabase = createClientComponentClient()