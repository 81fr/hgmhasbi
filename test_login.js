import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ekgxcybvaiydkskmydhy.supabase.co'
const supabaseAnonKey = 'sb_publishable_sOzavju0gBgM2cYF7BIXrw_StDfGIGQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: '81fr511@gmail.com',
    password: '054626',
  })
  if (error) {
    console.error('Login Failed:', error.message)
  } else {
    console.log('Login Success! Session token:', data.session.access_token.substring(0, 20) + '...')
  }
}

testLogin()
