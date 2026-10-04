import * as XLSX from 'xlsx';

export const CATEGORIES = ['أراضي', 'مباني', 'أجهزة تقنية', 'أثاث مكتبي', 'مركبات', 'آلات ومعدات'];
export const STATUSES = ['نشط', 'متوقف', 'صيانة', 'مستبعد'];
export const METHOD_LABELS = { SL: 'القسط الثابت', DB: 'القسط المتناقص' };

export const ASSET_COLUMNS = [
  { key: 'id', label: 'رقم الأصل', width: 18 },
  { key: 'name', label: 'اسم / وصف الأصل', width: 35, required: true },
  { key: 'category', label: 'فئة الأصل', width: 16, required: true },
  { key: 'serialNumber', label: 'الرقم التسلسلي', width: 20 },
  { key: 'manufacturer', label: 'الشركة المصنعة', width: 18 },
  { key: 'model', label: 'الموديل', width: 18 },
  { key: 'location', label: 'الموقع', width: 20 },
  { key: 'department', label: 'الإدارة المستفيدة', width: 20 },
  { key: 'custody', label: 'صاحب العهدة', width: 20 },
  { key: 'supplier', label: 'المورد', width: 20 },
  { key: 'poNumber', label: 'رقم أمر الشراء (PO)', width: 20 },
  { key: 'invoiceNumber', label: 'رقم الفاتورة', width: 18 },
  { key: 'date', label: 'تاريخ الشراء', width: 14, type: 'date', required: true },
  { key: 'receiptDate', label: 'تاريخ الاستلام', width: 14, type: 'date' },
  { key: 'readyDate', label: 'تاريخ جاهزية الاستخدام', width: 20, type: 'date' },
  { key: 'warranty', label: 'تفاصيل الضمان', width: 20 },
  { key: 'fundingSource', label: 'مصدر التمويل', width: 18 },
  { key: 'cost', label: 'تكلفة الأصل (ر.س)', width: 18, type: 'number', required: true },
  { key: 'salvage', label: 'القيمة المتبقية (الخردة)', width: 22, type: 'number' },
  { key: 'life', label: 'العمر الإنتاجي (سنوات)', width: 20, type: 'number', required: true },
  { key: 'method', label: 'طريقة الإهلاك', width: 16, type: 'method', required: true },
  { key: 'status', label: 'حالة الأصل', width: 14 },
  { key: 'lastInventory', label: 'تاريخ آخر جرد', width: 16, type: 'date' },
  { key: 'disposalDate', label: 'تاريخ الاستبعاد', width: 16, type: 'date' },
  { key: 'disposalReason', label: 'سبب الاستبعاد', width: 25 }
];

const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const rtlSheet = (ws, widths) => {
  ws['!cols'] = widths.map((w) => ({ wch: w }));
  ws['!views'] = [{ RTL: true }];
  return ws;
};

export const exportAssets = (assets) => {
  // Add calculated accounting fields to the end of the columns
  const finalColumns = [...ASSET_COLUMNS.map(c => c.label), 'إهلاك الفترة (ر.س)', 'مجمع الإهلاك (ر.س)', 'صافي القيمة الدفترية (NBV)'];
  const finalWidths = [...ASSET_COLUMNS.map(c => c.width), 18, 18, 22];

  const rows = assets.map((a) => {
    const base = ASSET_COLUMNS.map((c) => {
      if (c.key === 'method') return METHOD_LABELS[a.method] || 'القسط الثابت';
      if (c.key === 'date' || c.key === 'readyDate') return a[c.key] ? a[c.key].split('T')[0] : '';
      if (c.type === 'number') return Number(a[c.key]) || 0;
      return a[c.key] ?? '';
    });
    
    // Add Accounting calculations
    const periodDep = Math.round(Number(a.annualDep) || 0);
    const accDep = Math.round(Number(a.accumulatedDep) || 0);
    const nbv = Math.round(Number(a.netBookValue) || 0);

    return [...base, periodDep, accDep, nbv];
  });

  const ws = rtlSheet(XLSX.utils.aoa_to_sheet([finalColumns, ...rows]), finalWidths);
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'سجل الأصول الثابتة');
  XLSX.writeFile(wb, `سجل_الأصول_الثابتة_${fmtDate(new Date())}.xlsx`);
};

export const downloadTemplate = () => {};
export const parseAssetsFile = async (file) => { return {rows:[], errors:[]} };
