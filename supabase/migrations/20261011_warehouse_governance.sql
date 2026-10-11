-- =========================================================================
-- Phase 8: Warehouse Governance & Material Dispatch Approvals Migration
-- =========================================================================

-- 1. إضافة أعمدة الحوكمة إلى جدول الأصناف بالمستودع
ALTER TABLE public.warehouse_items ADD COLUMN IF NOT EXISTS warehouse_keeper VARCHAR(255);
ALTER TABLE public.warehouse_items ADD COLUMN IF NOT EXISTS warehouse_branch VARCHAR(255) DEFAULT 'المستودع المركزي الرئيسي';
ALTER TABLE public.warehouse_items ADD COLUMN IF NOT EXISTS storage_condition VARCHAR(255) DEFAULT 'عادي / جاف (درجة حرارة الغرفة)';

-- 2. إنشاء جدول طلبات الصرف وخروج المواد من المستودع مع دورة الموافقات
CREATE TABLE IF NOT EXISTS public.warehouse_requests (
    id VARCHAR(100) PRIMARY KEY,
    item_id UUID REFERENCES public.warehouse_items(id) ON DELETE SET NULL,
    item_sku VARCHAR(100),
    item_name VARCHAR(255) NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1,
    unit VARCHAR(50) DEFAULT 'حبة',
    bin_location VARCHAR(100),
    warehouse_branch VARCHAR(255) DEFAULT 'المستودع المركزي الرئيسي',
    requester VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    is_custody BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'بانتظار الموافقة', -- 'بانتظار الموافقة', 'معتمد ومصروف', 'مرفوض'
    rejection_reason TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_by VARCHAR(255),
    approved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- تمكين سياسات الوصول RLS
ALTER TABLE public.warehouse_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all actions for authenticated users on warehouse_requests" ON public.warehouse_requests FOR ALL USING (true);
