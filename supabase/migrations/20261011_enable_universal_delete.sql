-- ========================================================================================
-- سياسات الحذف المباشر والدائم لجميع جداول النظام المحاسبي
-- Migration: 20261011_enable_universal_delete.sql
-- ========================================================================================

-- 1. جدول الأصول الثابتة (Assets)
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow delete on assets" ON public.assets;
DROP POLICY IF EXISTS "Allow all on assets" ON public.assets;
CREATE POLICY "Allow all on assets" ON public.assets FOR ALL USING (true) WITH CHECK (true);

-- 2. جدول أصناف المستودع (Warehouse Items)
ALTER TABLE public.warehouse_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on warehouse_items" ON public.warehouse_items;
CREATE POLICY "Allow all on warehouse_items" ON public.warehouse_items FOR ALL USING (true) WITH CHECK (true);

-- 3. جدول طلبات المستودع والصرف (Warehouse Requests)
CREATE TABLE IF NOT EXISTS public.warehouse_requests (
    id VARCHAR(100) PRIMARY KEY,
    item_id UUID REFERENCES public.warehouse_items(id) ON DELETE SET NULL,
    item_sku VARCHAR(100),
    item_name VARCHAR(255),
    quantity INTEGER DEFAULT 1,
    unit VARCHAR(50) DEFAULT 'حبة',
    requested_by VARCHAR(255),
    recipient_name VARCHAR(255),
    department VARCHAR(255),
    is_custody BOOLEAN DEFAULT FALSE,
    reason TEXT,
    rejection_reason TEXT,
    status VARCHAR(50) DEFAULT 'بانتظار الموافقة',
    approved_by VARCHAR(255),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
ALTER TABLE public.warehouse_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on warehouse_requests" ON public.warehouse_requests;
CREATE POLICY "Allow all on warehouse_requests" ON public.warehouse_requests FOR ALL USING (true) WITH CHECK (true);

-- 4. جدول الموظفين (Employees)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on employees" ON public.employees;
CREATE POLICY "Allow all on employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);

-- 5. جدول القيود اليومية المحاسبية وأسطرها (Journals & Lines)
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on journal_entries" ON public.journal_entries;
CREATE POLICY "Allow all on journal_entries" ON public.journal_entries FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.journal_lines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on journal_lines" ON public.journal_lines;
CREATE POLICY "Allow all on journal_lines" ON public.journal_lines FOR ALL USING (true) WITH CHECK (true);

-- 6. جدول طلبات وحركات النقل (Transfers)
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on transfers" ON public.transfers;
CREATE POLICY "Allow all on transfers" ON public.transfers FOR ALL USING (true) WITH CHECK (true);

-- 7. فك قيد الربط الأجنبي لـ linked_entity_id إذا كان موجوداً للسماح بحذف الأصل دون تعارض
DO $$ 
BEGIN
    -- إذا كان هناك قيد خارجي يربط journal_entries بـ assets يتم تعديله ليصبح ON DELETE SET NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'journal_entries_linked_entity_id_fkey'
    ) THEN
        ALTER TABLE public.journal_entries DROP CONSTRAINT journal_entries_linked_entity_id_fkey;
        ALTER TABLE public.journal_entries ADD CONSTRAINT journal_entries_linked_entity_id_fkey 
            FOREIGN KEY (linked_entity_id) REFERENCES public.assets(id) ON DELETE SET NULL;
    END IF;
END $$;
