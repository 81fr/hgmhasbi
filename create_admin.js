import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ekgxcybvaiydkskmydhy.supabase.co'
const supabaseAnonKey = 'sb_publishable_sOzavju0gBgM2cYF7BIXrw_StDfGIGQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@hgmhasbi.com',
    password: 'adminPassword123',
  })
  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('User created:', data.user?.email)
  }
}

createAdmin()
