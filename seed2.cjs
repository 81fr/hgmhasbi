const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.ekgxcybvaiydkskmydhy:Az@1129062848@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
client.connect().then(async () => {
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
  UPDATE public.assets SET disposal_date = '2024-08-15', disposal_reason = 'تالف / خردة: اللوحة الأم معطلة وتكلفة الإصلاح باهظة' WHERE asset_no = 'AST-2024-0011';
  
  TRUNCATE TABLE public.warehouse_items CASCADE;
  INSERT INTO public.warehouse_items (sku, name, category_id, quantity, min_quantity, bin_location, status, radar_stage) VALUES
  ('SKU-PC-001', 'شاشة كمبيوتر ديل 27 بوصة', 'أجهزة تقنية', 25, 5, 'A-01', 'متاح', 'Deploy'),
  ('SKU-FUR-002', 'كرسي مكتب طبي دوار', 'أثاث مكتبي', 40, 10, 'B-04', 'متاح', 'Allocate'),
  ('SKU-IT-003', 'كيابل شبكة 10 متر', 'أجهزة تقنية', 0, 15, 'C-12', 'نفد', 'Receive');
  
  TRUNCATE TABLE public.inventory_campaigns CASCADE;
  INSERT INTO public.inventory_campaigns (campaign_name, start_date, end_date, status, notes) VALUES
  ('حملة الجرد السنوي للأصول 2024', '2024-11-01', '2024-12-15', 'مغلقة', 'نطاق: كافة فروع الشركة | مشرف: فهد عبدالله'),
  ('الجرد المفاجئ لتقنية المعلومات', '2024-12-25', '2025-01-10', 'مفتوحة', 'نطاق: إدارة التقنية فقط | التركيز على العهد');
  
  TRUNCATE TABLE public.audit_logs CASCADE;
  INSERT INTO public.audit_logs (action, entity_name, new_values) VALUES
  ('إنشاء حملة جرد', 'Inventory Campaign', '{"campaign_name": "الجرد المفاجئ لتقنية المعلومات"}'),
  ('إنشاء أصل جديد', 'Asset', '{"asset_no": "AST-2024-0010"}'),
  ('استبعاد أصل', 'Asset', '{"asset_no": "AST-2024-0011", "status": "مستبعد"}'),
  ('حركة مستودعية', 'Warehouse', '{"type": "إذن إضافة", "qty": 25, "sku": "SKU-PC-001"}');
  `;
  await client.query(sql);
  console.log('Seeded successfully!');
  client.end();
});
