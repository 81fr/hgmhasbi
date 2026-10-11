import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';

export const CATEGORIES = ['أراضي', 'مباني', 'أجهزة تقنية', 'أثاث مكتبي', 'مركبات', 'آلات ومعدات'];
export const STATUSES = ['نشط', 'متوقف', 'صيانة', 'مستبعد'];
export const METHOD_LABELS = { SL: 'القسط الثابت', DB: 'القسط المتناقص' };
export const RADAR_STAGES = ['استلام (Receive)', 'تخصيص (Allocate)', 'نشر (Deploy)', 'مراجعة (Audit)', 'إحلال (Retire)'];
export const WAREHOUSE_STATUSES = ['متاح', 'مخصص', 'صيانة', 'نفاد', 'تالف'];

const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Helper to trigger browser download from ExcelJS workbook buffer
const saveWorkbook = async (wb, filename) => {
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// ==========================================
// 1. FIXED ASSETS REGISTER (سجل الأصول الثابتة)
// ==========================================

export const ASSET_COLUMNS = [
  { key: 'id', label: 'رقم الأصل / الباركود', width: 22 },
  { key: 'name', label: 'اسم / وصف الأصل *', width: 32, required: true },
  { key: 'category', label: 'فئة الأصل *', width: 20, required: true },
  { key: 'custody', label: 'اسم الموظف صاحب العهدة *', width: 25, required: true },
  { key: 'location', label: 'مكان العهدة / الموقع *', width: 25, required: true },
  { key: 'department', label: 'الإدارة المستفيدة', width: 22 },
  { key: 'serialNumber', label: 'الرقم التسلسلي (S/N)', width: 22 },
  { key: 'manufacturer', label: 'الشركة المصنعة', width: 20 },
  { key: 'model', label: 'الموديل', width: 18 },
  { key: 'supplier', label: 'المورد', width: 22 },
  { key: 'invoiceNumber', label: 'رقم الفاتورة', width: 18 },
  { key: 'date', label: 'تاريخ الشراء * (YYYY-MM-DD)', width: 22, required: true },
  { key: 'cost', label: 'تكلفة الأصل (ر.س) *', width: 20, type: 'number', required: true },
  { key: 'salvage', label: 'القيمة التخريدية (الخردة)', width: 22, type: 'number' },
  { key: 'life', label: 'العمر الإنتاجي (سنوات) *', width: 22, type: 'number', required: true },
  { key: 'method', label: 'طريقة الإهلاك *', width: 20, required: true },
  { key: 'status', label: 'حالة الأصل', width: 18 },
  { key: 'fundingSource', label: 'مصدر التمويل', width: 20 },
  { key: 'lastInventory', label: 'تاريخ آخر جرد', width: 18 }
];

export const exportAssets = async (assets) => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'نظام تراؤف المحاسبي لإدارة الأصول';
  wb.created = new Date();

  const ws = wb.addWorksheet('سجل الأصول الثابتة', {
    views: [{ rtl: true, showGridLines: true }]
  });

  // Header columns
  const cols = [
    ...ASSET_COLUMNS.map(c => ({ header: c.label, key: c.key, width: c.width })),
    { header: 'إهلاك الفترة (ر.س)', key: 'periodDep', width: 20 },
    { header: 'مجمع الإهلاك (ر.س)', key: 'accDep', width: 20 },
    { header: 'صافي القيمة الدفترية (NBV)', key: 'nbv', width: 24 }
  ];
  ws.columns = cols;

  // Header style
  const headerRow = ws.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0D9488' } // Teal brand color
    };
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF0F766E' } },
      bottom: { style: 'medium', color: { argb: 'FF115E59' } },
      left: { style: 'thin', color: { argb: 'FF0F766E' } },
      right: { style: 'thin', color: { argb: 'FF0F766E' } }
    };
  });

  // Rows
  assets.forEach((a, idx) => {
    const periodDep = Math.round(Number(a.annualDep || a.periodDep) || 0);
    const accDep = Math.round(Number(a.accumulatedDep) || 0);
    const nbv = Math.round(Number(a.netBookValue || (Number(a.cost || 0) - accDep)) || 0);

    const rowData = {
      id: a.id || a.code || `AST-${a.db_id || idx}`,
      name: a.name || '',
      category: a.category || 'أجهزة تقنية',
      custody: a.custody || a.employee_id || 'غير محدد',
      location: a.location || 'المركز الرئيسي',
      department: a.department || '',
      serialNumber: a.serialNumber || a.serial_number || '',
      manufacturer: a.manufacturer || '',
      model: a.model || '',
      supplier: a.supplier || '',
      invoiceNumber: a.invoiceNumber || a.invoice_number || '',
      date: a.date ? a.date.split('T')[0] : '',
      cost: Number(a.cost) || 0,
      salvage: Number(a.salvage) || 0,
      life: Number(a.life) || 5,
      method: METHOD_LABELS[a.method] || a.method || 'القسط الثابت',
      status: a.status || 'نشط',
      fundingSource: a.fundingSource || 'إيرادات ذاتية',
      lastInventory: a.lastInventory ? a.lastInventory.split('T')[0] : '',
      periodDep,
      accDep,
      nbv
    };

    const row = ws.addRow(rowData);
    row.height = 24;
    const isEven = idx % 2 === 0;

    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: colNum >= 13 ? 'center' : 'right' };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
      if (!isEven) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
      }
    });

    // Number formatting
    [13, 14, 15, 20, 21, 22].forEach(colIdx => {
      row.getCell(colIdx).numFmt = '#,##0.00';
    });
  });

  await saveWorkbook(wb, `سجل_الأصول_الثابتة_${fmtDate(new Date())}.xlsx`);
};

export const downloadAssetTemplate = async () => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'نظام تراؤف المحاسبي';

  const ws = wb.addWorksheet('نموذج تعبئة الأصول', {
    views: [{ rtl: true, showGridLines: true }]
  });

  ws.columns = ASSET_COLUMNS.map(c => ({ header: c.label, key: c.key, width: c.width }));

  // Header styling
  const headerRow = ws.getRow(1);
  headerRow.height = 32;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' } // Slate 800 dark professional
    };
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Sample pre-filled row for user guidance
  const sampleRow = ws.addRow({
    id: 'AST-SAMPLE-01',
    name: 'مثال: جهاز حاسب آلي لابتوب ديل',
    category: 'أجهزة تقنية',
    custody: 'فيصل المحاسب',
    location: 'الإدارة العامة - مكتب 104',
    department: 'تقنية المعلومات',
    serialNumber: 'SN-987654321',
    manufacturer: 'Dell',
    model: 'Latitude 5420',
    supplier: 'شركة الحلول التقنية',
    invoiceNumber: 'INV-2026-091',
    date: '2026-01-15',
    cost: 4500,
    salvage: 500,
    life: 4,
    method: 'القسط الثابت',
    status: 'نشط',
    fundingSource: 'إيرادات ذاتية',
    lastInventory: '2026-02-01'
  });
  sampleRow.height = 24;
  sampleRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
    cell.alignment = { vertical: 'middle', horizontal: 'right' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  });

  // Apply Real Excel Data Validations (Dropdown Lists) for rows 2 to 500
  const categoryFormula = `"${CATEGORIES.join(',')}"`;
  const methodFormula = '"القسط الثابت,القسط المتناقص"';
  const statusFormula = `"${STATUSES.join(',')}"`;
  const fundingFormula = '"إيرادات ذاتية,قرض بنكي,منحة حكومية"';

  for (let r = 2; r <= 300; r++) {
    // Column C: Category
    ws.getCell(`C${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [categoryFormula],
      showErrorMessage: true,
      errorTitle: 'فئة غير صالحة',
      error: 'يرجى اختيار فئة الأصل من القائمة المنسدلة المتاحة'
    };

    // Column P: Method
    ws.getCell(`P${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [methodFormula],
      showErrorMessage: true,
      errorTitle: 'طريقة إهلاك غير صحيحة',
      error: 'يرجى اختيار إما القسط الثابت أو القسط المتناقص'
    };

    // Column Q: Status
    ws.getCell(`Q${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [statusFormula]
    };

    // Column R: Funding Source
    ws.getCell(`R${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [fundingFormula]
    };
  }

  await saveWorkbook(wb, 'نموذج_إدخال_الأصول_مع_الخيارات.xlsx');
};

export const downloadTemplate = downloadAssetTemplate;


// ==========================================
// 2. WAREHOUSE REGISTER (سجل المستودعات)
// ==========================================

export const WAREHOUSE_COLUMNS = [
  { key: 'sku', label: 'رمز الصنف / الباركود (SKU) *', width: 22, required: true },
  { key: 'name', label: 'اسم الصنف *', width: 30, required: true },
  { key: 'category', label: 'الفئة التصنيفية *', width: 20, required: true },
  { key: 'qty', label: 'الكمية الحالية *', width: 16, type: 'number', required: true },
  { key: 'minQty', label: 'حد الطلب الأدنى', width: 16, type: 'number' },
  { key: 'bin', label: 'موقع الرف (Bin Location)', width: 22 },
  { key: 'unit', label: 'وحدة القياس', width: 16 },
  { key: 'cost', label: 'تكلفة الوحدة (ر.س)', width: 18, type: 'number' },
  { key: 'supplier', label: 'المورد الرئيسي', width: 22 },
  { key: 'stage', label: 'مرحلة RADAR *', width: 22 },
  { key: 'status', label: 'الحالة التشغيلية', width: 18 },
  { key: 'description', label: 'الملاحظات والوصف', width: 30 }
];

export const exportWarehouse = async (items) => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'نظام تراؤف - المستودعات';

  const ws = wb.addWorksheet('سجل المخزون والمستودعات', {
    views: [{ rtl: true, showGridLines: true }]
  });

  ws.columns = WAREHOUSE_COLUMNS.map(c => ({ header: c.label, key: c.key, width: c.width }));

  const headerRow = ws.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0284C7' } }; // Sky 600
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  items.forEach((item, idx) => {
    const row = ws.addRow({
      sku: item.sku || item.item_no || `SKU-${idx + 101}`,
      name: item.name || '',
      category: item.category || 'أصول ومخزون',
      qty: Number(item.qty || item.quantity) || 0,
      minQty: Number(item.minQty || item.min_quantity) || 0,
      bin: item.bin || item.bin_location || '',
      unit: item.unit || 'حبة',
      cost: Number(item.cost) || 0,
      supplier: item.supplier || '',
      stage: item.stage || 'Deploy',
      status: item.status || 'متاح',
      description: item.description || ''
    });

    row.height = 24;
    const isEven = idx % 2 === 0;
    row.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
      if (!isEven) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    });
  });

  await saveWorkbook(wb, `سجل_المستودعات_والمخزون_${fmtDate(new Date())}.xlsx`);
};

export const downloadWarehouseTemplate = async () => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('نموذج تعبئة المستودع', {
    views: [{ rtl: true, showGridLines: true }]
  });

  ws.columns = WAREHOUSE_COLUMNS.map(c => ({ header: c.label, key: c.key, width: c.width }));

  const headerRow = ws.getRow(1);
  headerRow.height = 32;
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Sample row
  const sampleRow = ws.addRow({
    sku: 'WH-SKU-1001',
    name: 'مثال: طابعة مكتبية ليزرية',
    category: 'أجهزة تقنية',
    qty: 15,
    minQty: 3,
    bin: 'رف A-02-04',
    unit: 'حبة',
    cost: 1200,
    supplier: 'شركة التوريدات التقنية',
    stage: 'نشر (Deploy)',
    status: 'متاح',
    description: 'صنف مستودعي جاهز للتسليم'
  });
  sampleRow.height = 24;
  sampleRow.eachCell(c => {
    c.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  });

  // Dropdown validations
  const stageFormula = `"${RADAR_STAGES.join(',')}"`;
  const statusFormula = `"${WAREHOUSE_STATUSES.join(',')}"`;
  const unitFormula = '"حبة,كرتون,طقم,متر,كجم,باقة"';

  for (let r = 2; r <= 300; r++) {
    // Column G: Unit
    ws.getCell(`G${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [unitFormula]
    };
    // Column J: RADAR stage
    ws.getCell(`J${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [stageFormula]
    };
    // Column K: Status
    ws.getCell(`K${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [statusFormula]
    };
  }

  await saveWorkbook(wb, 'نموذج_إدخال_المستودعات_مع_الخيارات.xlsx');
};

// ==========================================
// 3. CUSTODY REGISTER (سجل العهد والموظفين)
// ==========================================

export const CUSTODY_COLUMNS = [
  { key: 'barcode', label: 'رقم الأصل / الباركود *', width: 22, required: true },
  { key: 'name', label: 'اسم الأصل المسلم *', width: 30, required: true },
  { key: 'category', label: 'الفئة', width: 18 },
  { key: 'custody', label: 'اسم الموظف المستلم (صاحب العهدة) *', width: 26, required: true },
  { key: 'employee_id', label: 'الرقم الوظيفي', width: 18 },
  { key: 'location', label: 'مكان العهدة / المكتب / الغرفة *', width: 26, required: true },
  { key: 'department', label: 'الإدارة المستفيدة', width: 22 },
  { key: 'serialNumber', label: 'الرقم التسلسلي (S/N)', width: 20 },
  { key: 'date', label: 'تاريخ التسليم / الشراء', width: 20 },
  { key: 'cost', label: 'قيمة العهدة (ر.س)', width: 18, type: 'number' },
  { key: 'status', label: 'حالة الأصل بالعهدة', width: 16 }
];

export const exportCustody = async (assets) => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'نظام تراؤف - إدارة العهد';

  const ws = wb.addWorksheet('سجل العهد والموظفين', {
    views: [{ rtl: true, showGridLines: true }]
  });

  ws.columns = CUSTODY_COLUMNS.map(c => ({ header: c.label, key: c.key, width: c.width }));

  const headerRow = ws.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B5CF6' } }; // Purple 600
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  assets.forEach((a, idx) => {
    const row = ws.addRow({
      barcode: a.id || a.code || `AST-${idx + 1}`,
      name: a.name || '',
      category: a.category || 'أجهزة تقنية',
      custody: a.custody || a.employee_id || 'غير مخصص',
      employee_id: a.employee_id || '',
      location: a.location || 'المركز الرئيسي',
      department: a.department || 'الإدارة العامة',
      serialNumber: a.serialNumber || a.serial_number || '',
      date: a.date ? a.date.split('T')[0] : '',
      cost: Number(a.cost) || 0,
      status: a.status || 'نشط'
    });

    row.height = 24;
    const isEven = idx % 2 === 0;
    row.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
      if (!isEven) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    });
    row.getCell(10).numFmt = '#,##0.00';
  });

  await saveWorkbook(wb, `سجل_العهد_والموظفين_${fmtDate(new Date())}.xlsx`);
};

export const downloadCustodyTemplate = async () => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('نموذج تعبئة العهد', {
    views: [{ rtl: true, showGridLines: true }]
  });

  ws.columns = CUSTODY_COLUMNS.map(c => ({ header: c.label, key: c.key, width: c.width }));

  const headerRow = ws.getRow(1);
  headerRow.height = 32;
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF312E81' } };
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  const sampleRow = ws.addRow({
    barcode: 'AST-CUST-901',
    name: 'مثال: سيارة نقل تويوتا هايلكس',
    category: 'مركبات',
    custody: 'محمد السالم',
    employee_id: 'EMP-102',
    location: 'فرع المنطقة الغربية - مبنى أ',
    department: 'المبيعات والتسويق',
    serialNumber: 'VIN-928374921',
    date: '2026-02-10',
    cost: 85000,
    status: 'نشط'
  });
  sampleRow.height = 24;
  sampleRow.eachCell(c => {
    c.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  });

  await saveWorkbook(wb, 'نموذج_إدخال_العهد_مع_الخيارات.xlsx');
};

// ==========================================
// 4. SMART IMPORT PARSER (معالج الاستيراد الذكي)
// ==========================================

const normalizeHeader = (h) => {
  if (!h) return '';
  return String(h)
    .replace(/[\*\(].*?[\)\*]/g, '') // remove (*), (ر.س), etc.
    .replace(/[^a-zA-Z0-9\u0621-\u064A]/g, '') // strip special chars
    .trim()
    .toLowerCase();
};

export const parseAssetsFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });

        if (!jsonRows || jsonRows.length === 0) {
          resolve({ total: 0, validCount: 0, errorCount: 0, rows: [], errors: [] });
          return;
        }

        const validRows = [];
        const errors = [];

        jsonRows.forEach((row, idx) => {
          const lineNum = idx + 2; // header is line 1

          // Map by normalized keys
          const normalizedRow = {};
          Object.keys(row).forEach(k => {
            normalizedRow[normalizeHeader(k)] = row[k];
          });

          const getVal = (...aliases) => {
            for (const a of aliases) {
              const normA = normalizeHeader(a);
              if (normalizedRow[normA] !== undefined && normalizedRow[normA] !== '') {
                return String(normalizedRow[normA]).trim();
              }
            }
            return '';
          };

          const name = getVal('اسم الأصل', 'اسم وصف الأصل', 'اسم', 'الأصل', 'name');
          const costStr = getVal('تكلفة الأصل', 'التكلفة', 'cost', 'سعر الشراء');
          const cost = parseFloat(costStr.replace(/,/g, '')) || 0;
          const lifeStr = getVal('العمر الإنتاجي', 'العمر', 'life', 'السنوات');
          const life = parseInt(lifeStr || '5', 10) || 5;

          // If sample line, ignore
          if (name.includes('مثال:') || getVal('رقم الأصل').includes('SAMPLE')) {
            return;
          }

          const lineIssues = [];
          if (!name) lineIssues.push('اسم الأصل مطلوب');
          if (cost <= 0) lineIssues.push('التكلفة يجب أن تكون أكبر من صفر');

          // Auto-generate barcode / asset ID if empty
          let assetId = getVal('رقم الأصل', 'الباركود', 'رقم الأصل  الباركود', 'id', 'رمز الأصل');
          if (!assetId) {
            assetId = `AST-${Date.now().toString().slice(-6)}${idx}`;
          }

          const parsedItem = {
            id: assetId,
            name: name,
            category: getVal('فئة الأصل', 'الفئة', 'category') || 'أجهزة تقنية',
            custody: getVal('اسم الموظف صاحب العهدة', 'صاحب العهدة', 'الموظف', 'العهدة', 'custody') || 'غير محدد',
            location: getVal('مكان العهدة  الموقع', 'مكان العهدة', 'الموقع', 'location') || 'المركز الرئيسي',
            department: getVal('الإدارة المستفيدة', 'الإدارة', 'القسم', 'department') || 'الإدارة العامة',
            serialNumber: getVal('الرقم التسلسلي', 'serial', 'sn') || '',
            manufacturer: getVal('الشركة المصنعة', 'manufacturer') || '',
            model: getVal('الموديل', 'model') || '',
            supplier: getVal('المورد', 'supplier') || '',
            invoiceNumber: getVal('رقم الفاتورة', 'invoice') || '',
            date: getVal('تاريخ الشراء', 'تاريخ', 'date') || new Date().toISOString().split('T')[0],
            cost: cost,
            salvage: parseFloat(getVal('القيمة التخريدية', 'الخردة', 'salvage').replace(/,/g, '')) || 0,
            life: life,
            method: getVal('طريقة الإهلاك', 'method').includes('متناقص') ? 'DB' : 'SL',
            status: getVal('حالة الأصل', 'الحالة', 'status') || 'نشط',
            fundingSource: getVal('مصدر التمويل', 'التمويل') || 'إيرادات ذاتية'
          };

          if (lineIssues.length > 0) {
            errors.push({ line: lineNum, issues: lineIssues.join('، ') });
          } else {
            validRows.push({ line: lineNum, data: parsedItem });
          }
        });

        resolve({
          total: jsonRows.length,
          validCount: validRows.length,
          errorCount: errors.length,
          rows: validRows,
          errors: errors
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

// Warehouse file parser
export const parseWarehouseFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });

        const validRows = [];
        const errors = [];

        jsonRows.forEach((row, idx) => {
          const lineNum = idx + 2;
          const normalized = {};
          Object.keys(row).forEach(k => { normalized[normalizeHeader(k)] = row[k]; });

          const getVal = (...keys) => {
            for (const k of keys) {
              const nk = normalizeHeader(k);
              if (normalized[nk] !== undefined && normalized[nk] !== '') return String(normalized[nk]).trim();
            }
            return '';
          };

          const name = getVal('اسم الصنف', 'الصنف', 'name');
          if (name.includes('مثال:')) return;

          let sku = getVal('رمز الصنف', 'الباركود', 'sku', 'رمز الصنف  الباركود');
          if (!sku) sku = `WH-SKU-${Date.now().toString().slice(-5)}${idx}`;

          const qty = parseInt(getVal('الكمية الحالية', 'الكمية', 'qty') || '0', 10) || 0;
          const minQty = parseInt(getVal('حد الطلب الأدنى', 'الحد الأدنى', 'minqty') || '0', 10) || 0;
          const cost = parseFloat(getVal('تكلفة الوحدة', 'السعر', 'cost') || '0') || 0;

          if (!name) {
            errors.push({ line: lineNum, issues: 'اسم الصنف مطلوب' });
          } else {
            validRows.push({
              line: lineNum,
              data: {
                sku,
                name,
                category: getVal('الفئة التصنيفية', 'الفئة', 'category') || 'أصول تقنية',
                quantity: qty,
                min_quantity: minQty,
                bin_location: getVal('موقع الرف', 'الرف', 'bin') || 'A-01-01',
                unit: getVal('وحدة القياس', 'الوحدة') || 'حبة',
                cost: cost,
                supplier: getVal('المورد الرئيسي', 'المورد') || '',
                stage: getVal('مرحلة radar', 'مرحلة', 'stage').includes('استلام') ? 'Receive' : 'Deploy',
                status: getVal('الحالة التشغيلية', 'الحالة') || 'متاح',
                description: getVal('الملاحظات والوصف', 'الوصف') || ''
              }
            });
          }
        });

        resolve({ total: jsonRows.length, validCount: validRows.length, errorCount: errors.length, rows: validRows, errors });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Custody file parser
export const parseCustodyFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });

        const validRows = [];
        const errors = [];

        jsonRows.forEach((row, idx) => {
          const lineNum = idx + 2;
          const normalized = {};
          Object.keys(row).forEach(k => { normalized[normalizeHeader(k)] = row[k]; });

          const getVal = (...keys) => {
            for (const k of keys) {
              const nk = normalizeHeader(k);
              if (normalized[nk] !== undefined && normalized[nk] !== '') return String(normalized[nk]).trim();
            }
            return '';
          };

          const name = getVal('اسم الأصل', 'اسم وصف الأصل', 'name', 'الأصل');
          if (name.includes('مثال:')) return;

          const custody = getVal('اسم الموظف صاحب العهدة', 'الموظف', 'صاحب العهدة', 'custody');
          let barcode = getVal('رقم الأصل  الباركود', 'رقم الأصل', 'الباركود', 'barcode', 'id');
          if (!barcode) barcode = `CUST-${Date.now().toString().slice(-6)}${idx}`;

          if (!custody && !name) {
            errors.push({ line: lineNum, issues: 'اسم الأصل واسم الموظف مطلوبان' });
          } else {
            validRows.push({
              line: lineNum,
              data: {
                id: barcode,
                name: name || 'أصل عهدة',
                custody: custody || 'غير محدد',
                employee_id: getVal('الرقم الوظيفي', 'رقم الموظف', 'employeeid') || '',
                location: getVal('مكان العهدة  الموقع', 'مكان العهدة', 'الموقع', 'location') || 'المركز الرئيسي',
                department: getVal('الإدارة المستفيدة', 'الإدارة', 'department') || 'الإدارة العامة',
                category: getVal('فئة الأصل', 'الفئة', 'category') || 'أجهزة تقنية',
                serialNumber: getVal('الرقم التسلسلي', 'serial') || '',
                date: getVal('تاريخ استلام العهدة', 'تاريخ الاستلام', 'تاريخ') || new Date().toISOString().split('T')[0],
                cost: parseFloat(getVal('القيمة التقديرية', 'التكلفة', 'cost') || '0') || 0,
                status: getVal('حالة العهدة', 'الحالة') || 'نشط'
              }
            });
          }
        });

        resolve({ total: jsonRows.length, validCount: validRows.length, errorCount: errors.length, rows: validRows, errors });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

