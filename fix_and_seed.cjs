const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.ekgxcybvaiydkskmydhy:Az@1129062848@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
const alter = async (table, col, fk) => {
  await client.query(`ALTER TABLE public.${table} DROP CONSTRAINT IF EXISTS ${fk}`).catch(()=>null);
  await client.query(`ALTER TABLE public.${table} ALTER COLUMN ${col} TYPE VARCHAR(255)`).catch(e => console.log(e.message));
};
client.connect().then(async () => {
  await alter('assets', 'department_id', 'assets_department_id_fkey');
  await alter('assets', 'location_id', 'assets_location_id_fkey');
  await alter('assets', 'custodian_id', 'assets_custodian_id_fkey');
  await alter('assets', 'supplier_id', 'assets_supplier_id_fkey');
  
  // also fix seed query to use strings
  const sql = `
  TRUNCATE TABLE public.assets CASCADE;
  INSERT INTO public.assets (
    id, asset_no, name, category_id, department_id, location_id, custodian_id, supplier_id,
    purchase_date, receipt_date, ready_for_use_date, cost, salvage_value, useful_life, depreciation_method,
    status, qr_code, serial_number, manufacturer, model, invoice_number, po_number, funding_source, warranty_details,
    last_inventory_date
  ) VALUES 
  (
    uuid_generate_v4(), 'AST-2024-0010', 'سيرفر بيانات مركزي', 'أجهزة تقنية', 'إدارة تقنية المعلومات', 'المبنى الرئيسي - الدور الثالث', 'فهد عبدالله المبرمج', 'شركة العبيكان للتقنية',
    '2024-01-10', '2024-01-15', '2024-02-01', 45000.00, 5000.00, 5, 'SL',
    'نشط', 'QR-SRV-001', 'SN-DEL-99931', 'Dell', 'PowerEdge R750', 'INV-5541', 'PO-2024-001', 'ميزانية معتمدة', '3 سنوات شاملة الصيانة',
    '2024-12-01'
  ),
  (
    uuid_generate_v4(), 'AST-2024-0011', 'طابعة ليزر ملونة', 'آلات ومعدات', 'الإدارة المالية', 'المبنى الرئيسي - الدور الثاني', 'محمد المحاسب', 'شركة جرير',
    '2023-06-20', '2023-06-25', '2023-07-01', 12000.00, 1000.00, 4, 'SL',
    'مستبعد', 'QR-PRN-002', 'SN-HP-2281', 'HP', 'LaserJet Enterprise', 'INV-6677', 'PO-2023-110', 'إيرادات ذاتية', 'سنة واحدة',
    '2024-01-10'
  );
  
  TRUNCATE TABLE public.disposals CASCADE;
  INSERT INTO public.disposals (asset_id, reason, request_date, approval_status, committee_members)
  SELECT id, 'تالف / خردة: اللوحة الأم معطلة وتكلفة الإصلاح باهظة', '2024-08-15', 'معتمد', 'لجنة فحص الأعطال التقنية'
  FROM public.assets WHERE asset_no = 'AST-2024-0011';
  UPDATE public.assets SET disposal_date = '2024-08-15', disposal_reason = 'تالف / خردة: اللوحة الأم معطلة وتكلفة الإصلاح باهظة' WHERE asset_no = 'AST-2024-0011';
  `;
  await client.query(sql);
  console.log('Fixed relationships and seeded assets!');
  client.end();
});
