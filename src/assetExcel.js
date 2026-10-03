import * as XLSX from 'xlsx';

// ===== قوائم القيم المسموحة (حسب سجل الأصول الثابتة) =====
export const CATEGORIES = ['أراضي', 'مباني', 'مركبات', 'أصول تقنية', 'أثاث ومعدات', 'أصول أوقاف'];
export const STATUSES = ['يعمل', 'بالمستودع', 'تالف', 'مستبعد'];
export const FUNDING_SOURCES = ['بنك الراجحي', 'بنك البلاد', 'موردين', 'تبرعات عينية', 'تمويل ذاتي'];
export const METHOD_LABELS = {
  SL: 'القسط الثابت',
  DB: 'القسط المتناقص المضاعف',
  SYD: 'مجموع أرقام السنوات'
};

// الأعمدة: key = اسم الحقل في النظام، label = عنوان العمود في Excel
export const ASSET_COLUMNS = [
  { key: 'id', label: 'رقم الأصل', width: 16 },
  { key: 'name', label: 'وصف الأصل', width: 34, required: true },
  { key: 'category', label: 'فئة الأصل', width: 16, required: true },
  { key: 'location', label: 'الموقع', width: 18 },
  { key: 'department', label: 'الإدارة', width: 18 },
  { key: 'custody', label: 'الموظف / العهدة', width: 18 },
  { key: 'supplier', label: 'المورد', width: 18 },
  { key: 'invoiceNo', label: 'رقم الفاتورة', width: 16 },
  { key: 'date', label: 'تاريخ الشراء', width: 14, type: 'date', required: true },
  { key: 'receiptDate', label: 'تاريخ الاستلام', width: 14, type: 'date' },
  { key: 'readyDate', label: 'تاريخ جاهزية الاستخدام', width: 20, type: 'date' },
  { key: 'cost', label: 'تكلفة الأصل', width: 14, type: 'number', required: true },
  { key: 'vat', label: 'ضريبة القيمة المضافة', width: 18, type: 'number' },
  { key: 'source', label: 'مصدر التمويل', width: 16 },
  { key: 'life', label: 'العمر الإنتاجي (سنوات)', width: 20, type: 'number' },
  { key: 'method', label: 'طريقة الإهلاك', width: 22, type: 'method' },
  { key: 'salvage', label: 'القيمة المتبقية', width: 14, type: 'number' },
  { key: 'status', label: 'الحالة', width: 12 },
  { key: 'lastInventory', label: 'تاريخ آخر جرد', width: 14, type: 'date' },
  { key: 'disposalDate', label: 'تاريخ الاستبعاد', width: 14, type: 'date' },
  { key: 'disposalReason', label: 'سبب الاستبعاد', width: 22 }
];

const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const toDateString = (v) => {
  if (v === undefined || v === null || v === '') return '';
  if (v instanceof Date && !isNaN(v)) return fmtDate(v);
  if (typeof v === 'number') {
    const p = XLSX.SSF.parse_date_code(v);
    return p ? `${p.y}-${pad(p.m)}-${pad(p.d)}` : '';
  }
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/); // DD/MM/YYYY
  if (m) return `${m[3]}-${pad(m[2])}-${pad(m[1])}`;
  const d = new Date(s);
  return isNaN(d) ? '' : fmtDate(d);
};

const toNumber = (v) => {
  if (v === undefined || v === null || v === '') return 0;
  const n = parseFloat(String(v).replace(/[,\s]/g, ''));
  return isNaN(n) ? NaN : n;
};

const toMethod = (v) => {
  const s = String(v || '').trim();
  if (!s) return 'SL';
  const up = s.toUpperCase();
  if (METHOD_LABELS[up]) return up;
  const found = Object.entries(METHOD_LABELS).find(([, label]) => label === s);
  return found ? found[0] : null;
};

const rtlSheet = (ws, widths) => {
  ws['!cols'] = widths.map((w) => ({ wch: w }));
  ws['!views'] = [{ RTL: true }];
  return ws;
};

// ===== تنزيل نموذج التعبئة =====
export const downloadTemplate = () => {
  const headers = ASSET_COLUMNS.map((c) => c.label + (c.required ? ' *' : ''));
  const example = {
    id: '', name: 'سيارة نقل تويوتا هايلكس', category: 'مركبات', location: 'الرياض - المستودع الرئيسي',
    department: 'إدارة النقل', custody: 'أحمد سالم', supplier: 'شركة المركبات المتحدة', invoiceNo: 'INV-2024-0155',
    date: '2024-01-15', receiptDate: '2024-01-20', readyDate: '2024-01-25', cost: 120000, vat: 18000,
    source: 'بنك الراجحي', life: 5, method: 'القسط الثابت', salvage: 10000, status: 'يعمل',
    lastInventory: '2024-06-30', disposalDate: '', disposalReason: ''
  };
  const row = ASSET_COLUMNS.map((c) => example[c.key]);
  const ws = rtlSheet(XLSX.utils.aoa_to_sheet([headers, row]), ASSET_COLUMNS.map((c) => c.width));

  const maxLen = Math.max(CATEGORIES.length, STATUSES.length, FUNDING_SOURCES.length, 3);
  const help = [
    ['تعليمات تعبئة النموذج'],
    ['1) املأ البيانات في الورقة "تعبئة الأصول" بدءاً من السطر الثاني، واحذف سطر المثال أو استبدله.'],
    ['2) الأعمدة المعلّمة بنجمة (*) إلزامية: وصف الأصل، الفئة، تاريخ الشراء، التكلفة.'],
    ['3) صيغة التواريخ: YYYY-MM-DD مثال 2024-01-15 (أو تاريخ Excel عادي).'],
    ['4) رقم الأصل: اتركه فارغاً ليُنشأ تلقائياً، أو أدخل رقماً موجوداً لتحديث الأصل.'],
    ['5) استخدم القيم المسموحة أدناه تماماً للفئة والحالة ومصدر التمويل وطريقة الإهلاك.'],
    [],
    ['فئة الأصل', 'الحالة', 'مصدر التمويل', 'طريقة الإهلاك']
  ];
  const methods = Object.values(METHOD_LABELS);
  for (let i = 0; i < maxLen; i++) {
    help.push([CATEGORIES[i] || '', STATUSES[i] || '', FUNDING_SOURCES[i] || '', methods[i] || '']);
  }
  const wsHelp = rtlSheet(XLSX.utils.aoa_to_sheet(help), [20, 16, 18, 26]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'تعبئة الأصول');
  XLSX.utils.book_append_sheet(wb, wsHelp, 'تعليمات');
  XLSX.writeFile(wb, 'نموذج_استيراد_الأصول.xlsx');
};

// ===== تصدير السجل الحالي =====
export const exportAssets = (assets) => {
  const rows = assets.map((a) => {
    const base = ASSET_COLUMNS.map((c) => (c.key === 'method' ? METHOD_LABELS[a.method] || '' : a[c.key] ?? ''));
    return [...base, Math.round(a.periodDep || 0), Math.round(a.accumulatedDep || 0), Math.round(a.netBookValue || 0)];
  });
  const headers = [...ASSET_COLUMNS.map((c) => c.label), 'إهلاك الفترة', 'مجمع الإهلاك', 'القيمة الدفترية'];
  const ws = rtlSheet(XLSX.utils.aoa_to_sheet([headers, ...rows]), [...ASSET_COLUMNS.map((c) => c.width), 14, 14, 16]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'سجل الأصول الثابتة');
  XLSX.writeFile(wb, `سجل_الأصول_${fmtDate(new Date())}.xlsx`);
};

// ===== قراءة ملف Excel المرفوع والتحقق منه =====
export const parseAssetsFile = async (file) => {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array', cellDates: true });
  const ws = wb.Sheets['تعبئة الأصول'] || wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(ws, { defval: '', raw: true });

  const clean = (h) => String(h).replace('*', '').trim();
  const byLabel = Object.fromEntries(ASSET_COLUMNS.map((c) => [c.label, c]));

  const rows = [];
  const errors = [];
  raw.forEach((r, i) => {
    const line = i + 2;
    const rec = {};
    Object.entries(r).forEach(([h, v]) => {
      const col = byLabel[clean(h)];
      if (!col) return;
      if (col.type === 'date') rec[col.key] = toDateString(v);
      else if (col.type === 'number') rec[col.key] = toNumber(v);
      else if (col.type === 'method') rec[col.key] = toMethod(v);
      else rec[col.key] = String(v ?? '').trim();
    });
    if (Object.values(rec).every((v) => v === '' || v === 0 || v === null)) return; // سطر فارغ

    const issues = [];
    if (!rec.name) issues.push('وصف الأصل مطلوب');
    if (!CATEGORIES.includes(rec.category)) issues.push(`الفئة غير صحيحة (${rec.category || 'فارغة'})`);
    if (!rec.date) issues.push('تاريخ الشراء مطلوب/غير صحيح');
    if (!(rec.cost > 0)) issues.push('التكلفة يجب أن تكون رقماً أكبر من صفر');
    if (rec.method === null) issues.push('طريقة الإهلاك غير صحيحة');
    ['vat', 'life', 'salvage'].forEach((k) => { if (Number.isNaN(rec[k])) issues.push(`قيمة غير رقمية في ${k}`); });
    if (rec.status && !STATUSES.includes(rec.status)) issues.push(`الحالة غير صحيحة (${rec.status})`);

    if (issues.length) errors.push({ line, issues: issues.join('، ') });
    else rows.push({ line, data: rec });
  });
  return { rows, errors, total: rows.length + errors.length };
};
