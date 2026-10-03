import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutGrid, Box, FileText, Shuffle, PieChart, ClipboardList, Settings, BarChart3, Database,
  TrendingUp, Activity, ShieldCheck, Calendar, AlertTriangle, CheckCircle, Filter, FilePlus,
  Edit, Trash2, Download, QrCode, Target, Shield, Laptop, Search, Bell, ChevronDown,
  MoreHorizontal, Bot, BrainCircuit, Sparkles, MessageSquare, Send, X, Zap, Mic, MicOff,
  Volume2, VolumeX, Plus, UserCircle, Warehouse, Package, PackageCheck, PackagePlus,
  RotateCcw, ScanLine, MapPin, ArrowRightLeft, TrendingDown, Eye, Boxes, Upload
} from 'lucide-react';
import { downloadTemplate, exportAssets, parseAssetsFile } from './assetExcel';
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
  RadialLinearScale,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
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
  Legend,
  RadialLinearScale,
  Filler
);

const DEPRECIATION_METHODS = {
  SL: 'القسط الثابت',
  DB: 'القسط المتناقص المضاعف',
  SYD: 'مجموع أرقام السنوات'
};

const F = ({ label, children, full }) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: full ? '1 / -1' : undefined}}>
    <label style={{fontSize: '0.85rem', fontWeight: 600}}>{label}</label>
    {children}
  </div>
);

import { supabase } from './supabaseClient';

const Login = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError('فشل إنشاء الحساب: ' + error.message);
      } else {
        setMessage('✅ تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        setIsSignUp(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('فشل تسجيل الدخول: البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else {
        onLogin(data.session);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', fontFamily:'"Tajawal", sans-serif', direction:'rtl'}}>
      <form onSubmit={handleAuth} style={{background:'var(--card-bg)', padding:'2.5rem', borderRadius:'24px', boxShadow:'0 25px 50px -12px rgba(0,0,0,0.5)', width:'400px', display:'flex', flexDirection:'column', gap:'1.25rem', border:'1px solid var(--border)'}}>
        <div style={{textAlign:'center', marginBottom:'1rem'}}>
          <div style={{background:'linear-gradient(135deg, var(--brand-teal), var(--brand-green))', width:'60px', height:'60px', borderRadius:'16px', display:'flex', justifyContent:'center', alignItems:'center', margin:'0 auto 1rem', boxShadow:'0 10px 15px -3px rgba(16,185,129,0.3)'}}>
             <Database size={32} color="white" />
          </div>
          <h2 style={{color:'var(--text)', fontSize:'1.5rem'}}>نظام إدارة الأصول V3.0</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.9rem', marginTop:'0.5rem'}}>
            {isSignUp ? 'إنشاء حساب جديد للمدير' : 'الرجاء تسجيل الدخول للمتابعة'}
          </p>
        </div>
        
        {error && <div style={{color:'#ef4444', background:'#fef2f2', padding:'0.75rem', borderRadius:'8px', fontSize:'0.85rem', textAlign:'center', border:'1px solid #fecaca'}}>{error}</div>}
        {message && <div style={{color:'#10b981', background:'#ecfdf5', padding:'0.75rem', borderRadius:'8px', fontSize:'0.85rem', textAlign:'center', border:'1px solid #a7f3d0'}}>{message}</div>}
        
        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
           <label style={{fontSize:'0.85rem', color:'var(--text-secondary)', fontWeight:600}}>البريد الإلكتروني</label>
           <input type="email" placeholder="أدخل بريدك الإلكتروني" value={email} onChange={e=>setEmail(e.target.value)} required style={{padding:'0.9rem', borderRadius:'12px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
           <label style={{fontSize:'0.85rem', color:'var(--text-secondary)', fontWeight:600}}>كلمة المرور</label>
           <input type="password" placeholder="أدخل كلمة المرور" value={password} onChange={e=>setPassword(e.target.value)} required style={{padding:'0.9rem', borderRadius:'12px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
        </div>
        <button type="submit" disabled={loading} style={{background:'linear-gradient(135deg, var(--brand-teal), var(--brand-green))', color:'white', padding:'1rem', borderRadius:'12px', border:'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight:800, fontSize:'1rem', marginTop:'1rem', boxShadow:'0 4px 6px -1px rgba(16,185,129,0.2)'}}>
          {loading ? 'جاري التحقق...' : (isSignUp ? 'إنشاء الحساب' : 'تسجيل الدخول')}
        </button>

        <div style={{textAlign:'center', marginTop:'0.5rem'}}>
           <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }} style={{background:'none', border:'none', color:'var(--brand-teal)', fontSize:'0.85rem', fontWeight:600, cursor:'pointer', textDecoration:'underline'}}>
             {isSignUp ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
           </button>
        </div>
      </form>
    </div>
  );
};

const Section = ({ title }) => (
  <div style={{gridColumn: '1 / -1', fontWeight: 800, color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginTop: '0.5rem'}}>{title}</div>
);

const App = () => {
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [view, setView] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterParams, setFilterParams] = useState({ query: '', category: 'الكل' });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{role: 'bot', text: 'أهلاً بك يا فيصل! أنا المساعد الذكي (Traouf AI). أراقب حالياً 20 أصلاً مؤسسياً، وألاحظ أن هناك 3 أصول تتطلب اهتمامك الفوري. كيف يمكنني مساعدتك اليوم؟'}]);
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const chatEndRef = useRef(null);

  // Warehouse RADAR State
  const [warehouseItems, setWarehouseItems] = useState([
    { id: 'WH-001', sku: 'IT-SKU-101', name: 'لابتوب ديل XPS 15', category: 'أصول تقنية', qty: 12, minQty: 5, location: 'A-01-03', status: 'متاح', stage: 'Deploy', lastAudit: '2024-08-15' },
    { id: 'WH-002', sku: 'OF-SKU-202', name: 'مكتب إداري فاخر', category: 'أثاث ومعدات', qty: 3, minQty: 2, location: 'B-02-01', status: 'مخصص', stage: 'Allocate', lastAudit: '2024-07-20' },
    { id: 'WH-003', sku: 'VH-SKU-303', name: 'سيارة نقل تويوتا هايلكس', category: 'مركبات', qty: 1, minQty: 1, location: 'G-01-01', status: 'صيانة', stage: 'Audit', lastAudit: '2024-09-01' },
    { id: 'WH-004', sku: 'IT-SKU-104', name: 'طابعة HP LaserJet Pro', category: 'أصول تقنية', qty: 25, minQty: 10, location: 'A-02-05', status: 'متاح', stage: 'Deploy', lastAudit: '2024-08-28' },
    { id: 'WH-005', sku: 'OF-SKU-205', name: 'كرسي مكتبي مريح', category: 'أثاث ومعدات', qty: 0, minQty: 5, location: 'B-03-02', status: 'نفاد', stage: 'Receive', lastAudit: '2024-06-10' },
    { id: 'WH-006', sku: 'IT-SKU-106', name: 'شاشة عرض تفاعلية 65 بوصة', category: 'أصول تقنية', qty: 4, minQty: 2, location: 'C-01-01', status: 'متاح', stage: 'Deploy', lastAudit: '2024-09-10' },
    { id: 'WH-007', sku: 'VH-SKU-307', name: 'رافعة شوكية كاتربيلر', category: 'مركبات', qty: 2, minQty: 1, location: 'G-02-01', status: 'متاح', stage: 'Deploy', lastAudit: '2024-09-05' },
    { id: 'WH-008', sku: 'OF-SKU-208', name: 'مكيف مركزي سبليت', category: 'أثاث ومعدات', qty: 8, minQty: 3, location: 'D-01-04', status: 'تالف', stage: 'Retire', lastAudit: '2024-05-20' },
  ]);
  const [warehouseFilter, setWarehouseFilter] = useState('الكل');
  const [viewAsset, setViewAsset] = useState(null);
  const [viewWarehouse, setViewWarehouse] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const importInputRef = useRef(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [fiscalYear, setFiscalYear] = useState('2026');
  const [erpConnected, setErpConnected] = useState(true);
  const [chartMode, setChartMode] = useState('hist');

  const editWarehouseItem = (item) => {
    const qty = window.prompt(`الكمية الجديدة للصنف "${item.name}":`, String(item.qty));
    if (qty === null) return;
    const q = parseInt(qty, 10);
    if (isNaN(q) || q < 0) { showToast('⚠️ كمية غير صحيحة'); return; }
    const loc = window.prompt('الموقع (Bin):', item.location);
    if (loc === null) return;
    const status = q === 0 ? 'نفاد' : (item.status === 'نفاد' ? 'متاح' : item.status);
    setWarehouseItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: q, location: loc.trim() || i.location, status } : i));
    showToast('✅ تم تحديث بيانات الصنف');
  };

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

  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (session) {
      fetchAssets();
    }
  }, [session]);

  const fetchAssets = async () => {
    // جلب الأصول من قاعدة البيانات الحقيقية
    const { data, error } = await supabase.from('assets').select('*');
    if (error) {
      console.error(error);
      return;
    }
    
    if (data && data.length > 0) {
      const mappedAssets = data.map(item => ({
        id: item.asset_no,
        db_id: item.id,
        code: item.qr_code || 'QR-N/A',
        name: item.name,
        category: item.category_id || 'أخرى',
        cost: Number(item.cost) || 0,
        vat: 0,
        salvage: Number(item.salvage_value) || 0,
        life: 5,
        date: item.purchase_date || '2024-01-01',
        method: 'SL',
        status: item.status || 'يعمل',
        custody: 'موظف',
        source: 'مورد',
        isExpense: false
      }));
      setAssets(mappedAssets);
    } else {
      // لو قاعدة البيانات فارغة، نضع مصفوفة فارغة 
      setAssets([]);
    }
  };

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
      const startDate = new Date(asset.readyDate || asset.date);
      const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
      const yearsElapsed = Math.max(0, monthsElapsed / 12);
      const cost = asset.cost || 0;
      const salvage = asset.salvage || 0;
      const life = asset.life || 1;
      
      if (asset.isExpense) {
        return { ...asset, accumulatedDep: cost, netBookValue: 0, annualDep: 0, periodDep: 0 };
      }

      if (asset.category === 'أراضي') {
        return { ...asset, accumulatedDep: 0, netBookValue: cost, annualDep: 0, periodDep: 0 };
      }

      let accumulatedDep = 0;
      let annualDep = 0;
      if (asset.method === 'SL') {
        annualDep = (cost - salvage) / life;
        accumulatedDep = Math.min(cost - salvage, annualDep * yearsElapsed);
      } else if (asset.method === 'DB') {
        const rate = (2 / life);
        let bookValue = cost;
        for(let i=0; i < Math.floor(yearsElapsed); i++) {
          bookValue -= bookValue * rate;
        }
        accumulatedDep = cost - Math.max(salvage, bookValue);
        annualDep = Math.max(0, Math.min(bookValue * rate, bookValue - salvage));
      } else if (asset.method === 'SYD') {
        const sum = (life * (life + 1)) / 2;
        let dep = 0;
        for(let i=0; i < Math.floor(yearsElapsed); i++) {
          dep += (cost - salvage) * (Math.max(0, life - i) / sum);
        }
        accumulatedDep = Math.min(cost - salvage, dep);
        annualDep = (cost - salvage) * (Math.max(0, life - Math.floor(yearsElapsed)) / sum);
      }

      const fullyDepreciated = accumulatedDep >= cost - salvage - 0.5;
      return {
        ...asset,
        accumulatedDep,
        netBookValue: cost - accumulatedDep,
        annualDep: fullyDepreciated ? 0 : annualDep,
        periodDep: fullyDepreciated ? 0 : annualDep,
      };
    });
  }, [assets]);

  const notifications = useMemo(() => {
    const list = [];
    accountingEngine.filter(a => a.category !== 'أراضي' && !a.isExpense && a.cost > 0 && a.accumulatedDep / a.cost >= 0.8).slice(0, 3).forEach(a =>
      list.push({ text: `⚠️ ${a.name}: استُهلك أكثر من 80% من قيمته (إحلال مقترح)`, action: () => setViewAsset(a) }));
    accountingEngine.filter(a => a.status === 'تالف').slice(0, 3).forEach(a =>
      list.push({ text: `🛠️ أصل تالف: ${a.name}`, action: () => setViewAsset(a) }));
    warehouseItems.filter(i => i.qty <= i.minQty).slice(0, 3).forEach(i =>
      list.push({ text: `📦 مخزون ${i.qty === 0 ? 'نافد' : 'منخفض'}: ${i.name}`, action: () => setView('warehouse') }));
    return list;
  }, [accountingEngine, warehouseItems]);

  const totals = useMemo(() => {
    return accountingEngine.reduce((acc, curr) => ({
      cost: acc.cost + curr.cost,
      dep: acc.dep + curr.accumulatedDep,
      nbv: acc.nbv + curr.netBookValue
    }), { cost: 0, dep: 0, nbv: 0 });
  }, [accountingEngine]);

  const chartData = {
    labels: accountingEngine.slice(0, 8).map(a => a.name.substring(0, 15)),
    datasets: chartMode === 'hist' ? [
      { type: 'line', label: 'صافي القيمة', data: accountingEngine.slice(0, 8).map(a => a.netBookValue), borderColor: '#f59e0b', backgroundColor: '#f59e0b', tension: 0.4 },
      { type: 'bar', label: 'التكلفة التاريخية', data: accountingEngine.slice(0, 8).map(a => a.cost), backgroundColor: '#0f172a', borderRadius: 4 },
      { type: 'bar', label: 'الإهلاك المتراكم', data: accountingEngine.slice(0, 8).map(a => a.accumulatedDep), backgroundColor: '#0d9488', borderRadius: 4 }
    ] : [
      { type: 'line', label: 'القيمة الدفترية المتوقعة بعد سنة', data: accountingEngine.slice(0, 8).map(a => Math.max(a.category === 'أراضي' ? a.cost : a.salvage || 0, a.netBookValue - (a.annualDep || 0))), borderColor: '#8b5cf6', backgroundColor: '#8b5cf6', tension: 0.4 },
      { type: 'bar', label: 'صافي القيمة الحالية', data: accountingEngine.slice(0, 8).map(a => a.netBookValue), backgroundColor: '#0f172a', borderRadius: 4 },
      { type: 'bar', label: 'إهلاك السنة القادمة', data: accountingEngine.slice(0, 8).map(a => Math.min(a.netBookValue, a.annualDep || 0)), backgroundColor: '#ef4444', borderRadius: 4 }
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
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>مؤشرات الأداء الرئيسية، تقييم المخاطر المباشرة، والعائد على المحافظ الرأسمالية.</p>
        </div>
        <div style={{display:'flex', gap:'0.5rem'}}>
           <button className="btn btn-ghost" style={{border:'1px solid var(--border)'}} onClick={exportCSV}><Download size={16} /> تقرير الأداء</button>
           <button className="btn btn-primary" onClick={() => setView('new-asset')}><Plus size={16} /> أصل جديد</button>
        </div>
      </div>

      <div className="summary-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)', marginBottom:'2rem'}}>
        <div className="card" style={{position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:0, left:0, width:'4px', height:'100%', background:'#0f172a'}}></div>
          <div className="stat-icon" style={{background: '#f1f5f9'}}><Database size={20} color="#0f172a" /></div>
          <div className="val-sub">إجمالي المحفظة الرأسمالية</div>
          <div className="val-big" style={{fontSize:'1.4rem'}}>{totals.cost.toLocaleString()} <span style={{fontSize:'0.8rem', fontWeight:400}}>ر.س</span></div>
          <div className="val-sub" style={{color: '#10b981', fontWeight:700}}><TrendingUp size={12} /> +12.4% نمو سنوي</div>
        </div>
        <div className="card" style={{position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:0, left:0, width:'4px', height:'100%', background:'#0d9488'}}></div>
          <div className="stat-icon" style={{background: '#f0fdfa'}}><ShieldCheck size={20} color="#0d9488" /></div>
          <div className="val-sub">صافي ثروة الأصول (NBV)</div>
          <div className="val-big" style={{fontSize:'1.4rem'}}>{totals.nbv.toLocaleString()} <span style={{fontSize:'0.8rem', fontWeight:400}}>ر.س</span></div>
          <div className="val-sub">نسبة السيولة الرأسمالية: 68%</div>
        </div>
        <div className="card" style={{position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:0, left:0, width:'4px', height:'100%', background:'#ef4444'}}></div>
          <div className="stat-icon" style={{background: '#fef2f2'}}><Activity size={20} color="#ef4444" /></div>
          <div className="val-sub">مجمع الإهلاك المتراكم</div>
          <div className="val-big" style={{fontSize:'1.4rem', color:'#ef4444'}}>{totals.dep.toLocaleString()} <span style={{fontSize:'0.8rem', fontWeight:400}}>ر.س</span></div>
          <div className="val-sub" style={{color:'#ef4444', fontWeight:600}}>معدل التآكل: {((totals.dep/totals.cost)*100).toFixed(1)}%</div>
        </div>
        <div className="card" style={{position:'relative', overflow:'hidden', background:'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', borderColor:'#c7d2fe'}}>
          <div style={{position:'absolute', top:0, left:0, width:'4px', height:'100%', background:'#8b5cf6'}}></div>
          <div className="stat-icon" style={{background: '#f3e8ff'}}><BrainCircuit size={20} color="#8b5cf6" /></div>
          <div className="val-sub" style={{fontWeight:700, color:'#4f46e5'}}>نقاط القوة الاستراتيجية</div>
          <div className="val-big" style={{color:'#8b5cf6'}}>92 / 100</div>
          <div className="val-sub">تصنيف: مؤسسة رائدة مالياً</div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem', marginBottom:'1.5rem'}}>
        <div className="card">
           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'1.1rem'}}>تحليل القيمة مقابل الاستهلاك (أهم الأصول)</h3>
              <div style={{display:'flex', gap:'0.5rem'}}>
                 <button className={`btn ${chartMode === 'hist' ? 'btn-primary' : 'btn-ghost'}`} style={{fontSize:'0.7rem', padding:'0.3rem 0.6rem'}} onClick={() => setChartMode('hist')}>تاريخي</button>
                 <button className={`btn ${chartMode === 'fore' ? 'btn-primary' : 'btn-ghost'}`} style={{fontSize:'0.7rem', padding:'0.3rem 0.6rem'}} onClick={() => setChartMode('fore')}>توقعي</button>
              </div>
           </div>
           <div style={{height:'350px'}}>
              <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
           </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
           <div className="card" style={{background:'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color:'white', border:'none', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontSize:'1rem', marginBottom:'1.25rem', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'0.75rem'}}>النبض المؤسسي للأصول</h3>
              <div style={{display:'flex', flexDirection:'column', gap:'1.25rem'}}>
                 <div>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'0.5rem'}}>
                       <span>كفاءة استخدام الأصول</span>
                       <span style={{color:'#10b981', fontWeight:700}}>88%</span>
                    </div>
                    <div style={{height:'6px', background:'rgba(255,255,255,0.1)', borderRadius:'3px', overflow:'hidden'}}>
                       <div style={{width:'88%', background:'#10b981', height:'100%'}}></div>
                    </div>
                 </div>
                 <div>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'0.5rem'}}>
                       <span>الامتثال لمعايير الجرد</span>
                       <span style={{color:'#3b82f6', fontWeight:700}}>94%</span>
                    </div>
                    <div style={{height:'6px', background:'rgba(255,255,255,0.1)', borderRadius:'3px', overflow:'hidden'}}>
                       <div style={{width:'94%', background:'#3b82f6', height:'100%'}}></div>
                    </div>
                 </div>
                 <div>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'0.5rem'}}>
                       <span>جاهزية خطة الإحلال</span>
                       <span style={{color:'#f59e0b', fontWeight:700}}>72%</span>
                    </div>
                    <div style={{height:'6px', background:'rgba(255,255,255,0.1)', borderRadius:'3px', overflow:'hidden'}}>
                       <div style={{width:'72%', background:'#f59e0b', height:'100%'}}></div>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="card">
              <h3 style={{fontSize:'1rem', marginBottom:'1rem'}}>آخر التحديثات اللحظية</h3>
              <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                 {[
                   {icon: <Shuffle size={14}/>, text: 'تحويل أصل: طابعة ليزر -> المبيعات', time: 'منذ 5 د', color: '#6366f1'},
                   {icon: <FileText size={14}/>, text: 'ترحيل قيد إهلاك: يونيو 2024', time: 'منذ ساعة', color: '#10b981'},
                   {icon: <Box size={14}/>, text: 'تسجيل أصل: لابتوب ديل XPS', time: 'منذ ساعتين', color: '#f59e0b'},
                 ].map((act, idx) => (
                   <div key={idx} style={{display:'flex', gap:'0.75rem', alignItems:'center', paddingBottom:'0.75rem', borderBottom: idx < 2 ? '1px solid #f1f5f9' : 'none'}}>
                      <div style={{background: act.color + '15', color: act.color, padding:'0.5rem', borderRadius:'10px'}}>{act.icon}</div>
                      <div style={{flex:1}}>
                         <div style={{fontSize:'0.8rem', fontWeight:600, color:'#1e293b'}}>{act.text}</div>
                         <div style={{fontSize:'0.65rem', color:'var(--text-muted)'}}>{act.time}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:'1.5rem'}}>
         <div className="card">
            <h3 style={{fontSize:'1.1rem', marginBottom:'1.5rem'}}>توزيع المحفظة (فئات)</h3>
            <div style={{height:'250px'}}>
               <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } } }} />
            </div>
         </div>
         <div className="card" style={{display:'flex', gap:'2rem'}}>
            <div style={{flex:1}}>
               <h3 style={{fontSize:'1.1rem', marginBottom:'1.5rem'}}>تقييم المخاطر (AI Radar)</h3>
               <div style={{height:'250px'}}>
                  <Radar data={{
                    labels: ['العمر الافتراضي', 'تكلفة الصيانة', 'معدل الاستخدام', 'مخاطر السوق', 'القيمة الاستردادية'],
                    datasets: [{
                      label: 'تحليل المخاطر',
                      data: [42, 35, 60, 20, 80],
                      backgroundColor: 'rgba(139, 92, 246, 0.2)',
                      borderColor: '#8b5cf6',
                      pointBackgroundColor: '#8b5cf6'
                    }]
                  }} options={{ responsive: true, maintainAspectRatio: false }} />
               </div>
            </div>
            <div style={{flex:1, borderRight:'1px solid var(--border)', paddingRight:'2rem', display:'flex', flexDirection:'column', justifyContent:'center'}}>
               <div style={{background:'#fdf2f8', color:'#9d174d', padding:'1.5rem', borderRadius:'16px', fontSize:'0.9rem', border:'1px solid #fbcfe8', position:'relative'}}>
                  <Sparkles size={24} style={{position:'absolute', top:'-12px', right:'-12px', background:'white', borderRadius:'50%', padding:'4px', boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}} />
                  <h4 style={{fontWeight:800, marginBottom:'0.75rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><AlertTriangle size={18} /> نصيحة Traouf AI الاستراتيجية</h4>
                  <p style={{lineHeight:1.6}}>يلاحظ وجود تآكل متسارع في قيمة "الأصول التقنية" مقارنة بنظيراتها في السوق. نوصي بتفعيل **عقود الضمان الممتد** فوراً وإعادة تقييم العمر الإنتاجي للخوادم المركزية لتجنب خسائر رأسمالية غير متوقعة بنهاية السنة المالية.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const exportCSV = () => {
    showToast('جاري تحضير ملف Excel...');
    setTimeout(() => {
      exportAssets(accountingEngine);
      showToast('✅ تم تصدير ملف Excel بنجاح!');
    }, 300);
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const result = await parseAssetsFile(file);
      if (result.total === 0) {
        showToast('⚠️ الملف لا يحتوي على بيانات. استخدم نموذج التعبئة.');
        return;
      }
      setImportPreview(result);
    } catch (err) {
      console.error(err);
      showToast('❌ تعذّرت قراءة الملف، تأكد أنه بصيغة Excel صحيحة');
    }
  };

  const confirmImport = () => {
    if (!importPreview) return;
    let added = 0, updated = 0;
    let next = [...assets];
    importPreview.rows.forEach(({ data }, i) => {
      const cost = data.cost;
      const life = data.life || 1;
      const base = {
        ...data,
        life,
        vat: data.vat || 0,
        salvage: data.salvage || 0,
        method: data.method || 'SL',
        status: data.status || 'يعمل',
        source: data.source || '',
        isExpense: data.category !== 'أراضي' && (cost < 3000 || data.life < 1)
      };
      const idx = data.id ? next.findIndex(a => a.id === data.id) : -1;
      if (idx >= 0) {
        next[idx] = { ...next[idx], ...base, code: next[idx].code };
        updated++;
      } else {
        const id = data.id || `AST-${Date.now().toString().slice(-6)}${i}`;
        next.push({ ...base, id, code: `CD-${Math.floor(Math.random()*9000 + 1000)}` });
        added++;
      }
    });
    setAssets(next);
    setImportPreview(null);
    showToast(`✅ تم الاستيراد: ${added} أصل جديد، ${updated} محدّث`);
  };

  const renderRegister = () => {
    const filteredAssets = accountingEngine.filter(a => {
      const q = filterParams.query.trim().toLowerCase();
      const matchQuery = !q || [a.name, a.code, a.id, a.location, a.custody, a.supplier, a.department].some(v => (v || '').toString().toLowerCase().includes(q));
      const matchCat = filterParams.category === 'الكل' || a.category === filterParams.category;
      return matchQuery && matchCat;
    });

    const activeAssets = accountingEngine.filter(a => a.status === 'يعمل').length;
    const alertAssets = accountingEngine.filter(a => a.accumulatedDep >= a.cost * 0.8 && a.category !== 'أراضي').length;

    return (
      <div className="view-anim">
        <div style={{background:'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding:'2rem', borderRadius:'16px', color:'white', marginBottom:'2rem', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.5)', display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1.5rem'}}>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.5rem'}}>القيمة الرأسمالية الإجمالية</div>
            <div style={{fontSize:'1.5rem', fontWeight:800}}>{totals.cost.toLocaleString()} <span style={{fontSize:'0.8rem', fontWeight:400, opacity:0.7}}>ر.س</span></div>
          </div>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.5rem'}}>صافي ثروة الأصول (NBV)</div>
            <div style={{fontSize:'1.5rem', fontWeight:800, color:'#34d399'}}>{totals.nbv.toLocaleString()} <span style={{fontSize:'0.8rem', fontWeight:400, opacity:0.7}}>ر.س</span></div>
          </div>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.5rem'}}>الأصول المتاحة للخدمة</div>
            <div style={{fontSize:'1.5rem', fontWeight:800, color:'#fbbf24'}}>{activeAssets} <span style={{fontSize:'0.8rem', fontWeight:400, opacity:0.7}}>أصل</span></div>
          </div>
          <div>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.5rem'}}>توصيات الإحلال النشطة</div>
            <div style={{fontSize:'1.5rem', fontWeight:800, color:'#fb7185'}}>{alertAssets} <span style={{fontSize:'0.8rem', fontWeight:400, opacity:0.7}}>تنبيه</span></div>
          </div>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
          <h2 style={{fontSize:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Box size={28} color="var(--accent)" /> السجل المركزي للأصول الثابتة (FAR)</h2>
          <div style={{display:'flex', gap:'0.5rem'}}>
            <button className="btn btn-ghost" style={{color:'var(--accent)', background: 'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)'}} onClick={() => setShowScanner(true)}>
              <QrCode size={18} /> المسح الميداني النشط
            </button>
            <div style={{width:'1px', background:'var(--border)', margin:'0 0.5rem'}}></div>
            <button className={`btn btn-ghost ${showFilter ? 'b-active' : ''}`} onClick={() => setShowFilter(!showFilter)} style={{padding:'0.6rem 1.2rem'}}><Filter size={18} /> تصفية السجل</button>
            <button className="btn btn-ghost" style={{padding:'0.6rem 1.2rem'}} title="تنزيل نموذج Excel فارغ للتعبئة" onClick={() => { downloadTemplate(); showToast('📄 تم تنزيل نموذج التعبئة'); }}><FileText size={18} /> نموذج التعبئة</button>
            <button className="btn btn-ghost" style={{padding:'0.6rem 1.2rem'}} title="رفع ملف Excel معبّأ" onClick={() => importInputRef.current?.click()}><Upload size={18} /> استيراد Excel</button>
            <button className="btn btn-ghost" style={{padding:'0.6rem 1.2rem'}} title="تصدير السجل الحالي" onClick={exportCSV}><Download size={18} /> تصدير Excel</button>
            <button className="btn btn-primary" style={{padding:'0.6rem 1.5rem'}} onClick={() => { setEditingAsset(null); setView('new-asset'); }}><FilePlus size={18} /> إضافة أصل جديد</button>
          </div>
        </div>

        {showFilter && (
          <div style={{display:'flex', gap:'1rem', marginBottom:'1.5rem', padding:'1.5rem', background:'var(--card-bg)', borderRadius:'12px', border:'1px solid var(--border)', animation:'slideDown 0.3s ease-out', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
            <div style={{flex:1}}>
               <label style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'0.5rem', display:'block'}}>البحث الذكي (الاسم، الرمز، المعرف)</label>
               <input type="text" placeholder="مثال: لابتوب، AST-1234..." value={filterParams.query} onChange={e => setFilterParams({...filterParams, query: e.target.value})} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
            </div>
            <div style={{width:'250px'}}>
               <label style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'0.5rem', display:'block'}}>الفئة التصنيفية</label>
               <select value={filterParams.category} onChange={e => setFilterParams({...filterParams, category: e.target.value})} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}}>
                 <option value="الكل">جميع الفئات</option>
                 <option value="أراضي">أراضي</option>
                 <option value="مباني">مباني</option>
                 <option value="أصول تقنية">أصول تقنية</option>
                 <option value="مركبات">مركبات</option>
                 <option value="أصول أوقاف">أصول أوقاف</option>
               </select>
            </div>
          </div>
        )}

        <div className="table-wrapper" style={{background:'var(--card-bg)', borderRadius:'16px', border:'1px solid var(--border)', overflowX:'auto', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.05)'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead style={{background:'#f8fafc', borderBottom:'2px solid var(--border)'}}>
            <tr>
              <th style={{padding:'1.2rem 1rem', textAlign:'right'}}>رقم الأصل</th>
              <th style={{padding:'1.2rem 1rem', textAlign:'right'}}>وصف الأصل وفئته</th>
              <th style={{padding:'1.2rem 1rem', textAlign:'right'}}>الموقع والإدارة والعهدة</th>
              <th style={{padding:'1.2rem 1rem', textAlign:'right'}}>المورد والفاتورة والتواريخ</th>
              <th style={{padding:'1.2rem 1rem', textAlign:'right'}}>التكلفة ومصدر التمويل</th>
              <th style={{padding:'1.2rem 1rem', textAlign:'right'}}>الإهلاك (الفترة / المجمع)</th>
              <th style={{padding:'1.2rem 1rem', textAlign:'right'}}>القيمة الدفترية</th>
              <th style={{padding:'1.2rem 1rem', textAlign:'center'}}>الحالة وآخر جرد</th>
              <th style={{padding:'1.2rem 1rem', textAlign:'center'}}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset, index) => {
              const depPerc = asset.category === 'أراضي' ? 0 : (asset.accumulatedDep / asset.cost) * 100;
              const healthScore = Math.max(0, 100 - depPerc);
              const isWarning = depPerc >= 80 && asset.category !== 'أراضي';
              const statusColor = { 'يعمل': '#10b981', 'بالمستودع': '#3b82f6', 'تالف': '#ef4444', 'مستبعد': '#6b7280' }[asset.status] || '#64748b';
              const small = {fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.25rem'};
              
              return (
              <tr key={asset.id} style={{borderBottom:'1px solid var(--border)', background: index % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)', transition:'background 0.2s'}} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'} onMouseLeave={e => e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)'}>
                <td style={{padding:'1.2rem 1rem'}}>
                  <div style={{color:'var(--accent)', fontWeight:800, display:'flex', alignItems:'center', gap:'0.4rem'}}><QrCode size={14} /> {asset.id}</div>
                  <div style={{fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'0.25rem', fontFamily:'monospace'}}>{asset.code}</div>
                </td>
                <td style={{padding:'1.2rem 1rem'}}>
                  <div style={{fontWeight:700, color:'var(--text)', fontSize:'0.95rem'}}>{asset.name}</div>
                  <div style={small}>{asset.category} <span style={{margin:'0 0.3rem', opacity:0.5}}>|</span> {DEPRECIATION_METHODS[asset.method]} <span style={{margin:'0 0.3rem', opacity:0.5}}>|</span> {asset.category === 'أراضي' ? 'بدون عمر' : `${asset.life} سنة`}</div>
                </td>
                <td style={{padding:'1.2rem 1rem'}}>
                  <div style={{fontWeight:600, fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'0.3rem'}}><MapPin size={12} color="#64748b" /> {asset.location || '-'}</div>
                  <div style={small}>الإدارة: {asset.department || '-'}</div>
                  <div style={{...small, display:'flex', alignItems:'center', gap:'0.3rem'}}><UserCircle size={12} color="#64748b" /> {asset.custody || '-'}</div>
                </td>
                <td style={{padding:'1.2rem 1rem'}}>
                  <div style={{fontWeight:600, fontSize:'0.85rem'}}>{asset.supplier || '-'}</div>
                  <div style={small}>فاتورة: {asset.invoiceNo || '-'}</div>
                  <div style={small}>شراء: {asset.date || '-'} | استلام: {asset.receiptDate || '-'}</div>
                  <div style={small}>جاهزية: {asset.readyDate || '-'}</div>
                </td>
                <td style={{padding:'1.2rem 1rem', fontWeight:700}}>
                  <div>{(asset.cost + (asset.vat || 0)).toLocaleString()} <span style={{fontSize:'0.7rem', fontWeight:400}}>ر.س</span></div>
                  <div style={{...small, fontWeight:400}}>التمويل: {asset.source || '-'}</div>
                </td>
                <td style={{padding:'1.2rem 1rem'}}>
                  <div style={{width:'100%', height:'6px', background:'#f1f5f9', borderRadius:'3px', overflow:'hidden', marginBottom:'0.4rem', border:'1px solid #e2e8f0'}}>
                     <div style={{width:`${Math.min(100, depPerc)}%`, background: depPerc > 80 ? '#ef4444' : depPerc > 50 ? '#f59e0b' : '#3b82f6', height:'100%'}}></div>
                  </div>
                  <div style={{fontSize:'0.75rem', fontWeight:600}}>للفترة: {Math.round(asset.periodDep).toLocaleString()}</div>
                  <div style={{fontSize:'0.7rem', fontWeight:600, color: depPerc > 80 ? '#ef4444' : 'var(--text-muted)'}}>مجمع: {Math.round(asset.accumulatedDep).toLocaleString()} ({depPerc.toFixed(1)}%)</div>
                </td>
                <td style={{padding:'1.2rem 1rem', fontWeight:800, color:'#0f172a', fontSize:'1rem'}}>{Math.round(asset.netBookValue).toLocaleString()} <span style={{fontSize:'0.7rem', fontWeight:400}}>ر.س</span></td>
                <td style={{padding:'1.2rem 1rem', textAlign:'center'}}>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'0.4rem'}}>
                    <span style={{background: statusColor + '20', color: statusColor, padding:'0.2rem 0.7rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700}}>{asset.status}</span>
                    <div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>آخر جرد: {asset.lastInventory || '-'}</div>
                    <div style={{display:'flex', alignItems:'center', gap:'0.4rem'}}>
                       <div style={{width:'10px', height:'10px', borderRadius:'50%', background: healthScore > 70 ? '#10b981' : healthScore > 30 ? '#f59e0b' : '#ef4444'}}></div>
                       <span style={{fontWeight:800, fontSize:'0.8rem'}}>{healthScore.toFixed(0)}%</span>
                    </div>
                    {isWarning && <span style={{fontSize:'0.65rem', background:'#fee2e2', color:'#b91c1c', padding:'0.2rem 0.6rem', borderRadius:'20px', fontWeight:700, border:'1px solid #fecaca'}}>إحلال مقترح</span>}
                    {asset.disposalDate && <span style={{fontSize:'0.65rem', color:'#6b7280'}}>استبعاد: {asset.disposalDate}{asset.disposalReason ? ` (${asset.disposalReason})` : ''}</span>}
                  </div>
                </td>
                <td style={{padding:'1.2rem 1rem', textAlign:'center'}}>
                  <div style={{display:'flex', justifyContent:'center', gap:'0.5rem'}}>
                    <button className="btn btn-ghost" style={{padding:'0.5rem', background:'#eff6ff', borderRadius:'8px'}} title="عرض" onClick={() => setViewAsset(asset)}><Eye size={16} color="#3b82f6" /></button>
                    <button className="btn btn-ghost" style={{padding:'0.5rem', background:'#f1f5f9', borderRadius:'8px'}} title="تعديل" onClick={() => { setEditingAsset(asset); setView('new-asset'); }}><Edit size={16} color="#475569" /></button>
                    <button className="btn btn-ghost" style={{padding:'0.5rem', background:'#fef2f2', borderRadius:'8px'}} title="حذف" onClick={() => deleteAsset(asset.id)}><Trash2 size={16} color="#ef4444" /></button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
        {filteredAssets.length === 0 && <div style={{padding:'5rem', textAlign:'center', color:'var(--text-muted)'}}><Box size={64} color="#e2e8f0" style={{margin:'0 auto 1.5rem'}} />لا توجد أصول مطابقة لمعايير البحث الحالية.</div>}
      </div>
    </div>
    );
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const g = (k) => (fd.get(k) || '').toString().trim();
    const n = (k) => parseFloat(fd.get(k) || 0) || 0;
    const cost = n('cost');
    const life = n('life');
    const categoryName = g('category');

    const typedId = g('id'); // this acts as asset_no
    
    // Check if duplicate in UI state
    if (!editingAsset && typedId && assets.some(a => a.id === typedId)) {
      showToast('⚠️ رقم الأصل مستخدم من قبل، اختر رقماً آخر');
      return;
    }
    
    const asset_no = editingAsset ? editingAsset.id : (typedId || `AST-${Date.now().toString().slice(-6)}`);
    const name = g('name');
    const qr_code = editingAsset ? editingAsset.code : (g('code') || `CD-${Math.floor(Math.random()*9000 + 1000)}`);
    const purchase_date = g('date') || new Date().toISOString().split('T')[0];
    const salvage_value = n('salvage');
    const status = g('status') || 'يعمل';

    const dbRecord = {
      asset_no,
      name,
      description: '',
      cost,
      salvage_value,
      purchase_date,
      status,
      qr_code
    };

    if (editingAsset) {
      const { error } = await supabase.from('assets').update(dbRecord).eq('id', editingAsset.db_id);
      if (error) {
         showToast('❌ حدث خطأ أثناء التحديث: ' + error.message);
         return;
      }
      showToast('✅ تم تحديث بيانات الأصل بنجاح');
    } else {
      const { error } = await supabase.from('assets').insert([dbRecord]);
      if (error) {
         showToast('❌ حدث خطأ أثناء الإضافة: ' + error.message);
         return;
      }
      showToast('✅ تم تسجيل الأصل الجديد بنجاح');
    }
    
    await fetchAssets();
    setEditingAsset(null);
    setView('register');
  };

  const renderNewAsset = () => {
    const ea = editingAsset;
    const inp = {padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', width: '100%'};
    return (
    <div className="view-anim">
      <div style={{marginBottom:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2 style={{fontSize:'1.25rem'}}>{ea ? 'تعديل بيانات الأصل' : 'تسجيل أصل جديد'}</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>{ea ? `تعديل الأصل: ${ea.name}` : 'أدخل بيانات الأصل الثابت كاملة وفق متطلبات سجل الأصول الثابتة'}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => { setEditingAsset(null); setView('register'); }}>عودة للسجل</button>
      </div>
      <div className="card" style={{maxWidth: '980px', background: 'var(--card-bg)'}}>
        <form key={ea ? ea.id : 'new'} onSubmit={handleAddAsset} style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem'}}>
          <Section title="1) تعريف الأصل" />
          <F label="رقم الأصل (اتركه فارغاً للإنشاء التلقائي)"><input name="id" type="text" defaultValue={ea?.id} readOnly={!!ea} placeholder="AST-0001" style={inp} /></F>
          <F label="وصف الأصل *"><input name="name" type="text" defaultValue={ea?.name} placeholder="مثال: سيارة نقل تويوتا" required style={inp} /></F>
          <F label="فئة الأصل *">
            <select name="category" defaultValue={ea?.category || 'أصول تقنية'} required style={inp}>
              {['أراضي','مباني','مركبات','أصول تقنية','أثاث ومعدات','أصول أوقاف'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </F>

          <Section title="2) الموقع والإدارة والموظف / العهدة" />
          <F label="الموقع"><input name="location" type="text" defaultValue={ea?.location} placeholder="مثال: الرياض - المستودع" style={inp} /></F>
          <F label="الإدارة"><input name="department" type="text" defaultValue={ea?.department} placeholder="مثال: إدارة النقل" style={inp} /></F>
          <F label="الموظف / العهدة"><input name="custody" type="text" defaultValue={ea?.custody} placeholder="مثال: أحمد سالم" style={inp} /></F>

          <Section title="3) المورد ورقم الفاتورة" />
          <F label="المورد"><input name="supplier" type="text" defaultValue={ea?.supplier} style={inp} /></F>
          <F label="رقم الفاتورة"><input name="invoiceNo" type="text" defaultValue={ea?.invoiceNo} style={inp} /></F>
          <div />

          <Section title="4) تواريخ الشراء والاستلام والجاهزية" />
          <F label="تاريخ الشراء *"><input name="date" type="date" defaultValue={ea?.date || new Date().toISOString().split('T')[0]} required style={inp} /></F>
          <F label="تاريخ الاستلام"><input name="receiptDate" type="date" defaultValue={ea?.receiptDate} style={inp} /></F>
          <F label="تاريخ جاهزية الاستخدام"><input name="readyDate" type="date" defaultValue={ea?.readyDate} style={inp} /></F>

          <Section title="5) التكلفة ومصدر التمويل" />
          <F label="تكلفة الأصل (ر.س) *"><input name="cost" type="number" step="0.01" defaultValue={ea?.cost} placeholder="0.00" required style={inp} /></F>
          <F label="الضريبة المضافة (VAT)"><input name="vat" type="number" step="0.01" defaultValue={ea?.vat || 0} style={inp} /></F>
          <F label="مصدر التمويل">
            <select name="source" defaultValue={ea?.source || 'بنك الراجحي'} style={inp}>
              {['بنك الراجحي','بنك البلاد','البلاد','موردين','تبرعات عينية','تمويل ذاتي'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </F>

          <Section title="6) العمر الإنتاجي وطريقة الإهلاك والقيمة المتبقية" />
          <F label="العمر الإنتاجي (سنوات)"><input name="life" type="number" defaultValue={ea?.life} placeholder="مثال: 5 (اتركه فارغاً للأراضي)" style={inp} /></F>
          <F label="طريقة الإهلاك">
            <select name="method" defaultValue={ea?.method || 'SL'} style={inp}>
              {Object.entries(DEPRECIATION_METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </F>
          <F label="القيمة المتبقية (ر.س)"><input name="salvage" type="number" step="0.01" defaultValue={ea?.salvage || 0} style={inp} /></F>

          <Section title="7) الحالة وتاريخ آخر جرد" />
          <F label="الحالة">
            <select name="status" defaultValue={ea?.status || 'يعمل'} style={inp}>
              {['يعمل','بالمستودع','تالف','مستبعد'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </F>
          <F label="تاريخ آخر جرد"><input name="lastInventory" type="date" defaultValue={ea?.lastInventory} style={inp} /></F>
          <div />

          <Section title="8) الاستبعاد (عند انطباقه)" />
          <F label="تاريخ الاستبعاد"><input name="disposalDate" type="date" defaultValue={ea?.disposalDate} style={inp} /></F>
          <F label="سبب الاستبعاد" full><input name="disposalReason" type="text" defaultValue={ea?.disposalReason} placeholder="مثال: تلف كامل / بيع خردة" style={inp} /></F>

          <div style={{display: 'flex', gap: '1rem', gridColumn: '1 / -1', marginTop: '1rem'}}>
            <button type="submit" className="btn btn-primary" style={{padding: '0.75rem 2rem'}}>{ea ? 'تحديث البيانات' : 'حفظ الأصل'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setEditingAsset(null); setView('register'); }} style={{padding: '0.75rem 2rem'}}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
    );
  };

  const renderJournal = () => {
    const totalDebit = journals.reduce((acc, j) => acc + (j.debit || 0), 0);
    const totalCredit = journals.reduce((acc, j) => acc + (j.credit || 0), 0);
    const draftCount = journals.filter(j => j.status === 'مسودة').length;
    
    return (
      <div className="view-anim">
        <div style={{background:'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding:'2rem', borderRadius:'16px', color:'white', marginBottom:'2rem', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.5)', display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1.5rem'}}>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.5rem'}}>إجمالي المدين (DR)</div>
            <div style={{fontSize:'1.75rem', fontWeight:800, color:'#fb7185'}}>{totalDebit.toLocaleString()} <span style={{fontSize:'0.9rem', fontWeight:400, opacity:0.7}}>ر.س</span></div>
          </div>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.5rem'}}>إجمالي الدائن (CR)</div>
            <div style={{fontSize:'1.75rem', fontWeight:800, color:'#34d399'}}>{totalCredit.toLocaleString()} <span style={{fontSize:'0.9rem', fontWeight:400, opacity:0.7}}>ر.س</span></div>
          </div>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.5rem'}}>قيود غير مرحلة</div>
            <div style={{fontSize:'1.75rem', fontWeight:800, color:'#fbbf24'}}>{draftCount} <span style={{fontSize:'0.9rem', fontWeight:400, opacity:0.7}}>قيد</span></div>
          </div>
          <div>
            <div style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.5rem'}}>توازن الدفاتر</div>
            <div style={{fontSize:'1.25rem', fontWeight:700, color: totalDebit === totalCredit ? '#10b981' : '#ef4444'}}>
              {totalDebit === totalCredit ? '✓ متوازنة' : '⚠ غير متوازنة'}
            </div>
            <div style={{fontSize:'0.75rem', opacity:0.6}}>نظام المطابقة الآلي نشط</div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 3fr', gap:'1.5rem', marginBottom:'2rem'}}>
          <div className="card">
             <h3 style={{fontSize:'1.1rem', marginBottom:'1.5rem'}}>نشاط التدوين الأسبوعي</h3>
             <div style={{height:'220px'}}>
                <Line data={{
                  labels: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
                  datasets: [{
                    label: 'عدد القيود',
                    data: [12, 19, 15, 28, 22],
                    borderColor: 'var(--accent)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: 'var(--accent)'
                  }]
                }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
             </div>
             <div style={{marginTop:'1.5rem', padding:'1rem', background:'#f0f9ff', borderRadius:'8px', fontSize:'0.8rem', color:'#0369a1', border:'1px solid #bae6fd'}}>
                <Sparkles size={14} style={{marginLeft:'0.4rem'}} />
                <strong>تحليل النمط الزمني:</strong> يلاحظ كثافة في توليد القيود يوم الأربعاء نتيجة إغلاق عهد الموظفين؛ نوصي بجدولة الترحيل النهائي صباح الخميس لضمان دقة التقارير.
             </div>
          </div>

          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
              <h2 style={{fontSize:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><FileText size={24} color="var(--accent)" /> سجل قيود اليومية المركزية</h2>
              <div style={{display:'flex', gap:'0.5rem'}}>
                <button className="btn btn-ghost" style={{color:'var(--danger)', border:'1px solid var(--danger)', padding:'0.6rem 1.2rem'}} onClick={() => { showToast('تم فك ترحيل جميع القيود وإعادتها كمسودة'); setJournals(journals.map(j => ({...j, status: 'مسودة'}))); }}><X size={18} /> إلغاء الترحيل الجماعي</button>
                <button className="btn btn-primary" style={{padding:'0.6rem 1.2rem'}} onClick={() => { showToast('تم ترحيل كافة القيود المعلقة للسجلات المالية'); setJournals(journals.map(j => ({...j, status: 'مرحل'}))); }}><FileText size={18} /> ترحيل كافة القيود</button>
              </div>
            </div>
            <div className="table-wrapper" style={{background:'var(--card-bg)', borderRadius:'12px', border:'1px solid var(--border)', overflow:'hidden'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead style={{background:'#f8fafc', borderBottom:'2px solid var(--border)'}}>
                  <tr>
                    <th style={{padding:'1rem', textAlign:'right'}}>الرقم المرجعي</th>
                    <th style={{padding:'1rem', textAlign:'right'}}>التاريخ</th>
                    <th style={{padding:'1rem', textAlign:'right'}}>البيان المحاسبي</th>
                    <th style={{padding:'1rem', textAlign:'right'}}>المدين (DR)</th>
                    <th style={{padding:'1rem', textAlign:'right'}}>الدائن (CR)</th>
                    <th style={{padding:'1rem', textAlign:'center'}}>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {journals.map((j, idx) => (
                    <tr key={j.id} style={{borderBottom:'1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)'}}>
                      <td style={{padding:'1rem', fontWeight:700, color:'#0f172a'}}>{j.id}</td>
                      <td style={{padding:'1rem', fontSize:'0.85rem'}}>{j.date}</td>
                      <td style={{padding:'1rem'}}>
                         <div style={{fontWeight:600}}>{j.desc}</div>
                         <div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>المصدر: نظام الأصول الثابتة الآلي</div>
                      </td>
                      <td style={{padding:'1rem', color:'#e11d48', fontWeight:700}}>{j.debit ? j.debit.toLocaleString() : '-'}</td>
                      <td style={{padding:'1rem', color:'#10b981', fontWeight:700}}>{j.credit ? j.credit.toLocaleString() : '-'}</td>
                      <td style={{padding:'1rem', textAlign:'center'}}>
                        {j.status === 'مرحل' ? 
                          <span className="badge b-active" style={{padding:'0.4rem 1rem', display:'inline-flex', alignItems:'center', gap:'0.25rem'}}><CheckCircle size={12}/> مرحل</span> : 
                          <span className="badge" style={{background:'#fef3c7', color:'#92400e', padding:'0.4rem 1rem', display:'inline-flex', alignItems:'center', gap:'0.25rem'}}><Activity size={12}/> مسودة</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTransfers = () => (
    <div className="view-anim">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <div>
          <h2 style={{fontSize:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Shuffle color="var(--accent)" /> التحويلات العينية للأصول</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>إدارة ومراقبة حركة تنقلات الأصول بين الأقسام والفروع لضمان دقة العهدة.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setView('new-transfer')} style={{padding:'0.75rem 2rem'}}><Shuffle size={18} /> طلب تحويل جديد</button>
      </div>

      <div className="summary-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)', marginBottom:'2rem'}}>
        <div className="card" style={{display:'flex', gap:'1rem', alignItems:'center'}}>
           <div style={{background:'rgba(59, 130, 246, 0.1)', padding:'0.75rem', borderRadius:'12px'}}><Shuffle color="#3b82f6" size={24} /></div>
           <div><div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>إجمالي الطلبات</div><div style={{fontSize:'1.2rem', fontWeight:800}}>{transfers.length}</div></div>
        </div>
        <div className="card" style={{display:'flex', gap:'1rem', alignItems:'center'}}>
           <div style={{background:'rgba(16, 185, 129, 0.1)', padding:'0.75rem', borderRadius:'12px'}}><CheckCircle color="#10b981" size={24} /></div>
           <div><div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>تم النقل بنجاح</div><div style={{fontSize:'1.2rem', fontWeight:800, color:'#10b981'}}>{transfers.filter(t => t.status === 'مكتمل').length}</div></div>
        </div>
        <div className="card" style={{display:'flex', gap:'1rem', alignItems:'center'}}>
           <div style={{background:'rgba(245, 158, 11, 0.1)', padding:'0.75rem', borderRadius:'12px'}}><Activity color="#f59e0b" size={24} /></div>
           <div><div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>قيد المراجعة</div><div style={{fontSize:'1.2rem', fontWeight:800, color:'#f59e0b'}}>{transfers.filter(t => t.status === 'قيد المراجعة').length}</div></div>
        </div>
        <div className="card" style={{display:'flex', gap:'1rem', alignItems:'center'}}>
           <div style={{background:'rgba(239, 68, 68, 0.1)', padding:'0.75rem', borderRadius:'12px'}}><AlertTriangle color="#ef4444" size={24} /></div>
           <div><div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>طلبات مرفوضة</div><div style={{fontSize:'1.2rem', fontWeight:800, color:'#ef4444'}}>{transfers.filter(t => t.status === 'مرفوض').length}</div></div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:'1.5rem', marginBottom:'1.5rem'}}>
        <div className="card">
           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'1.1rem'}}>تحليل التدفق (In/Out Flow)</h3>
              <TrendingUp size={18} color="var(--accent)" />
           </div>
           <div style={{height:'350px'}}>
             <Bar data={{
               labels: ['الإنتاج', 'المبيعات', 'التقنية', 'الإدارة'],
               datasets: [
                 { label: 'أصول صادرة', data: [5, 2, 8, 3], backgroundColor: '#f43f5e', borderRadius: 4 },
                 { label: 'أصول واردة', data: [3, 9, 4, 7], backgroundColor: '#10b981', borderRadius: 4 }
               ]
             }} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
           </div>
           <div style={{marginTop:'1rem', background:'#f0f9ff', padding:'0.85rem', borderRadius:'8px', fontSize:'0.8rem', color:'#0369a1', border:'1px solid #bae6fd'}}>
              <Sparkles size={14} style={{marginLeft:'0.4rem'}} />
              <strong>تحليل الذكاء الاصطناعي:</strong> يلاحظ ارتفاع معدل طلب الأصول في "قسم المبيعات" بنسبة 40%؛ نوصي بدراسة الحاجة لتوريد عهدة ثابتة جديدة لهم بدلاً من التحويلات المتكررة.
           </div>
        </div>

        <div className="table-wrapper" style={{background:'var(--card-bg)', borderRadius:'12px', border:'1px solid var(--border)', overflow:'hidden'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead style={{background:'#f8fafc', borderBottom:'2px solid var(--border)'}}>
              <tr>
                <th style={{padding:'1rem', textAlign:'right'}}>رقم الطلب</th>
                <th style={{padding:'1rem', textAlign:'right'}}>الأصل / العهدة</th>
                <th style={{padding:'1rem', textAlign:'right'}}>مسار التحويل (Logistics)</th>
                <th style={{padding:'1rem', textAlign:'right'}}>التاريخ</th>
                <th style={{padding:'1rem', textAlign:'center'}}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t, index) => (
                <tr key={t.id} style={{borderBottom:'1px solid var(--border)', background: index % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)'}}>
                  <td style={{padding:'1rem', fontWeight:700, color:'var(--accent)'}}>{t.id}</td>
                  <td style={{padding:'1rem'}}>
                    <div style={{fontWeight:600}}>{t.asset}</div>
                    <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>كود تتبع نشط</div>
                  </td>
                  <td style={{padding:'1rem'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'0.75rem', fontWeight:600}}>
                      <span style={{color:'#64748b', background:'#f1f5f9', padding:'0.2rem 0.5rem', borderRadius:'4px'}}>{t.from}</span>
                      <Shuffle size={14} color="var(--accent)" />
                      <span style={{color:'#0f172a', background:'rgba(59, 130, 246, 0.05)', padding:'0.2rem 0.5rem', borderRadius:'4px', border:'1px solid rgba(59, 130, 246, 0.1)'}}>{t.to}</span>
                    </div>
                  </td>
                  <td style={{padding:'1rem'}}>{t.date}</td>
                  <td style={{padding:'1rem', textAlign:'center'}}>
                    {t.status === 'مكتمل' ? 
                      <span className="badge b-active" style={{padding:'0.4rem 1rem', display:'inline-flex', alignItems:'center', gap:'0.25rem'}}><CheckCircle size={12}/> مكتمل</span> : 
                      t.status === 'قيد المراجعة' ?
                      <span className="badge" style={{background:'#fef3c7', color:'#92400e', padding:'0.4rem 1rem', display:'inline-flex', alignItems:'center', gap:'0.25rem'}}><Activity size={12}/> قيد المراجعة</span> :
                      <span className="badge" style={{background:'#fee2e2', color:'#b91c1c', padding:'0.4rem 1rem', display:'inline-flex', alignItems:'center', gap:'0.25rem'}}><X size={12}/> مرفوض</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        <div style={{display:'flex', gap:'0.5rem'}}>
           <button className="btn btn-ghost" style={{border:'1px solid var(--border)'}} onClick={() => { const v = window.prompt('أدخل السقف المالي الجديد (ر.س):', '1000000'); if (v && !isNaN(parseFloat(v))) showToast(`✅ تم ضبط السقف المالي إلى ${parseFloat(v).toLocaleString()} ر.س`); }}><Settings size={16} /> ضبط السقف المالي</button>
           <button className="btn btn-primary" onClick={() => { const v = window.prompt('مبلغ التعزيز المطلوب (ر.س):', '100000'); if (v && !isNaN(parseFloat(v))) showToast(`📨 تم رفع طلب تعزيز ميزانية بمبلغ ${parseFloat(v).toLocaleString()} ر.س للاعتماد`); }}><FilePlus size={16} /> طلب تعزيز ميزانية</button>
        </div>
      </div>
      
      <div className="summary-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', marginBottom:'1.5rem'}}>
        <div className="card" style={{position:'relative', overflow:'hidden', borderTop:'4px solid #3b82f6'}}>
          <div className="val-sub">الميزانية المعتمدة (2024)</div>
          <div className="val-big" style={{color:'#3b82f6'}}>1,500,000 ر.س</div>
          <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>تم اعتمادها في: 01-01-2024</div>
        </div>
        <div className="card" style={{position:'relative', overflow:'hidden', borderTop:'4px solid #ef4444'}}>
          <div className="val-sub">المنصرف الفعلي + الالتزامات</div>
          <div className="val-big" style={{color:'#ef4444'}}>680,000 ر.س</div>
          <div style={{fontSize:'0.75rem', color:'var(--danger)', fontWeight:600}}>معدل استهلاك: 45.3%</div>
        </div>
        <div className="card" style={{position:'relative', overflow:'hidden', borderTop:'4px solid #10b981'}}>
          <div className="val-sub">الرصيد المتاح للارتباط</div>
          <div className="val-big" style={{color:'#10b981'}}>820,000 ر.س</div>
          <div style={{fontSize:'0.75rem', color:'var(--success)', fontWeight:600}}>وفر مالي متاح</div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem', marginBottom:'1.5rem'}}>
        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
             <h3 style={{fontSize:'1.1rem'}}>تحليل معدل الحرق (Budget Burn Rate)</h3>
             <TrendingUp size={20} color="var(--accent)" />
          </div>
          <div style={{height:'280px'}}>
             <Line data={{
               labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس'],
               datasets: [
                 { 
                   label: 'السقف المخطط الموزع', 
                   data: [187500, 375000, 562500, 750000, 937500, 1125000, 1312500, 1500000], 
                   borderColor: '#94a3b8', 
                   borderDash: [5, 5], 
                   pointRadius: 0,
                   fill: false 
                 },
                 { 
                   label: 'الإنفاق الفعلي التراكمي', 
                   data: [120000, 290000, 480000, 680000], 
                   borderColor: '#3b82f6', 
                   backgroundColor: 'rgba(59, 130, 246, 0.1)',
                   tension: 0.4, 
                   fill: true 
                 }
               ]
             }} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="card">
          <h3 style={{fontSize:'1.1rem', marginBottom:'1rem'}}>الانحراف حسب الفئة</h3>
          <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
             {[
               {label: 'أصول تقنية', budget: 500000, actual: 420000, color: '#6366f1'},
               {label: 'مركبات', budget: 400000, actual: 150000, color: '#f43f5e'},
               {label: 'مباني وأوقاف', budget: 600000, actual: 110000, color: '#10b981'},
             ].map((cat, idx) => {
               const perc = (cat.actual / cat.budget) * 100;
               return (
                 <div key={idx}>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'0.4rem'}}>
                       <span style={{fontWeight:600}}>{cat.label}</span>
                       <span style={{color:'var(--text-muted)'}}>{perc.toFixed(1)}%</span>
                    </div>
                    <div style={{height:'8px', background:'#f1f5f9', borderRadius:'4px', overflow:'hidden'}}>
                       <div style={{width: `${perc}%`, background: cat.color, height:'100%'}}></div>
                    </div>
                    <div style={{fontSize:'0.75rem', marginTop:'0.3rem', color:'var(--text-muted)'}}>
                       المنصرف: {cat.actual.toLocaleString()} / {cat.budget.toLocaleString()}
                    </div>
                 </div>
               );
             })}
          </div>
          <div style={{marginTop:'1.5rem', padding:'1rem', background:'#f8fafc', borderRadius:'8px', border:'1px solid var(--border)'}}>
             <div style={{fontSize:'0.8rem', fontWeight:700, marginBottom:'0.5rem'}}>ملخص الانحراف الإجمالي</div>
             <div style={{fontSize:'1.1rem', fontWeight:800, color:'var(--success)'}}>32.4% <span style={{fontSize:'0.8rem', fontWeight:400, color:'var(--text-muted)'}}>تحت الميزانية</span></div>
          </div>
        </div>
      </div>

      <div className="card" style={{borderLeft:'4px solid var(--success)', background:'rgba(16, 185, 129, 0.05)'}}>
        <div style={{display:'flex', gap:'0.75rem', alignItems:'center'}}>
          <Sparkles size={20} color="var(--success)" />
          <div>
            <strong style={{color:'var(--success)'}}>توصية المحافظ الذكي (Budget Guardian):</strong> 
            <span style={{fontSize:'0.85rem', marginLeft:'0.5rem'}}>معدل الإنفاق الفعلي أقل من المخطط بـ 32%، نوصي باستغلال الوفر الحالي في تعزيز البنية التحتية للشبكات (فئة التقنية) قبل نهاية الربع الثالث لضمان استغلال الميزانية الرأسمالية بكفاءة.</span>
          </div>
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
        <button className="btn btn-ghost" style={{border:'1px solid var(--border)'}} onClick={() => { showToast('🔄 جاري إعادة تدريب نماذج التنبؤ...'); setTimeout(() => showToast(`✅ تم تحديث النماذج على ${assets.length} أصل`), 1200); }}><Activity size={18} /> تحديث نماذج التنبؤ</button>
      </div>

      <div className="summary-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
        <div className="card" style={{borderTop:'4px solid #8b5cf6'}}>
          <div className="val-sub">مؤشر مخاطر تعطل الأصول الحرجة</div>
          <div className="val-big" style={{color:'#8b5cf6'}}>12%</div>
          <div className="val-sub">احتمالية تعطل خوادم البيانات بناءً على أنماط الاستخدام.</div>
        </div>
        <div className="card" style={{borderTop:'4px solid #10b981'}}>
          <div className="val-sub">وفر مالي استراتيجي (Forecast)</div>
          <div className="val-big" style={{color:'#10b981'}}>150,000 ر.س</div>
          <div className="val-sub">عن طريق تحسين دورة الصيانة الوقائية للأصول.</div>
        </div>
        <div className="card" style={{borderTop:'4px solid #f59e0b'}}>
          <div className="val-sub">دقة نماذج التنبؤ الحالية</div>
          <div className="val-big" style={{color:'#f59e0b'}}>94.8%</div>
          <div className="val-sub">بناءً على المطابقة التاريخية للبيانات الفعلية.</div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop:'1.5rem'}}>
        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
             <h3 style={{fontSize:'1.1rem'}}>التنبؤ بالاحتياجات الرأسمالية المستقبلية (CAPEX Forecast)</h3>
             <Calendar size={20} color="var(--accent)" />
          </div>
          <div style={{height:'280px'}}>
            <Bar data={{
              labels: ['2024', '2025', '2026', '2027', '2028'],
              datasets: [
                {
                  label: 'تكاليف الإحلال المتوقعة (ر.س)',
                  data: [120000, 450000, 890000, 300000, 150000],
                  backgroundColor: '#6366f1',
                  borderRadius: 6
                }
              ]
            }} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div style={{marginTop:'1.5rem', fontSize:'0.85rem', color:'var(--text-muted)', background:'rgba(99, 102, 241, 0.05)', padding:'1rem', borderRadius:'8px', border:'1px solid rgba(99, 102, 241, 0.2)'}}>
             <strong>رؤية استراتيجية:</strong> يتوقع الذكاء الاصطناعي "ذروة إنفاق" في عام 2026 نتيجة انتهاء العمر الافتراضي لأسطول النقل اللوجستي. نوصي بالبدء في تكوين احتياطي مالي من الآن.
          </div>
        </div>

        <div className="card">
          <h3 style={{fontSize:'1.1rem', marginBottom:'1.5rem'}}>خارطة مخاطر التعطل (AI Risk Map)</h3>
          <div style={{display:'flex', flexDirection:'column', gap:'1.25rem'}}>
             {[
               {name: 'الخوادم المركزية', risk: 85, status: 'حرج', color: '#ef4444'},
               {name: 'مركبات التوزيع', risk: 40, status: 'متوسط', color: '#f59e0b'},
               {name: 'أجهزة الموظفين', risk: 15, status: 'آمن', color: '#10b981'},
             ].map((item, idx) => (
               <div key={idx} style={{padding:'1rem', borderRadius:'12px', background:'#f8fafc', border:'1px solid var(--border)'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem'}}>
                     <span style={{fontWeight:700}}>{item.name}</span>
                     <span style={{color:item.color, fontWeight:700}}>{item.status}</span>
                  </div>
                  <div style={{height:'6px', background:'#e2e8f0', borderRadius:'3px', overflow:'hidden'}}>
                     <div style={{width: `${item.risk}%`, background: item.color, height:'100%'}}></div>
                  </div>
                  <div style={{fontSize:'0.75rem', marginTop:'0.5rem', color:'var(--text-muted)'}}>احتمالية العطل: {item.risk}%</div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop:'1.5rem'}}>
        <div className="card">
          <h3 style={{marginBottom:'1rem', fontSize:'1.1rem'}}>التنبؤ بتآكل القيمة الدفترية (5 سنوات)</h3>
          <div className="chart-container" style={{height:'250px'}}>
            <Line data={{
              labels: ['2024', '2025', '2026', '2027', '2028'],
              datasets: [{
                label: 'صافي القيمة الدفترية المتوقعة (NBV)',
                data: [1850000, 1600000, 1300000, 950000, 600000],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
              }]
            }} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="card">
          <h3 style={{marginBottom:'1rem', fontSize:'1.1rem'}}>تحليل كفاءة استخدام الأصول</h3>
          <div className="chart-container" style={{height:'250px', display:'flex', justifyContent:'center'}}>
            <Doughnut data={{
              labels: ['مستغلة بالكامل', 'استغلال جزئي', 'فائضة'],
              datasets: [{
                data: [65, 25, 10],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0
              }]
            }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:'1.5rem', background:'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', color:'white', border:'none'}}>
         <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
            <div style={{background:'rgba(255,255,255,0.2)', padding:'1rem', borderRadius:'12px'}}>
               <BrainCircuit size={32} />
            </div>
            <div>
               <h4 style={{fontSize:'1.2rem', fontWeight:700, marginBottom:'0.25rem'}}>محرك التحليل الاستراتيجي (Strategic Advisor)</h4>
               <p style={{fontSize:'0.9rem', opacity:0.9}}>بناءً على النمذجة الرياضية، نوصي ببيع "أجهزة التدريب التفاعلية" الآن نظراً لانخفاض معدل استخدامها (8%) وارتفاع تكلفتها التشغيلية؛ البيع الآن سيحقق عائداً رأسمالياً قدره 35,000 ريال قبل تآكل قيمتها بالكامل.</p>
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
          <button className="btn btn-ghost" style={{color: erpConnected ? 'var(--success)' : 'var(--danger)'}} onClick={() => { setErpConnected(!erpConnected); showToast(erpConnected ? '🔌 تم فصل الربط مع النظام المحاسبي' : '✅ تم الاتصال بالنظام المحاسبي (ERP)'); }}><CheckCircle size={16} /> {erpConnected ? 'متصل' : 'غير متصل'}</button>
        </div>
      </div>
    </div>
  );

  // ===== WAREHOUSE RADAR SYSTEM =====
  const renderWarehouse = () => {
    const filteredItems = warehouseItems.filter(item => 
      warehouseFilter === 'الكل' || item.status === warehouseFilter
    );
    const totalQty = warehouseItems.reduce((s, i) => s + i.qty, 0);
    const availableQty = warehouseItems.filter(i => i.status === 'متاح').reduce((s, i) => s + i.qty, 0);
    const lowStock = warehouseItems.filter(i => i.qty <= i.minQty && i.qty > 0).length;
    const outOfStock = warehouseItems.filter(i => i.qty === 0).length;

    const stageCount = (stage) => warehouseItems.filter(i => i.stage === stage).length;

    return (
    <div className="view-anim">
      {/* Hero Banner */}
      <div className="dash-hero">
        <div style={{zIndex:1}}>
          <h2 style={{fontSize:'1.6rem', fontWeight:800, margin:'0 0 6px'}}>🏭 نظام المستودعات المتكامل</h2>
          <p style={{opacity:0.85, fontSize:'0.95rem'}}>إدارة ذكية وفق منهجية RADAR — استلام · تخصيص · نشر · مراجعة · إحلال</p>
        </div>
        <div style={{zIndex:1, textAlign:'center'}}>
          <div style={{fontSize:'2.5rem', fontWeight:800}}>{totalQty}</div>
          <div style={{fontSize:'0.8rem', opacity:0.8}}>وحدة في المخزون</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="summary-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)', marginBottom:'2rem'}}>
        <div className="card" style={{display:'flex', gap:'1rem', alignItems:'center', borderRight:'4px solid var(--brand-teal)'}}>
          <div style={{background:'rgba(0, 165, 155, 0.1)', padding:'0.75rem', borderRadius:'12px'}}><Boxes color="var(--brand-teal)" size={24} /></div>
          <div><div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>إجمالي المخزون</div><div style={{fontSize:'1.4rem', fontWeight:800}}>{totalQty} <span style={{fontSize:'0.7rem', fontWeight:400}}>وحدة</span></div></div>
        </div>
        <div className="card" style={{display:'flex', gap:'1rem', alignItems:'center', borderRight:'4px solid var(--brand-green)'}}>
          <div style={{background:'rgba(140, 194, 64, 0.1)', padding:'0.75rem', borderRadius:'12px'}}><PackageCheck color="var(--brand-green)" size={24} /></div>
          <div><div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>جاهز للتسليم</div><div style={{fontSize:'1.4rem', fontWeight:800, color:'var(--brand-green)'}}>{availableQty}</div></div>
        </div>
        <div className="card" style={{display:'flex', gap:'1rem', alignItems:'center', borderRight:'4px solid var(--warning)'}}>
          <div style={{background:'rgba(245, 158, 11, 0.1)', padding:'0.75rem', borderRadius:'12px'}}><AlertTriangle color="var(--warning)" size={24} /></div>
          <div><div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>مخزون منخفض</div><div style={{fontSize:'1.4rem', fontWeight:800, color:'var(--warning)'}}>{lowStock}</div></div>
        </div>
        <div className="card" style={{display:'flex', gap:'1rem', alignItems:'center', borderRight:'4px solid var(--danger)'}}>
          <div style={{background:'rgba(239, 68, 68, 0.1)', padding:'0.75rem', borderRadius:'12px'}}><Package color="var(--danger)" size={24} /></div>
          <div><div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>نفاد كامل</div><div style={{fontSize:'1.4rem', fontWeight:800, color:'var(--danger)'}}>{outOfStock}</div></div>
        </div>
      </div>

      {/* RADAR Stages + Chart */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:'1.5rem', marginBottom:'2rem'}}>
        <div className="card">
          <h3 style={{fontSize:'1.1rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Target size={20} color="var(--brand-teal)" /> مراحل RADAR</h3>
          <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
            {[
              { key: 'Receive', label: 'الاستلام (Receive)', icon: <PackagePlus size={16}/>, color: '#3b82f6' },
              { key: 'Allocate', label: 'التخصيص (Allocate)', icon: <ArrowRightLeft size={16}/>, color: '#8b5cf6' },
              { key: 'Deploy', label: 'النشر (Deploy)', icon: <MapPin size={16}/>, color: 'var(--brand-green)' },
              { key: 'Audit', label: 'المراجعة (Audit)', icon: <ScanLine size={16}/>, color: '#f59e0b' },
              { key: 'Retire', label: 'الإحلال (Retire)', icon: <RotateCcw size={16}/>, color: '#ef4444' },
            ].map(s => (
              <div key={s.key} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 1rem', borderRadius:'12px', background: `${s.color}08`, border:`1px solid ${s.color}20`}}>
                <div style={{display:'flex', alignItems:'center', gap:'0.5rem', color: s.color, fontWeight:600, fontSize:'0.85rem'}}>{s.icon} {s.label}</div>
                <div style={{background: s.color, color:'white', borderRadius:'20px', padding:'0.2rem 0.75rem', fontSize:'0.8rem', fontWeight:700}}>{stageCount(s.key)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{fontSize:'1.1rem', marginBottom:'1.5rem'}}>خريطة RADAR الخماسية</h3>
          <div style={{height:'300px'}}>
            <Radar data={{
              labels: ['الاستلام', 'التخصيص', 'النشر', 'المراجعة', 'الإحلال'],
              datasets: [{
                label: 'توزيع الأصول',
                data: [stageCount('Receive'), stageCount('Allocate'), stageCount('Deploy'), stageCount('Audit'), stageCount('Retire')],
                backgroundColor: 'rgba(0, 165, 155, 0.15)',
                borderColor: 'var(--brand-teal)',
                pointBackgroundColor: 'var(--brand-teal)',
                pointBorderColor: '#fff',
                pointHoverRadius: 8,
                borderWidth: 2,
              }]
            }} options={{ responsive: true, maintainAspectRatio: false, scales: { r: { beginAtZero: true, ticks: { stepSize: 1 } } }, plugins: { legend: { display: false } } }} />
          </div>
          <div style={{marginTop:'1rem', background:'linear-gradient(to right, #f0fdf4, #ffffff)', padding:'1rem', borderRadius:'12px', fontSize:'0.8rem', color:'#166534', border:'1px solid #bbf7d0'}}>
            <Sparkles size={14} style={{marginLeft:'0.4rem'}} />
            <strong>تحليل RADAR:</strong> النسبة الأكبر من الأصول في مرحلة "النشر" مما يدل على كفاءة توزيع عالية. يُوصى بمراجعة الأصول في مرحلة "الإحلال" لاتخاذ قرار التقاعد.
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
        <h2 style={{fontSize:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Warehouse size={24} color="var(--brand-teal)" /> جدول المخزون المباشر</h2>
        <div style={{display:'flex', gap:'0.5rem'}}>
          {['الكل', 'متاح', 'مخصص', 'صيانة', 'نفاد', 'تالف'].map(f => (
            <button key={f} onClick={() => setWarehouseFilter(f)} className={`btn ${warehouseFilter === f ? 'btn-primary' : 'btn-ghost'}`} style={{padding:'0.4rem 1rem', fontSize:'0.8rem'}}>{f}</button>
          ))}
        </div>
      </div>

      <div className="table-wrapper" style={{borderRadius:'16px', overflow:'hidden'}}>
        <table>
          <thead style={{borderBottom:'2px solid var(--border)'}}>
            <tr>
              <th>SKU</th>
              <th>اسم الصنف</th>
              <th>الفئة</th>
              <th>الكمية</th>
              <th>الحد الأدنى</th>
              <th>الموقع (Bin)</th>
              <th>مرحلة RADAR</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, idx) => {
              const statusColors = { 'متاح': '#10b981', 'مخصص': '#3b82f6', 'صيانة': '#f59e0b', 'نفاد': '#ef4444', 'تالف': '#6b7280' };
              const stageColors = { Receive: '#3b82f6', Allocate: '#8b5cf6', Deploy: '#10b981', Audit: '#f59e0b', Retire: '#ef4444' };
              const stageLabels = { Receive: 'استلام', Allocate: 'تخصيص', Deploy: 'نشر', Audit: 'مراجعة', Retire: 'إحلال' };
              return (
              <tr key={item.id} style={{borderBottom:'1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)'}}>
                <td style={{fontWeight:700, color:'var(--brand-teal)', fontFamily:'monospace'}}>{item.sku}</td>
                <td><div style={{fontWeight:600}}>{item.name}</div><div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>{item.id}</div></td>
                <td style={{fontSize:'0.85rem'}}>{item.category}</td>
                <td>
                  <div style={{fontWeight:800, fontSize:'1.1rem', color: item.qty <= item.minQty ? 'var(--danger)' : 'var(--brand-ink)'}}>{item.qty}</div>
                  {item.qty <= item.minQty && item.qty > 0 && <div style={{fontSize:'0.65rem', color:'var(--warning)', fontWeight:600}}>⚠️ منخفض</div>}
                </td>
                <td style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>{item.minQty}</td>
                <td><span style={{background:'var(--thead-bg)', padding:'0.3rem 0.75rem', borderRadius:'8px', fontSize:'0.8rem', fontWeight:600, fontFamily:'monospace'}}><MapPin size={12} style={{marginLeft:'0.3rem'}} />{item.location}</span></td>
                <td><span style={{background: `${stageColors[item.stage]}15`, color: stageColors[item.stage], padding:'0.3rem 0.75rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700}}>{stageLabels[item.stage]}</span></td>
                <td><span style={{background: `${statusColors[item.status]}15`, color: statusColors[item.status], padding:'0.3rem 0.75rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700, border:`1px solid ${statusColors[item.status]}30`}}>{item.status}</span></td>
                <td>
                  <div style={{display:'flex', gap:'0.4rem'}}>
                    <button className="btn btn-ghost" style={{padding:'0.4rem', borderRadius:'8px', background:'var(--thead-bg)'}} title="عرض" onClick={() => setViewWarehouse(item)}><Eye size={14} color="var(--brand-teal)" /></button>
                    <button className="btn btn-ghost" style={{padding:'0.4rem', borderRadius:'8px', background:'var(--thead-bg)'}} title="تعديل" onClick={() => editWarehouseItem(item)}><Edit size={14} color="var(--text-muted)" /></button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
    );
  };

  if (!session) {
    return <Login onLogin={setSession} />;
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        {/* Logo */}
        <div className="logo-area">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="تراؤف" />
          <span className="version-badge">V5.0 RADAR</span>
        </div>

        {/* User Profile */}
        <div className="sidebar-profile">
          <div className="sidebar-profile-avatar">FA</div>
          <div className="sidebar-profile-name">فيصل المحاسب</div>
          <div className="sidebar-profile-role"><ShieldCheck size={11} /> المدير التقني والمالي</div>
        </div>

        <div className="nav-group">
          <div className="nav-label">الرئيسية</div>
          <div className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            <div className="nav-icon-box"><LayoutGrid size={18} /></div> لوحة التحكم
          </div>
        </div>

        <div className="nav-group">
          <div className="nav-label">إدارة الأصول</div>
          <div className={`nav-item ${view === 'register' ? 'active' : ''}`} onClick={() => setView('register')}>
            <div className="nav-icon-box"><Box size={18} /></div> سجل الأصول الثابتة
          </div>
          <div className={`nav-item ${view === 'journal' ? 'active' : ''}`} onClick={() => setView('journal')}>
            <div className="nav-icon-box"><FileText size={18} /></div> قيود اليومية
          </div>
          <div className={`nav-item ${view === 'transfers' ? 'active' : ''}`} onClick={() => setView('transfers')}>
            <div className="nav-icon-box"><Shuffle size={18} /></div> التحويلات العينية
          </div>
        </div>

        <div className="nav-group">
          <div className="nav-label">المستودعات (RADAR)</div>
          <div className={`nav-item ${view === 'warehouse' ? 'active' : ''}`} onClick={() => setView('warehouse')}>
            <div className="nav-icon-box"><Warehouse size={18} /></div> إدارة المستودعات
          </div>
        </div>

        <div className="nav-group">
          <div className="nav-label">الذكاء الاصطناعي</div>
          <div className={`nav-item ${view === 'ai-insights' ? 'active' : ''}`} onClick={() => setView('ai-insights')}>
            <div className="nav-icon-box"><Sparkles size={18} /></div> التحليلات التنبؤية
          </div>
        </div>

        <div className="nav-group">
          <div className="nav-label">التقارير</div>
          <div className={`nav-item ${view === 'reports' ? 'active' : ''}`} onClick={() => setView('reports')}>
            <div className="nav-icon-box"><BarChart3 size={18} /></div> التقارير الشاملة
          </div>
          <div className={`nav-item ${view === 'budget' ? 'active' : ''}`} onClick={() => setView('budget')}>
            <div className="nav-icon-box"><PieChart size={18} /></div> الميزانية التقديرية
          </div>
          <div className={`nav-item ${view === 'inventory' ? 'active' : ''}`} onClick={() => setView('inventory')}>
            <div className="nav-icon-box"><ClipboardList size={18} /></div> تقارير الجرد
          </div>
        </div>

        <div style={{marginTop: 'auto', padding:'0 0.75rem'}}>
          <div className={`nav-item ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}>
            <div className="nav-icon-box"><Settings size={18} /></div> الإعدادات
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
            <div style={{display:'flex', background:'var(--thead-bg)', padding:'0.5rem 1rem', borderRadius:'20px', gap:'0.5rem', alignItems:'center'}}>
              <Search size={16} color="var(--text-muted)" />
              <input type="text" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && globalSearch.trim()) { setFilterParams({ query: globalSearch.trim(), category: 'الكل' }); setShowFilter(true); setView('register'); } }} placeholder="بحث سريع في الأصول والمستودعات... (Enter)" style={{border:'none', background:'transparent', outline:'none', fontSize:'0.85rem', width:'250px', color:'var(--text)'}} />
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'1.5rem', position:'relative'}}>
            <div style={{position:'relative', cursor:'pointer'}} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} color="var(--text-muted)" />
              {notifications.length > 0 && <span style={{position:'absolute', top:'-6px', right:'-6px', background:'#ef4444', color:'white', borderRadius:'50%', fontSize:'0.6rem', width:'16px', height:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>{notifications.length}</span>}
            </div>
            {showNotifications && (
              <div style={{position:'absolute', top:'2.2rem', left:0, width:'340px', background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:'12px', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.25)', zIndex:500, padding:'1rem'}}>
                <div style={{fontWeight:800, marginBottom:'0.75rem'}}>الإشعارات ({notifications.length})</div>
                {notifications.length === 0 && <div style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>لا توجد إشعارات.</div>}
                {notifications.map((n, i) => (
                  <div key={i} onClick={() => { n.action(); setShowNotifications(false); }} style={{padding:'0.6rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.82rem', borderBottom:'1px solid var(--border)'}}>{n.text}</div>
                ))}
              </div>
            )}
            <div style={{height:'30px', width:'1px', background:'var(--border)'}}></div>
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer'}}>
              <select value={fiscalYear} onChange={e => { setFiscalYear(e.target.value); showToast(`📅 تم التحويل إلى السنة المالية ${e.target.value}`); }} style={{border:'none', background:'transparent', fontSize:'0.85rem', fontWeight:600, color:'var(--text)', cursor:'pointer', outline:'none'}}>
                {['2026', '2025', '2024', '2023'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
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
          {view === 'warehouse' && renderWarehouse()}
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
                const q = e.target.value.trim().toLowerCase();
                const found = assets.find(a => a.code.toLowerCase() === q || a.id.toLowerCase() === q);
                setShowScanner(false);
                if (found) {
                  const today = new Date().toISOString().split('T')[0];
                  setAssets(prev => prev.map(a => a.id === found.id ? { ...a, lastInventory: today } : a));
                  setViewAsset({ ...found, lastInventory: today });
                  showToast(`✅ تم مسح الأصل (${found.name}) وتحديث تاريخ آخر جرد`);
                } else {
                  showToast(`⚠️ لم يتم العثور على أصل بالرمز (${e.target.value})`);
                }
              }
            }}/>
            <button className="btn btn-ghost" style={{marginTop:'1.5rem', width:'100%', padding:'0.75rem'}} onClick={() => setShowScanner(false)}>إلغاء العملية</button>
          </div>
        </div>
      )}

      {viewAsset && (() => {
        const a = accountingEngine.find(x => x.id === viewAsset.id) || viewAsset;
        const dash = (v) => (v === undefined || v === null || v === '' ? '-' : v);
        const money = (v) => `${Math.round(v || 0).toLocaleString()} ر.س`;
        const sections = [
          { title: 'التعريف', rows: [['رقم الأصل', a.id], ['الرمز / الباركود', a.code], ['وصف الأصل', a.name], ['فئة الأصل', a.category]] },
          { title: 'الموقع والعهدة', rows: [['الموقع', dash(a.location)], ['الإدارة', dash(a.department)], ['الموظف / العهدة', dash(a.custody)]] },
          { title: 'الشراء والمورد', rows: [['المورد', dash(a.supplier)], ['رقم الفاتورة', dash(a.invoiceNo)], ['تاريخ الشراء', dash(a.date)], ['تاريخ الاستلام', dash(a.receiptDate)], ['تاريخ جاهزية الاستخدام', dash(a.readyDate)]] },
          { title: 'التكلفة والتمويل', rows: [['تكلفة الأصل', money(a.cost)], ['الضريبة المضافة', money(a.vat)], ['مصدر التمويل', dash(a.source)]] },
          { title: 'الإهلاك والقيمة الدفترية', rows: [['العمر الإنتاجي', a.category === 'أراضي' ? 'غير محدد (أرض)' : `${a.life} سنة`], ['طريقة الإهلاك', DEPRECIATION_METHODS[a.method] || '-'], ['القيمة المتبقية', money(a.salvage)], ['الإهلاك للفترة', money(a.periodDep)], ['مجمع الإهلاك', money(a.accumulatedDep)], ['القيمة الدفترية', money(a.netBookValue)]] },
          { title: 'الحالة والجرد والاستبعاد', rows: [['الحالة', dash(a.status)], ['تاريخ آخر جرد', dash(a.lastInventory)], ['تاريخ الاستبعاد', dash(a.disposalDate)], ['سبب الاستبعاد', dash(a.disposalReason)]] }
        ];
        return (
          <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)'}} onClick={() => setViewAsset(null)}>
            <div className="card" style={{width:'760px', maxWidth:'94vw', maxHeight:'88vh', overflowY:'auto', background:'var(--card-bg)', padding:'2rem'}} onClick={e => e.stopPropagation()}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
                <h3 style={{fontSize:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Eye size={22} color="var(--accent)" /> بطاقة الأصل: {a.name}</h3>
                <button className="btn btn-ghost" onClick={() => setViewAsset(null)}><X size={18} /></button>
              </div>
              {sections.map(s => (
                <div key={s.title} style={{marginBottom:'1.25rem'}}>
                  <div style={{fontWeight:800, color:'var(--accent)', fontSize:'0.9rem', marginBottom:'0.5rem', borderBottom:'1px solid var(--border)', paddingBottom:'0.4rem'}}>{s.title}</div>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem 1.5rem'}}>
                    {s.rows.map(([k, v]) => (
                      <div key={k} style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', gap:'1rem'}}>
                        <span style={{color:'var(--text-muted)'}}>{k}</span><strong>{v}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{display:'flex', gap:'0.75rem', marginTop:'1rem'}}>
                <button className="btn btn-primary" onClick={() => { setEditingAsset(viewAsset); setViewAsset(null); setView('new-asset'); }}><Edit size={16} /> تعديل الأصل</button>
                <button className="btn btn-ghost" onClick={() => setViewAsset(null)}>إغلاق</button>
              </div>
            </div>
          </div>
        );
      })()}

      {viewWarehouse && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)'}} onClick={() => setViewWarehouse(null)}>
          <div className="card" style={{width:'460px', maxWidth:'94vw', background:'var(--card-bg)', padding:'2rem'}} onClick={e => e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem'}}>
              <h3 style={{fontSize:'1.15rem'}}>{viewWarehouse.name}</h3>
              <button className="btn btn-ghost" onClick={() => setViewWarehouse(null)}><X size={18} /></button>
            </div>
            {[['المعرف', viewWarehouse.id], ['رمز الصنف (SKU)', viewWarehouse.sku], ['الفئة', viewWarehouse.category], ['الكمية', viewWarehouse.qty], ['الحد الأدنى', viewWarehouse.minQty], ['الموقع (Bin)', viewWarehouse.location], ['مرحلة RADAR', viewWarehouse.stage], ['الحالة', viewWarehouse.status], ['آخر جرد', viewWarehouse.lastAudit]].map(([k, v]) => (
              <div key={k} style={{display:'flex', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'1px solid var(--border)', fontSize:'0.9rem'}}><span style={{color:'var(--text-muted)'}}>{k}</span><strong>{v}</strong></div>
            ))}
          </div>
        </div>
      )}

      <input ref={importInputRef} type="file" accept=".xlsx,.xls,.csv" style={{display:'none'}} onChange={handleImportFile} />

      {importPreview && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)'}}>
          <div className="card" style={{width:'720px', maxWidth:'94vw', maxHeight:'88vh', overflowY:'auto', background:'var(--card-bg)', padding:'2rem'}}>
            <h3 style={{fontSize:'1.25rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Upload size={22} color="var(--accent)" /> معاينة استيراد الأصول من Excel</h3>
            <div style={{display:'flex', gap:'1rem', marginBottom:'1.25rem'}}>
              <div style={{flex:1, padding:'1rem', borderRadius:'12px', background:'#f0fdf4', color:'#166534', fontWeight:700}}>✅ صالحة: {importPreview.rows.length}</div>
              <div style={{flex:1, padding:'1rem', borderRadius:'12px', background:'#fef2f2', color:'#991b1b', fontWeight:700}}>⚠️ بها أخطاء: {importPreview.errors.length}</div>
              <div style={{flex:1, padding:'1rem', borderRadius:'12px', background:'#eff6ff', color:'#1e40af', fontWeight:700}}>تحديث لأصول موجودة: {importPreview.rows.filter(r => r.data.id && assets.some(a => a.id === r.data.id)).length}</div>
            </div>
            {importPreview.errors.length > 0 && (
              <div style={{marginBottom:'1.25rem', maxHeight:'200px', overflowY:'auto', border:'1px solid #fecaca', borderRadius:'8px', padding:'0.75rem', fontSize:'0.85rem'}}>
                {importPreview.errors.map(e => <div key={e.line} style={{padding:'0.25rem 0'}}><strong>سطر {e.line}:</strong> {e.issues}</div>)}
              </div>
            )}
            <p style={{color:'var(--text-muted)', fontSize:'0.8rem', marginBottom:'1rem'}}>سيتم استيراد الأسطر الصالحة فقط، وتجاهل الأسطر التي بها أخطاء. صحّح الأخطاء في الملف وأعد رفعه لاستيرادها.</p>
            <div style={{display:'flex', gap:'0.75rem'}}>
              <button className="btn btn-primary" disabled={importPreview.rows.length === 0} onClick={confirmImport}><CheckCircle size={16} /> استيراد {importPreview.rows.length} أصل</button>
              <button className="btn btn-ghost" onClick={() => setImportPreview(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div style={{position:'fixed', bottom:'2rem', right:'2rem', background:'var(--accent)', color:'#fff', padding:'1rem 1.5rem', borderRadius:'8px', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.3)', zIndex:9999, display:'flex', alignItems:'center', gap:'0.75rem', fontWeight:600}}>
          <CheckCircle size={20} /> {toastMessage}
        </div>
      )}

      <button 
        style={{position:'fixed', bottom:'2rem', left:'2rem', background:'linear-gradient(135deg, var(--brand-teal), var(--brand-green))', color:'white', width:'60px', height:'60px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-accent)', zIndex:9998, border:'none', cursor:'pointer', transition:'transform 0.2s'}}
        onClick={() => setIsChatOpen(true)}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Bot size={28} />
      </button>

      {isChatOpen && (
        <div style={{position:'fixed', bottom:'5rem', left:'2rem', width:'420px', height:'620px', background:'var(--card-bg)', borderRadius:'24px', boxShadow:'0 25px 50px -12px rgba(0,0,0,0.25)', zIndex:10000, display:'flex', flexDirection:'column', border:'1px solid var(--border)', overflow:'hidden', animation:'slideUp 0.3s ease-out'}}>
          {/* AI Header - Manafez Brand */}
          <div style={{background:'linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-green) 100%)', color:'white', padding:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
              <div style={{background:'rgba(255,255,255,0.2)', padding:'0.5rem', borderRadius:'12px', position:'relative'}}>
                 <Bot size={24} />
                 <div style={{position:'absolute', bottom:'-2px', right:'-2px', width:'10px', height:'10px', background:'#fff', borderRadius:'50%', border:'2px solid var(--brand-green)'}}></div>
              </div>
              <div>
                 <div style={{fontWeight:800, fontSize:'1rem'}}>تراؤف AI V5.0</div>
                 <div style={{fontSize:'0.7rem', opacity:0.9}}>متصل | أصول + مستودعات + RADAR</div>
              </div>
            </div>
            <div style={{display:'flex', gap:'0.5rem'}}>
               <button onClick={() => setAutoSpeak(!autoSpeak)} style={{background:'transparent', border:'none', color:'white', cursor:'pointer', opacity: autoSpeak ? 1 : 0.5}} title="التحدث تلقائياً">
                  {autoSpeak ? <Volume2 size={20}/> : <VolumeX size={20}/>}
               </button>
               <button style={{background:'transparent', border:'none', color:'white', cursor:'pointer'}} onClick={() => setIsChatOpen(false)}><X size={20} /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{flex:1, padding:'1.5rem', overflowY:'auto', display:'flex', flexDirection:'column', gap:'1.25rem', background:'var(--bg)'}}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end', display:'flex', flexDirection:'column', gap:'0.25rem', maxWidth:'85%'}}>
                <div style={{
                  background: msg.role === 'bot' ? 'var(--card-bg)' : 'linear-gradient(135deg, var(--brand-teal), var(--brand-green))', 
                  color: msg.role === 'bot' ? 'var(--text)' : 'white', 
                  padding:'1rem 1.25rem', 
                  borderRadius: msg.role === 'bot' ? '0 16px 16px 16px' : '16px 16px 0 16px', 
                  fontSize:'0.9rem', lineHeight:1.6,
                  boxShadow: msg.role === 'bot' ? 'var(--shadow-sm)' : 'var(--shadow-accent)',
                  border: msg.role === 'bot' ? '1px solid var(--border)' : 'none'
                }}>
                  {msg.text}
                </div>
                <div style={{fontSize:'0.65rem', color:'var(--text-muted)', textAlign: msg.role === 'bot' ? 'right' : 'left', padding:'0 0.5rem'}}>
                  {msg.role === 'bot' ? 'تراؤف ذكاء اصطناعي' : 'أنت'}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{alignSelf:'flex-start', background:'var(--card-bg)', padding:'0.75rem 1.25rem', borderRadius:'0 16px 16px 16px', border:'1px solid var(--border)', display:'flex', gap:'4px'}}>
                 <div className="typing-dot"></div>
                 <div className="typing-dot"></div>
                 <div className="typing-dot"></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions - Enhanced with Warehouse */}
          <div style={{padding:'0.5rem 1rem', display:'flex', gap:'0.5rem', overflowX:'auto', background:'var(--card-bg)', borderTop:'1px solid var(--border)'}}>
             {[
               {label: 'حالة المخزون', icon: <Warehouse size={12}/>},
               {label: 'أصول حرجة', icon: <AlertTriangle size={12}/>},
               {label: 'تحليل RADAR', icon: <Target size={12}/>},
               {label: 'فرص الوفر', icon: <Zap size={12}/>},
               {label: 'تقرير شامل', icon: <BarChart3 size={12}/>},
             ].map((chip, idx) => (
               <button key={idx} onClick={() => setChatInput(chip.label)} style={{whiteSpace:'nowrap', padding:'0.4rem 0.8rem', borderRadius:'20px', border:'1px solid var(--border)', background:'var(--card-bg)', fontSize:'0.75rem', fontWeight:600, color:'var(--text-secondary)', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem', transition:'all 0.2s'}} onMouseEnter={e => {e.currentTarget.style.borderColor = 'var(--brand-teal)'; e.currentTarget.style.color = 'var(--brand-teal)';}} onMouseLeave={e => {e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)';}}>
                 {chip.icon} {chip.label}
               </button>
             ))}
          </div>

          {/* Input Area */}
          <form style={{display:'flex', padding:'1.25rem', background:'var(--card-bg)', borderTop:'1px solid var(--border)', gap:'0.75rem'}} onSubmit={(e) => {
            e.preventDefault();
            if(!chatInput.trim()) return;
            const userInput = chatInput;
            setChatMessages(prev => [...prev, {role: 'user', text: userInput}]);
            setChatInput('');
            setIsTyping(true);
            
            setTimeout(() => {
              let botResponse = '';
              const totalWH = warehouseItems.reduce((s,i) => s + i.qty, 0);
              const lowWH = warehouseItems.filter(i => i.qty <= i.minQty && i.qty > 0).length;
              const outWH = warehouseItems.filter(i => i.qty === 0).length;

              if(userInput.includes('مخزون') || userInput.includes('مستودع')) {
                botResponse = `📦 تقرير المخزون اللحظي:\n• إجمالي الوحدات: ${totalWH} وحدة\n• أصناف منخفضة المخزون: ${lowWH}\n• أصناف نفدت بالكامل: ${outWH}\n\nأوصي بإصدار أوامر شراء عاجلة للأصناف المنفدة لتجنب تعطل العمليات.`;
              } else if(userInput.includes('RADAR') || userInput.includes('رادار')) {
                const stages = ['Receive','Allocate','Deploy','Audit','Retire'].map(s => warehouseItems.filter(i => i.stage === s).length);
                botResponse = `🎯 تحليل مراحل RADAR:\n• الاستلام: ${stages[0]} أصول\n• التخصيص: ${stages[1]} أصول\n• النشر: ${stages[2]} أصول\n• المراجعة: ${stages[3]} أصول\n• الإحلال: ${stages[4]} أصول\n\nتحليلي: ${stages[2] > 3 ? 'نسبة النشر عالية (إيجابي). ' : ''}${stages[4] > 0 ? 'يوجد أصول بحاجة لقرار إحلال عاجل.' : 'لا توجد أصول في مرحلة الإحلال حالياً.'}`;
              } else if(userInput.includes('ميزانية') || userInput.includes('وفر')) {
                botResponse = '💰 بناءً على تحليل بند CAPEX الحالي، يظهر وفر مالي بنسبة 12% في قسم التقنية (حوالي 150,000 ر.س). أوصي بتدوير هذا الوفر لتحديث خوادم المستودعات وتعزيز منظومة RADAR.';
              } else if(userInput.includes('أصول') || userInput.includes('حرجة') || userInput.includes('مخاطر')) {
                botResponse = '⚠️ أراقب 3 أصول تقنية (Firewalls) تقترب من نهاية عمرها الإنتاجي. احتمال التعطل يقدر بـ 15% خلال الأشهر الثلاثة القادمة. كما يوجد ' + lowWH + ' صنف بمستوى مخزون منخفض في المستودعات.';
              } else if(userInput.includes('جرد')) {
                botResponse = '📋 حملة الجرد الحالية في فرع الرياض مكتملة بنسبة 94%. تبقى 6 أصول لم تُطابق بعد. نظام RADAR يقترح بدء مراجعة ميدانية للمخزون المتبقي.';
              } else if(userInput.includes('تقرير') || userInput.includes('شامل')) {
                botResponse = `📊 التقرير الشامل لمنظومة تراؤف V5.0:\n• الأصول المسجلة: ${assets.length} أصل\n• القيمة الرأسمالية: ${totals.cost.toLocaleString()} ر.س\n• صافي القيمة: ${totals.nbv.toLocaleString()} ر.س\n• المستودعات: ${totalWH} وحدة مخزون\n• حالة RADAR: فعّال ✅\n\nالنظام يعمل بكفاءة 94.8%. هل تحتاج تفاصيل إضافية؟`;
              } else {
                botResponse = `🤖 مرحباً! أنا تراؤف AI V5.0 المدعوم بمنهجية RADAR. تحليلي لمدخلاتك: "${userInput}"\n\nيمكنني مساعدتك في:\n• تحليل الأصول والمستودعات\n• تقارير RADAR الخماسية\n• التنبؤ بالإحلال والمخاطر\n• تحليل الميزانية والوفر\n\nتفضل بسؤالك!`;
              }
              setChatMessages(prev => [...prev, {role: 'bot', text: botResponse}]);
              setIsTyping(false);
              if(autoSpeak) speak(botResponse);
              setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }, 1500);
          }}>
            <button type="button" onClick={startListening} style={{background: isListening ? '#ef4444' : 'var(--thead-bg)', color: isListening ? 'white' : 'var(--text-muted)', border:'none', borderRadius:'12px', width:'45px', height:'45px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s'}}>
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input type="text" placeholder="اسأل عن الأصول، المستودعات، RADAR..." value={chatInput} onChange={e => setChatInput(e.target.value)} style={{flex:1, padding:'0 1rem', borderRadius:'12px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', outline:'none', fontSize:'0.9rem'}} />
            <button type="submit" style={{background:'linear-gradient(135deg, var(--brand-teal), var(--brand-green))', color:'white', border:'none', borderRadius:'12px', width:'45px', height:'45px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'var(--shadow-accent)'}}><Send size={20} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
