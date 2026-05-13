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
  MoreHorizontal,
  Bot,
  BrainCircuit,
  Sparkles,
  MessageSquare,
  Send,
  X,
  Zap,
  Mic,
  MicOff,
  Volume2
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
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{role: 'bot', text: 'أهلاً بك! أنا المساعد الذكي (Traouf AI). أستطيع مساعدتك في الاستعلام عن الأصول، أو إعطاء توصيات حوكمة وتحليلات استراتيجية. تفضل بطرح سؤالك.'}]);
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const deleteAsset = (id) => {
    if(window.confirm('هل أنت متأكد من حذف هذا الأصل نهائياً من السجل؟')) {
      setAssets(assets.filter(a => a.id !== id));
      showToast('🗑️ تم حذف الأصل بنجاح');
    }
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('⚠️ متصفحك لا يدعم التعرف على الكلام');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
    };
    recognition.start();
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [assets, setAssets] = useState([
    { id: 'ORG-AST-001', code: 'IT-001', name: 'خوادم البيانات المركزية (Mainframe)', category: 'أصول تقنية', cost: 1200000, vat: 180000, salvage: 100000, life: 5, date: '2023-01-01', method: 'SL', status: 'يعمل', custody: 'أحمد سالم', source: 'بنك الراجحي' },
    { id: 'ORG-AST-002', code: 'VH-021', name: 'أسطول سيارات التوزيع الدفعة الأولى', category: 'مركبات', cost: 450000, vat: 67500, salvage: 50000, life: 7, date: '2022-06-15', method: 'DB', status: 'يعمل', custody: 'محمد العبدالله', source: 'البلاد' },
    { id: 'ORG-AST-003', code: 'LD-001', name: 'أرض المقر الرئيسي (حي الصحافة)', category: 'أراضي', cost: 15000000, vat: 0, salvage: 15000000, life: 99, date: '2015-01-01', method: 'SL', status: 'يعمل', custody: '-', source: 'تبرعات عينية' },
    { id: 'ORG-AST-004', code: 'WAQ-001', name: 'مبنى الوقف السكني التجاري', category: 'أصول أوقاف', cost: 8500000, vat: 0, salvage: 1500000, life: 40, date: '2018-05-10', method: 'SL', status: 'يعمل', custody: 'إدارة الأوقاف', source: 'تبرعات عينية' },
    { id: 'ORG-AST-005', code: 'OF-015', name: 'طابعة مكتبية ليزرية', category: 'أثاث ومعدات', cost: 1500, vat: 225, salvage: 0, life: 3, date: '2024-01-10', method: 'SL', status: 'يعمل', custody: 'سعد فهد', source: 'موردين', isExpense: true },
    { id: 'ORG-AST-006', code: 'IT-002', name: 'أجهزة حاسب آلي (لاب توب) للإدارة', category: 'أصول تقنية', cost: 350000, vat: 52500, salvage: 20000, life: 4, date: '2022-11-20', method: 'SYD', status: 'يعمل', custody: 'قسم تقنية المعلومات', source: 'موردين' },
    { id: 'ORG-AST-007', code: 'VH-022', name: 'سيارة نقل ثقيل مرسيدس', category: 'مركبات', cost: 380000, vat: 57000, salvage: 60000, life: 10, date: '2020-03-05', method: 'DB', status: 'بالمستودع', custody: 'صالح اليامي', source: 'بنك الراجحي' },
    { id: 'ORG-AST-008', code: 'OF-016', name: 'أثاث مكتبي صالة الاستقبال', category: 'أثاث ومعدات', cost: 45000, vat: 6750, salvage: 5000, life: 5, date: '2023-08-12', method: 'SL', status: 'يعمل', custody: 'إدارة المرافق', source: 'بنك البلاد' },
    { id: 'ORG-AST-009', code: 'IT-003', name: 'تجهيزات شبكة سيسكو', category: 'أصول تقنية', cost: 180000, vat: 27000, salvage: 15000, life: 5, date: '2021-02-18', method: 'SL', status: 'يعمل', custody: 'أحمد سالم', source: 'موردين' },
    { id: 'ORG-AST-010', code: 'BD-001', name: 'مبنى المستودعات اللوجستية', category: 'مباني', cost: 3200000, vat: 480000, salvage: 400000, life: 33, date: '2019-09-30', method: 'SL', status: 'يعمل', custody: 'الإدارة الهندسية', source: 'بنك الراجحي' },
    { id: 'ORG-AST-011', code: 'VH-023', name: 'باص نقل موظفين 30 راكب', category: 'مركبات', cost: 220000, vat: 33000, salvage: 30000, life: 8, date: '2021-07-25', method: 'DB', status: 'تالف', custody: 'قسم النقل', source: 'البلاد' },
    { id: 'ORG-AST-012', code: 'IT-004', name: 'شاشات عرض تفاعلية للتدريب', category: 'أصول تقنية', cost: 55000, vat: 8250, salvage: 5000, life: 4, date: '2023-10-10', method: 'SYD', status: 'يعمل', custody: 'مركز التدريب', source: 'موردين' },
    { id: 'ORG-AST-013', code: 'OF-017', name: 'مكيفات مركزية للمبنى الإداري', category: 'أثاث ومعدات', cost: 280000, vat: 42000, salvage: 25000, life: 10, date: '2019-05-15', method: 'SL', status: 'يعمل', custody: 'إدارة المرافق', source: 'بنك الراجحي' },
    { id: 'ORG-AST-014', code: 'WAQ-002', name: 'مزرعة وقفية بالقصيم', category: 'أصول أوقاف', cost: 5500000, vat: 0, salvage: 2000000, life: 25, date: '2017-12-01', method: 'SL', status: 'يعمل', custody: 'إدارة الأوقاف', source: 'تبرعات عينية' },
    { id: 'ORG-AST-015', code: 'LD-002', name: 'أرض فضاء للاستثمار', category: 'أراضي', cost: 8000000, vat: 0, salvage: 8000000, life: 99, date: '2020-01-20', method: 'SL', status: 'بالمستودع', custody: '-', source: 'بنك البلاد' },
    { id: 'ORG-AST-016', code: 'IT-005', name: 'رخص برمجيات أوراكل (CAPEX)', category: 'أصول تقنية', cost: 750000, vat: 112500, salvage: 0, life: 5, date: '2022-04-01', method: 'SL', status: 'يعمل', custody: 'قسم تقنية المعلومات', source: 'موردين' },
    { id: 'ORG-AST-017', code: 'OF-018', name: 'آلة تصوير مستندات ضخمة', category: 'أثاث ومعدات', cost: 35000, vat: 5250, salvage: 2000, life: 5, date: '2024-02-05', method: 'SL', status: 'يعمل', custody: 'إدارة الشؤون الإدارية', source: 'البلاد' },
    { id: 'ORG-AST-018', code: 'VH-024', name: 'رافعة شوكية للمستودع', category: 'مركبات', cost: 120000, vat: 18000, salvage: 15000, life: 10, date: '2021-08-11', method: 'DB', status: 'يعمل', custody: 'محمد العبدالله', source: 'بنك الراجحي' },
    { id: 'ORG-AST-019', code: 'BD-002', name: 'مبنى فرع جدة', category: 'مباني', cost: 4500000, vat: 675000, salvage: 600000, life: 40, date: '2016-11-30', method: 'SL', status: 'يعمل', custody: 'الإدارة الهندسية', source: 'بنك الراجحي' },
    { id: 'ORG-AST-020', code: 'IT-006', name: 'نظام الحماية من الاختراقات (Firewalls)', category: 'أصول تقنية', cost: 210000, vat: 31500, salvage: 10000, life: 4, date: '2023-06-20', method: 'SYD', status: 'يعمل', custody: 'أحمد سالم', source: 'موردين' },
  ]);

  const [journals, setJournals] = useState([
    { id: 'JV-2024-001', date: '2024-01-31', desc: 'إثبات إهلاك شهر يناير', debit: 45200, credit: null, status: 'مرحل' },
    { id: 'JV-2024-001', date: '2024-01-31', desc: 'مجمع إهلاك الأصول', debit: null, credit: 45200, status: 'مرحل' },
    { id: 'JV-2024-015', date: '2024-02-28', desc: 'إثبات إهلاك شهر فبراير', debit: 45850, credit: null, status: 'مرحل' },
    { id: 'JV-2024-015', date: '2024-02-28', desc: 'مجمع إهلاك الأصول', debit: null, credit: 45850, status: 'مرحل' },
    { id: 'JV-2024-032', date: '2024-03-31', desc: 'إثبات إهلاك شهر مارس', debit: 46100, credit: null, status: 'مرحل' },
    { id: 'JV-2024-032', date: '2024-03-31', desc: 'مجمع إهلاك الأصول', debit: null, credit: 46100, status: 'مرحل' },
    { id: 'JV-2024-048', date: '2024-04-30', desc: 'إثبات إهلاك شهر أبريل', debit: 46100, credit: null, status: 'مسودة' },
    { id: 'JV-2024-048', date: '2024-04-30', desc: 'مجمع إهلاك الأصول', debit: null, credit: 46100, status: 'مسودة' },
    { id: 'JV-2024-051', date: '2024-05-05', desc: 'تسوية بيع خردة (سيارة تالفة)', debit: 15000, credit: null, status: 'مسودة' },
    { id: 'JV-2024-051', date: '2024-05-05', desc: 'أرباح بيع أصول ثابتة', debit: null, credit: 15000, status: 'مسودة' },
  ]);

  const [transfers, setTransfers] = useState([
    { id: 'TR-092', asset: 'تجهيزات المكتب الرئيسي', from: 'الإدارة', to: 'الموارد البشرية', date: '2024-01-15', status: 'مكتمل' },
    { id: 'TR-093', asset: 'آلة تغليف صناعية', from: 'المستودع', to: 'الإنتاج', date: '2024-02-20', status: 'قيد المراجعة' },
    { id: 'TR-094', asset: 'باص نقل موظفين 30 راكب', from: 'الإنتاج', to: 'المستودع', date: '2024-03-05', status: 'مرفوض' },
    { id: 'TR-095', asset: 'أجهزة حاسب آلي للإدارة', from: 'قسم تقنية المعلومات', to: 'الموارد البشرية', date: '2024-04-12', status: 'مكتمل' },
    { id: 'TR-096', asset: 'طابعة مكتبية ليزرية', from: 'الإدارة', to: 'المبيعات', date: '2024-05-02', status: 'قيد المراجعة' },
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
    labels: accountingEngine.slice(0, 8).map(a => a.name.substring(0, 15)),
    datasets: [
      { type: 'line', label: 'صافي القيمة', data: accountingEngine.slice(0, 8).map(a => a.netBookValue), borderColor: '#f59e0b', backgroundColor: '#f59e0b', tension: 0.4 },
      { type: 'bar', label: 'التكلفة التاريخية', data: accountingEngine.slice(0, 8).map(a => a.cost), backgroundColor: '#0f172a', borderRadius: 4 },
      { type: 'bar', label: 'الإهلاك المتراكم', data: accountingEngine.slice(0, 8).map(a => a.accumulatedDep), backgroundColor: '#0d9488', borderRadius: 4 }
    ]
  };

  const categoryData = {
    labels: ['أراضي ومباني', 'أصول تقنية', 'مركبات ورافعات', 'أثاث ومعدات', 'أوقاف'],
    datasets: [{
      data: [
        accountingEngine.filter(a => a.category === 'أراضي' || a.category === 'مباني').reduce((s,a)=>s+a.cost,0),
        accountingEngine.filter(a => a.category === 'أصول تقنية').reduce((s,a)=>s+a.cost,0),
        accountingEngine.filter(a => a.category === 'مركبات').reduce((s,a)=>s+a.cost,0),
        accountingEngine.filter(a => a.category === 'أثاث ومعدات').reduce((s,a)=>s+a.cost,0),
        accountingEngine.filter(a => a.category === 'أصول أوقاف').reduce((s,a)=>s+a.cost,0)
      ],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'],
      borderWidth: 0
    }]
  };

  const renderDashboard = () => (
    <div className="view-anim">
      <div style={{background:'linear-gradient(90deg, var(--accent) 0%, #8b5cf6 100%)', padding:'1.5rem', borderRadius:'16px', color:'white', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', boxShadow:'0 10px 25px -5px rgba(59, 130, 246, 0.4)'}}>
        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
          <div style={{background:'rgba(255,255,255,0.2)', padding:'0.75rem', borderRadius:'50%'}}>
            <Sparkles size={28} />
          </div>
          <div>
            <div style={{fontWeight:700, fontSize:'1.25rem', marginBottom:'0.25rem'}}>محرك الذكاء الاصطناعي نشط (Traouf AI Engine)</div>
            <div style={{fontSize:'0.9rem', opacity:0.9}}>تم فحص وتحليل {accountingEngine.length} أصل رأسمالي بقيمة إجمالية تتجاوز {Math.floor(totals.cost / 1000000)} مليون ريال بنجاح.</div>
          </div>
        </div>
        <div style={{background:'rgba(255,255,255,0.2)', padding:'0.5rem 1rem', borderRadius:'8px', fontSize:'0.85rem', fontWeight:600, display:'flex', alignItems:'center', gap:'0.5rem'}}>
          <Activity size={16} /> تحديث مباشر اللحظة
        </div>
      </div>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'1.5rem'}}>
        <div>
          <h2 style={{fontSize:'1.5rem', marginBottom:'0.5rem'}}>لوحة القيادة الاستراتيجية</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>مؤشرات الأداء الرئيسية، تقييم المخاطر المباشرة، والعائد على المحافظ.</p>
        </div>
      </div>

      <div className="summary-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
        <div className="card" style={{position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:0, left:0, width:'4px', height:'100%', background:'#0f172a'}}></div>
          <div className="stat-icon" style={{background: '#f1f5f9'}}><Database size={20} color="#0f172a" /></div>
          <div className="val-sub">إجمالي المحفظة الرأسمالية</div>
          <div className="val-big">{totals.cost.toLocaleString()} ر.س</div>
          <div className="val-sub" style={{color: '#10b981', fontWeight:600}}><TrendingUp size={14} /> +12.4% نمو عن العام السابق</div>
        </div>
        <div className="card" style={{position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:0, left:0, width:'4px', height:'100%', background:'#0d9488'}}></div>
          <div className="stat-icon" style={{background: '#f0fdfa'}}><ShieldCheck size={20} color="#0d9488" /></div>
          <div className="val-sub">صافي القيمة الدفترية (NBV)</div>
          <div className="val-big">{totals.nbv.toLocaleString()} ر.س</div>
          <div className="val-sub">القيمة الحقيقية القابلة للتسييل</div>
        </div>
        <div className="card" style={{position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:0, left:0, width:'4px', height:'100%', background:'#ef4444'}}></div>
          <div className="stat-icon" style={{background: '#fef2f2'}}><Activity size={20} color="#ef4444" /></div>
          <div className="val-sub">مجمع الإهلاك الكلي</div>
          <div className="val-big">{totals.dep.toLocaleString()} ر.س</div>
          <div className="val-sub" style={{color:'#ef4444', fontWeight:600}}>معدل التآكل الكلي: {((totals.dep/totals.cost)*100).toFixed(1)}%</div>
        </div>
        <div className="card" style={{position:'relative', overflow:'hidden', background:'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', borderColor:'#c7d2fe'}}>
          <div style={{position:'absolute', top:0, left:0, width:'4px', height:'100%', background:'#8b5cf6'}}></div>
          <div className="stat-icon" style={{background: '#f3e8ff'}}><BrainCircuit size={20} color="#8b5cf6" /></div>
          <div className="val-sub" style={{fontWeight:600, color:'#4f46e5'}}>مؤشر المخاطر المدعوم بالذكاء</div>
          <div className="val-big" style={{color:'#8b5cf6'}}>متوسط / 42%</div>
          <div className="val-sub" style={{color:'#64748b'}}>توجد 4 أصول تتطلب إحلال عاجل</div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom:'1.5rem'}}>
        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1.5rem'}}>
            <h3 style={{fontSize:'1.1rem'}}>تحليل العائد والمخاطر الرأسمالية (أبرز 8 أصول)</h3>
          </div>
          <div className="chart-container" style={{height:'320px'}}>
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="card">
          <h3 style={{marginBottom:'1.5rem', fontSize:'1.1rem'}}>التوزيع الاستراتيجي للمحفظة</h3>
          <div className="chart-container" style={{height:'320px', display:'flex', justifyContent:'center'}}>
            <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
        <div className="card" style={{border:'1px solid #fecdd3', background:'#fff1f2'}}>
          <h3 style={{marginBottom:'1rem', fontSize:'1.1rem', color:'#be123c', display:'flex', alignItems:'center', gap:'0.5rem'}}><AlertTriangle size={20} /> تحليل المخاطر (AI Risks)</h3>
          <ul style={{paddingLeft:'1.5rem', margin:0, color:'#9f1239', fontSize:'0.9rem', lineHeight:'1.8'}}>
            <li style={{marginBottom:'0.5rem'}}><strong>خوادم البيانات المركزية:</strong> استهلكت 85% من عمرها الإنتاجي، خطر توقف مفاجئ لشبكة الإدارة. <span style={{fontWeight:700, textDecoration:'underline'}}>التوصية: إحلال فوري (استثمار CAPEX).</span></li>
            <li><strong>سيارات التوزيع:</strong> 3 مركبات نقل ثقيل تجاوزت الحد المسموح للإهلاك وبدأت تستهلك تكلفة صيانة تعادل 40% من قيمتها الدفترية.</li>
          </ul>
        </div>
        <div className="card" style={{border:'1px solid #bbf7d0', background:'#f0fdf4'}}>
          <h3 style={{marginBottom:'1rem', fontSize:'1.1rem', color:'#15803d', display:'flex', alignItems:'center', gap:'0.5rem'}}><Zap size={20} /> الفرص الاستراتيجية (AI Opportunities)</h3>
          <ul style={{paddingLeft:'1.5rem', margin:0, color:'#166534', fontSize:'0.9rem', lineHeight:'1.8'}}>
            <li style={{marginBottom:'0.5rem'}}><strong>أرض المقر الرئيسي (حي الصحافة):</strong> مسجلة دفترياً بقيمة 15 مليون، بينما قيمتها السوقية بالذكاء الاصطناعي تقدر بـ 28 مليون ريال. <span style={{fontWeight:700, textDecoration:'underline'}}>يوصى بعمل إعادة تقييم (Revaluation)</span> لرفع قوة الميزانية العمومية.</li>
            <li><strong>أصول الأوقاف:</strong> تقييم الذكاء الاصطناعي يشير لإمكانية تحقيق عائد إضافي بنسبة 8% عبر تأجير المساحات التجارية الفائضة.</li>
          </ul>
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

    const activeAssets = accountingEngine.filter(a => a.status === 'يعمل').length;
    const alertAssets = accountingEngine.filter(a => a.accumulatedDep >= a.cost * 0.8 && a.category !== 'أراضي').length;

    return (
      <div className="view-anim">
        <div style={{background:'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding:'1.5rem', borderRadius:'16px', color:'white', marginBottom:'2rem', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.5)', display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1rem'}}>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.25rem'}}>إجمالي الأصول المسجلة</div>
            <div style={{fontSize:'1.5rem', fontWeight:700}}>{accountingEngine.length} أصل</div>
          </div>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.25rem'}}>الأصول التشغيلية النشطة</div>
            <div style={{fontSize:'1.5rem', fontWeight:700, color:'#10b981'}}>{activeAssets} أصل</div>
          </div>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.25rem'}}>تحذير الذكاء الاصطناعي (AI)</div>
            <div style={{fontSize:'1.5rem', fontWeight:700, color:'#f59e0b'}}>{alertAssets} أصول متهالكة</div>
          </div>
          <div>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.25rem'}}>إجمالي القيمة الدفترية</div>
            <div style={{fontSize:'1.5rem', fontWeight:700}}>{totals.nbv.toLocaleString()} ر.س</div>
          </div>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
          <h2 style={{fontSize:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Box size={24} color="var(--accent)" /> سجل الأصول الثابتة (FAR)</h2>
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

        <div className="table-wrapper" style={{background:'var(--card-bg)', borderRadius:'12px', border:'1px solid var(--border)', overflow:'hidden'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead style={{background:'#f8fafc', borderBottom:'2px solid var(--border)'}}>
            <tr>
              <th style={{padding:'1rem', textAlign:'right'}}>الرمز / الباركود</th>
              <th style={{padding:'1rem', textAlign:'right'}}>بيانات الأصل (Category)</th>
              <th style={{padding:'1rem', textAlign:'right'}}>الفرع / العهدة / المورد</th>
              <th style={{padding:'1rem', textAlign:'right'}}>التكلفة (مع الضريبة)</th>
              <th style={{padding:'1rem', textAlign:'right'}}>الإهلاك المتراكم</th>
              <th style={{padding:'1rem', textAlign:'right'}}>صافي القيمة (NBV)</th>
              <th style={{padding:'1rem', textAlign:'center'}}>الحالة / الذكاء الاصطناعي</th>
              <th style={{padding:'1rem', textAlign:'center'}}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset, index) => {
              const isWarning = asset.accumulatedDep >= asset.cost * 0.8 && asset.category !== 'أراضي';
              return (
              <tr key={asset.id} style={{borderBottom:'1px solid var(--border)', background: index % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)', transition:'background 0.2s'}} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'} onMouseLeave={e => e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)'}>
                <td style={{padding:'1rem'}}>
                  <div style={{color:'var(--accent)', fontWeight:700, display:'flex', alignItems:'center', gap:'0.25rem'}}><QrCode size={14} /> {asset.code}</div>
                  <div style={{fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>{asset.id}</div>
                </td>
                <td style={{padding:'1rem'}}>
                  <div style={{fontWeight:600, color:'var(--text)'}}>{asset.name}</div>
                  <div style={{fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>{asset.category} | {DEPRECIATION_METHODS[asset.method]}</div>
                </td>
                <td style={{padding:'1rem'}}>
                  <div style={{fontWeight:600, fontSize:'0.85rem'}}>{asset.custody}</div>
                  <div style={{fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.25rem'}}><span style={{color:'#64748b'}}>المورد:</span> {asset.source}</div>
                </td>
                <td style={{padding:'1rem', fontWeight:600}}>{(asset.cost + (asset.vat || 0)).toLocaleString()} ر.س</td>
                <td style={{padding:'1rem', color:'var(--danger)', fontWeight:500}}>{asset.category === 'أراضي' ? '-' : `-${asset.accumulatedDep.toLocaleString()}`}</td>
                <td style={{padding:'1rem', fontWeight:700, color:'#0f172a'}}>{asset.netBookValue.toLocaleString()} ر.س</td>
                <td style={{padding:'1rem', textAlign:'center'}}>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem'}}>
                    {asset.isExpense ? 
                      <span className="badge" style={{background:'#fef2f2', color:'#ef4444'}}>مصروف</span> :
                      <span className={`badge ${asset.status === 'يعمل' ? 'b-active' : ''}`} style={asset.status === 'بالمستودع' ? {background:'#fef3c7', color:'#92400e'} : asset.status === 'تالف' ? {background:'#fee2e2', color:'#b91c1c'} : {}}>{asset.status}</span>
                    }
                    {isWarning && <span style={{fontSize:'0.7rem', background:'#fee2e2', color:'#b91c1c', padding:'0.2rem 0.5rem', borderRadius:'4px', display:'flex', alignItems:'center', gap:'0.25rem'}}><AlertTriangle size={10} /> إحلال مقترح (AI)</span>}
                  </div>
                </td>
                <td style={{padding:'1rem', textAlign:'center'}}>
                  <div style={{display:'flex', justifyContent:'center', gap:'0.5rem'}}>
                    <button className="btn btn-ghost" style={{padding:'0.4rem', background:'#f1f5f9'}} title="تعديل" onClick={() => { setEditingAsset(asset); setView('new-asset'); }}><Edit size={16} color="#475569" /></button>
                    <button className="btn btn-ghost" style={{padding:'0.4rem', background:'#fef2f2'}} title="استبعاد/بيع" onClick={() => deleteAsset(asset.id)}><Trash2 size={16} color="#ef4444" /></button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
        {filteredAssets.length === 0 && <div style={{padding:'4rem', textAlign:'center', color:'var(--text-muted)'}}><Box size={48} color="#cbd5e1" style={{margin:'0 auto 1rem'}} />لا توجد أصول مطابقة لمعايير البحث الحالية.</div>}
      </div>
    </div>
    );
  };

  const handleAddAsset = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const cost = parseFloat(fd.get('cost') || 0);
    const life = parseFloat(fd.get('life') || 0);
    
    const assetData = {
      id: editingAsset ? editingAsset.id : `AST-${Math.floor(Math.random()*10000)}`,
      code: editingAsset ? editingAsset.code : `CD-${Math.floor(Math.random()*1000)}`,
      name: fd.get('name'),
      category: fd.get('category'),
      cost: cost,
      vat: parseFloat(fd.get('vat') || 0),
      salvage: editingAsset ? editingAsset.salvage : 0,
      life: life || 1,
      date: editingAsset ? editingAsset.date : new Date().toISOString().split('T')[0],
      method: editingAsset ? editingAsset.method : 'SL',
      status: fd.get('status'),
      custody: fd.get('custody'),
      source: fd.get('source'),
      isExpense: (cost < 3000 || life < 1)
    };

    if (editingAsset) {
      setAssets(assets.map(a => a.id === editingAsset.id ? assetData : a));
      showToast('✅ تم تحديث بيانات الأصل بنجاح');
    } else {
      setAssets([...assets, assetData]);
      showToast('✅ تم تسجيل الأصل الجديد بنجاح');
    }
    setEditingAsset(null);
    setView('register');
  };

  const renderNewAsset = () => (
    <div className="view-anim">
      <div style={{marginBottom:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2 style={{fontSize:'1.25rem'}}>{editingAsset ? 'تعديل بيانات الأصل' : 'تسجيل أصل جديد'}</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>{editingAsset ? `تعديل الأصل: ${editingAsset.name}` : 'أدخل بيانات الأصل الثابت الجديد لإضافته إلى السجل'}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => { setEditingAsset(null); setView('register'); }}>عودة للسجل</button>
      </div>
      <div className="card" style={{maxWidth: '800px', background: 'var(--card-bg)'}}>
        <form onSubmit={handleAddAsset} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>اسم الأصل</label>
            <input name="name" type="text" defaultValue={editingAsset?.name} placeholder="مثال: سيارة نقل تويوتا" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>الفئة التصنيفية</label>
            <select name="category" defaultValue={editingAsset?.category} required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}}>
              <option value="أراضي">أراضي</option>
              <option value="مباني">مباني</option>
              <option value="مركبات">سيارات ومركبات</option>
              <option value="أصول تقنية">أجهزة تقنية</option>
              <option value="أثاث ومعدات">أثاث ومعدات</option>
              <option value="أصول أوقاف">أصول أوقاف</option>
            </select>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>مصدر الأصل / وسيلة الدفع</label>
            <select name="source" defaultValue={editingAsset?.source} required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}}>
              <option value="بنك الراجحي">بنك الراجحي</option>
              <option value="بنك البلاد">بنك البلاد</option>
              <option value="موردين">موردين (آجل)</option>
              <option value="تبرعات عينية">تبرعات عينية</option>
            </select>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>الحالة التشغيلية</label>
            <select name="status" defaultValue={editingAsset?.status} required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}}>
              <option value="يعمل">يعمل</option>
              <option value="بالمستودع">بالمستودع</option>
              <option value="تالف">تالف</option>
            </select>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>تحديد العهدة (اسم الموظف)</label>
            <input name="custody" type="text" defaultValue={editingAsset?.custody} placeholder="مثال: أحمد سالم" style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>التكلفة الأساسية (ر.س)</label>
            <input name="cost" type="number" defaultValue={editingAsset?.cost} placeholder="0.00" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>الضريبة المضافة (VAT)</label>
            <input name="vat" type="number" defaultValue={editingAsset?.vat || 0} placeholder="0.00" style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.85rem', fontWeight: 600}}>العمر الإنتاجي (سنوات)</label>
            <input name="life" type="number" defaultValue={editingAsset?.life} placeholder="مثال: 5 (اتركه فارغاً للأراضي)" style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
          </div>
          <div style={{display: 'flex', gap: '1rem', gridColumn: '1 / -1', marginTop: '1rem'}}>
            <button type="submit" className="btn btn-primary" style={{padding: '0.75rem 2rem'}}>{editingAsset ? 'تحديث البيانات' : 'حفظ الأصل'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setEditingAsset(null); setView('register'); }} style={{padding: '0.75rem 2rem'}}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderJournal = () => {
    const totalDebit = journals.reduce((acc, j) => acc + (j.debit || 0), 0);
    const totalCredit = journals.reduce((acc, j) => acc + (j.credit || 0), 0);
    const draftCount = journals.filter(j => j.status === 'مسودة').length;
    
    return (
      <div className="view-anim">
        <div style={{background:'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding:'1.5rem', borderRadius:'16px', color:'white', marginBottom:'2rem', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.5)', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1rem'}}>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.25rem'}}>إجمالي المدين</div>
            <div style={{fontSize:'1.5rem', fontWeight:700, color:'#ef4444'}}>{totalDebit.toLocaleString()} ر.س</div>
          </div>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.25rem'}}>إجمالي الدائن</div>
            <div style={{fontSize:'1.5rem', fontWeight:700, color:'#10b981'}}>{totalCredit.toLocaleString()} ر.س</div>
          </div>
          <div>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.25rem'}}>قيود معلقة (مسودة)</div>
            <div style={{fontSize:'1.5rem', fontWeight:700, color:'#f59e0b'}}>{draftCount} قيود</div>
          </div>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
          <h2 style={{fontSize:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><FileText size={24} color="var(--accent)" /> قيود اليومية التلقائية</h2>
          <div style={{display:'flex', gap:'0.5rem'}}>
            <button className="btn btn-ghost" style={{color:'var(--danger)', border:'1px solid var(--danger)'}} onClick={() => { showToast('تم فك الترحيل وإعادة القيود لحالة المسودة'); setJournals(journals.map(j => ({...j, status: 'مسودة'}))); }}><X size={18} /> فك / إلغاء الترحيل</button>
            <button className="btn btn-primary" onClick={() => { showToast('تم ترحيل القيود المعلقة بنجاح'); setJournals(journals.map(j => ({...j, status: 'مرحل'}))); }}><FileText size={18} /> ترحيل القيود</button>
          </div>
        </div>
        <div className="table-wrapper" style={{background:'var(--card-bg)', borderRadius:'12px', border:'1px solid var(--border)', overflow:'hidden'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead style={{background:'#f8fafc', borderBottom:'2px solid var(--border)'}}>
              <tr>
                <th style={{padding:'1rem', textAlign:'right'}}>رقم القيد</th>
                <th style={{padding:'1rem', textAlign:'right'}}>التاريخ</th>
                <th style={{padding:'1rem', textAlign:'right'}}>البيان</th>
                <th style={{padding:'1rem', textAlign:'right'}}>مدين</th>
                <th style={{padding:'1rem', textAlign:'right'}}>دائن</th>
                <th style={{padding:'1rem', textAlign:'center'}}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {journals.map((j, idx) => (
                <tr key={idx} style={{borderBottom:'1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)'}}>
                  <td style={{padding:'1rem', fontWeight:700, color:'#0f172a'}}>{j.id}</td>
                  <td style={{padding:'1rem'}}>{j.date}</td>
                  <td style={{padding:'1rem', fontWeight:600}}>{j.desc}</td>
                  <td style={{padding:'1rem', color:'var(--danger)', fontWeight:700}}>{j.debit ? j.debit.toLocaleString() : '-'}</td>
                  <td style={{padding:'1rem', color:'var(--success)', fontWeight:700}}>{j.credit ? j.credit.toLocaleString() : '-'}</td>
                  <td style={{padding:'1rem', textAlign:'center'}}>
                    {j.status === 'مرحل' ? 
                      <span className="badge b-active" style={{padding:'0.4rem 1rem'}}>مرحل</span> : 
                      <span className="badge" style={{background:'#fef3c7', color:'#92400e', padding:'0.4rem 1rem'}}>مسودة</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTransfers = () => (
    <div className="view-anim">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <div>
          <h2 style={{fontSize:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Shuffle color="var(--accent)" /> التحويلات العينية للأصول</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>إدارة ومراقبة حركة تنقلات الأصول بين الأقسام والفروع.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setView('new-transfer')}><Shuffle size={18} /> طلب تحويل جديد</button>
      </div>

      <div className="summary-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', marginBottom:'2rem'}}>
        <div className="card" style={{borderTop:'4px solid #3b82f6'}}>
          <div className="val-sub">إجمالي الطلبات</div>
          <div className="val-big" style={{color:'#3b82f6'}}>{transfers.length}</div>
        </div>
        <div className="card" style={{borderTop:'4px solid #10b981'}}>
          <div className="val-sub">طلبات مكتملة</div>
          <div className="val-big" style={{color:'#10b981'}}>{transfers.filter(t => t.status === 'مكتمل').length}</div>
        </div>
        <div className="card" style={{borderTop:'4px solid #f59e0b'}}>
          <div className="val-sub">قيد المراجعة</div>
          <div className="val-big" style={{color:'#f59e0b'}}>{transfers.filter(t => t.status === 'قيد المراجعة').length}</div>
        </div>
      </div>

      <div className="table-wrapper" style={{background:'var(--card-bg)', borderRadius:'12px', border:'1px solid var(--border)', overflow:'hidden'}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead style={{background:'#f8fafc', borderBottom:'2px solid var(--border)'}}>
            <tr>
              <th style={{padding:'1rem', textAlign:'right'}}>رقم الطلب</th>
              <th style={{padding:'1rem', textAlign:'right'}}>الأصل</th>
              <th style={{padding:'1rem', textAlign:'right'}}>مسار التحويل</th>
              <th style={{padding:'1rem', textAlign:'right'}}>التاريخ</th>
              <th style={{padding:'1rem', textAlign:'center'}}>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t, index) => (
              <tr key={t.id} style={{borderBottom:'1px solid var(--border)', background: index % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)'}}>
                <td style={{padding:'1rem', fontWeight:700, color:'var(--accent)'}}>{t.id}</td>
                <td style={{padding:'1rem', fontWeight:600}}>{t.asset}</td>
                <td style={{padding:'1rem'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:600}}>
                    <span style={{color:'#64748b'}}>{t.from}</span>
                    <Shuffle size={14} color="#94a3b8" />
                    <span style={{color:'#0f172a'}}>{t.to}</span>
                  </div>
                </td>
                <td style={{padding:'1rem'}}>{t.date}</td>
                <td style={{padding:'1rem', textAlign:'center'}}>
                  {t.status === 'مكتمل' ? 
                    <span className="badge b-active" style={{padding:'0.4rem 1rem'}}>مكتمل</span> : 
                    t.status === 'قيد المراجعة' ?
                    <span className="badge" style={{background:'#fef3c7', color:'#92400e', padding:'0.4rem 1rem'}}>قيد المراجعة</span> :
                    <span className="badge" style={{background:'#fee2e2', color:'#b91c1c', padding:'0.4rem 1rem'}}>مرفوض</span>
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
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem'}}>
        <div>
          <h2 style={{fontSize:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><PieChart color="var(--accent)" /> الميزانية التقديرية الرأسمالية (CAPEX)</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>مراقبة وتحليل خطط الشراء والاستحواذ مقارنة بالميزانية المعتمدة.</p>
        </div>
      </div>
      <div className="summary-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
        <div className="card" style={{position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:0, left:0, width:'4px', height:'100%', background:'#3b82f6'}}></div>
          <div className="val-sub">الميزانية المعتمدة لعام 2024</div>
          <div className="val-big" style={{color:'#3b82f6'}}>1,500,000 ر.س</div>
          <div className="val-sub">خطة CAPEX السنوية</div>
        </div>
        <div className="card" style={{position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:0, left:0, width:'4px', height:'100%', background:'#ef4444'}}></div>
          <div className="val-sub">المنصرف الفعلي حتى الآن</div>
          <div className="val-big" style={{color:'#ef4444'}}>680,000 ر.س</div>
          <div className="val-sub">تم استهلاك 45% من الميزانية</div>
        </div>
        <div className="card" style={{position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:0, left:0, width:'4px', height:'100%', background:'#10b981'}}></div>
          <div className="val-sub">المتبقي من الميزانية</div>
          <div className="val-big" style={{color:'#10b981'}}>820,000 ر.س</div>
          <div className="val-sub">فائض متوفر للاستحواذات</div>
        </div>
      </div>

      <div className="card" style={{marginTop:'1.5rem'}}>
        <h3 style={{marginBottom:'1.5rem', fontSize:'1.1rem', color:'#1e293b'}}>مؤشر استهلاك الميزانية</h3>
        <div style={{height:'24px', width:'100%', background:'#f1f5f9', borderRadius:'12px', overflow:'hidden', display:'flex', marginBottom:'1rem'}}>
          <div style={{width:'45%', background:'#ef4444', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'0.75rem', fontWeight:700}}>المنصرف 45%</div>
          <div style={{width:'15%', background:'#f59e0b', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'0.75rem', fontWeight:700}}>تحت الطلب 15%</div>
          <div style={{width:'40%', background:'#10b981', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'0.75rem', fontWeight:700}}>المتبقي 40%</div>
        </div>
        <div style={{background:'#f0fdf4', padding:'1rem', borderRadius:'8px', border:'1px solid #bbf7d0', color:'#166534', fontSize:'0.85rem', display:'flex', gap:'0.5rem'}}>
          <Sparkles size={18} />
          <strong>تحليل الذكاء الاصطناعي:</strong> المتبقي من الميزانية كافٍ جداً لتغطية نفقات إحلال خوادم البيانات الموصى بها (تكلفة تقديرية 120,000 ر.س) دون تجاوز السقف السنوي المعتمد.
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="view-anim">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem'}}>
        <div>
          <h2 style={{fontSize:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><ClipboardList color="var(--accent)" /> تقارير الجرد الميداني والفروقات</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>إدارة لجان الجرد الميداني الذكي، تسويات العهد، والمطابقة الآلية.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setView('new-inventory')} style={{padding:'0.75rem 2rem'}}><CheckCircle size={18} /> بدء حملة جرد</button>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom:'2rem'}}>
        <div className="card" style={{borderLeft:'6px solid var(--danger)', background:'linear-gradient(to right, #fff1f2, #ffffff)'}}>
          <div style={{fontSize:'0.9rem', color:'var(--danger)', fontWeight:700, marginBottom:'0.5rem'}}>أصول مفقودة (لم تُجرد)</div>
          <div style={{fontSize:'2rem', fontWeight:800, color:'#9f1239'}}>2 <span style={{fontSize:'1rem', fontWeight:600}}>أصل</span></div>
          <div style={{fontSize:'0.85rem', marginTop:'0.5rem', color:'#881337'}}>القيمة الدفترية: 4,500 ر.س - <button onClick={() => { setView('journal'); showToast('تم إنشاء مسودة قيد إعدام أصول مفقودة تلقائياً بقيمة 4,500 ر.س'); }} style={{color:'var(--danger)', textDecoration:'underline', background:'none', border:'none', cursor:'pointer', padding:0, fontSize:'inherit', fontWeight:'inherit'}}>عرض التسوية لتكوين قيد إعدام</button></div>
        </div>
        <div className="card" style={{borderLeft:'6px solid var(--success)', background:'linear-gradient(to right, #f0fdf4, #ffffff)'}}>
          <div style={{fontSize:'0.9rem', color:'var(--success)', fontWeight:700, marginBottom:'0.5rem'}}>أصول زائدة (غير مسجلة)</div>
          <div style={{fontSize:'2rem', fontWeight:800, color:'#166534'}}>1 <span style={{fontSize:'1rem', fontWeight:600}}>أصل</span></div>
          <div style={{fontSize:'0.85rem', marginTop:'0.5rem', color:'#14532d'}}>لابتوب ديل إضافي (مجهول المصدر) - <button onClick={() => { setEditingAsset({ name: 'لابتوب ديل إضافي (جرد)', category: 'أصول تقنية', source: 'تبرعات عينية', status: 'يعمل', cost: 3500, life: 3 }); setView('new-asset'); }} style={{color:'var(--success)', textDecoration:'underline', background:'none', border:'none', cursor:'pointer', padding:0, fontSize:'inherit', fontWeight:'inherit'}}>تسجيل كأصل جديد من تبرع</button></div>
        </div>
      </div>

      <h3 style={{fontSize:'1.1rem', marginBottom:'1rem'}}>حملات الجرد النشطة والمغلقة</h3>
      <div style={{display: 'grid', gap: '1rem'}}>
        <div className="card" style={{border:'1px solid var(--border)'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
            <div>
              <div style={{fontWeight:700, fontSize:'1.1rem'}}>جرد الربع الأول 2024</div>
              <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>تاريخ الإغلاق: 31-03-2024 - شامل جميع الفروع</div>
            </div>
            <span className="badge b-active" style={{fontSize:'0.9rem', padding:'0.5rem 1rem'}}><CheckCircle size={14}/> مكتمل ومغلق</span>
          </div>
          <div style={{background:'#f1f5f9', height:'8px', borderRadius:'4px', overflow:'hidden', marginBottom:'0.5rem'}}>
            <div style={{background:'#10b981', width:'100%', height:'100%'}}></div>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem'}}>
            <span style={{fontWeight:600}}>تم جرد 1,450 / 1,452</span>
            <span style={{color:'#10b981', fontWeight:700}}>نسبة التطابق 99.8%</span>
          </div>
        </div>

        <div className="card" style={{border:'1px solid #fcd34d', background:'#fffbeb'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
            <div>
              <div style={{fontWeight:700, fontSize:'1.1rem', color:'#92400e'}}>جرد مستودع التقنية</div>
              <div style={{fontSize:'0.85rem', color:'#b45309'}}>لجنة الجرد: م. فهد، أ. محمد (باستخدام المسح الميداني الذكي)</div>
            </div>
            <span className="badge" style={{background:'#f59e0b', color:'#fff', fontSize:'0.9rem', padding:'0.5rem 1rem'}}><Activity size={14}/> قيد التنفيذ</span>
          </div>
          <div style={{background:'#fde68a', height:'8px', borderRadius:'4px', overflow:'hidden', marginBottom:'0.5rem'}}>
            <div style={{background:'#d97706', width:'45%', height:'100%', animation:'pulse 2s infinite'}}></div>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem'}}>
            <span style={{fontWeight:600, color:'#92400e'}}>تم جرد 45 / 100 أصل تقني</span>
            <span style={{color:'#d97706', fontWeight:700}}>مُنجز 45%</span>
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

  const renderAIInsights = () => (
    <div className="view-anim">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem'}}>
        <div>
          <h2 style={{fontSize:'1.5rem', marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Sparkles color="var(--accent)" /> التحليلات التنبؤية بالذكاء الاصطناعي</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>تحليل المخاطر، التنبؤ بالإحلال، وفرص تحسين استغلال الأصول المدعومة بنماذج تعلم الآلة.</p>
        </div>
      </div>

      <div className="summary-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
        <div className="card" style={{borderTop:'4px solid #8b5cf6'}}>
          <div className="val-sub">مخاطر تعطل الأصول الحرجة</div>
          <div className="val-big" style={{color:'#8b5cf6'}}>12%</div>
          <div className="val-sub">احتمالية تعطل خوادم البيانات خلال 3 أشهر بناءً على معدل الإهلاك.</div>
        </div>
        <div className="card" style={{borderTop:'4px solid #10b981'}}>
          <div className="val-sub">وفر مالي متوقع (CAPEX)</div>
          <div className="val-big" style={{color:'#10b981'}}>150,000 ر.س</div>
          <div className="val-sub">عن طريق تأجيل إحلال مركبات التوزيع وتكثيف صيانتها.</div>
        </div>
        <div className="card" style={{borderTop:'4px solid #f59e0b'}}>
          <div className="val-sub">التوقيت الأمثل للجرد القادم</div>
          <div className="val-big" style={{color:'#f59e0b'}}>أكتوبر 2024</div>
          <div className="val-sub">بناءً على دورة حياة الأصول التقنية (IT Lifecycle).</div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop:'1.5rem'}}>
        <div className="card">
          <h3 style={{marginBottom:'1rem', fontSize:'1.1rem'}}>التنبؤ بتآكل القيمة الدفترية (5 سنوات)</h3>
          <div className="chart-container" style={{height:'300px'}}>
            <Line data={{
              labels: ['2024', '2025', '2026', '2027', '2028'],
              datasets: [{
                label: 'صافي القيمة الدفترية المتوقعة (NBV)',
                data: [1850000, 1600000, 1300000, 950000, 600000],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                fill: true,
                tension: 0.4
              }]
            }} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="card">
          <h3 style={{marginBottom:'1rem', fontSize:'1.1rem'}}>توزيع استغلال الأصول (AI Clustering)</h3>
          <div className="chart-container" style={{height:'300px', display:'flex', justifyContent:'center'}}>
            <Doughnut data={{
              labels: ['أصول مستغلة بالكامل', 'أصول قيد الاستغلال الجزئي', 'أصول فائضة/غير مستغلة'],
              datasets: [{
                data: [65, 25, 10],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0
              }]
            }} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneralReports = () => {
    const totalCost = assets.reduce((acc, a) => acc + a.cost, 0);
    const totalDep = accountingEngine.reduce((acc, a) => acc + a.accumulatedDep, 0);
    const totalNBV = accountingEngine.reduce((acc, a) => acc + a.netBookValue, 0);
    
    return (
      <div className="view-anim">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem'}}>
          <div>
            <h2 style={{fontSize:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Database color="var(--accent)" /> التقارير والتحليلات المؤسسية</h2>
            <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>عرض شامل لأداء المحفظة الرأسمالية، تحليل الإهلاك، وحالة الامتثال.</p>
          </div>
          <button className="btn btn-primary" onClick={() => showToast('📥 جاري تصدير التقرير المؤسسي الشامل...')}><Download size={18} /> استخراج التقرير السنوي</button>
        </div>

        <div className="summary-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)', marginBottom:'2rem'}}>
          <div className="card" style={{borderRight:'4px solid var(--accent)'}}>
            <div className="val-sub">إجمالي التكلفة التاريخية</div>
            <div className="val-big" style={{fontSize:'1.2rem'}}>{totalCost.toLocaleString()} ر.س</div>
          </div>
          <div className="card" style={{borderRight:'4px solid var(--danger)'}}>
            <div className="val-sub">مجمع الإهلاك المتراكم</div>
            <div className="val-big" style={{fontSize:'1.2rem', color:'var(--danger)'}}>{totalDep.toLocaleString()} ر.س</div>
          </div>
          <div className="card" style={{borderRight:'4px solid var(--success)'}}>
            <div className="val-sub">صافي القيمة الدفترية (NBV)</div>
            <div className="val-big" style={{fontSize:'1.2rem', color:'var(--success)'}}>{totalNBV.toLocaleString()} ر.س</div>
          </div>
          <div className="card" style={{borderRight:'4px solid #f59e0b'}}>
            <div className="val-sub">العائد على الأصول (ROA)</div>
            <div className="val-big" style={{fontSize:'1.2rem', color:'#f59e0b'}}>14.2%</div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem', marginBottom:'1.5rem'}}>
          <div className="card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'1.1rem'}}>تحليل حالة الأصول (Asset Condition)</h3>
              <Activity size={20} color="var(--accent)" />
            </div>
            <div style={{height:'300px'}}>
              <Bar data={{
                labels: ['يعمل بكفاءة', 'يحتاج صيانة', 'تحت المستودع', 'تالف/إعدام'],
                datasets: [{
                  label: 'عدد الأصول',
                  data: [15, 3, 2, 1],
                  backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
                  borderRadius: 8
                }]
              }} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="card">
            <h3 style={{fontSize:'1.1rem', marginBottom:'1.5rem'}}>توزيع الفئات</h3>
            <div style={{height:'250px', display:'flex', justifyContent:'center'}}>
              <Doughnut data={{
                labels: ['تقنية', 'مركبات', 'مباني', 'أثاث'],
                datasets: [{
                  data: [40, 25, 20, 15],
                  backgroundColor: ['#6366f1', '#f43f5e', '#10b981', '#f59e0b'],
                  borderWidth: 0
                }]
              }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        </div>

        <div className="card" style={{background:'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border:'1px solid #bae6fd'}}>
          <div style={{display:'flex', gap:'1rem', alignItems:'flex-start'}}>
            <div style={{background:'white', padding:'0.75rem', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
              <TrendingUp color="#0369a1" size={24} />
            </div>
            <div>
              <h4 style={{color:'#0369a1', fontWeight:700, marginBottom:'0.5rem'}}>توصيات الذكاء الاصطناعي للتحسين (Report Insights)</h4>
              <ul style={{fontSize:'0.85rem', color:'#075985', paddingRight:'1.2rem', display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                <li>• يُلاحظ تركز 40% من الأصول في الفئة التقنية؛ نوصي بمراجعة عقود الصيانة الدورية لتقليل مخاطر التعطل.</li>
                <li>• معدل الإهلاك السنوي ارتفع بنسبة 5% نتيجة الاستحواذات الأخيرة، مما يتطلب مراجعة التدفقات النقدية التشغيلية.</li>
                <li>• هناك 3 أصول في "المستودع" منذ أكثر من 6 أشهر؛ نوصي بإعادة تخصيصها أو بيعها لتجنب تآكل قيمتها دون فائدة.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <div className="nav-label">الذكاء الاصطناعي (AI)</div>
          <div className={`nav-item ${view === 'ai-insights' ? 'active' : ''}`} onClick={() => setView('ai-insights')}>
            <Sparkles size={18} /> التحليلات التنبؤية
          </div>
        </div>

        <div className="nav-group">
          <div className="nav-label">التقارير</div>
          <div className={`nav-item ${view === 'reports' ? 'active' : ''}`} onClick={() => setView('reports')}><BarChart3 size={18} /> التقارير الشاملة</div>
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
          {view === 'reports' && renderGeneralReports()}
          {view === 'new-inventory' && renderNewInventory()}
          {view === 'ai-insights' && renderAIInsights()}
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

      <button 
        style={{position:'fixed', bottom:'2rem', left:'2rem', background:'var(--accent)', color:'white', width:'60px', height:'60px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 10px 25px rgba(59,130,246,0.5)', zIndex:9998, border:'none', cursor:'pointer', transition:'transform 0.2s'}}
        onClick={() => setIsChatOpen(true)}
      >
        <Bot size={28} />
      </button>

      {isChatOpen && (
        <div style={{position:'fixed', bottom:'5rem', left:'2rem', width:'350px', height:'500px', background:'var(--card-bg)', borderRadius:'16px', boxShadow:'0 15px 35px rgba(0,0,0,0.2)', zIndex:10000, display:'flex', flexDirection:'column', border:'1px solid var(--border)', overflow:'hidden', animation:'fadeIn 0.2s'}}>
          <div style={{background:'var(--accent)', color:'white', padding:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
              <Bot size={20} />
              <div style={{fontWeight:600}}>المساعد الذكي (Traouf AI)</div>
            </div>
            <button style={{background:'transparent', border:'none', color:'white', cursor:'pointer'}} onClick={() => setIsChatOpen(false)}><X size={20} /></button>
          </div>
          <div style={{flex:1, padding:'1rem', overflowY:'auto', display:'flex', flexDirection:'column', gap:'1rem', background:'var(--bg)'}}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end', background: msg.role === 'bot' ? 'var(--card-bg)' : 'var(--accent)', color: msg.role === 'bot' ? 'var(--text)' : 'white', padding:'0.75rem 1rem', borderRadius:'12px', maxWidth:'85%', fontSize:'0.85rem', border: msg.role === 'bot' ? '1px solid var(--border)' : 'none'}}>
                {msg.text}
              </div>
            ))}
          </div>
          <form style={{display:'flex', padding:'1rem', background:'var(--card-bg)', borderTop:'1px solid var(--border)', gap:'0.5rem'}} onSubmit={(e) => {
            e.preventDefault();
            if(!chatInput.trim()) return;
            setChatMessages([...chatMessages, {role: 'user', text: chatInput}]);
            const prevInput = chatInput;
            setChatInput('');
            setTimeout(() => {
              const botResponse = `بناءً على تحليلات قواعد بيانات الأصول، أود الإفادة بأن "${prevInput}" يعكس حالة استقرار مالي حالياً. لمزيد من الدقة يمكنني إعداد تقرير مخصص، هل ترغب في ذلك؟`;
              setChatMessages(prev => [...prev, {role: 'bot', text: botResponse}]);
              speak(botResponse);
            }, 1000);
          }}>
            <button type="button" onClick={startListening} style={{background: isListening ? '#ef4444' : 'var(--bg)', color: isListening ? 'white' : '#64748b', border:'1px solid var(--border)', borderRadius:'8px', width:'40px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', animation: isListening ? 'pulse 1.5s infinite' : 'none'}}>
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <input type="text" placeholder="اسأل أو تحدث مع الذكاء الاصطناعي..." value={chatInput} onChange={e => setChatInput(e.target.value)} style={{flex:1, padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', outline:'none'}} />
            <button type="submit" style={{background:'var(--accent)', color:'white', border:'none', borderRadius:'8px', width:'40px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}><Send size={16} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
