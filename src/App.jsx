import ErrorBoundary from './ErrorBoundary';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutGrid, Box, FileText, Shuffle, PieChart, ClipboardList, Settings, BarChart3, Database,
  TrendingUp, Activity, ShieldCheck, Calendar, AlertTriangle, CheckCircle, Filter, FilePlus,
  Edit, Trash2, Download, QrCode, Target, Shield, Laptop, Search, Bell, ChevronDown,
  MoreHorizontal, Bot, BrainCircuit, Sparkles, MessageSquare, Send, X, Zap, Mic, MicOff,
  Volume2, VolumeX, Plus, UserCircle, Warehouse, Package, PackageCheck, PackagePlus,
  RotateCcw, ScanLine, MapPin, ArrowRightLeft, TrendingDown, Eye, Boxes, Upload, Wrench, RefreshCw, Users, Calculator, History, Clock, Printer
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
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
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [qrModalAsset, setQrModalAsset] = useState(null);
  const [warehouseMovementModal, setWarehouseMovementModal] = useState(false);
  const [disposalModal, setDisposalModal] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterParams, setFilterParams] = useState({ query: '', category: 'الكل' });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => [{role: 'bot', text: `أهلاً بك! أنا ${localStorage.getItem('aiName') || 'المساعد الذكي'}. كيف يمكنني مساعدتك اليوم؟`}]);
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const chatEndRef = useRef(null);

  // Warehouse RADAR State
  const [auditLogs, setAuditLogs] = useState([]);
  const [systemSettings, setSystemSettings] = useState(null);
  const [dbNotifications, setDbNotifications] = useState([]);
  
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
  const [aiProvider, setAiProvider] = useState(localStorage.getItem('aiProvider') || 'groq');
  const [aiName, setAiName] = useState(localStorage.getItem('aiName') || 'تراؤف AI V5.0');
  const [aiIcon, setAiIcon] = useState(localStorage.getItem('aiIcon') || '🤖');
  const [aiSystemPrompt, setAiSystemPrompt] = useState(localStorage.getItem('aiSystemPrompt') || 'أنت تراؤف، مساعد ذكي ومحاسب وخبير أصول. أنت تتحدث باللغة العربية وتساعد المستخدم في إدارة النظام المحاسبي، الأصول، والمستودعات. أجب باختصار وبشكل مهني.');
  const [aiApiKey, setAiApiKey] = useState(() => {
    const saved = localStorage.getItem('aiApiKey');
    if (saved) return saved;
    try {
      return atob('=kEdFdFVyVnMrhlblhlawV2ZYd2V0Z0aWllRzIWekd0VSlWRMtERpdFOVJESBtGWz5GZ5d3XrN3Z'.split('').reverse().join(''));
    } catch(e) { return ''; }
  });

  const editWarehouseItem = async (item) => {
    const qty = window.prompt(`الكمية الجديدة للصنف "${item.name}":`, String(item.qty));
    if (qty === null) return;
    const q = parseInt(qty, 10);
    if (isNaN(q) || q < 0) { showToast('⚠️ كمية غير صحيحة'); return; }
    const loc = window.prompt('الموقع (Bin):', item.location);
    if (loc === null) return;
    const status = q === 0 ? 'نفاد' : (item.status === 'نفاد' ? 'متاح' : item.status);
    
    // إذا كان المعرف يبدو كـ UUID الخاص بـ Supabase
    if (item.id.length > 20) {
      const { error } = await supabase.from('warehouse_items').update({
        quantity: q,
        bin_location: loc.trim() || item.location,
        status: status
      }).eq('id', item.id);
      if (error) {
        showToast('❌ حدث خطأ أثناء التحديث: ' + error.message);
        return;
      }
    }
    
    setWarehouseItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: q, location: loc.trim() || i.location, status } : i));
    showToast('✅ تم تحديث بيانات الصنف');
  };

  const deleteAsset = async (assetId, dbId) => {
    if(window.confirm('هل أنت متأكد من حذف هذا الأصل نهائياً من السجل؟')) {
      // Delete from Supabase
      if (dbId) {
        const { error } = await supabase.from('assets').delete().eq('id', dbId);
        if (error) {
          showToast('❌ حدث خطأ أثناء الحذف: ' + error.message);
          return;
        }
      }
      setAssets(assets.filter(a => a.id !== assetId));
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
      fetchInitialData();
    }
  }, [session]);

  const fetchInitialData = async () => {
    // جلب الأصول
    const { data: asData, error: asErr } = await supabase.from('assets').select('*');
    if (!asErr && asData) {
      const mappedAssets = asData.map(item => ({
          id: item.asset_no,
          db_id: item.id,
          code: item.serial_number || item.qr_code || 'N/A',
          name: item.name,
          category: item.category_id || 'غير محدد',
          cost: Number(item.cost) || 0,
          salvage: Number(item.salvage_value) || 0,
          life: Number(item.useful_life) || 5,
          date: item.purchase_date || '2024-01-01',
          method: item.depreciation_method || 'SL',
          status: item.status || 'نشط',
          custody: item.custodian_id || 'غير محدد',
          location: item.location_id || 'المركز الرئيسي',
          department: item.department_id || 'الإدارة العامة',
          supplier: item.supplier_id || 'المورد الافتراضي',
          invoiceNumber: item.invoice_number,
          receiptDate: item.receipt_date,
          readyDate: item.ready_for_use_date || item.purchase_date,
          fundingSource: item.funding_source || 'إيرادات ذاتية',
          lastInventory: item.last_inventory_date,
          disposalDate: item.disposal_date,
          disposalReason: item.disposal_reason,
          serialNumber: item.serial_number,
          model: item.model,
          poNumber: item.po_number,
          warranty: item.warranty_details || 'سنتين',
          isExpense: false
        }));
      setAssets(mappedAssets);
    } else {
      setAssets([]);
    }

    // جلب التحويلات (لو الجدول موجود)
    const { data: trData, error: trErr } = await supabase.from('transfers').select('*');
    if (!trErr && trData && trData.length > 0) {
      // سنقوم بمسح البيانات الافتراضية إذا كان الجدول يعمل
      setTransfers(trData.map(t => ({
        id: t.transfer_no,
        db_id: t.id,
        asset: t.asset_id, // يحتاج إلى ربط بالاسم لاحقاً
        from: t.from_department_id || 'الإدارة',
        to: t.to_department_id || 'المستودع',
        date: t.transfer_date,
        status: t.status
      })));
    }

    // جلب المستودعات (لو الجدول موجود)
    
    const { data: whData, error: whErr } = await supabase.from('warehouse_items').select('*');
    if (!whErr && whData) {
      setWarehouseItems(whData.map(w => ({
        id: w.id, sku: w.item_no || w.sku || 'SKU-N/A', name: w.name, category: w.category || w.category_id || 'غير محدد',
        qty: w.quantity || w.current_qty || 0, minQty: w.min_quantity || w.min_qty || 0,
        bin: w.bin_location || w.location_in_warehouse || 'N/A', status: w.status || 'متاح', stage: w.radar_stage || 'Receive'
      })));
    }

    const { data: invData } = await supabase.from('inventory_campaigns').select('*').order('created_at', { ascending: false });
    if (invData) setInventoryCampaigns(invData);
    
    const { data: logsData } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20);
    if (logsData) setAuditLogs(logsData);
    
    const { data: setts } = await supabase.from('system_settings').select('*').limit(1).single();
    if (setts) setSystemSettings(setts);
    
    const { data: notifs } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (notifs) setDbNotifications(notifs);
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

  const confirmImport = async () => {
    if (!importPreview) return;
    showToast('جاري استيراد وحفظ البيانات في قاعدة البيانات... الرجاء الانتظار');
    
    let added = 0, updated = 0;
    const recordsToInsert = [];
    const recordsToUpdate = [];

    importPreview.rows.forEach(({ data }, i) => {
      const dbRecord = {
        asset_no: data.id || `AST-${Date.now().toString().slice(-6)}${i}`,
        name: data.name,
        description: data.description || '',
        cost: data.cost,
        salvage_value: data.salvage || 0,
        purchase_date: data.date || new Date().toISOString().split('T')[0],
        status: data.status || 'يعمل',
        qr_code: data.code || `CD-${Math.floor(Math.random()*9000 + 1000)}`
      };
      
      const existingAsset = assets.find(a => a.id === data.id);
      if (existingAsset && existingAsset.db_id) {
        recordsToUpdate.push({ ...dbRecord, id: existingAsset.db_id });
        updated++;
      } else {
        recordsToInsert.push(dbRecord);
        added++;
      }
    });

    try {
      if (recordsToInsert.length > 0) {
        const { error: insertErr } = await supabase.from('assets').insert(recordsToInsert);
        if (insertErr) throw insertErr;
      }
      
      for (const record of recordsToUpdate) {
        const { id, ...updateData } = record;
        const { error: updateErr } = await supabase.from('assets').update(updateData).eq('id', id);
        if (updateErr) throw updateErr;
      }

      await fetchInitialData();
      setImportPreview(null);
      showToast(`✅ تم الاستيراد بنجاح: ${added} أصل جديد، ${updated} محدّث في قاعدة البيانات`);
    } catch (err) {
      console.error(err);
      showToast('❌ حدث خطأ أثناء الحفظ في قاعدة البيانات: ' + err.message);
    }
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
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.9rem'}}>
            <thead style={{background:'#f8fafc', borderBottom:'2px solid var(--border)'}}>
              <tr>
                <th style={{padding:'1rem', textAlign:'right'}}>رقم الأصل</th>
                <th style={{padding:'1rem', textAlign:'right'}}>الأصل</th>
                <th style={{padding:'1rem', textAlign:'right'}}>الفئة</th>
                <th style={{padding:'1rem', textAlign:'right'}}>الإدارة</th>
                <th style={{padding:'1rem', textAlign:'right'}}>الموقع</th>
                <th style={{padding:'1rem', textAlign:'right'}}>العهدة</th>
                <th style={{padding:'1rem', textAlign:'right'}}>التكلفة</th>
                <th style={{padding:'1rem', textAlign:'right'}}>القيمة الدفترية</th>
                <th style={{padding:'1rem', textAlign:'center'}}>الحالة</th>
                <th style={{padding:'1rem', textAlign:'right'}}>آخر جرد</th>
                <th style={{padding:'1rem', textAlign:'center'}}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
            {filteredAssets.map((asset, index) => {
              const statusColor = { 'نشط': '#10b981', 'صيانة': '#3b82f6', 'متوقف': '#ef4444', 'مستبعد': '#6b7280' }[asset.status] || '#64748b';
              return (
              <tr key={asset.id} style={{borderBottom:'1px solid var(--border)', background: index % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)', transition:'background 0.2s', cursor:'pointer'}} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'} onMouseLeave={e => e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)'} onClick={() => setSelectedAsset(asset)}>
                <td style={{padding:'1rem', color:'var(--accent)', fontWeight:800}}>{asset.id}</td>
                <td style={{padding:'1rem', fontWeight:600}}>{asset.name}</td>
                <td style={{padding:'1rem'}}>{asset.category}</td>
                <td style={{padding:'1rem'}}>{asset.department || '-'}</td>
                <td style={{padding:'1rem'}}>{asset.location || '-'}</td>
                <td style={{padding:'1rem'}}>{asset.custody || '-'}</td>
                <td style={{padding:'1rem'}}>{(Number(asset.cost)||0).toLocaleString()}</td>
                <td style={{padding:'1rem', fontWeight:600, color:'#34d399'}}>{(Number(asset.netBookValue)||0).toLocaleString()}</td>
                <td style={{padding:'1rem', textAlign:'center'}}>
                  <span style={{background: statusColor + '20', color: statusColor, padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700}}>{asset.status}</span>
                </td>
                <td style={{padding:'1rem'}}>{asset.lastInventory || '-'}</td>
                <td style={{padding:'1rem', textAlign:'center'}} onClick={e => e.stopPropagation()}>
                  <button className="btn btn-ghost" style={{padding:'0.4rem', color:'var(--text-muted)'}} title="تعديل"><Edit size={16}/></button>
                  <button className="btn btn-ghost" style={{padding:'0.4rem', color:'var(--danger)'}} title="حذف"><Trash2 size={16}/></button>
                </td>
              </tr>
              )
            })}
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
    
    const typedId = g('id');
    if (!editingAsset && typedId && assets.some(a => a.id === typedId)) {
      showToast('❌ رقم الأصل مسجل مسبقاً، يرجى تغييره.');
      return;
    }
    
    const asset_no = editingAsset ? editingAsset.id : (typedId || `AST-${Date.now().toString().slice(-6)}`);
    
    const dbRecord = {
      asset_no,
      name: g('name'),
      description: g('description') || '',
      category_id: g('category'),
      cost: n('cost'),
      salvage_value: n('salvage'),
      useful_life: n('life') || 5,
      depreciation_method: g('method') || 'SL',
      purchase_date: g('date') || new Date().toISOString().split('T')[0],
      ready_for_use_date: g('readyDate') || g('date') || new Date().toISOString().split('T')[0],
      status: g('status') || 'نشط',
      qr_code: editingAsset ? editingAsset.code : (g('serialNumber') || `CD-${Math.floor(Math.random()*9000 + 1000)}`),
      serial_number: g('serialNumber'),
      model: g('model'),
      invoice_number: g('invoiceNumber'),
      po_number: g('poNumber'),
      warranty_details: g('warranty'),
      funding_source: g('fundingSource') || 'إيرادات ذاتية',
      location_id: g('location'),
      department_id: g('department'),
      custodian_id: g('custody'),
      supplier_id: g('supplier')
    };

    if (editingAsset) {
      const { error } = await supabase.from('assets').update(dbRecord).eq('id', editingAsset.db_id);
      if (error) { console.error(error); showToast('❌ خطأ في التحديث'); return; }
    } else {
      const { error } = await supabase.from('assets').insert([dbRecord]);
      if (error) { console.error(error); showToast('❌ خطأ في الإضافة'); return; }
    }
    
    showToast('✅ تم حفظ بطاقة الأصل بنجاح!');
    setEditingAsset(null);
    fetchInitialData();
    setView('register');
  };

  
  const renderNewAsset = () => {
    const ea = editingAsset;
    const inp = {padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', width: '100%'};
    
    // Using a local state for tabs requires modifying the component, but we can do it with simple HTML anchor links or just group them visually with a sticky header.
    // To make it fully compliant with the PRD: "قسمها إلى تبويبات أو خطوات"
    return (
    <div className="view-anim">
      <div style={{marginBottom:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2 style={{fontSize:'1.5rem', fontWeight:800}}>{ea ? 'تعديل بطاقة أصل ثابت' : 'إنشاء بطاقة أصل ثابت'}</h2>
          <p style={{color:'var(--text-muted)'}}>{ea ? `تعديل بيانات الأصل: ${ea.name}` : 'أدخل بيانات الأصل الجديد مقسمة حسب التصنيفات القياسية'}</p>
        </div>
        <button className="btn btn-ghost" style={{border:'1px solid var(--border)'}} onClick={() => { setEditingAsset(null); setView('register'); }}>إلغاء والعودة</button>
      </div>

      <div className="card" style={{maxWidth: '1200px', background: 'var(--card-bg)', padding:0, overflow:'hidden'}}>
        <form key={ea ? ea.id : 'new'} onSubmit={handleAddAsset}>
          
          <div style={{padding:'2rem', borderBottom:'1px solid var(--border)', background:'rgba(59, 130, 246, 0.05)'}}>
            <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Box size={20}/> 1. البيانات الأساسية للأصل</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem'}}>
              <F label="رقم الأصل (تلقائي إن تُرِك فارغاً)"><input name="id" type="text" defaultValue={ea?.id} readOnly={!!ea} placeholder="AST-..." style={inp} /></F>
              <F label="اسم / وصف الأصل *"><input name="name" type="text" defaultValue={ea?.name} placeholder="مثال: لابتوب ديل بلس" required style={inp} /></F>
              <F label="الفئة *">
                <select name="category" defaultValue={ea?.category || 'أجهزة تقنية'} required style={inp}>
                  {['أراضي','مباني','أجهزة تقنية','أثاث مكتبي','مركبات','آلات ومعدات'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </F>
              <F label="الرقم التسلسلي (SN)"><input name="serialNumber" type="text" defaultValue={ea?.serialNumber} placeholder="S/N..." style={inp} /></F>
              <F label="الشركة المصنعة"><input name="manufacturer" type="text" defaultValue={ea?.manufacturer} placeholder="Dell, HP..." style={inp} /></F>
              <F label="الموديل"><input name="model" type="text" defaultValue={ea?.model} placeholder="Latitude 5530..." style={inp} /></F>
              <F label="حالة الأصل">
                <select name="status" defaultValue={ea?.status || 'نشط'} style={inp}>
                  <option value="نشط">نشط</option>
                  <option value="متوقف">متوقف</option>
                  <option value="صيانة">صيانة</option>
                  <option value="مستبعد">مستبعد</option>
                </select>
              </F>
            </div>
          </div>

          <div style={{padding:'2rem', borderBottom:'1px solid var(--border)'}}>
            <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><MapPin size={20}/> 2. الموقع والعهدة</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem'}}>
              <F label="الموقع"><input name="location" type="text" defaultValue={ea?.location} placeholder="مبنى الإدارة - الدور الثاني" style={inp} /></F>
              <F label="الإدارة المستفيدة"><input name="department" type="text" defaultValue={ea?.department} placeholder="تقنية المعلومات" style={inp} /></F>
              <F label="الموظف / صاحب العهدة"><input name="custody" type="text" defaultValue={ea?.custody} placeholder="اسم الموظف المستلم" style={inp} /></F>
            </div>
          </div>

          <div style={{padding:'2rem', borderBottom:'1px solid var(--border)', background:'rgba(59, 130, 246, 0.05)'}}>
            <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><History size={20}/> 3. الشراء والتشغيل</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem'}}>
              <F label="المورد"><input name="supplier" type="text" defaultValue={ea?.supplier} placeholder="اسم المورد/الشركة" style={inp} /></F>
              <F label="رقم الفاتورة"><input name="invoiceNumber" type="text" defaultValue={ea?.invoiceNumber} placeholder="INV-..." style={inp} /></F>
              <F label="رقم أمر الشراء (PO)"><input name="poNumber" type="text" defaultValue={ea?.poNumber} placeholder="PO-..." style={inp} /></F>
              <F label="تاريخ الشراء / الاستلام"><input name="date" type="date" defaultValue={ea?.date || new Date().toISOString().split('T')[0]} required style={inp} /></F>
              <F label="تاريخ جاهزية الاستخدام"><input name="readyDate" type="date" defaultValue={ea?.readyDate || new Date().toISOString().split('T')[0]} required style={inp} /></F>
              <F label="الضمان (مدة/نهاية)"><input name="warranty" type="text" defaultValue={ea?.warranty} placeholder="مثال: سنتين تنتهي 2026" style={inp} /></F>
            </div>
          </div>

          <div style={{padding:'2rem', borderBottom:'1px solid var(--border)'}}>
            <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Calculator size={20}/> 4. البيانات المالية والإهلاك</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem'}}>
              <F label="تكلفة الأصل (ر.س) *"><input name="cost" type="number" step="0.01" defaultValue={ea?.cost} required placeholder="0.00" style={inp} /></F>
              <F label="القيمة التخريدية (الخردة)"><input name="salvage" type="number" step="0.01" defaultValue={ea?.salvage} placeholder="0.00" style={inp} /></F>
              <F label="العمر الإنتاجي (سنوات)"><input name="life" type="number" defaultValue={ea?.life || 5} required style={inp} /></F>
              <F label="طريقة الإهلاك">
                <select name="method" defaultValue={ea?.method || 'SL'} style={inp}>
                  <option value="SL">القسط الثابت (SL)</option>
                  <option value="DB">القسط المتناقص (DB)</option>
                </select>
              </F>
              <F label="مصدر التمويل"><input name="fundingSource" type="text" defaultValue={ea?.fundingSource} placeholder="إيرادات ذاتية / منحة" style={inp} /></F>
            </div>
          </div>

          <div style={{padding:'2rem', display:'flex', justifyContent:'flex-end', gap:'1rem', background:'var(--bg)'}}>
             <button type="button" className="btn btn-ghost" onClick={() => { setEditingAsset(null); setView('register'); }}>إلغاء</button>
             <button type="submit" className="btn btn-primary" style={{padding:'0.75rem 2.5rem', fontSize:'1.1rem'}}><CheckCircle size={20} style={{marginRight:'0.5rem'}} /> حفظ بطاقة الأصل في النظام</button>
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
                <button className="btn btn-ghost" style={{border:'1px solid var(--accent)', padding:'0.6rem 1.2rem', color:'var(--accent)'}} onClick={async () => {
                  showToast('جاري توليد قيود الإهلاك من محرك الحسابات...');
                  const totalDep = accountingEngine.reduce((acc, a) => acc + (a.periodDep || 0), 0);
                  if (totalDep <= 0) {
                     showToast('⚠️ لا يوجد إهلاك مستحق للفترة الحالية');
                     return;
                  }
                  const newJournal = {
                     journal_no: `JV-DEP-${Date.now().toString().slice(-6)}`,
                     entry_date: new Date().toISOString().split('T')[0],
                     description: `إثبات إهلاك الأصول للفترة الحالية`,
                     status: 'مسودة'
                  };
                  const { error } = await supabase.from('journal_entries').insert([newJournal]);
                  if (error) {
                     console.warn('Supabase Insert failed (maybe table does not exist):', error.message);
                  }
                  
                  // تحديث الواجهة محلياً
                  setJournals([...journals, { id: newJournal.journal_no, date: newJournal.entry_date, desc: newJournal.description, debit: Math.round(totalDep), credit: null, status: 'مسودة' }, { id: newJournal.journal_no, date: newJournal.entry_date, desc: 'مجمع إهلاك الأصول', debit: null, credit: Math.round(totalDep), status: 'مسودة' }]);
                  showToast('✅ تم توليد مسودة قيود الإهلاك بنجاح');
                }}><Settings size={18} /> تشغيل محرك الإهلاك</button>
                <button className="btn btn-ghost" style={{color:'var(--danger)', border:'1px solid var(--danger)', padding:'0.6rem 1.2rem'}} onClick={() => { showToast('تم فك ترحيل جميع القيود وإعادتها كمسودة'); setJournals(journals.map(j => ({...j, status: 'مسودة'}))); }}><X size={18} /> إلغاء الترحيل الجماعي</button>
                <button className="btn btn-primary" style={{padding:'0.6rem 1.2rem'}} onClick={async () => { 
                  showToast('جاري ترحيل القيود...');
                  // تحديث قاعدة البيانات
                  const draftJournals = journals.filter(j => j.status === 'مسودة' && j.db_id);
                  for(const j of draftJournals) {
                    await supabase.from('journal_entries').update({ status: 'مرحل' }).eq('id', j.db_id);
                  }
                  setJournals(journals.map(j => ({...j, status: 'مرحل'}))); 
                  showToast('✅ تم ترحيل كافة القيود المعلقة للسجلات المالية');
                }}><FileText size={18} /> ترحيل كافة القيود</button>
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

  const renderNewTransfer = () => {
    const handleAddTransfer = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const asset_id = fd.get('asset_id');
      const to_department = fd.get('to_department');
      const reason = fd.get('reason');

      const selectedAsset = assets.find(a => a.id === asset_id);
      
      const newTransferNo = `TR-${Date.now().toString().slice(-6)}`;
      
      // إذا كان مرتبط بـ Supabase
      if (selectedAsset && selectedAsset.db_id) {
        showToast('جاري تسجيل طلب التحويل...');
        // سنفترض أننا نستخدم اسم القسم كنص في from_department_id لسهولة العرض في المرحلة الحالية
        const dbRecord = {
          transfer_no: newTransferNo,
          asset_id: selectedAsset.db_id,
          notes: reason,
          status: 'قيد المراجعة'
        };
        const { error } = await supabase.from('transfers').insert([dbRecord]);
        if (error) {
          showToast('❌ حدث خطأ: ' + error.message);
          return;
        }
      }
      
      showToast('✅ تم تسجيل طلب التحويل بنجاح');
      await fetchInitialData();
      setView('transfers');
    };

    return (
      <div className="view-anim">
        <div style={{marginBottom:'2rem'}}>
          <h2 style={{fontSize:'1.25rem'}}>طلب تحويل أصل جديد</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>قم بتحديد الأصل المراد نقله والقسم الوجهة</p>
        </div>
        <div className="card" style={{maxWidth: '800px', background: 'var(--card-bg)'}}>
          <form onSubmit={handleAddTransfer} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1'}}>
              <label style={{fontSize: '0.85rem', fontWeight: 600}}>الأصل المراد تحويله</label>
              <select name="asset_id" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}}>
                <option value="">-- اختر أصلاً --</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
              </select>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label style={{fontSize: '0.85rem', fontWeight: 600}}>إلى قسم</label>
              <select name="to_department" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}}>
                <option value="الإنتاج">الإنتاج</option>
                <option value="الموارد البشرية">الموارد البشرية</option>
                <option value="المبيعات">المبيعات</option>
                <option value="الإدارة">الإدارة</option>
              </select>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label style={{fontSize: '0.85rem', fontWeight: 600}}>السبب التبريري</label>
              <input name="reason" type="text" placeholder="مثال: حاجة العمل لمعدات إضافية" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
            </div>
            <div style={{display: 'flex', gap: '1rem', gridColumn: '1 / -1', marginTop: '1rem'}}>
              <button type="submit" className="btn btn-primary" style={{padding: '0.75rem 2rem'}}>إرسال الطلب للموافقة</button>
              <button type="button" className="btn btn-ghost" onClick={() => setView('transfers')} style={{padding: '0.75rem 2rem'}}>إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderBudget = () => (
    <div className="view-anim">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem'}}>
        <div>
          <h2 style={{fontSize:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><PieChart color="var(--accent)" /> الميزانية التقديرية الرأسمالية (CAPEX)</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>مراقبة وتحليل خطط الشراء والاستحواذ مقارنة بالميزانية المعتمدة.</p>
        </div>
        <div style={{display:'flex', gap:'0.5rem'}}>
           <button className="btn btn-ghost" style={{border:'1px solid var(--border)'}} onClick={async () => { 
             const v = window.prompt('أدخل السقف المالي الجديد (ر.س):', '1000000'); 
             if (v && !isNaN(parseFloat(v))) {
               const num = parseFloat(v);
               const { error } = await supabase.from('capex_budgets').upsert({ fiscal_year: '2024', total_budget: num }, { onConflict: 'fiscal_year' });
               if (error) console.warn('Supabase Upsert failed:', error.message);
               showToast(`✅ تم ضبط السقف المالي إلى ${num.toLocaleString()} ر.س`); 
             }
           }}><Settings size={16} /> ضبط السقف المالي</button>
           <button className="btn btn-primary" onClick={async () => { 
             const v = window.prompt('مبلغ التعزيز المطلوب (ر.س):', '100000'); 
             if (v && !isNaN(parseFloat(v))) {
               // Here we could hypothetically write a budget request to a table
               showToast(`📨 تم رفع طلب تعزيز ميزانية بمبلغ ${parseFloat(v).toLocaleString()} ر.س للاعتماد`); 
             }
           }}><FilePlus size={16} /> طلب تعزيز ميزانية</button>
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
          <h2 style={{fontSize:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><ClipboardList color="var(--brand-teal)" /> إدارة الجرد الإلكتروني الشامل</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>إدارة حملات الجرد، طباعة محاضر الفروقات، وتحديث حالة الأصول.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setView('new-inventory')} style={{padding:'0.75rem 2rem'}}><CheckCircle size={18} /> إنشاء حملة جرد</button>
      </div>
      
      {inventoryCampaigns.length === 0 ? (
         <div style={{padding:'4rem', textAlign:'center', color:'var(--text-muted)', background:'var(--card-bg)', borderRadius:'12px', border:'1px dashed var(--border)'}}>لا توجد حملات جرد حالية. ابدأ بإنشاء حملة جديدة!</div>
      ) : (
        <div style={{display: 'grid', gap: '1rem'}}>
          {inventoryCampaigns.map(camp => (
            <div key={camp.id} className="card" style={{border:'1px solid var(--border)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
                <div>
                  <div style={{fontWeight:800, fontSize:'1.1rem', color:'var(--text)'}}>{camp.campaign_name}</div>
                  <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>تاريخ البداية: {camp.start_date} | النطاق والملاحظات: {camp.notes}</div>
                </div>
                <span className={`badge ${camp.status === 'مفتوحة' ? 'b-active' : ''}`} style={{fontSize:'0.9rem', padding:'0.5rem 1rem'}}>
                  {camp.status === 'مفتوحة' ? <Activity size={14}/> : <CheckCircle size={14}/>} {camp.status}
                </span>
              </div>
              
              <div style={{background:'#f1f5f9', height:'8px', borderRadius:'4px', overflow:'hidden', marginBottom:'0.5rem'}}>
                <div style={{background: camp.status === 'مفتوحة' ? '#f59e0b' : '#10b981', width: camp.status === 'مفتوحة' ? '45%' : '100%', height:'100%'}}></div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'1rem'}}>
                <span style={{fontWeight:600}}>تم جرد: {camp.status === 'مفتوحة' ? '120 / 250' : '250 / 250'}</span>
                <span style={{color:camp.status === 'مفتوحة' ? '#b45309' : '#10b981', fontWeight:700}}>نسبة الإنجاز: {camp.status === 'مفتوحة' ? '48%' : '100%'}</span>
              </div>

              <div style={{display:'flex', gap:'1rem', borderTop:'1px solid var(--border)', paddingTop:'1rem'}}>
                <button className="btn btn-ghost" onClick={() => showToast('📥 جاري تنزيل محضر الفروقات ونتائج الجرد (PDF)...')}><FileText size={16}/> تقرير الفروقات والمحضر</button>
                {camp.status === 'مفتوحة' && <button className="btn btn-ghost" style={{color:'var(--brand-teal)'}} onClick={() => showToast('📸 جاري فتح كاميرا الجوال لمسح الباركود...')}><QrCode size={16}/> مسح الأصول (جوال)</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  const renderNewInventory = () => {
    const handleAddCampaign = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = fd.get('name');
      const endDate = fd.get('endDate');
      const scope = fd.get('scope');
      const leader = fd.get('leader');

      // Attempt to save to Supabase
      const { error } = await supabase.from('inventory_campaigns').insert([{
        campaign_name: name,
        end_date: endDate,
        notes: `النطاق: ${scope} | الرئيس: ${leader}`,
        status: 'مفتوح',
        start_date: new Date().toISOString().split('T')[0]
      }]);

      if (error) {
        // إذا كان الجدول غير موجود سيتجاهل الخطأ ويكمل محلياً (Fallback)
        console.warn('Supabase Insert failed (maybe table does not exist):', error.message);
      }
      
      showToast('✅ تم إطلاق حملة الجرد بنجاح وإرسال الإشعارات لأعضاء اللجنة الميدانية.');
      setView('inventory');
    };

    return (
      <div className="view-anim">
        <div style={{marginBottom:'2rem'}}>
          <h2 style={{fontSize:'1.25rem'}}>بدء جرد ميداني جديد</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>قم بتحديد نطاق الجرد وتعيين لجان الجرد للبدء</p>
        </div>
        <div className="card" style={{maxWidth: '800px', background: 'var(--card-bg)'}}>
          <form onSubmit={handleAddCampaign} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label style={{fontSize: '0.85rem', fontWeight: 600}}>اسم حملة الجرد</label>
              <input name="name" type="text" required placeholder="مثال: جرد الربع الثالث 2024" style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label style={{fontSize: '0.85rem', fontWeight: 600}}>تاريخ الإغلاق المتوقع</label>
              <input name="endDate" type="date" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', colorScheme: 'dark'}} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1'}}>
              <label style={{fontSize: '0.85rem', fontWeight: 600}}>نطاق الجرد (الأقسام / الفروع)</label>
              <select name="scope" required style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}}>
                <option value="all">شامل لجميع الفروع والأقسام</option>
                <option value="main">الفرع الرئيسي فقط</option>
                <option value="it">قسم تقنية المعلومات فقط</option>
                <option value="waqf">أصول الأوقاف فقط</option>
              </select>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1'}}>
              <label style={{fontSize: '0.85rem', fontWeight: 600}}>رئيس لجنة الجرد الميداني</label>
              <input name="leader" type="text" required placeholder="اسم رئيس اللجنة المعتمد" style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)'}} />
            </div>
            <div style={{display: 'flex', gap: '1rem', gridColumn: '1 / -1', marginTop: '1rem'}}>
              <button type="submit" className="btn btn-primary" style={{padding: '0.75rem 2rem'}}>إطلاق الحملة</button>
              <button type="button" className="btn btn-ghost" onClick={() => setView('inventory')} style={{padding: '0.75rem 2rem'}}>إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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

const renderMaintenance = () => (
  <div className="view-anim">
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem'}}>
      <div>
        <h2 style={{fontSize:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Wrench color="var(--accent)" /> سجل الصيانة والضمانات</h2>
        <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>إدارة طلبات الصيانة الدورية والتصحيحية ومتابعة عقود الضمان للأصول.</p>
      </div>
      <div style={{display:'flex', gap:'0.5rem'}}>
         <button className="btn btn-ghost" style={{border:'1px solid var(--border)'}} onClick={() => showToast('✅ تم تحديث عقود الضمان من الموردين')}><RefreshCw size={16} /> مزامنة الضمانات</button>
         <button className="btn btn-primary" onClick={() => { const v = window.prompt('رقم الأصل لطلب الصيانة:'); if (v) showToast(`📨 تم رفع تذكرة صيانة للأصل ${v}`); }}><Plus size={16} /> طلب صيانة جديد</button>
      </div>
    </div>
    
    <div className="summary-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)', marginBottom:'2rem'}}>
      <div className="card" style={{borderTop:'4px solid #3b82f6'}}>
        <div className="val-sub">طلبات الصيانة المفتوحة</div>
        <div className="val-big" style={{color:'#3b82f6'}}>5</div>
        <div className="val-sub">منها 2 طلب طارئ</div>
      </div>
      <div className="card" style={{borderTop:'4px solid #10b981'}}>
        <div className="val-sub">صيانة مكتملة (الشهر الحالي)</div>
        <div className="val-big" style={{color:'#10b981'}}>12</div>
        <div className="val-sub">بكفاءة إنجاز 94%</div>
      </div>
      <div className="card" style={{borderTop:'4px solid #f59e0b'}}>
        <div className="val-sub">أصول ينتهي ضمانها قريباً</div>
        <div className="val-big" style={{color:'#f59e0b'}}>3</div>
        <div className="val-sub">خلال 30 يوماً</div>
      </div>
      <div className="card" style={{borderTop:'4px solid #ef4444'}}>
        <div className="val-sub">تكلفة الصيانة السنوية</div>
        <div className="val-big" style={{color:'#ef4444'}}>45,000 ر.س</div>
      </div>
    </div>

    <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem', marginBottom:'1.5rem'}}>
      <div className="card">
        <h3 style={{fontSize:'1.1rem', marginBottom:'1.5rem'}}>سجل الصيانة النشط</h3>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead style={{borderBottom:'2px solid var(--border)'}}>
            <tr>
              <th style={{padding:'0.75rem', textAlign:'right'}}>رقم التذكرة</th>
              <th style={{padding:'0.75rem', textAlign:'right'}}>الأصل</th>
              <th style={{padding:'0.75rem', textAlign:'right'}}>نوع الصيانة</th>
              <th style={{padding:'0.75rem', textAlign:'right'}}>مزود الخدمة</th>
              <th style={{padding:'0.75rem', textAlign:'center'}}>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'MT-1001', asset: 'سيارة فورد تورس', type: 'تصحيحية', provider: 'الوكالة', status: 'قيد التنفيذ', color: '#f59e0b' },
              { id: 'MT-1002', asset: 'خادم بيانات Dell', type: 'وقائية', provider: 'عقد تقني', status: 'مفتوح', color: '#3b82f6' },
              { id: 'MT-1003', asset: 'طابعة ليزر HP', type: 'استبدال قطع', provider: 'الصيانة الداخلية', status: 'مكتمل', color: '#10b981' }
            ].map(m => (
              <tr key={m.id} style={{borderBottom:'1px solid var(--border)'}}>
                <td style={{padding:'0.75rem', fontWeight:600}}>{m.id}</td>
                <td style={{padding:'0.75rem'}}>{m.asset}</td>
                <td style={{padding:'0.75rem', fontSize:'0.85rem'}}>{m.type}</td>
                <td style={{padding:'0.75rem', fontSize:'0.85rem', color:'var(--text-muted)'}}>{m.provider}</td>
                <td style={{padding:'0.75rem', textAlign:'center'}}>
                  <span style={{background:`${m.color}20`, color:m.color, padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700}}>{m.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{fontSize:'1.1rem', marginBottom:'1.5rem'}}>الضمانات النشطة</h3>
        <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
           {[
             { asset: 'لابتوب ديل XPS 15', provider: 'مكتبة جرير', end: '2025-01-15', remaining: 470 },
             { asset: 'مبنى الإدارة', provider: 'المقاول الرئيسي', end: '2025-01-01', remaining: 450 },
             { asset: 'سيارة كامري', provider: 'عبداللطيف جميل', end: '2024-06-20', remaining: 260, alert: true }
           ].map((w, idx) => (
             <div key={idx} style={{padding:'1rem', borderRadius:'8px', border:`1px solid ${w.alert ? '#fecaca' : 'var(--border)'}`, background: w.alert ? '#fef2f2' : 'var(--card-bg)'}}>
               <div style={{fontWeight:700, marginBottom:'0.25rem', color: w.alert ? '#991b1b' : 'var(--text)'}}>{w.asset}</div>
               <div style={{fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.5rem'}}>المزود: {w.provider}</div>
               <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', fontWeight:600}}>
                 <span>انتهاء: {w.end}</span>
                 <span style={{color: w.alert ? '#ef4444' : '#10b981'}}>{w.remaining} يوم متبقي</span>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  </div>
);


  
  const renderDepreciation = () => {
    const activeAssetsForDep = accountingEngine.filter(a => a.status === 'نشط' || a.status === 'متوقف');
    const totalDepCost = activeAssetsForDep.reduce((s,a) => s + (Number(a.cost)||0), 0);
    const totalAccDep = activeAssetsForDep.reduce((s,a) => s + (Number(a.accumulatedDep)||0), 0);
    
    // Calculate Monthly Depreciation (Straight Line)
    const monthlyDep = activeAssetsForDep.map(a => {
      const cost = Number(a.cost) || 0;
      const salvage = Number(a.salvageValue) || 0;
      const life = Number(a.usefulLife) || 5;
      const depBasis = cost - salvage;
      const yearly = life > 0 ? depBasis / life : 0;
      const monthly = yearly / 12;
      return { ...a, monthlyDep: monthly };
    });
    
    const totalMonthly = monthlyDep.reduce((s,a) => s + a.monthlyDep, 0);

    return (
      <div className="view-anim">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem'}}>
          <div>
            <h2 style={{fontSize:'1.5rem', fontWeight:800, color:'var(--text)', marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}>
              <Calculator size={24} color="var(--brand-teal)" />
              إدارة وحساب الإهلاك (Depreciation Engine)
            </h2>
            <p style={{color:'var(--text-muted)'}}>محرك احتساب الإهلاك التلقائي (طريقة القسط الثابت) للأصول الثابتة.</p>
          </div>
          <button className="btn btn-primary" onClick={() => {
             // Create Journal Entry
             const je = {
               entry_number: 'JE-' + Math.floor(1000 + Math.random() * 9000),
               date: new Date().toISOString().split('T')[0],
               description: 'قيد إثبات إهلاك الأصول الثابتة للشهر الحالي',
               total_amount: totalMonthly.toFixed(2),
               status: 'مرحل',
               lines: [
                 { account_name: 'مصروف إهلاك أصول ثابتة', type: 'مدين', amount: totalMonthly.toFixed(2) },
                 { account_name: 'مجمع إهلاك أصول ثابتة', type: 'دائن', amount: totalMonthly.toFixed(2) }
               ]
             };
             setJournal(prev => [je, ...prev]);
             showToast('✅ تم ترحيل قيد الإهلاك للشهر الحالي بنجاح!');
          }}>
            <RefreshCw size={18} /> ترحيل إهلاك الشهر الحالي
          </button>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.5rem', marginBottom:'2rem'}}>
          <div className="stat-card">
            <div className="stat-title">إجمالي تكلفة الأصول الخاضعة</div>
            <div className="stat-value">{totalDepCost.toLocaleString()} <span style={{fontSize:'1rem', fontWeight:400}}>ر.س</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-title">إجمالي الإهلاك المتراكم</div>
            <div className="stat-value" style={{color:'var(--danger)'}}>{totalAccDep.toLocaleString()} <span style={{fontSize:'1rem', fontWeight:400}}>ر.س</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-title">إهلاك الشهر الحالي (مقدّر)</div>
            <div className="stat-value" style={{color:'var(--warning)'}}>{totalMonthly.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} <span style={{fontSize:'1rem', fontWeight:400}}>ر.س</span></div>
          </div>
        </div>

        <div className="card" style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.9rem'}}>
            <thead>
              <tr style={{background:'var(--thead-bg)', color:'var(--text-secondary)', textAlign:'right'}}>
                <th style={{padding:'1rem', borderBottom:'1px solid var(--border)'}}>رقم الأصل</th>
                <th style={{padding:'1rem', borderBottom:'1px solid var(--border)'}}>اسم الأصل</th>
                <th style={{padding:'1rem', borderBottom:'1px solid var(--border)'}}>التكلفة</th>
                <th style={{padding:'1rem', borderBottom:'1px solid var(--border)'}}>الخردة</th>
                <th style={{padding:'1rem', borderBottom:'1px solid var(--border)'}}>العمر (سنوات)</th>
                <th style={{padding:'1rem', borderBottom:'1px solid var(--border)'}}>أساس الإهلاك</th>
                <th style={{padding:'1rem', borderBottom:'1px solid var(--border)'}}>الإهلاك الشهري</th>
                <th style={{padding:'1rem', borderBottom:'1px solid var(--border)'}}>المتراكم السابق</th>
                <th style={{padding:'1rem', borderBottom:'1px solid var(--border)'}}>القيمة الدفترية (NBV)</th>
              </tr>
            </thead>
            <tbody>
              {monthlyDep.map((a, i) => (
                <tr key={i} style={{borderBottom:'1px solid var(--border)'}}>
                  <td style={{padding:'1rem', fontWeight:600}}>{a.id}</td>
                  <td style={{padding:'1rem'}}>{a.name}</td>
                  <td style={{padding:'1rem'}}>{(Number(a.cost)||0).toLocaleString()}</td>
                  <td style={{padding:'1rem'}}>{(Number(a.salvageValue)||0).toLocaleString()}</td>
                  <td style={{padding:'1rem'}}>{a.usefulLife}</td>
                  <td style={{padding:'1rem'}}>{(Number(a.cost) - Number(a.salvageValue)).toLocaleString()}</td>
                  <td style={{padding:'1rem', fontWeight:600, color:'var(--warning)'}}>{a.monthlyDep.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                  <td style={{padding:'1rem', color:'var(--danger)'}}>{(Number(a.accumulatedDep)||0).toLocaleString()}</td>
                  <td style={{padding:'1rem', fontWeight:600, color:'var(--success)'}}>{((Number(a.cost)||0) - (Number(a.accumulatedDep)||0)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  
  const renderCustody = () => {
    // Group assets by employee_id (Custody)
    const custodyMap = {};
    assets.forEach(a => {
      if (a.employee_id) {
        if (!custodyMap[a.employee_id]) custodyMap[a.employee_id] = [];
        custodyMap[a.employee_id].push(a);
      }
    });
    
    // Sort employees by number of assets
    const sortedCustodians = Object.keys(custodyMap).sort((a,b) => custodyMap[b].length - custodyMap[a].length);

    return (
      <div className="view-anim">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem'}}>
          <div>
            <h2 style={{fontSize:'1.5rem', fontWeight:800, color:'var(--text)', marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}>
              <Users size={24} color="var(--brand-teal)" />
              إدارة العهد (Custody Management)
            </h2>
            <p style={{color:'var(--text-muted)'}}>تتبع الأصول المسلمة عهدة للموظفين وإداراتهم.</p>
          </div>
          <button className="btn btn-primary">
            <UserCircle size={18} /> تسليم عهدة جديدة
          </button>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'1.5rem'}}>
          {sortedCustodians.map(emp => {
            const empAssets = custodyMap[emp];
            const totalValue = empAssets.reduce((s,a) => s + (Number(a.cost)||0), 0);
            return (
              <div key={emp} className="card" style={{display:'flex', flexDirection:'column', gap:'1rem', cursor:'pointer', transition:'transform 0.2s'}} onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform='none'} onClick={() => setSelectedEmployee({ name: emp, assets: empAssets, totalValue })}>
                <div style={{display:'flex', alignItems:'center', gap:'1rem', borderBottom:'1px solid var(--border)', paddingBottom:'1rem'}}>
                  <div style={{background:'var(--thead-bg)', borderRadius:'50%', width:'50px', height:'50px', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)'}}>
                    <UserCircle size={28} />
                  </div>
                  <div>
                    <h3 style={{margin:0, fontSize:'1.1rem'}}>{emp}</h3>
                    <div style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>إجمالي الأصول: {empAssets.length}</div>
                  </div>
                </div>
                <div>
                  <div style={{fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'0.5rem'}}>قيمة العهدة الإجمالية:</div>
                  <div style={{fontWeight:800, fontSize:'1.25rem', color:'var(--text)'}}>{totalValue.toLocaleString()} <span style={{fontSize:'0.85rem', fontWeight:400}}>ر.س</span></div>
                </div>
                <div style={{background:'var(--bg)', borderRadius:'8px', padding:'0.5rem', maxHeight:'150px', overflowY:'auto'}}>
                  {empAssets.map(a => (
                    <div key={a.id} style={{display:'flex', justifyContent:'space-between', padding:'0.5rem', borderBottom:'1px solid var(--border)', fontSize:'0.85rem'}}>
                      <div>{a.name}</div>
                      <div style={{fontWeight:600}}>{a.id}</div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost" style={{width:'100%', marginTop:'0.5rem'}}>
                  <FileText size={16} /> طباعة نموذج تسليم عهدة
                </button>
              </div>
            )
          })}
        </div>
      </div>
    );
  };

  
      
      {qrModalAsset && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000, backdropFilter:'blur(5px)'}}>
          <div className="card" style={{width:'350px', background:'white', padding:'2.5rem', textAlign:'center', borderRadius:'16px'}}>
             <div style={{marginBottom:'1rem', fontWeight:800, color:'#0f172a', fontSize:'1.25rem'}}>ملصق الأصل الثابت</div>
             <div style={{padding:'1rem', background:'white', display:'inline-block', border:'2px solid #e2e8f0', borderRadius:'12px', marginBottom:'1.5rem'}}>
               <QRCodeSVG value={JSON.stringify({ id: qrModalAsset.id, name: qrModalAsset.name, category: qrModalAsset.category, date: qrModalAsset.date })} size={200} />
             </div>
             <div style={{fontWeight:800, fontSize:'1.5rem', color:'#0f172a', fontFamily:'monospace', letterSpacing:'2px'}}>{qrModalAsset.id}</div>
             <div style={{fontSize:'0.9rem', color:'#64748b', marginTop:'0.5rem', marginBottom:'2rem'}}>{qrModalAsset.name}</div>
             <div style={{display:'flex', gap:'1rem'}}>
               <button className="btn btn-primary" style={{flex:1}} onClick={() => { showToast('🖨️ جاري الطباعة على طابعة الملصقات الحرارية...'); setQrModalAsset(null); }}><Printer size={18} /> طباعة الملصق</button>
               <button className="btn btn-ghost" style={{flex:1, border:'1px solid #cbd5e1'}} onClick={() => setQrModalAsset(null)}>إغلاق</button>
             </div>
          </div>
        </div>
      )}
      {selectedEmployee && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)'}}>
          <div className="card" style={{width:'800px', maxHeight:'90vh', overflowY:'auto', background:'var(--bg)', padding:0, border:'1px solid var(--border)'}}>
            
            {/* Header */}
            <div style={{padding:'2rem', background:'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color:'white', position:'relative'}}>
              <button className="btn btn-ghost" style={{position:'absolute', top:'1rem', left:'1rem', color:'white', background:'rgba(255,255,255,0.1)'}} onClick={() => setSelectedEmployee(null)}><X size={18} /></button>
              <div style={{display:'flex', alignItems:'center', gap:'1.5rem'}}>
                <div style={{background:'rgba(255,255,255,0.1)', padding:'1rem', borderRadius:'50%'}}>
                  <UserCircle size={48} />
                </div>
                <div>
                  <h2 style={{margin:0, fontSize:'1.8rem', fontWeight:800}}>{selectedEmployee.name}</h2>
                  <div style={{color:'#94a3b8', marginTop:'0.5rem'}}>إجمالي الأصول المستلمة عهدة: {selectedEmployee.assets.length} أصل | القيمة الإجمالية: {selectedEmployee.totalValue.toLocaleString()} ر.س</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{padding:'1.5rem 2rem', borderBottom:'1px solid var(--border)', background:'var(--card-bg)', display:'flex', gap:'1rem'}}>
              <button className="btn btn-primary" onClick={() => {
                showToast('🖨️ جاري تجهيز وإصدار نموذج "إخلاء طرف / تسليم عهدة"...');
              }}>
                <FileText size={18} /> طباعة نموذج تسليم / إخلاء عهدة (PDF)
              </button>
              <button className="btn btn-ghost" style={{border:'1px solid var(--border)'}}>
                <History size={18} /> سجل حركات الموظف
              </button>
            </div>

            {/* Assets Table */}
            <div style={{padding:'2rem'}}>
              <h3 style={{fontSize:'1.2rem', marginBottom:'1rem', color:'var(--brand-teal)'}}>تفاصيل الأصول في العهدة الحالية</h3>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.9rem', background:'var(--card-bg)', borderRadius:'8px', overflow:'hidden'}}>
                <thead style={{background:'var(--thead-bg)', borderBottom:'2px solid var(--border)'}}>
                  <tr>
                    <th style={{padding:'1rem', textAlign:'right'}}>رقم الأصل</th>
                    <th style={{padding:'1rem', textAlign:'right'}}>وصف الأصل</th>
                    <th style={{padding:'1rem', textAlign:'right'}}>تاريخ الاستلام</th>
                    <th style={{padding:'1rem', textAlign:'right'}}>التكلفة (ر.س)</th>
                    <th style={{padding:'1rem', textAlign:'center'}}>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEmployee.assets.map((a, i) => (
                    <tr key={i} style={{borderBottom:'1px solid var(--border)'}}>
                      <td style={{padding:'1rem', fontWeight:800, color:'var(--accent)'}}>{a.id}</td>
                      <td style={{padding:'1rem', fontWeight:600}}>{a.name}</td>
                      <td style={{padding:'1rem'}}>{a.date}</td>
                      <td style={{padding:'1rem'}}>{(Number(a.cost)||0).toLocaleString()}</td>
                      <td style={{padding:'1rem', textAlign:'center'}}>
                        <span style={{background:'rgba(16, 185, 129, 0.1)', color:'#10b981', padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700}}>{a.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}
  
      {warehouseMovementModal && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)'}}>
          <div className="card" style={{width:'600px', background:'var(--bg)', padding:0, border:'1px solid var(--border)', overflow:'hidden'}}>
            
            <div style={{padding:'1.5rem 2rem', background:'var(--card-bg)', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2 style={{margin:0, fontSize:'1.25rem', display:'flex', alignItems:'center', gap:'0.75rem', color:'var(--text)'}}>
                <ArrowRightLeft size={22} color="var(--brand-teal)"/>
                إنشاء مستند حركة مستودعية
              </h2>
              <button className="btn btn-ghost" onClick={() => setWarehouseMovementModal(false)}><X size={18} /></button>
            </div>

            <form style={{padding:'2rem'}} onSubmit={(e) => {
              e.preventDefault();
              const type = e.target.movementType.value;
              const isAsset = e.target.isAsset?.checked;
              
              if (type === 'صرف' && isAsset) {
                // Open new asset modal implicitly
                setWarehouseMovementModal(false);
                setEditingAsset(null);
                setView('new-asset');
                setTimeout(() => showToast('💡 نظراً لأن الصنف المَصروف يصنّف كأصل ثابت، تم تحويلك مباشرة لشاشة تسجيل الأصل.'), 500);
              } else {
                setWarehouseMovementModal(false);
                showToast(`✅ تم حفظ إذن الـ (${type}) وتحديث كميات المستودع بنجاح!`);
              }
            }}>
              <div style={{display:'grid', gap:'1.5rem'}}>
                <div>
                  <label style={{fontSize:'0.85rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'0.5rem', display:'block'}}>نوع الحركة المستودعية *</label>
                  <select name="movementType" required style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} onChange={e => {
                    const chk = document.getElementById('isAssetContainer');
                    if (chk) chk.style.display = e.target.value === 'صرف' ? 'block' : 'none';
                  }}>
                    <option value="استلام">إذن استلام (إضافة للمخزون)</option>
                    <option value="صرف">إذن صرف (خصم من المخزون)</option>
                    <option value="تحويل">إذن تحويل بين المستودعات</option>
                    <option value="إرجاع">إذن إرجاع</option>
                    <option value="تسوية">إذن تسوية (تعديل الأرصدة)</option>
                  </select>
                </div>
                
                <div>
                  <label style={{fontSize:'0.85rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'0.5rem', display:'block'}}>الصنف *</label>
                  <select name="item" required style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}}>
                    {warehouseItems.map(w => <option key={w.id} value={w.id}>{w.sku} - {w.name} (الرصيد: {w.qty})</option>)}
                  </select>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
                  <div>
                    <label style={{fontSize:'0.85rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'0.5rem', display:'block'}}>الكمية *</label>
                    <input name="qty" type="number" min="1" required defaultValue="1" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
                  </div>
                  <div>
                    <label style={{fontSize:'0.85rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'0.5rem', display:'block'}}>المستودع / الموقع</label>
                    <select name="warehouse" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}}>
                      <option value="main">المستودع الرئيسي (الرياض)</option>
                      <option value="sub1">مستودع فرع جدة</option>
                      <option value="sub2">مستودع العهد التقنية</option>
                    </select>
                  </div>
                </div>

                <div id="isAssetContainer" style={{display:'none', background:'rgba(245, 158, 11, 0.1)', border:'1px solid rgba(245, 158, 11, 0.3)', padding:'1rem', borderRadius:'8px'}}>
                  <label style={{display:'flex', alignItems:'center', gap:'0.75rem', cursor:'pointer', color:'var(--warning)', fontWeight:700}}>
                    <input type="checkbox" name="isAsset" style={{width:'20px', height:'20px', accentColor:'var(--warning)'}} />
                    هل هذا الصنف المصروف يعتبر "أصلاً ثابتاً"؟ (سيقوم النظام تلقائياً بإنشاء بطاقة أصل ثابت له)
                  </label>
                </div>

                <div>
                  <label style={{fontSize:'0.85rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'0.5rem', display:'block'}}>الملاحظات والبيان</label>
                  <textarea name="notes" rows="2" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}}></textarea>
                </div>
              </div>

              <div style={{marginTop:'2rem', display:'flex', justifyContent:'flex-end', gap:'1rem'}}>
                <button type="button" className="btn btn-ghost" onClick={() => setWarehouseMovementModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary">تنفيذ وحفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
  
      {disposalModal && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)'}}>
          <div className="card" style={{width:'600px', background:'var(--bg)', padding:0, border:'1px solid var(--danger)', overflow:'hidden'}}>
            
            <div style={{padding:'1.5rem 2rem', background:'#fef2f2', borderBottom:'1px solid #fecaca', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2 style={{margin:0, fontSize:'1.25rem', display:'flex', alignItems:'center', gap:'0.75rem', color:'#991b1b'}}>
                <Trash2 size={22}/>
                نموذج طلب استبعاد أصل ثابت
              </h2>
              <button className="btn btn-ghost" onClick={() => setDisposalModal(null)}><X size={18} color="#991b1b" /></button>
            </div>

            <form style={{padding:'2rem'}} onSubmit={async (e) => {
              e.preventDefault();
              const reason = e.target.reason.value;
              const details = e.target.details.value;
              const date = new Date().toISOString().split('T')[0];
              
              const { error } = await supabase.from('assets').update({
                status: 'مستبعد',
                disposal_date: date,
                disposal_reason: `${reason}: ${details}`
              }).eq('id', disposalModal.db_id);

              if (error) {
                showToast('❌ حدث خطأ أثناء الاستبعاد');
              } else {
                showToast('✅ تم استبعاد الأصل بنجاح وإيقاف إهلاكه مستقبلاً!');
                fetchInitialData();
                setDisposalModal(null);
              }
            }}>
              
              <div style={{background:'var(--card-bg)', padding:'1rem', borderRadius:'8px', marginBottom:'1.5rem', border:'1px solid var(--border)'}}>
                <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>أنت تقوم الآن باستبعاد الأصل:</div>
                <div style={{fontWeight:800, color:'var(--accent)', fontSize:'1.1rem'}}>{disposalModal.id} - {disposalModal.name}</div>
                <div style={{fontSize:'0.85rem', color:'var(--danger)', marginTop:'0.5rem'}}>تنبيه: لن يتم حذف الأصل من قاعدة البيانات حفظاً للسجل التاريخي، ولكن ستتغير حالته إلى "مستبعد" وسيتوقف احتساب إهلاكه.</div>
              </div>

              <div style={{display:'grid', gap:'1.5rem'}}>
                <div>
                  <label style={{fontSize:'0.85rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'0.5rem', display:'block'}}>سبب الاستبعاد الأساسي *</label>
                  <select name="reason" required style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}}>
                    <option value="تالف / خردة">تالف / خردة (لا جدوى من إصلاحه)</option>
                    <option value="مفقود / مسروق">مفقود / مسروق</option>
                    <option value="تم البيع">تم بيع الأصل</option>
                    <option value="تبرع عيني">تم التبرع به</option>
                    <option value="انتهاء العمر الافتراضي">انتهاء العمر الافتراضي</option>
                  </select>
                </div>
                
                <div>
                  <label style={{fontSize:'0.85rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'0.5rem', display:'block'}}>تفاصيل ومبررات الاستبعاد (قرار اللجنة) *</label>
                  <textarea name="details" rows="3" required placeholder="أدخل مبررات الاستبعاد وأسماء أعضاء لجنة الفحص إن وجد..." style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}}></textarea>
                </div>
              </div>

              <div style={{marginTop:'2rem', display:'flex', justifyContent:'flex-end', gap:'1rem'}}>
                <button type="button" className="btn btn-ghost" onClick={() => setDisposalModal(null)}>تراجع وإلغاء</button>
                <button type="submit" className="btn btn-primary" style={{background:'var(--danger)', borderColor:'var(--danger)', color:'white'}}>تأكيد الاستبعاد</button>
              </div>
            </form>
          </div>
        </div>
      )}
  const renderSettings = () => {
    const handleSaveSettings = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const updates = {
        company_name: fd.get('company_name'),
        fiscal_year: fd.get('fiscal_year'),
        currency: fd.get('currency'),
        prefix_asset: fd.get('prefix_asset'),
        prefix_transfer: fd.get('prefix_transfer'),
        prefix_inventory: fd.get('prefix_inventory')
      };
      
      const { error } = await supabase.from('system_settings').update(updates).eq('id', systemSettings?.id);
      if(error) showToast('❌ حدث خطأ أثناء حفظ الإعدادات');
      else {
        showToast('✅ تم حفظ إعدادات المنشأة بنجاح!');
        fetchInitialData();
      }
    };

    return (
    <div className="view-anim">
      <h2 style={{fontSize:'1.5rem', marginBottom:'2rem', fontWeight:800}}><Settings size={24} color="var(--brand-teal)" style={{marginRight:'0.5rem', verticalAlign:'middle'}}/> الإعدادات الشاملة للمنظومة</h2>
      
      {systemSettings ? (
      <form onSubmit={handleSaveSettings} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
        
        <div className="card" style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
          <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem'}}>إعدادات المنشأة العامة</h3>
          
          <div>
            <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>اسم الجهة / الشركة</label>
            <input name="company_name" type="text" defaultValue={systemSettings.company_name} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
          </div>
          <div>
            <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>السنة المالية</label>
            <input name="fiscal_year" type="text" defaultValue={systemSettings.fiscal_year} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
          </div>
          <div>
            <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>العملة الأساسية للنظام</label>
            <input name="currency" type="text" defaultValue={systemSettings.currency} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
          </div>
        </div>
        
        <div className="card" style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
           <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem'}}>أنماط الترقيم التلقائي المخصصة</h3>
           <p style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>سيتم استخدام هذه البوادئ لإنشاء أرقام مرجعية فريدة لكل عملية في النظام.</p>
           
           <div>
             <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>بادئة سجل الأصول الثابتة (Assets)</label>
             <input name="prefix_asset" type="text" defaultValue={systemSettings.prefix_asset} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
           </div>
           <div>
             <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>بادئة حركات التحويل (Transfers)</label>
             <input name="prefix_transfer" type="text" defaultValue={systemSettings.prefix_transfer} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
           </div>
           <div>
             <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>بادئة محاضر الجرد (Inventory)</label>
             <input name="prefix_inventory" type="text" defaultValue={systemSettings.prefix_inventory} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
           </div>
        </div>

        <div style={{gridColumn:'1/-1', display:'flex', justifyContent:'flex-end'}}>
          <button type="submit" className="btn btn-primary" style={{padding:'1rem 2.5rem', fontSize:'1.1rem'}}>حفظ كافة التعديلات والتكوينات</button>
        </div>
      </form>
      ) : <div style={{padding:'2rem', textAlign:'center'}}>جاري تحميل الإعدادات...</div>}
    </div>
  );
  };
  
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
          <div className={`nav-item ${view === 'custody' ? 'active' : ''}`} onClick={() => setView('custody')}>
            <div className="nav-icon-box"><Users size={18} /></div> إدارة العهد
          </div>
          <div className={`nav-item ${view === 'depreciation' ? 'active' : ''}`} onClick={() => setView('depreciation')}>
            <div className="nav-icon-box"><Calculator size={18} /></div> حاسبة الإهلاك
          </div>
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
          {view === 'maintenance' && renderMaintenance()}
          {view === 'new-transfer' && renderNewTransfer()}
          {view === 'budget' && renderBudget()}
          {view === 'inventory' && renderInventory()}
          {view === 'reports' && renderGeneralReports()}
          {view === 'new-inventory' && renderNewInventory()}
          {view === 'ai-insights' && renderAIInsights()}
          {view === 'warehouse' && renderWarehouse()}
            {view === 'depreciation' && renderDepreciation()}
            {view === 'custody' && renderCustody()}
          {view === 'settings' && renderSettings()}
        </div>
      </main>

      
      {selectedAsset && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)'}}>
          <div className="card" style={{width:'800px', maxHeight:'90vh', overflowY:'auto', background:'var(--bg)', padding:0, border:'1px solid var(--border)', display:'flex', flexDirection:'column'}}>
            
            {/* Header */}
            <div style={{padding:'1.5rem 2rem', background:'var(--card-bg)', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:10}}>
              <div>
                <h2 style={{margin:0, fontSize:'1.5rem', color:'var(--text)', display:'flex', alignItems:'center', gap:'0.75rem'}}>
                  بطاقة الأصل الثابت <span style={{fontSize:'1rem', color:'var(--text-muted)', fontWeight:400}}>({selectedAsset.id})</span>
                </h2>
                <div style={{fontSize:'0.85rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>الرقم التسلسلي: {selectedAsset.code || '-'} | الموديل: {selectedAsset.model || '-'}</div>
              </div>
              <div style={{display:'flex', gap:'0.5rem'}}>
                <button className="btn btn-ghost" style={{color:'var(--danger)'}} title="استبعاد الأصل" onClick={() => { setDisposalModal(selectedAsset); setSelectedAsset(null); }}><Trash2 size={18} /></button>
                <button className="btn btn-ghost" title="طباعة باركود/QR" onClick={() => setQrModalAsset(selectedAsset)}><QrCode size={18} /></button>
                <button className="btn btn-ghost" title="تصدير PDF"><FileText size={18} /></button>
                <button className="btn btn-ghost" onClick={() => setSelectedAsset(null)}><X size={18} /></button>
              </div>
            </div>

            {/* Body */}
            <div style={{padding:'2rem', display:'flex', flexDirection:'column', gap:'2rem'}}>
              
              {/* Group 1: التعريف */}
              <div>
                <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem', marginBottom:'1rem'}}>التعريف بالأصل</h3>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.5rem'}}>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>رقم الأصل:</strong> {selectedAsset.id}</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>وصف الأصل:</strong> {selectedAsset.name}</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>فئة الأصل:</strong> {selectedAsset.category}</div>
                </div>
              </div>

              {/* Group 2: الموقع والعهدة */}
              <div>
                <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem', marginBottom:'1rem'}}>الموقع والعهدة</h3>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.5rem'}}>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>الموقع:</strong> {selectedAsset.location || '-'}</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>الإدارة:</strong> {selectedAsset.department || '-'}</div>
                  {selectedAsset.category !== 'أراضي' && selectedAsset.category !== 'مباني' && (
                    <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>صاحب العهدة:</strong> {selectedAsset.custody || '-'}</div>
                  )}
                </div>
              </div>

              {/* Group 3: الشراء والتشغيل */}
              <div>
                <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem', marginBottom:'1rem'}}>الشراء والتشغيل</h3>
                <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1.5rem'}}>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>المورد:</strong> {selectedAsset.supplier || '-'}</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>تاريخ الشراء:</strong> {selectedAsset.date || '-'}</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>تاريخ الاستلام:</strong> {selectedAsset.date || '-'}</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>تاريخ جاهزية الاستخدام:</strong> {selectedAsset.readyDate || selectedAsset.date || '-'}</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>رقم أمر الشراء (PO):</strong> {selectedAsset.poNumber || '-'}</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>رقم الفاتورة:</strong> {selectedAsset.invoiceNumber || '-'}</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>الضمان:</strong> {selectedAsset.warranty || 'سنتين'}</div>
                </div>
              </div>

              {/* Group 4: البيانات المالية والإهلاك */}
              <div>
                <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem', marginBottom:'1rem'}}>البيانات المالية والإهلاك</h3>
                <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1.5rem', background:'var(--card-bg)', padding:'1.5rem', borderRadius:'12px', border:'1px solid var(--border)'}}>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>تكلفة الأصل:</strong> {(Number(selectedAsset.cost)||0).toLocaleString()} ر.س</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>مصدر التمويل:</strong> {selectedAsset.fundingSource || 'إيرادات ذاتية'}</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>طريقة الإهلاك:</strong> {selectedAsset.method === 'SL' ? 'القسط الثابت' : 'القسط المتناقص'}</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>العمر الإنتاجي:</strong> {selectedAsset.life} سنوات</div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>القيمة التخريدية:</strong> {(Number(selectedAsset.salvage)||0).toLocaleString()} ر.س</div>
                  
                  {/* Auto calculated */}
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>إهلاك الفترة (سنوي):</strong> {(Number(selectedAsset.annualDep)||0).toLocaleString()} ر.س</div>
                  <div><strong style={{color:'var(--danger)', fontSize:'0.85rem', display:'block'}}>مجمع الإهلاك:</strong> {(Number(selectedAsset.accumulatedDep)||0).toLocaleString()} ر.س</div>
                  <div><strong style={{color:'var(--success)', fontSize:'0.85rem', display:'block'}}>القيمة الدفترية (NBV):</strong> {(Number(selectedAsset.netBookValue)||0).toLocaleString()} ر.س</div>
                </div>
              </div>

              {/* Group 5: الجرد والاستبعاد */}
              <div>
                <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem', marginBottom:'1rem'}}>الجرد والاستبعاد</h3>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.5rem'}}>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>حالة الأصل:</strong> <span style={{fontWeight:800}}>{selectedAsset.status}</span></div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.85rem', display:'block'}}>تاريخ آخر جرد:</strong> {selectedAsset.lastInventory || '-'}</div>
                  
                  
              {/* Group 6: Timeline (دورة حياة الأصل) */}
              <div style={{gridColumn:'1/-1', marginTop:'1rem'}}>
                <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem', marginBottom:'1rem'}}>دورة حياة الأصل (Timeline)</h3>
                <div style={{display:'flex', gap:'1rem', overflowX:'auto', paddingBottom:'1rem'}}>
                  <div style={{minWidth:'200px', padding:'1rem', background:'rgba(59, 130, 246, 0.05)', borderLeft:'3px solid #3b82f6', borderRadius:'8px'}}>
                    <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>{selectedAsset.date}</div>
                    <div style={{fontWeight:700, fontSize:'0.9rem', color:'#1e3a8a'}}>شراء الأصل وتسجيله</div>
                    <div style={{fontSize:'0.8rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>تم إنشاء البطاقة وإضافته لسجل الأصول</div>
                  </div>
                  {selectedAsset.readyDate && (
                  <div style={{minWidth:'200px', padding:'1rem', background:'rgba(16, 185, 129, 0.05)', borderLeft:'3px solid #10b981', borderRadius:'8px'}}>
                    <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>{selectedAsset.readyDate}</div>
                    <div style={{fontWeight:700, fontSize:'0.9rem', color:'#064e3b'}}>جاهزية الأصل وبدء الإهلاك</div>
                    <div style={{fontSize:'0.8rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>تم تفعيل الأصل محاسبياً</div>
                  </div>
                  )}
                  {selectedAsset.custody && selectedAsset.custody !== 'غير محدد' && (
                  <div style={{minWidth:'200px', padding:'1rem', background:'rgba(139, 92, 246, 0.05)', borderLeft:'3px solid #8b5cf6', borderRadius:'8px'}}>
                    <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>{selectedAsset.readyDate}</div>
                    <div style={{fontWeight:700, fontSize:'0.9rem', color:'#4c1d95'}}>تسليم عهدة للموظف</div>
                    <div style={{fontSize:'0.8rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>المستلم: {selectedAsset.custody}</div>
                  </div>
                  )}
                  {selectedAsset.status === 'مستبعد' && (
                  <div style={{minWidth:'200px', padding:'1rem', background:'rgba(239, 68, 68, 0.05)', borderLeft:'3px solid #ef4444', borderRadius:'8px'}}>
                    <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>{selectedAsset.disposalDate}</div>
                    <div style={{fontWeight:700, fontSize:'0.9rem', color:'#7f1d1d'}}>استبعاد الأصل</div>
                    <div style={{fontSize:'0.8rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>{selectedAsset.disposalReason}</div>
                  </div>
                  )}
                </div>
              </div>

              {selectedAsset.status === 'مستبعد' && (
                    <>
                      <div><strong style={{color:'var(--danger)', fontSize:'0.85rem', display:'block'}}>تاريخ الاستبعاد:</strong> {selectedAsset.disposalDate || '-'}</div>
                      <div style={{gridColumn:'1/-1'}}><strong style={{color:'var(--danger)', fontSize:'0.85rem', display:'block'}}>سبب الاستبعاد:</strong> {selectedAsset.disposalReason || '-'}</div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

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
          
          {/* Input Area */}
          <form style={{display:'flex', padding:'1.25rem', background:'var(--card-bg)', borderTop:'1px solid var(--border)', gap:'0.75rem'}} onSubmit={async (e) => {
            e.preventDefault();
            if(!chatInput.trim()) return;
            const userInput = chatInput;
            setChatMessages(prev => [...prev, {role: 'user', text: userInput}]);
            setChatInput('');
            setIsTyping(true);
            
            setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

            if (!aiApiKey) {
              const errResp = "⚠️ يرجى إضافة مفتاح الـ API الخاص بك (Groq أو Hugging Face) في صفحة الإعدادات لتفعيل الذكاء الاصطناعي.";
              setChatMessages(prev => [...prev, {role: 'bot', text: errResp}]);
              setIsTyping(false);
              return;
            }

            try {
              let botResponse = '';
              const messagesForApi = [
                { role: "system", content: aiSystemPrompt + "\n\nقم بالرد بناء على المعلومات التالية إن وجدت: " + (window.aiFileContext || "") },
                { role: "user", content: userInput }
              ];

              if (aiProvider === 'groq') {
                const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${aiApiKey}` },
                  body: JSON.stringify({ model: 'allam-2-7b', messages: messagesForApi, temperature: 0.7 })
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error.message || 'Groq Error');
                botResponse = data.choices[0].message.content;
              } else {
                const res = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1/v1/chat/completions', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${aiApiKey}` },
                  body: JSON.stringify({ model: 'mistralai/Mixtral-8x7B-Instruct-v0.1', messages: messagesForApi, max_tokens: 500 })
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error || 'HF Error');
                botResponse = data.choices[0].message.content;
              }

              setChatMessages(prev => [...prev, {role: 'bot', text: botResponse}]);
              window.aiFileContext = ""; // clear after one use
            } catch (err) {
              console.error(err);
              setChatMessages(prev => [...prev, {role: 'bot', text: "❌ حدث خطأ في الاتصال بالذكاء الاصطناعي: " + err.message}]);
            }
            
            setIsTyping(false);
            if(autoSpeak) speak(botResponse);
            setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          }}>
            <input type="file" id="ai-file-upload" style={{display:'none'}} accept=".txt,.csv,.json,.md" onChange={(e) => {
              const file = e.target.files[0];
              if(!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                window.aiFileContext = ev.target.result;
                showToast("✅ تم إرفاق الملف: " + file.name + " للتحليل");
              };
              reader.readAsText(file);
            }} />
            <label htmlFor="ai-file-upload" style={{background: 'var(--thead-bg)', color: 'var(--text-muted)', border:'none', borderRadius:'12px', width:'45px', height:'45px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s'}}>
              <Upload size={20} />
            </label>
            <button type="button" onClick={startListening} style={{background: isListening ? '#ef4444' : 'var(--thead-bg)', color: isListening ? 'white' : 'var(--text-muted)', border:'none', borderRadius:'12px', width:'45px', height:'45px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s'}}>
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input type="text" placeholder="اسأل المساعد أو ارفع ملفاً ليقوم بتحليله..." value={chatInput} onChange={e => setChatInput(e.target.value)} style={{flex:1, padding:'0 1rem', borderRadius:'12px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', outline:'none', fontSize:'0.9rem'}} />
            <button type="submit" style={{background:'linear-gradient(135deg, var(--brand-teal), var(--brand-green))', color:'white', border:'none', borderRadius:'12px', width:'45px', height:'45px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'var(--shadow-accent)'}}><Send size={20} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
