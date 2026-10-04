const { Client } = require('pg');

const connectionString = 'postgresql://postgres.ekgxcybvaiydkskmydhy:Az@1129062848@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

const sql = `
-- 1. Clean up existing data to avoid conflicts
TRUNCATE TABLE public.audit_logs CASCADE;
TRUNCATE TABLE public.disposals CASCADE;
TRUNCATE TABLE public.inventory_records CASCADE;
TRUNCATE TABLE public.inventory_campaigns CASCADE;
TRUNCATE TABLE public.warehouse_items CASCADE;
TRUNCATE TABLE public.items CASCADE;
TRUNCATE TABLE public.warehouses CASCADE;
TRUNCATE TABLE public.transfers CASCADE;
TRUNCATE TABLE public.journal_entries CASCADE;
TRUNCATE TABLE public.assets CASCADE;
TRUNCATE TABLE public.suppliers CASCADE;
TRUNCATE TABLE public.cost_centers CASCADE;
TRUNCATE TABLE public.projects CASCADE;

-- 2. Insert Basic Entities (Suppliers, Cost Centers, Projects, Departments, Locations)
INSERT INTO public.suppliers (id, name, contact_info) VALUES 
('11111111-1111-1111-1111-111111111111', 'شركة جرير للتسويق', 'sales@jarir.com | 920000089'),
('22222222-2222-2222-2222-222222222222', 'العبيكان للتقنية', 'tech@obeikan.com | 0112345678');

INSERT INTO public.cost_centers (id, name, code) VALUES 
('33333333-3333-3333-3333-333333333333', 'مركز التقنية والصيانة', 'CC-TECH-01');

INSERT INTO public.projects (id, name, code) VALUES 
('44444444-4444-4444-4444-444444444444', 'مشروع التحول الرقمي', 'PRJ-DIG-26');

-- Ensure some default departments/locations exist
INSERT INTO public.departments (id, name, code) VALUES 
('55555555-5555-5555-5555-555555555555', 'إدارة تقنية المعلومات', 'IT-01') ON CONFLICT DO NOTHING;

INSERT INTO public.locations (id, name) VALUES 
('66666666-6666-6666-6666-666666666666', 'المبنى الرئيسي - الدور الثالث') ON CONFLICT DO NOTHING;

INSERT INTO public.employees (id, full_name, employee_id) VALUES
('77777777-7777-7777-7777-777777777777', 'فهد عبدالله المبرمج', 'EMP-1005') ON CONFLICT DO NOTHING;

-- 3. Insert Comprehensive Assets (Active & Disposed)
INSERT INTO public.assets (
    id, asset_no, name, category_id, department_id, location_id, custodian_id, supplier_id,
    purchase_date, receipt_date, ready_for_use_date, cost, salvage_value, useful_life, depreciation_method,
    status, qr_code, serial_number, manufacturer, model, invoice_number, po_number, funding_source, warranty_details,
    last_inventory_date
) VALUES 
(
    uuid_generate_v4(), 'AST-2024-0010', 'سيرفر بيانات مركزي', 'أجهزة تقنية', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222',
    '2024-01-10', '2024-01-15', '2024-02-01', 45000.00, 5000.00, 5, 'SL',
    'نشط', 'QR-SRV-001', 'SN-DEL-99931', 'Dell', 'PowerEdge R750', 'INV-5541', 'PO-2024-001', 'ميزانية معتمدة', '3 سنوات شاملة الصيانة',
    '2024-12-01'
),
(
    uuid_generate_v4(), 'AST-2024-0011', 'طابعة ليزر ملونة', 'آلات ومعدات', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111',
    '2023-06-20', '2023-06-25', '2023-07-01', 12000.00, 1000.00, 4, 'SL',
    'مستبعد', 'QR-PRN-002', 'SN-HP-2281', 'HP', 'LaserJet Enterprise', 'INV-6677', 'PO-2023-110', 'إيرادات ذاتية', 'سنة واحدة',
    '2024-01-10'
);

-- 4. Insert Disposal Record for the disposed asset
INSERT INTO public.disposals (asset_id, reason, request_date, approval_status, committee_members)
SELECT id, 'تالف / خردة: اللوحة الأم معطلة وتكلفة الإصلاح باهظة', '2024-08-15', 'معتمد', 'لجنة فحص الأعطال التقنية'
FROM public.assets WHERE asset_no = 'AST-2024-0011';

UPDATE public.assets SET disposal_date = '2024-08-15', disposal_reason = 'تالف / خردة: اللوحة الأم معطلة وتكلفة الإصلاح باهظة' WHERE asset_no = 'AST-2024-0011';

-- 5. Insert Warehouses & Items
INSERT INTO public.warehouses (id, name) VALUES ('88888888-8888-8888-8888-888888888888', 'المستودع الرئيسي - الرياض');

INSERT INTO public.warehouse_items (sku, name, category_id, quantity, min_quantity, bin_location, status, radar_stage) VALUES
('SKU-PC-001', 'شاشة كمبيوتر ديل 27 بوصة', 'أجهزة تقنية', 25, 5, 'A-01', 'متاح', 'Deploy'),
('SKU-FUR-002', 'كرسي مكتب طبي دوار', 'أثاث مكتبي', 40, 10, 'B-04', 'متاح', 'Allocate'),
('SKU-IT-003', 'كيابل شبكة 10 متر', 'أجهزة تقنية', 0, 15, 'C-12', 'نفد', 'Receive');

-- 6. Insert Inventory Campaigns
INSERT INTO public.inventory_campaigns (campaign_name, start_date, end_date, status, notes) VALUES
('حملة الجرد السنوي للأصول 2024', '2024-11-01', '2024-12-15', 'مغلقة', 'نطاق: كافة فروع الشركة | مشرف: فهد عبدالله'),
('الجرد المفاجئ لتقنية المعلومات', '2024-12-25', '2025-01-10', 'مفتوحة', 'نطاق: إدارة التقنية فقط | التركيز على العهد');

-- 7. Insert Audit Logs
INSERT INTO public.audit_logs (action, entity_name, new_values) VALUES
('إنشاء حملة جرد', 'Inventory Campaign', '{"campaign_name": "الجرد المفاجئ لتقنية المعلومات"}'),
('إنشاء أصل جديد', 'Asset', '{"asset_no": "AST-2024-0010"}'),
('استبعاد أصل', 'Asset', '{"asset_no": "AST-2024-0011", "status": "مستبعد"}'),
('حركة مستودعية', 'Warehouse', '{"type": "إذن إضافة", "qty": 25, "sku": "SKU-PC-001"}');
`;

async function seedDB() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to Supabase.");
    await client.query(sql);
    console.log("Fake data inserted successfully!");
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await client.end();
  }
}

seedDB();
