import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  Box, 
  FileText, 
  Shuffle, 
  PieChart, 
  ClipboardList, 
  Settings, 
  BarChart3, 
  Database,
  TrendingUp,
  Activity,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Filter,
  FilePlus,
  Edit,
  Trash2,
  Download,
  QrCode,
  Target,
  Shield,
  Laptop,
  Search,
  Bell,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DEPRECIATION_METHODS = {
  SL: 'القسط الثابت',
  DB: 'القسط المتناقص المضاعف',
  SYD: 'مجموع أرقام السنوات'
};

const App = () => {
  const [view, setView] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterParams, setFilterParams] = useState({ query: '', category: 'الكل' });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [assets, setAssets] = useState([
    { id: 'ORG-AST-001', code: 'IT-001', name: 'خوادم البيانات المركزية', category: 'أصول تقنية', cost: 120000, vat: 18000, salvage: 10000, life: 5, date: '2023-01-01', method: 'SL', status: 'يعمل', custody: 'أحمد سالم', source: 'بنك الراجحي' },
    { id: 'ORG-AST-002', code: 'VH-021', name: 'أسطول سيارات التوزيع', category: 'مركبات', cost: 450000, vat: 67500, salvage: 50000, life: 7, date: '2022-06-15', method: 'DB', status: 'يعمل', custody: 'محمد العبدالله', source: 'البلاد' },
    { id: 'ORG-AST-003', code: 'LD-001', name: 'أرض المقر الرئيسي', category: 'أراضي', cost: 1500000, vat: 0, salvage: 1500000, life: 99, date: '2015-01-01', method: 'SL', status: 'يعمل', custody: '-', source: 'تبرعات عينية' },
    { id: 'ORG-AST-004', code: 'WAQ-001', name: 'مبنى الوقف السكني', category: 'أصول أوقاف', cost: 3000000, vat: 0, salvage: 500000, life: 40, date: '2018-05-10', method: 'SL', status: 'يعمل', custody: 'إدارة الأوقاف', source: 'تبرعات عينية' },
    { id: 'ORG-AST-005', code: 'OF-015', name: 'طابعة مكتبية صغيرة', category: 'أثاث', cost: 1500, vat: 225, salvage: 0, life: 3, date: '2024-01-10', method: 'SL', status: 'يعمل', custody: 'سعد فهد', source: 'موردين', isExpense: true },
  ]);

  const [journals, setJournals] = useState([
    { id: 'JV-2024-001', date: '2024-03-01', desc: 'إثبات إهلاك شهر مارس', debit: 15200, credit: null, status: 'مرحل' },
    { id: 'JV-2024-001', date: '2024-03-01', desc: 'مجمع إهلاك الأصول', debit: null, credit: 15200, status: 'مرحل' },
    { id: 'JV-2024-002', date: '2024-04-01', desc: 'إثبات إهلاك شهر أبريل', debit: 15200, credit: null, status: 'مسودة' },
    { id: 'JV-2024-002', date: '2024-04-01', desc: 'مجمع إهلاك الأصول', debit: null, credit: 15200, status: 'مسودة' },
  ]);

  const [transfers, setTransfers] = useState([
    { id: 'TR-092', asset: 'تجهيزات المكتب الرئيسي', from: 'الإدارة', to: 'الموارد البشرية', date: '2024-01-15', status: 'مكتمل' },
    { id: 'TR-093', asset: 'آلة تغليف صناعية', from: 'المستودع', to: 'الإنتاج', date: '2024-02-20', status: 'قيد المراجعة' },
  ]);

  const accountingEngine = useMemo(() => {
    const now = new Date();
    return assets.map(asset => {
      const startDate = new Date(asset.date);
      const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
      const yearsElapsed = Math.max(0, monthsElapsed / 12);
      
      if (asset.isExpense) {
        return {
          ...asset,
          accumulatedDep: asset.cost,
          netBookValue: 0,
        };
      }

      if (asset.category === 'أراضي') {
        return {
          ...asset,
          accumulatedDep: 0,
          netBookValue: asset.cost,
        };
      }

      let accumulatedDep = 0;
      if (asset.method === 'SL') {
        const annualDep = (asset.cost - asset.salvage) / asset.life;
        accumulatedDep = Math.min(asset.cost - asset.salvage, annualDep * yearsElapsed);
      } else if (asset.method === 'DB') {
        const rate = (2 / asset.life);
        let bookValue = asset.cost;
        for(let i=0; i < Math.floor(yearsElapsed); i++) {
          bookValue -= bookValue * rate;
        }
        accumulatedDep = asset.cost - Math.max(asset.salvage, bookValue);
      } else if (asset.method === 'SYD') {
        const sum = (asset.life * (asset.life + 1)) / 2;
        let dep = 0;
        for(let i=0; i < Math.floor(yearsElapsed); i++) {
          dep += (asset.cost - asset.salvage) * ((asset.life - i) / sum);
        }
        accumulatedDep = Math.min(asset.cost - asset.salvage, dep);
      }

      return {
        ...asset,
        accumulatedDep,
        netBookValue: asset.cost - accumulatedDep,
      };
    });
  }, [assets]);

  const totals = useMemo(() => {
    return accountingEngine.reduce((acc, curr) => ({
      cost: acc.cost + curr.cost,
      dep: acc.dep + curr.accumulatedDep,
      nbv: acc.nbv + curr.netBookValue
    }), { cost: 0, dep: 0, nbv: 0 });
  }, [accountingEngine]);

  const chartData = {
    labels: accountingEngine.map(a => a.name.length > 15 ? a.name.substring(0, 15) + '...' : a.name),
    datasets: [
      { label: 'التكلفة التاريخية', data: accountingEngine.map(a => a.cost), backgroundColor: '#0f172a' },
      { label: 'الإهلاك المتراكم', data: accountingEngine.map(a => a.accumulatedDep), backgroundColor: '#0d9488' }
    ]
  };

  const renderDashboard = () => (
    <div className="view-anim">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'1.5rem'}}>
        <div>
          <h2 style={{fontSize:'1.5rem', marginBottom:'0.5rem'}}>القيادة والتميز المؤسسي (Strategic View)</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>مؤشرات الأداء الرئيسية، العائد على الأصول، ونسب الاستغلال.</p>
        </div>
        <div style={{display:'flex', gap:'1rem'}}>
          <div style={{background:'rgba(16, 185, 129, 0.1)', color:'#10b981', padding:'0.5rem 1rem', borderRadius:'8px', fontWeight:600, display:'flex', alignItems:'center', gap:'0.5rem'}}>
            <Shield size={18} /> مؤشر الحوكمة: 98%
          </div>
          <div style={{background:'rgba(59, 130, 246, 0.1)', color:'#3b82f6', padding:'0.5rem 1rem', borderRadius:'8px', fontWeight:600, display:'flex', alignItems:'center', gap:'0.5rem'}}>
            <Target size={18} /> معدل استغلال الأصول: 85%
          </div>
        </div>
      </div>
      <div className="summary-grid">
        <div className="card">
          <div className="stat-icon" style={{background: '#f1f5f9'}}><Database size={20} color="#64748b" /></div>
          <div className="val-sub">إجمالي المحفظة الرأسمالية</div>
          <div className="val-big">{totals.cost.toLocaleString()} ر.س</div>
          <div className="val-sub" style={{color: 'var(--success)'}}><TrendingUp size={14} /> +4.2% نمو الأصول</div>
        </div>
        <div className="card">
          <div className="stat-icon" style={{background: '#fef2f2'}}><Activity size={20} color="#ef4444" /></div>
          <div className="val-sub">الإهلاك المتراكم</div>
          <div className="val-big">{totals.dep.toLocaleString()} ر.س</div>
          <div className="val-sub">معدل تآكل الأصول: {((totals.dep/totals.cost)*100).toFixed(1)}%</div>
        </div>
        <div className="card">
          <div className="stat-icon" style={{background: '#f0fdf4'}}><ShieldCheck size={20} color="#10b981" /></div>
          <div className="val-sub">صافي القيمة الدفترية (NBV)</div>
          <div className="val-big">{totals.nbv.toLocaleString()} ر.س</div>
          <div className="val-sub">القيمة الحقيقية في الدفاتر</div>
        </div>
        <div className="card">
          <div className="stat-icon" style={{background: '#f0f9ff'}}><Laptop size={20} color="#0ea5e9" /></div>
          <div className="val-sub">أصول تقنية تقترب من النهاية</div>
          <div className="val-big" style={{color:'#0ea5e9'}}>3 أصول</div>
          <div className="val-sub">تحتاج إحلال هذا العام (IT lifecycle)</div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem'}}>
        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
            <h3 style={{fontSize:'1.1rem'}}>توزيع الأصول ووضع الإهلاك الاستراتيجي</h3>
            <button className="btn btn-ghost" style={{fontSize:'0.75rem'}}>عرض التفاصيل</button>
          </div>
          <div className="chart-container">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="card">
          <h3 style={{marginBottom:'1.5rem', fontSize:'1.1rem'}}>تنبيهات التدقيق والعمليات (Audit)</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div style={{display:'flex', gap:'1rem', padding:'1rem', background:'#fff7ed', borderRadius:'8px', borderRight:'4px solid #f59e0b'}}>
              <AlertTriangle color="#f59e0b" size={20} />
              <div>
                <div style={{fontSize:'0.85rem', fontWeight:600}}>تنبيه مالي وتشغيلي</div>
                <div style={{fontSize:'0.75rem', color:'#9a3412'}}>خوادم البيانات استهلكت 90%، يوصى بالترقية لتفادي أعطال التقنية.</div>
              </div>
            </div>
            <div style={{display:'flex', gap:'1rem', padding:'1rem', background:'#f0fdfa', borderRadius:'8px', borderRight:'4px solid #0d9488'}}>
              <CheckCircle color="#0d9488" size={20} />
              <div>
                <div style={{fontSize:'0.85rem', fontWeight:600}}>مطابقة الجرد الميداني</div>
                <div style={{fontSize:'0.75rem', color:'#134e4a'}}>تم تأكيد 98% من العهد الميدانية، ولا توجد انحرافات جوهرية.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const exportCSV = () => {
    showToast('جاري تحضير وتشفير البيانات...');
    setTimeout(() => {
      let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
      csvContent += "الرمز,الاسم,الفئة,المصدر,التكلفة,الإهلاك,الصافي,العهدة,الحالة\n";
      assets.forEach(a => {
        csvContent += `${a.code},${a.name},${a.category},${a.source},${a.cost},${a.dep},${a.nbv},${a.custody},${a.status}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "assets_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('✅ تم تصدير ملف Excel بنجاح!');
    }, 800);
  };

  const renderRegister = () => {
    const filteredAssets = accountingEngine.filter(a => {
      const matchQuery = a.name.includes(filterParams.query) || a.code.includes(filterParams.query);
      const matchCat = filterParams.category === 'الكل' || a.category === filterParams.category;
      return matchQuery && matchCat;
    });

    return (
      <div className="view-anim">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
          <h2 style={{fontSize:'1.25rem'}}>سجل الأصول الثابتة (FAR)</h2>
          <div style={{display:'flex', gap:'0.5rem'}}>
            <button className="btn btn-ghost" style={{color:'var(--accent)', background: 'rgba(59,130,246,0.1)'}} onClick={() => setShowScanner(true)}>
              <QrCode size={18} /> مسح ميداني ذكي
            </button>
            <div style={{width:'1px', background:'var(--border)', margin:'0 0.5rem'}}></div>
            <button className={`btn btn-ghost ${showFilter ? 'b-active' : ''}`} onClick={() => setShowFilter(!showFilter)}><Filter size={18} /> تصفية متقدمة</button>
            <button className="btn btn-ghost" onClick={exportCSV}><Download size={18} /> تصدير Excel</button>
            <button className="btn btn-ghost" onClick={() => { showToast('🖨️ جاري تجهيز التقرير للطباعة...'); setTimeout(() => window.print(), 800); }}><Download size={18} /> تصدير PDF</button>
            <button className="btn btn-primary" onClick={() => setView('new-asset')}><FilePlus size={18} /> تسجيل أصل جديد</button>
          </div>
        </div>

        {showFilter && (
          <div style={{display:'flex', gap:'1rem', marginBottom:'1.5rem', padding:'1rem', background:'var(--card-bg)', borderRadius:'12px', border:'1px solid var(--border)', animation:'fadeIn 0.2s'}}>
            <input type="text" placeholder="ابحث بالاسم أو الرمز..." value={filterParams.query} onChange={e => setFilterParams({...filterParams, query: e.target.value})} style={{flex:1, padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
            <select value={filterParams.category} onChange={e => setFilterParams({...filterParams, category: e.target.value})} style={{padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}}>
              <option value="الكل">جميع الفئات</option>
              <option value="أراضي">أراضي</option>
              <option value="مباني">مباني</option>
              <option value="أصول تقنية">أصول تقنية</option>
              <option value="مركبات">مركبات</option>
              <option value="أصول أوقاف">أصول أوقاف</option>
            </select>
          </div>
        )}

        <div className="table-wrapper">
          <table>
          <thead>
            <tr>
              <th>الرمز الموحد</th>
              <th>بيانات الأصل</th>
              <th>العهدة/المصدر</th>
              <th>التكلفة (مع الضريبة)</th>
              <th>الإهلاك المتراكم</th>
              <th>صافي القيمة</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map(asset => (
              <tr key={asset.id}>
                <td style={{color:'var(--accent)', fontWeight:600}}>{asset.code}</td>
                <td>
                  <div style={{fontWeight:600}}>{asset.name}</div>
                  <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>{asset.category} | {DEPRECIATION_METHODS[asset.method]}</div>
                </td>
                <td>
                  <div style={{fontWeight:600}}>{asset.custody}</div>
                  <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>{asset.source}</div>
                </td>
                <td>{(asset.cost + (asset.vat || 0)).toLocaleString()} ر.س</td>
                <td style={{color:'var(--danger)'}}>{asset.category === 'أراضي' ? '-' : `-${asset.accumulatedDep.toLocaleString()}`}</td>
                <td style={{fontWeight:700}}>{asset.netBookValue.toLocaleString()} ر.س</td>
                <td>
                  {asset.isExpense ? 
                    <span className="badge" style={{background:'#fef2f2', color:'#ef4444'}}>مصروف</span> :
                    <span className={`badge ${asset.status === 'يعمل' ? 'b-active' : ''}`} style={asset.status === 'بالمستودع' ? {background:'#fef3c7', color:'#92400e'} : asset.status === 'تالف' ? {background:'#fee2e2', color:'#b91c1c'} : {}}>{asset.status}</span>
                  }
                </td>
                <td>
                  <div style={{display:'flex', gap:'0.5rem'}}>
                    <button className="btn btn-ghost" style={{padding:'0.25rem'}} title="تعديل"><Edit size={16} /></button>
                    <button className="btn btn-ghost" style={{padding:'0.25rem', color:'var(--danger)'}} title="استبعاد/بيع"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAssets.length === 0 && <div style={{padding:'3rem', textAlign:'center', color:'var(--text-muted)'}}>لا توجد أصول مطابقة لمعايير البحث الحالية.</div>}
      </div>
    </div>
    );
  };

  const handleAddAsset = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const cost = parseFloat(fd.get('cost') || 0);
    const life = parseFloat(fd.get('life') || 0);
    
    if (cost < 3000 || life < 1) {
      alert("تنبيه: سيتم تسجيل هذا البند كمصروف دوري فوراً وفقاً لسياسة الحد الأدنى لرسملة الأصول (أقل من 3000 ريال أو عمر أقل من سنة).");
    } else {
      alert("تم اعتماد الأصل بنجاح وتوليد رمز تتبع موحد له (Barcode/Serial).");
    }
    setView('register');
  };

  const renderNewAsset = () => (
    <div className="view-anim">
      <div style={{marginBottom:'2rem'}}>
        <h2 style={{fontSize:'1.25rem'}}>تسجيل أصل جديد</h2>
        <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>أدخل بيانات الأصل الثابت الجديد لإضافته إلى السجل</p>
      </div>
      <div className="card" style={{maxWidth: '800px', background: 'var(--card-bg)'}}>
        <form onSubmit={handleAddAsset} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>اسم الأصل</label>
            <input name="name" type="text" placeholder="مثال: سيارة نقل تويوتا" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>الفئة التصنيفية</label>
            <select name="category" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}}>
              <option value="أراضي">أراضي</option>
              <option value="مباني">مباني</option>
              <option value="مركبات">سيارات ومركبات</option>
              <option value="أصول تقنية">أجهزة تقنية</option>
              <option value="أثاث">أثاث ومعدات</option>
              <option value="أصول أوقاف">أصول أوقاف</option>
            </select>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>مصدر الأصل / وسيلة الدفع</label>
            <select name="source" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}}>
              <option value="بنك الراجحي">بنك الراجحي</option>
              <option value="بنك البلاد">بنك البلاد</option>
              <option value="موردين">موردين (آجل)</option>
              <option value="تبرعات عينية">تبرعات عينية</option>
            </select>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>الحالة التشغيلية</label>
            <select name="status" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}}>
              <option value="يعمل">يعمل</option>
              <option value="بالمستودع">بالمستودع</option>
              <option value="تالف">تالف</option>
            </select>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>تحديد العهدة (اسم الموظف)</label>
            <input name="custody" type="text" placeholder="مثال: أحمد سالم" style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>التكلفة الأساسية (ر.س)</label>
            <input name="cost" type="number" placeholder="0.00" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>الضريبة المضافة (VAT)</label>
            <input name="vat" type="number" placeholder="0.00" defaultValue="0" style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>العمر الإنتاجي (سنوات)</label>
            <input name="life" type="number" placeholder="مثال: 5 (اتركه فارغاً للأراضي)" style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', gap: '1rem', gridColumn: '1 / -1', marginTop: '1rem'}}>
            <button type="submit" className="btn btn-primary" style={{padding: '0.75rem 2rem'}}>حفظ الأصل</button>
            <button type="button" className="btn btn-ghost" onClick={() => setView('register')} style={{padding: '0.75rem 2rem'}}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderJournal = () => (
    <div className="view-anim">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <h2 style={{fontSize:'1.25rem'}}>قيود اليومية التلقائية</h2>
        <button className="btn btn-primary" onClick={() => setJournals(journals.map(j => ({...j, status: 'مرحل'})))}><FileText size={18} /> ترحيل القيود</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>رقم القيد</th><th>التاريخ</th><th>البيان</th><th>مدين</th><th>دائن</th><th>الحالة</th></tr></thead>
          <tbody>
            {journals.map((j, idx) => (
              <tr key={idx}>
                <td style={{fontWeight:600}}>{j.id}</td>
                <td>{j.date}</td>
                <td>{j.desc}</td>
                <td style={{color:'var(--danger)', fontWeight:600}}>{j.debit ? j.debit.toLocaleString() : '-'}</td>
                <td style={{color:'var(--success)', fontWeight:600}}>{j.credit ? j.credit.toLocaleString() : '-'}</td>
                <td>
                  {j.status === 'مرحل' ? 
                    <span className="badge b-active">مرحل</span> : 
                    <span className="badge" style={{background:'#fef3c7', color:'#92400e'}}>مسودة</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTransfers = () => (
    <div className="view-anim">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <h2 style={{fontSize:'1.25rem'}}>التحويلات العينية للأصول</h2>
        <button className="btn btn-primary" onClick={() => setView('new-transfer')}><Shuffle size={18} /> طلب تحويل جديد</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>رقم الطلب</th><th>الأصل</th><th>من قسم</th><th>إلى قسم</th><th>التاريخ</th><th>الحالة</th></tr></thead>
          <tbody>
            {transfers.map(t => (
              <tr key={t.id}>
                <td style={{fontWeight:600}}>{t.id}</td>
                <td>{t.asset}</td>
                <td>{t.from}</td>
                <td>{t.to}</td>
                <td>{t.date}</td>
                <td>
                  {t.status === 'مكتمل' ? 
                    <span className="badge b-active">مكتمل</span> : 
                    <span className="badge" style={{background:'#fef3c7', color:'#92400e'}}>قيد المراجعة</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNewTransfer = () => (
    <div className="view-anim">
      <div style={{marginBottom:'2rem'}}>
        <h2 style={{fontSize:'1.25rem'}}>طلب تحويل أصل جديد</h2>
        <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>قم بتحديد الأصل المراد نقله والقسم الوجهة</p>
      </div>
      <div className="card" style={{maxWidth: '800px', background: 'var(--card-bg)'}}>
        <form onSubmit={(e) => { e.preventDefault(); setView('transfers'); }} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>الأصل المراد تحويله</label>
            <select required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}}>
              <option value="">-- اختر أصلاً --</option>
              {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
            </select>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>إلى قسم</label>
            <select required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}}>
              <option value="الإنتاج">الإنتاج</option>
              <option value="الموارد البشرية">الموارد البشرية</option>
              <option value="المبيعات">المبيعات</option>
              <option value="الإدارة">الإدارة</option>
            </select>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>السبب التبريري</label>
            <input type="text" placeholder="مثال: حاجة العمل لمعدات إضافية" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', gap: '1rem', gridColumn: '1 / -1', marginTop: '1rem'}}>
            <button type="submit" className="btn btn-primary" style={{padding: '0.75rem 2rem'}}>إرسال الطلب للموافقة</button>
            <button type="button" className="btn btn-ghost" onClick={() => setView('transfers')} style={{padding: '0.75rem 2rem'}}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderBudget = () => (
    <div className="view-anim">
      <div style={{marginBottom:'2rem'}}>
        <h2 style={{fontSize:'1.25rem'}}>الميزانية التقديرية الرأسمالية (CAPEX)</h2>
      </div>
      <div className="summary-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
        <div className="card">
          <div className="val-sub">الميزانية المعتمدة لعام 2024</div>
          <div className="val-big" style={{color:'var(--success)'}}>1,500,000 ر.س</div>
        </div>
        <div className="card">
          <div className="val-sub">المنصرف الفعلي حتى الآن</div>
          <div className="val-big" style={{color:'var(--danger)'}}>680,000 ر.س</div>
        </div>
        <div className="card">
          <div className="val-sub">المتبقي من الميزانية</div>
          <div className="val-big" style={{color:'var(--accent)'}}>820,000 ر.س</div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="view-anim">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <div>
          <h2 style={{fontSize:'1.25rem'}}>تقارير الجرد الميداني والفروقات</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>إدارة لجان الجرد، تسويات العهد، والمطابقة الفردية</p>
        </div>
        <button className="btn btn-primary" onClick={() => setView('new-inventory')}><CheckCircle size={18} /> بدء جرد جديد</button>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom:'1.5rem'}}>
        <div className="card" style={{borderRight:'4px solid var(--danger)'}}>
          <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>أصول مفقودة (لم تُجرد)</div>
          <div style={{fontSize:'1.5rem', fontWeight:700, color:'var(--danger)'}}>2 أصل</div>
          <div style={{fontSize:'0.75rem', marginTop:'0.5rem'}}>القيمة الدفترية: 4,500 ر.س - <a href="#" style={{color:'var(--danger)'}}>عرض التسوية</a></div>
        </div>
        <div className="card" style={{borderRight:'4px solid var(--success)'}}>
          <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>أصول زائدة (غير مسجلة)</div>
          <div style={{fontSize:'1.5rem', fontWeight:700, color:'var(--success)'}}>1 أصل</div>
          <div style={{fontSize:'0.75rem', marginTop:'0.5rem'}}>لابتوب ديل إضافي - <a href="#" style={{color:'var(--success)'}}>تسجيل كأصل جديد</a></div>
        </div>
      </div>

      <div style={{display: 'grid', gap: '1rem'}}>
        <div className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.5rem'}}>
          <div><div style={{fontWeight:600, fontSize:'1.1rem'}}>جرد الربع الأول 2024</div><div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>تاريخ الإغلاق: 31-03-2024 - شامل جميع الفروع</div></div>
          <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
            <div style={{textAlign:'left'}}>
              <div style={{fontSize:'0.85rem', fontWeight:600}}>تم جرد 1,450 / 1,452</div>
              <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>نسبة التطابق 99.8%</div>
            </div>
            <span className="badge b-active" style={{fontSize:'0.9rem'}}>مكتمل ومغلق</span>
          </div>
        </div>
        <div className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.5rem'}}>
          <div><div style={{fontWeight:600, fontSize:'1.1rem'}}>جرد مستودع التقنية</div><div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>لجنة الجرد: م. فهد، أ. محمد</div></div>
          <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
            <div style={{textAlign:'left'}}>
              <div style={{fontSize:'0.85rem', fontWeight:600}}>تم جرد 45 / 100</div>
            </div>
            <span className="badge" style={{background:'#fef3c7', color:'#92400e', fontSize:'0.9rem'}}>قيد التنفيذ 45%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNewInventory = () => (
    <div className="view-anim">
      <div style={{marginBottom:'2rem'}}>
        <h2 style={{fontSize:'1.25rem'}}>بدء جرد ميداني جديد</h2>
        <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>قم بتحديد نطاق الجرد وتعيين لجان الجرد للبدء</p>
      </div>
      <div className="card" style={{maxWidth: '800px', background: 'var(--card-bg)'}}>
        <form onSubmit={(e) => { e.preventDefault(); alert('تم إطلاق حملة الجرد بنجاح وإرسال الإشعارات لأعضاء اللجنة الميدانية.'); setView('inventory'); }} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>اسم حملة الجرد</label>
            <input type="text" required placeholder="مثال: جرد الربع الثالث 2024" style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>تاريخ الإغلاق المتوقع</label>
            <input type="date" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', colorScheme: 'dark'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>نطاق الجرد (الأقسام / الفروع)</label>
            <select required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}}>
              <option value="all">شامل لجميع الفروع والأقسام</option>
              <option value="main">الفرع الرئيسي فقط</option>
              <option value="it">قسم تقنية المعلومات فقط</option>
              <option value="waqf">أصول الأوقاف فقط</option>
            </select>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>رئيس لجنة الجرد الميداني</label>
            <input type="text" required placeholder="اسم رئيس اللجنة المعتمد" style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', gap: '1rem', gridColumn: '1 / -1', marginTop: '1rem'}}>
            <button type="submit" className="btn btn-primary" style={{padding: '0.75rem 2rem'}}>إطلاق الحملة</button>
            <button type="button" className="btn btn-ghost" onClick={() => setView('inventory')} style={{padding: '0.75rem 2rem'}}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="view-anim">
      <h2 style={{fontSize:'1.25rem', marginBottom:'2rem'}}>إعدادات النظام</h2>
      <div className="card" style={{maxWidth: '600px', display:'flex', flexDirection:'column', gap:'1.5rem'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontWeight:600}}>الإشعارات التلقائية</div>
            <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>تفعيل إرسال تنبيهات الجرد والإهلاك قبل الموعد</div>
          </div>
          <input type="checkbox" defaultChecked style={{width:'40px', height:'20px', cursor:'pointer'}} />
        </div>
        <div style={{height:'1px', background:'var(--border)'}}></div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontWeight:600}}>ربط النظام المحاسبي (ERP)</div>
            <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>مزامنة قيود اليومية مع دفتر الأستاذ العام تلقائياً</div>
          </div>
          <button className="btn btn-ghost" style={{color:'var(--success)'}}><CheckCircle size={16} /> متصل</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-box"><BarChart3 size={20} color="white" /></div>
          <span style={{fontWeight:800, fontSize:'1.2rem'}}>تراؤف <span style={{color:'var(--accent-light)'}}>V3.0</span></span>
        </div>

        <div className="nav-group">
          <div className="nav-label">الرئيسية</div>
          <div className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            <LayoutGrid size={18} /> لوحة التحكم
          </div>
        </div>

        <div className="nav-group">
          <div className="nav-label">إدارة الأصول</div>
          <div className={`nav-item ${view === 'register' ? 'active' : ''}`} onClick={() => setView('register')}>
            <Box size={18} /> سجل الأصول الثابتة
          </div>
          <div className={`nav-item ${view === 'journal' ? 'active' : ''}`} onClick={() => setView('journal')}><FileText size={18} /> قيود اليومية</div>
          <div className={`nav-item ${view === 'transfers' ? 'active' : ''}`} onClick={() => setView('transfers')}><Shuffle size={18} /> التحويلات العينية</div>
        </div>

        <div className="nav-group">
          <div className="nav-label">التقارير</div>
          <div className={`nav-item ${view === 'budget' ? 'active' : ''}`} onClick={() => setView('budget')}><PieChart size={18} /> الميزانية التقديرية</div>
          <div className={`nav-item ${view === 'inventory' ? 'active' : ''}`} onClick={() => setView('inventory')}><ClipboardList size={18} /> تقارير الجرد</div>
        </div>

        <div style={{marginTop: 'auto'}}>
          <div className={`nav-item ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}><Settings size={18} /> الإعدادات</div>
          <div style={{display:'flex', alignItems:'center', gap:'0.75rem', padding:'1rem', background:'rgba(255,255,255,0.05)', borderRadius:'12px', marginTop:'1rem'}}>
            <div style={{width:'35px', height:'35px', background:'var(--accent)', borderRadius:'50%', display:'flex', justifyContent:'center', alignItems:'center', fontSize:'0.8rem', fontWeight:700}}>FA</div>
            <div>
              <div style={{fontSize:'0.8rem', fontWeight:600}}>فيصل المحاسب</div>
              <div style={{fontSize:'0.65rem', color:'#94a3b8'}}>المدير التقني والمالي</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
            <div style={{display:'flex', background:'#f1f5f9', padding:'0.5rem 1rem', borderRadius:'20px', gap:'0.5rem', alignItems:'center'}}>
              <Search size={16} color="#64748b" />
              <input type="text" placeholder="بحث سريع..." style={{border:'none', background:'transparent', outline:'none', fontSize:'0.85rem', width:'200px'}} />
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'1.5rem'}}>
            <Bell size={20} color="#64748b" style={{cursor:'pointer'}} />
            <div style={{height:'30px', width:'1px', background:'var(--border)'}}></div>
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer'}}>
              <span style={{fontSize:'0.85rem', fontWeight:600}}>2024</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        <div className="content-area">
          {view === 'dashboard' && renderDashboard()}
          {view === 'register' && renderRegister()}
          {view === 'new-asset' && renderNewAsset()}
          {view === 'journal' && renderJournal()}
          {view === 'transfers' && renderTransfers()}
          {view === 'new-transfer' && renderNewTransfer()}
          {view === 'budget' && renderBudget()}
          {view === 'inventory' && renderInventory()}
          {view === 'new-inventory' && renderNewInventory()}
          {view === 'settings' && renderSettings()}
        </div>
      </main>

      {showScanner && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)'}}>
          <div className="card" style={{width:'400px', background:'var(--card-bg)', textAlign:'center', padding:'2.5rem 2rem', border:'1px solid var(--border)'}}>
            <div style={{display:'inline-block', padding:'1.5rem', borderRadius:'50%', background:'rgba(59, 130, 246, 0.1)', marginBottom:'1.5rem'}}>
              <QrCode size={48} color="var(--accent)" />
            </div>
            <h3 style={{marginBottom:'0.5rem', fontSize:'1.25rem'}}>المسح الميداني النشط</h3>
            <p style={{color:'var(--text-muted)', fontSize:'0.85rem', marginBottom:'2rem'}}>قم بتوجيه كاميرا الماسح الضوئي نحو ملصق الباركود أو الـ QR الخاص بالأصل، أو أدخل الرمز يدوياً.</p>
            <input autoFocus type="text" placeholder="أدخل رمز الأصل هنا..." style={{width:'100%', padding:'1rem', borderRadius:'8px', border:'2px solid var(--accent)', background:'transparent', color:'var(--text)', textAlign:'center', fontSize:'1.1rem', letterSpacing:'1px', outline:'none', boxShadow:'0 0 15px rgba(59, 130, 246, 0.2)'}} onKeyDown={(e) => {
              if(e.key === 'Enter' && e.target.value) {
                setShowScanner(false);
                showToast(`✅ تم مسح الأصل (${e.target.value}) بنجاح وتحديث حالته!`);
              }
            }}/>
            <button className="btn btn-ghost" style={{marginTop:'1.5rem', width:'100%', padding:'0.75rem'}} onClick={() => setShowScanner(false)}>إلغاء العملية</button>
          </div>
        </div>
      )}

      {toastMessage && (
        <div style={{position:'fixed', bottom:'2rem', right:'2rem', background:'var(--accent)', color:'#fff', padding:'1rem 1.5rem', borderRadius:'8px', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.3)', zIndex:9999, display:'flex', alignItems:'center', gap:'0.75rem', fontWeight:600}}>
          <CheckCircle size={20} /> {toastMessage}
        </div>
      )}
    </div>
  );
};

export default App;
