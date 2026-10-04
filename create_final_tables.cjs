const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.ekgxcybvaiydkskmydhy:Az@1129062848@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
client.connect().then(async () => {
  const sql = `
  CREATE TABLE IF NOT EXISTS public.system_settings (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      company_name VARCHAR(255) DEFAULT 'شركة الأعمال المتطورة المحدودة',
      fiscal_year VARCHAR(50) DEFAULT '2024',
      currency VARCHAR(50) DEFAULT 'الريال السعودي (ر.س)',
      prefix_asset VARCHAR(50) DEFAULT 'AST-2024-',
      prefix_transfer VARCHAR(50) DEFAULT 'TRF-2024-',
      prefix_inventory VARCHAR(50) DEFAULT 'INV-2024-',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
  );
  
  -- Insert default row if not exists
  INSERT INTO public.system_settings (company_name)
  SELECT 'شركة الأعمال المتطورة المحدودة'
  WHERE NOT EXISTS (SELECT 1 FROM public.system_settings);

  CREATE TABLE IF NOT EXISTS public.notifications (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      message TEXT,
      type VARCHAR(50) DEFAULT 'info',
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
  );
  
  -- Seed notifications based on current data
  TRUNCATE TABLE public.notifications CASCADE;
  INSERT INTO public.notifications (title, message, type) VALUES
  ('تنبيه: انخفاض مخزون', 'صنف (كيابل شبكة 10 متر) وصل إلى الحد الأدنى لإعادة الطلب.', 'warning'),
  ('تنبيه: صيانة قادمة', 'الأصل (سيرفر بيانات مركزي) يحتاج إلى صيانة دورية الشهر القادم.', 'info'),
  ('اعتماد مطلوب', 'يوجد طلب تحويل عهدة بانتظار اعتمادك من إدارة التقنية.', 'warning');
  
  -- Allow public access for now
  ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
  
  DROP POLICY IF EXISTS "Allow all settings" ON public.system_settings;
  DROP POLICY IF EXISTS "Allow all notifications" ON public.notifications;
  
  CREATE POLICY "Allow all settings" ON public.system_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all notifications" ON public.notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
  `;
  await client.query(sql);
  console.log('Tables created!');
  client.end();
});
