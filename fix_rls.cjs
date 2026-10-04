const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.ekgxcybvaiydkskmydhy:Az@1129062848@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
client.connect().then(async () => {
  try {
     await client.query('DROP POLICY IF EXISTS "Allow all settings" ON public.system_settings');
     await client.query('DROP POLICY IF EXISTS "Allow all notifications" ON public.notifications');
     await client.query('CREATE POLICY "Allow all settings" ON public.system_settings FOR ALL USING (true) WITH CHECK (true)');
     await client.query('CREATE POLICY "Allow all notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true)');
     console.log('RLS fixed!');
  } catch(e) { console.error(e) }
  client.end();
});
