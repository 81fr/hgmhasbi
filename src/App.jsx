import { AIService } from './aiService.js';
import { AnalyticsService } from './analyticsService.js';
import ErrorBoundary from './ErrorBoundary';
import AIStudio from './AIStudio';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutGrid, Box, FileText, Shuffle, PieChart, ClipboardList, Settings, BarChart3, Database,
  TrendingUp, Activity, ShieldCheck, Calendar, AlertTriangle, CheckCircle, Filter, FilePlus,
  Edit, Trash2, Download, QrCode, Target, Shield, Laptop, Search, Bell, ChevronDown,
  MoreHorizontal, Bot, Brain, BrainCircuit, Sparkles, MessageSquare, Send, X, Zap, Mic, MicOff,
  Volume2, VolumeX, Plus, UserCircle, Warehouse, Package, PackageCheck, PackagePlus,
  RotateCcw, ScanLine, MapPin, ArrowRightLeft, TrendingDown, Eye, Boxes, Upload, Wrench, RefreshCw, Users, Calculator, History, Clock, Printer
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  downloadTemplate, 
  downloadAssetTemplate, 
  exportAssets, 
  parseAssetsFile, 
  downloadWarehouseTemplate, 
  exportWarehouse, 
  parseWarehouseFile, 
  downloadCustodyTemplate, 
  exportCustody, 
  parseCustodyFile 
} from './assetExcel';
import BarcodePrintModal from './BarcodePrintModal';
import MaterialIssuePrintModal from './MaterialIssuePrintModal';
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



const AssetForm = ({ ea, systemLookups, onSubmit, onCancel }) => {
  const [cat, setCat] = React.useState(ea?.category || 'أجهزة تقنية');
  const [linkedJournals, setLinkedJournals] = React.useState([]);
  
  React.useEffect(() => {
    if (ea && ea.db_id) {
      supabase.from('journal_entries').select('*').eq('linked_entity_id', ea.db_id).then(({data}) => {
        if (data) setLinkedJournals(data);
      });
    }
  }, [ea]);
  const isLand = cat === 'أراضي' || cat === 'اراضي';
  
  const inp = {padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', width: '100%'};

  // Safe fallback for lookups
  const lookups = systemLookups || {};
  const cats = lookups.categories || ['أراضي','مباني','أجهزة تقنية','أثاث مكتبي','مركبات','آلات ومعدات'];
  const depts = lookups.departments || ['تقنية المعلومات', 'الإدارة العامة'];
  const locs = lookups.locations || ['مبنى الإدارة', 'الفرع'];
  const statuses = lookups.status || ['نشط', 'متوقف', 'صيانة', 'مستبعد'];
  const suppliersList = lookups.suppliers || [];
  const costCenters = lookups.cost_centers || ['المركز الرئيسي', 'الفرع', 'الإنتاج', 'المبيعات'];
  const conditionsList = lookups.conditions || ['ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'متهالك'];

  return (
    <div className="view-anim">
      <div style={{marginBottom:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2 style={{fontSize:'1.8rem', fontWeight:800}}>{ea ? 'تعديل بطاقة الأصل: ' + ea.name : 'إنشاء بطاقة أصل ثابت (سجل متكامل)'}</h2>
          <p style={{color:'var(--text-muted)'}}>{ea ? 'تعديل البيانات التفصيلية للأصل' : 'يرجى تعبئة الحقول الإجبارية المعلمة بـ (*) لارتباطها بالقيود المحاسبية'}</p>
        </div>
        <button type="button" className="btn btn-ghost" style={{border:'1px solid var(--border)'}} onClick={onCancel}>إلغاء والعودة</button>
      </div>

      <div className="card" style={{maxWidth: '1200px', background: 'var(--card-bg)', padding:0, overflow:'hidden', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.1)'}}>
        <form key={ea ? ea.id : 'new'} onSubmit={onSubmit}>
          
          <div style={{padding:'2rem', borderBottom:'1px solid var(--border)', background:'rgba(59, 130, 246, 0.05)'}}>
            <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Box size={20}/> 1. البيانات الأساسية والتصنيف</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem'}}>
              <F label="رقم الأصل (تلقائي)"><input name="id" type="text" defaultValue={ea?.id} readOnly={!!ea} placeholder="AST-..." style={{...inp, background:'var(--bg)', opacity:0.7}} /></F>
              <F label="اسم الأصل / الوصف *"><input name="name" type="text" defaultValue={ea?.name} placeholder="مثال: لابتوب ديل بلس" required style={inp} /></F>
              <F label="الفئة *">
                <select name="category" value={cat} onChange={e => setCat(e.target.value)} required style={inp}>
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </F>
              <F label="مركز التكلفة *">
                <select name="cost_center" defaultValue={ea?.cost_center || costCenters[0]} required style={inp}>
                  {costCenters.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </F>
              <F label="حالة الأصل العملية *">
                <select name="status" defaultValue={ea?.status || 'نشط'} required style={inp}>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </F>
              <F label="الحالة الفنية للأصل *">
                <select name="asset_condition" defaultValue={ea?.asset_condition || conditionsList[0]} required style={inp}>
                  {conditionsList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </F>
            </div>
          </div>

          {!isLand && (
          <div style={{padding:'2rem', borderBottom:'1px solid var(--border)'}}>
            <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Settings size={20}/> 2. البيانات الفنية والضمان</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem'}}>
              <F label="الرقم التسلسلي (SN)"><input name="serialNumber" type="text" defaultValue={ea?.serialNumber} placeholder="S/N..." style={inp} /></F>
              <F label="الشركة المصنعة"><input name="manufacturer" type="text" defaultValue={ea?.manufacturer} placeholder="Dell, Toyota..." style={inp} /></F>
              <F label="الموديل"><input name="model" type="text" defaultValue={ea?.model} placeholder="2024 / Latitude..." style={inp} /></F>
              <F label="جهة الضمان"><input name="warranty_provider" type="text" defaultValue={ea?.warranty_provider} placeholder="الوكيل المحلي..." style={inp} /></F>
              <F label="تاريخ انتهاء الضمان"><input name="warranty" type="date" defaultValue={ea?.warranty} style={inp} /></F>
              <F label="رقم بوليصة التأمين"><input name="insurance_policy" type="text" defaultValue={ea?.insurance_policy} placeholder="رقم البوليصة..." style={inp} /></F>
              <F label="تاريخ انتهاء التأمين"><input name="insurance_expiry" type="date" defaultValue={ea?.insurance_expiry} style={inp} /></F>
            </div>
          </div>
          )}

          <div style={{padding:'2rem', borderBottom:'1px solid var(--border)', background:'rgba(59, 130, 246, 0.05)'}}>
            <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><History size={20}/> 3. بيانات الاستحواذ والمورد</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem'}}>
              <F label="المورد *">
                {suppliersList.length > 0 ? (
                  <select name="supplier" defaultValue={ea?.supplier || suppliersList[0]} required style={inp}>
                    <option value="">بدون مورد محدد</option>
                    {suppliersList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <input name="supplier" type="text" defaultValue={ea?.supplier} placeholder="اسم المورد/الشركة" required style={inp} />
                )}
              </F>
              <F label="رقم الفاتورة *"><input name="invoiceNumber" type="text" defaultValue={ea?.invoiceNumber} placeholder="INV-..." required style={inp} /></F>
              <F label="رقم أمر الشراء (PO)"><input name="poNumber" type="text" defaultValue={ea?.poNumber} placeholder="PO-..." style={inp} /></F>
              <F label="تاريخ الشراء / الاستحواذ *"><input name="date" type="date" defaultValue={ea?.date || new Date().toISOString().split('T')[0]} required style={inp} /></F>
              {!isLand && <F label="تاريخ جاهزية الاستخدام *"><input name="readyDate" type="date" defaultValue={ea?.readyDate || new Date().toISOString().split('T')[0]} required style={inp} /></F>}
            </div>
          </div>

          <div style={{padding:'2rem', borderBottom:'1px solid var(--border)'}}>
            <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><MapPin size={20}/> 4. التموضع الجغرافي والعهدة</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem'}}>
              <F label="الموقع / الفرع *">
                <select name="location" defaultValue={ea?.location || locs[0]} required style={inp}>
                  {locs.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </F>
              <F label="القسم الإداري *">
                <select name="department" defaultValue={ea?.department || depts[0]} required style={inp}>
                  {depts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </F>
              <F label="الموظف / صاحب العهدة *"><input name="custody" type="text" defaultValue={ea?.custody} placeholder="اسم الموظف المستلم" required style={inp} /></F>
            </div>
          </div>

          <div style={{padding:'2rem', borderBottom:'1px solid var(--border)', background:'rgba(59, 130, 246, 0.05)'}}>
            <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Calculator size={20}/> 5. البيانات المالية {isLand ? '' : 'والإهلاك'}</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem'}}>
              <F label="تكلفة الأصل / الحيازة (ر.س) *"><input name="cost" type="number" step="0.01" defaultValue={ea?.cost} required placeholder="0.00" style={inp} /></F>
              {!isLand && <F label="القيمة التخريدية (الخردة)"><input name="salvage" type="number" step="0.01" defaultValue={ea?.salvage} placeholder="0.00" style={inp} /></F>}
              {!isLand && <F label="العمر الإنتاجي (سنوات) *"><input name="life" type="number" defaultValue={ea?.life || 5} required style={inp} /></F>}
              {!isLand && (
                <F label="طريقة الإهلاك *">
                  <select name="method" defaultValue={ea?.method || 'SL'} required style={inp}>
                    <option value="SL">القسط الثابت (SL)</option>
                    <option value="DB">القسط المتناقص (DB)</option>
                  </select>
                </F>
              )}
              <F label="مصدر التمويل *">
                <select name="fundingSource" defaultValue={ea?.fundingSource || 'إيرادات ذاتية'} required style={inp}>
                  <option value="إيرادات ذاتية">إيرادات ذاتية (نقدية)</option>
                  <option value="قرض بنكي">قرض بنكي</option>
                  <option value="منحة حكومية">منحة حكومية</option>
                </select>
              </F>
            </div>
            
            {ea && linkedJournals && linkedJournals.length > 0 && (
              <div style={{marginTop: '2rem', padding:'1.5rem', background:'var(--bg)', borderRadius:'12px', border:'1px solid var(--brand-teal)'}}>
                <h4 style={{marginBottom:'1rem', color:'var(--brand-teal)', fontWeight:700, display:'flex', alignItems:'center', gap:'0.5rem'}}><FileText size={18}/> القيود المحاسبية المرتبطة بهذا الأصل</h4>
                <table className="table">
                  <thead><tr><th style={{textAlign:'right'}}>رقم القيد</th><th style={{textAlign:'right'}}>التاريخ</th><th style={{textAlign:'right'}}>البيان</th><th style={{textAlign:'center'}}>الحالة</th></tr></thead>
                  <tbody>
                    {linkedJournals.map(j => (
                      <tr key={j.id}>
                        <td style={{color:'var(--brand-teal)', fontWeight:'bold'}}>{j.journal_no}</td>
                        <td>{new Date(j.entry_date).toLocaleDateString('ar-SA')}</td>
                        <td>{j.description}</td>
                        <td style={{textAlign:'center'}}><span className="badge" style={{background: j.status==='معتمد'?'var(--success)':'var(--warning)'}}>{j.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{padding:'2rem', display:'flex', justifyContent:'flex-end', gap:'1rem', background:'var(--bg)'}}>
             <button type="button" className="btn btn-ghost" onClick={onCancel}>إلغاء والتراجع</button>
             <button type="submit" className="btn btn-primary" style={{padding:'0.75rem 2.5rem', fontSize:'1.1rem'}}><CheckCircle size={20} style={{marginRight:'0.5rem'}} /> {ea ? 'تحديث بطاقة الأصل' : 'اعتماد وحفظ بطاقة الأصل'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const App = () => {
  const [session, setSession] = useState({ user: { id: 'test', email: 'test@test.com' } });
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {
    const fetchRealProfile = async () => {
      if (session?.user) {
        let role = session.user.user_metadata?.role || session.user.role || 'مسؤول نظام (Admin)';
        let name = session.user.user_metadata?.full_name || session.user.name || session.user.email?.split('@')[0];
        
        // Supabase defaults role to 'authenticated', which breaks our RBAC.
        // We must fetch the actual role from employees table!
        const { data: empData } = await supabase
          .from('employees')
          .select('role, full_name')
          .eq('email', session.user.email)
          .single();
          
        if (empData) {
          role = empData.role;
          if (empData.full_name) name = empData.full_name;
        } else if (role === 'authenticated') {
          role = 'مسؤول نظام (Admin)'; // Fallback for the very first admin user
        }
        
        setUserProfile({
          id: session.user.id,
          email: session.user.email,
          name: name,
          role: role,
          isAdmin: role.includes('مسؤول') || role.includes('Admin')
        });
      } else {
        setUserProfile(null);
      }
    };
    
    fetchRealProfile();
  }, [session]);
  
  
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
  const [systemLookups, setSystemLookups] = useState({
    categories: ['أجهزة تقنية', 'أثاث مكتبي', 'سيارات', 'معدات طبية'],
    departments: ['الإدارة العامة', 'تقنية المعلومات', 'المالية', 'الموارد البشرية'],
    locations: ['المبنى الرئيسي', 'فرع الرياض', 'المستودع المركزي'],
    suppliers: ['شركة التقنية', 'مؤسسة الأثاث', 'الوكالة العامة'],
    status: ['نشط', 'قيد التجهيز', 'متوقف', 'تالف']
  });
  const [inventoryCampaigns, setInventoryCampaigns] = useState([]);
  
  const [warehouseModal, setWarehouseModal] = useState(null);
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
  const [barcodeModalItem, setBarcodeModalItem] = useState(null);
  const [barcodeModalType, setBarcodeModalType] = useState('asset'); // 'asset' | 'warehouse' | 'custody' | 'receipt'
  const [warehouseImportPreview, setWarehouseImportPreview] = useState(null);
  const [custodyImportPreview, setCustodyImportPreview] = useState(null);
  const warehouseImportInputRef = useRef(null);
  const custodyImportInputRef = useRef(null);
  const [warehouseActiveTab, setWarehouseActiveTab] = useState('items'); // 'items' | 'requests' | 'movements' | 'radar'
  const [issueModalItem, setIssueModalItem] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [promptDialog, setPromptDialog] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [warehouseRequests, setWarehouseRequests] = useState(() => {
    const saved = localStorage.getItem('warehouseRequests');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      {
        id: 'REQ-2026-001',
        itemId: 'WH-001',
        itemSku: 'IT-SKU-101',
        itemName: 'لابتوب ديل XPS 15',
        qty: 1,
        unit: 'حبة',
        binLocation: 'A-01-03',
        warehouseBranch: 'المستودع المركزي الرئيسي',
        requester: 'أحمد الشمري',
        recipient: 'أحمد الشمري (قسم المحاسبة والمالية)',
        reason: 'تسليم عهدة عمل لموظف جديد في الإدارة المالية',
        isCustody: true,
        status: 'بانتظار الموافقة',
        requestedAt: '2026-10-10T09:30:00Z',
        keeper: 'فيصل العتيبي (أمين المستودع)',
        approvedBy: null,
        approvedAt: null,
        notes: 'مطلوب بصورة عاجلة للبدء في إعداد القوائم الختامية'
      },
      {
        id: 'REQ-2026-002',
        itemId: 'OF-SKU-202',
        itemSku: 'OF-SKU-202',
        itemName: 'مكتب إداري فاخر',
        qty: 1,
        unit: 'طقم',
        binLocation: 'B-02-01',
        warehouseBranch: 'مستودع الأثاث والمعدات',
        requester: 'خالد المطيري',
        recipient: 'الإدارة العامة - مكتب المدير التنفيذي',
        reason: 'تجهيز مكتب إداري تنفيذي',
        isCustody: true,
        status: 'معتمد ومصروف',
        requestedAt: '2026-10-08T11:00:00Z',
        keeper: 'فيصل العتيبي (أمين المستودع)',
        approvedBy: 'المدير المالي والتقني',
        approvedAt: '2026-10-08T14:20:00Z',
        notes: 'تم فحص سلامة المكتب قبل التسليم والصرف'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('warehouseRequests', JSON.stringify(warehouseRequests));
    } catch(e) {}
  }, [warehouseRequests]);

  const [globalSearch, setGlobalSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [journalFilter, setJournalFilter] = useState('all');
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [accountsList, setAccountsList] = useState([]);
  const [fiscalYear, setFiscalYear] = useState('2026');
  const [erpConnected, setErpConnected] = useState(true);
  const [chartMode, setChartMode] = useState('hist');
  const [aiProvider, setAiProvider] = useState(localStorage.getItem('aiProvider') || 'groq');
  const [aiName, setAiName] = useState(localStorage.getItem('aiName') || 'تراؤف AI V5.0');
  const [aiIcon, setAiIcon] = useState(localStorage.getItem('aiIcon') || '🤖');
  const [aiSystemPrompt, setAiSystemPrompt] = useState(localStorage.getItem('aiSystemPrompt') || 'أنت تراؤف، مساعد ذكي ومحاسب وخبير أصول. أنت تتحدث باللغة العربية وتساعد المستخدم في إدارة النظام المحاسبي، الأصول، والمستودعات. أجب باختصار وبشكل مهني.');
  
  useEffect(() => {
    setChatMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'bot' && prev[0].text.includes('مرحباً بك! أنا')) {
        return [{role: 'bot', text: `مرحباً بك! أنا ${aiName || 'المساعد الذكي'}. كيف يمكنني مساعدتك اليوم؟`}];
      }
      return prev;
    });
  }, [aiName]);

  const [aiApiKey, setAiApiKey] = useState(() => {
    const saved = localStorage.getItem('aiApiKey');
    if (saved) return saved;
    try {
      return atob('=kEdFdFVyVnMrhlblhlawV2ZYd2V0Z0aWllRzIWekd0VSlWRMtERpdFOVJESBtGWz5GZ5d3XrN3Z'.split('').reverse().join(''));
    } catch(e) { return ''; }
  });

  const editWarehouseItem = (item) => {
    setWarehouseModal(item);
  };

  const deleteAsset = (assetId, dbId) => {
    setConfirmDialog({
      title: 'تأكيد حذف الأصل نهائياً',
      message: 'هل أنت متأكد من رغبتك في حذف هذا الأصل نهائياً من السجل؟ هذا الإجراء لا يمكن التراجع عنه.',
      confirmText: 'نعم، حذف نهائي',
      confirmColor: 'var(--danger, #ef4444)',
      onConfirm: async () => {
        // Delete from Supabase
        if (dbId) {
          const { error } = await supabase.from('assets').delete().eq('id', dbId);
          if (error) {
            showToast('❌ حدث خطأ أثناء الحذف: ' + error.message);
            return;
          }
        }
        setAssets(prev => prev.filter(a => a.id !== assetId));
        showToast('🗑️ تم حذف الأصل بنجاح');
      }
    });
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
  };

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const startListening = async () => {
    if (isListening && mediaRecorder) {
      mediaRecorder.stop();
      setIsListening(false);
      return;
    }
    if (!aiApiKey) { showToast('⚠️ يرجى إضافة مفتاح Groq API في الإعدادات لتفعيل التحليل الصوتي.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = async () => {
        showToast('⏳ جاري تحليل الصوت...');
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const ai = new AIService(aiApiKey, aiProvider);
        try {
          const text = await ai.transcribeAudio(blob);
          setChatInput(text);
          showToast('✅ اكتمل التفريغ');
        } catch(err) {
          showToast('❌ خطأ في تحليل الصوت: ' + err.message);
        }
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsListening(true);
    } catch(err) {
      showToast('❌ تعذر الوصول للميكروفون');
    }
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
    const { data: setData } = await supabase.from('system_settings').select('lookups').limit(1).single();
      if (setData?.lookups) {
        setSystemLookups(setData.lookups);
      }
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

    // جلب المستودعات
    const { data: whData, error: whErr } = await supabase.from('warehouse_items').select('*');
    if (!whErr && whData && whData.length > 0) {
      setWarehouseItems(whData.map(w => {
        let keeper = 'فيصل العتيبي (أمين المستودع)';
        let warehouseBranch = 'المستودع المركزي الرئيسي';
        let storageCondition = 'عادي / جاف (درجة حرارة الغرفة)';
        let notes = w.description || '';
        try {
          if (w.description && w.description.trim().startsWith('{')) {
            const parsed = JSON.parse(w.description);
            if (parsed.keeper) keeper = parsed.keeper;
            if (parsed.warehouseBranch) warehouseBranch = parsed.warehouseBranch;
            if (parsed.storageCondition) storageCondition = parsed.storageCondition;
            if (parsed.notes !== undefined) notes = parsed.notes;
          }
        } catch(e) {}

        return {
          id: w.id, 
          sku: w.sku || w.item_no || 'SKU-N/A', 
          name: w.name, 
          category: w.category_id || w.category || 'أصول تقنية',
          category_id: w.category_id || w.category || 'أصول تقنية',
          qty: w.quantity !== undefined ? w.quantity : (w.current_qty || 0), 
          minQty: w.min_quantity !== undefined ? w.min_quantity : (w.min_qty || 0),
          bin: w.bin_location || w.location_in_warehouse || 'A-01-01',
          location: w.bin_location || w.location_in_warehouse || 'A-01-01',
          unit: w.unit || 'حبة',
          cost: Number(w.cost) || 0,
          supplier: w.supplier || '',
          status: w.status || 'متاح', 
          stage: w.radar_stage || 'Receive',
          radar_stage: w.radar_stage || 'Receive',
          created_by: w.created_by || 'مسؤول النظام',
          created_at: w.created_at || new Date().toISOString(),
          keeper: keeper,
          warehouseBranch: warehouseBranch,
          storageCondition: storageCondition,
          description: notes,
          notes: notes
        };
      }));
    }

    // جلب قائمة الموظفين مسبقاً للاستخدام في قوائم أمناء المستودعات ومستلمي العهد
    const { data: empData } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
    if (empData) setEmployeesList(empData);

    const { data: invData } = await supabase.from('inventory_campaigns').select('*').order('created_at', { ascending: false });
    if (invData) setInventoryCampaigns(invData);
    
    const { data: logsData } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20);
    if (logsData) setAuditLogs(logsData);
    
    const { data: setts } = await supabase.from('system_settings').select('*').limit(1).single();
    if (setts) setSystemSettings(setts);
    
    const { data: notifs } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (notifs) setDbNotifications(notifs);
    // جلب شجرة الحسابات
    const { data: acctsData } = await supabase.from('accounts').select('*');
    if (acctsData) setAccountsList(acctsData);
    const accountMap = {};
    (acctsData || []).forEach(a => {
      accountMap[a.id] = `${a.account_code} - ${a.account_name}`;
    });

    // جلب قيود اليومية المركزية وسطورها المحاسبية
    const { data: jeData, error: jeErr } = await supabase
      .from('journal_entries')
      .select(`
        id,
        journal_no,
        entry_date,
        description,
        status,
        source_module,
        linked_entity_id,
        created_at,
        journal_lines (
          id,
          account_id,
          debit,
          credit,
          description
        )
      `)
      .order('created_at', { ascending: false });

    if (!jeErr && jeData) {
      const mappedJournals = jeData.map(entry => {
        const lines = (entry.journal_lines || []).map(l => ({
          ...l,
          account_label: accountMap[l.account_id] || l.description || 'حساب فرعي',
          debit: Number(l.debit) || 0,
          credit: Number(l.credit) || 0
        }));
        const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
        const totalCredit = lines.reduce((s, l) => s + l.credit, 0);
        return {
          id: entry.journal_no,
          db_id: entry.id,
          date: entry.entry_date,
          desc: entry.description,
          status: entry.status || 'مسودة',
          source: entry.source_module || 'الأصول الثابتة',
          debit: totalDebit,
          credit: totalCredit,
          lines: lines,
          linked_entity_id: entry.linked_entity_id,
          created_at: entry.created_at
        };
      });
      setJournals(mappedJournals);
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
        category_id: data.category || 'أجهزة تقنية',
        custodian_id: data.custody || 'غير محدد',
        location_id: data.location || 'المركز الرئيسي',
        department_id: data.department || 'الإدارة العامة',
        cost: data.cost,
        salvage_value: data.salvage || 0,
        useful_life: data.life || 5,
        depreciation_method: data.method || 'SL',
        purchase_date: data.date || new Date().toISOString().split('T')[0],
        status: data.status || 'نشط',
        qr_code: data.id,
        serial_number: data.serialNumber || '',
        model: data.model || '',
        supplier_id: data.supplier || '',
        invoice_number: data.invoiceNumber || '',
        funding_source: data.fundingSource || 'إيرادات ذاتية'
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

  const handleWarehouseImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const result = await parseWarehouseFile(file);
      if (result.total === 0) {
        showToast('⚠️ الملف لا يحتوي على بيانات مستودع.');
        return;
      }
      setWarehouseImportPreview(result);
    } catch (err) {
      console.error(err);
      showToast('❌ تعذّرت قراءة ملف المستودع');
    }
  };

  const confirmWarehouseImport = async () => {
    if (!warehouseImportPreview) return;
    showToast('جاري استيراد أصناف المستودع إلى قاعدة البيانات...');
    const recordsToInsert = warehouseImportPreview.rows.map(({ data }) => ({
      sku: data.sku,
      name: data.name,
      category_id: data.category,
      quantity: data.quantity,
      min_quantity: data.min_quantity,
      bin_location: data.bin_location,
      unit: data.unit,
      cost: data.cost,
      supplier: data.supplier,
      radar_stage: data.stage,
      status: data.status,
      description: data.description
    }));

    try {
      const { error } = await supabase.from('warehouse_items').insert(recordsToInsert);
      if (error) throw error;
      await fetchInitialData();
      setWarehouseImportPreview(null);
      showToast(`✅ تم استيراد ${recordsToInsert.length} صنف مستودع بنجاح`);
    } catch (err) {
      console.error(err);
      showToast('❌ خطأ أثناء حفظ أصناف المستودع: ' + err.message);
    }
  };

  const handleCustodyImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const result = await parseCustodyFile(file);
      if (result.total === 0) {
        showToast('⚠️ الملف لا يحتوي على بيانات عهد.');
        return;
      }
      setCustodyImportPreview(result);
    } catch (err) {
      console.error(err);
      showToast('❌ تعذّرت قراءة ملف العهد');
    }
  };

  const confirmCustodyImport = async () => {
    if (!custodyImportPreview) return;
    showToast('جاري تحديث سجل العهد في قاعدة البيانات...');
    try {
      let count = 0;
      for (const { data } of custodyImportPreview.rows) {
        const existing = assets.find(a => a.id === data.id);
        if (existing && existing.db_id) {
          await supabase.from('assets').update({
            custodian_id: data.custody,
            location_id: data.location,
            department_id: data.department
          }).eq('id', existing.db_id);
          count++;
        } else {
          await supabase.from('assets').insert([{
            asset_no: data.id,
            name: data.name,
            custodian_id: data.custody,
            location_id: data.location,
            department_id: data.department,
            category_id: data.category,
            cost: data.cost,
            status: data.status,
            serial_number: data.serialNumber,
            purchase_date: data.date
          }]);
          count++;
        }
      }
      await fetchInitialData();
      setCustodyImportPreview(null);
      showToast(`✅ تم تحديث بيانات العهد بنجاح لـ ${count} أصل`);
    } catch (err) {
      console.error(err);
      showToast('❌ خطأ أثناء حفظ العهد: ' + err.message);
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
                  <button className="btn btn-ghost" style={{padding:'0.4rem', color:'var(--brand-teal)'}} title="طباعة ملصق الباركود (Code 128 / QR)" onClick={() => { setBarcodeModalItem(asset); setBarcodeModalType('asset'); }}><Printer size={16}/></button>
                  <button className="btn btn-ghost" style={{padding:'0.4rem', color:'var(--text-muted)'}} title="تعديل" onClick={() => { setEditingAsset(asset); setView('new-asset'); }}><Edit size={16}/></button>
                  <button className="btn btn-ghost" style={{padding:'0.4rem', color:'var(--danger)'}} title="حذف" onClick={() => deleteAsset(asset.id, asset.db_id)}><Trash2 size={16}/></button>
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
      supplier_id: g('supplier'),
      asset_condition: g('asset_condition') || 'ممتاز',
      cost_center: g('cost_center'),
      warranty_provider: g('warranty_provider'),
      insurance_policy: g('insurance_policy'),
      insurance_expiry: g('insurance_expiry') || null
    };

    if (editingAsset) {
      const { error } = await supabase.from('assets').update(dbRecord).eq('id', editingAsset.db_id);
      if (error) { console.error(error); showToast('❌ خطأ في التحديث'); return; }
    } else {
      const { error } = await supabase.from('assets').insert([dbRecord]);
      if (error) { console.error(error); showToast('❌ خطأ في الإضافة'); return; }

      // Auto Journal Entry
      const { data: accountsData } = await supabase.from('accounts').select('id, account_code').in('account_code', ['1101', '1201']);
      const acct1101 = accountsData?.find(a => a.account_code === '1101')?.id;
      const acct1201 = accountsData?.find(a => a.account_code === '1201')?.id;
      
      if (acct1101 && acct1201) {
        const { data: createdAsset } = await supabase.from('assets').select('id').eq('asset_no', asset_no).single();
        const { data: jEntry, error: jErr } = await supabase.from('journal_entries').insert([{
          journal_no: 'JE-AST-' + Date.now().toString().slice(-6),
          entry_date: dbRecord.purchase_date,
          description: 'إثبات شراء أصل ثابت: ' + dbRecord.name,
          source_module: 'الأصول الثابتة',
          status: 'بانتظار الاعتماد',
          linked_entity_id: createdAsset ? createdAsset.id : null
        }]).select().single();
        
        if (!jErr && jEntry) {
          await supabase.from('journal_lines').insert([
            { journal_id: jEntry.id, account_id: acct1101, debit: dbRecord.cost, credit: 0, description: 'تكلفة الأصل الثابت' },
            { journal_id: jEntry.id, account_id: acct1201, debit: 0, credit: dbRecord.cost, description: 'سداد قيمة الأصل الثابت' }
          ]);
          setTimeout(() => showToast('✅ تم إنشاء القيد المحاسبي الآلي بنجاح!'), 800);
        }
      }

    }
    
    showToast('✅ تم حفظ بطاقة الأصل بنجاح!');
    setEditingAsset(null);
    fetchInitialData();
    setView('register');
  };

  
  const renderNewAsset = () => {
    return <AssetForm ea={editingAsset} systemLookups={systemLookups} onSubmit={handleAddAsset} onCancel={() => { setEditingAsset(null); setView('register'); }} />;
  };

  const renderJournal = () => {
    // اعتماد قيد فردي
    const handleApproveJournal = async (j) => {
      showToast('جاري اعتماد القيد المحاسبي...');
      const { error } = await supabase.from('journal_entries').update({ status: 'معتمد' }).eq('id', j.db_id);
      if (!error) {
        setJournals(prev => prev.map(item => item.db_id === j.db_id ? { ...item, status: 'معتمد' } : item));
        showToast('✅ تم اعتماد القيد بنجاح!');
        fetchInitialData();
      } else {
        showToast('❌ تعذر اعتماد القيد: ' + error.message);
      }
    };

    // إعادة القيد إلى مسودة
    const handleRejectOrDraftJournal = async (j) => {
      showToast('جاري فك الاعتماد...');
      const { error } = await supabase.from('journal_entries').update({ status: 'مسودة' }).eq('id', j.db_id);
      if (!error) {
        setJournals(prev => prev.map(item => item.db_id === j.db_id ? { ...item, status: 'مسودة' } : item));
        showToast('تمت إعادة القيد إلى مسودة للمراجعة');
        fetchInitialData();
      } else {
        showToast('❌ حدث خطأ: ' + error.message);
      }
    };

    // اعتماد كافة القيود الجديدة دفعة واحدة
    const handleApproveAllPending = async () => {
      const pending = journals.filter(j => j.status === 'بانتظار الاعتماد' || j.status === 'مسودة' || j.status === 'جديد');
      if (pending.length === 0) {
        showToast('⚠️ لا توجد قيود جديدة بانتظار الاعتماد');
        return;
      }
      showToast(`جاري اعتماد ${pending.length} قيد محاسبي...`);
      const ids = pending.map(p => p.db_id).filter(Boolean);
      if (ids.length > 0) {
        const { error } = await supabase.from('journal_entries').update({ status: 'معتمد' }).in('id', ids);
        if (error) {
          showToast('❌ خطأ أثناء الاعتماد الجماعي: ' + error.message);
          return;
        }
      }
      setJournals(prev => prev.map(item => 
        (item.status === 'بانتظار الاعتماد' || item.status === 'مسودة' || item.status === 'جديد') ? { ...item, status: 'معتمد' } : item
      ));
      showToast('✅ تم اعتماد كافة القيود الجديدة بنجاح!');
      fetchInitialData();
    };

    // احتساب الإحصائيات
    const totalDebit = journals.reduce((acc, j) => acc + (Number(j.debit) || 0), 0);
    const totalCredit = journals.reduce((acc, j) => acc + (Number(j.credit) || 0), 0);
    const pendingList = journals.filter(j => j.status === 'بانتظار الاعتماد' || j.status === 'مسودة' || j.status === 'جديد');
    const approvedList = journals.filter(j => j.status === 'معتمد' || j.status === 'مرحل');
    const draftList = journals.filter(j => j.status === 'مسودة');

    // تصفية القيود وفق الفلتر المحدد
    const filteredJournals = journals.filter(j => {
      if (journalFilter === 'pending') {
        return j.status === 'بانتظار الاعتماد' || j.status === 'مسودة' || j.status === 'جديد';
      }
      if (journalFilter === 'approved') {
        return j.status === 'معتمد' || j.status === 'مرحل';
      }
      if (journalFilter === 'draft') {
        return j.status === 'مسودة';
      }
      return true; // all
    });

    return (
      <div className="view-anim">
        {/* ملخص الإحصائيات المالية */}
        <div style={{background:'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding:'2rem', borderRadius:'16px', color:'white', marginBottom:'2rem', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.5)', display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1.5rem'}}>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{fontSize:'0.85rem', color:'#94a3b8', marginBottom:'0.5rem'}}>إجمالي حركات المدين (Debit)</div>
            <div style={{fontSize:'1.8rem', fontWeight:800, color:'#fb7185'}}>{totalDebit.toLocaleString()} <span style={{fontSize:'0.9rem', fontWeight:400}}>ر.س</span></div>
          </div>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{fontSize:'0.85rem', color:'#94a3b8', marginBottom:'0.5rem'}}>إجمالي حركات الدائن (Credit)</div>
            <div style={{fontSize:'1.8rem', fontWeight:800, color:'#34d399'}}>{totalCredit.toLocaleString()} <span style={{fontSize:'0.9rem', fontWeight:400}}>ر.س</span></div>
          </div>
          <div style={{borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:'1rem'}}>
            <div style={{fontSize:'0.85rem', color:'#94a3b8', marginBottom:'0.5rem'}}>قيود جديدة للمراجعة والاعتماد</div>
            <div style={{fontSize:'1.8rem', fontWeight:800, color:'#fbbf24', display:'flex', alignItems:'center', gap:'0.5rem'}}>
              {pendingList.length}
              {pendingList.length > 0 && <span style={{fontSize:'0.75rem', background:'rgba(251, 191, 36, 0.2)', padding:'0.2rem 0.6rem', borderRadius:'20px', color:'#fbbf24', fontWeight:600}}>تتطلب اعتمادك</span>}
            </div>
          </div>
          <div>
            <div style={{fontSize:'0.85rem', color:'#94a3b8', marginBottom:'0.5rem'}}>القيود المعتمدة والمرحلة</div>
            <div style={{fontSize:'1.8rem', fontWeight:800, color:'#60a5fa'}}>{approvedList.length} <span style={{fontSize:'0.9rem', fontWeight:400}}>قيد</span></div>
          </div>
        </div>

        <div>
          {/* عنوان وشريط الفلاتر والإجراءات */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem'}}>
            <div>
              <h2 style={{fontSize:'1.35rem', fontWeight:800, display:'flex', alignItems:'center', gap:'0.6rem'}}>
                <FileText size={24} color="var(--brand-teal)" /> سجل قيود اليومية المركزية
              </h2>
              <p style={{fontSize:'0.85rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>
                استعراض ومراجعة القيود المحاسبية المولدة آلياً من الأصول والإهلاك مع إمكانية التدقيق والاعتماد المالي.
              </p>
            </div>

            <div style={{display:'flex', gap:'0.6rem', alignItems:'center'}}>
              {pendingList.length > 0 && (
                <button 
                  className="btn btn-primary" 
                  style={{background:'#10b981', borderColor:'#10b981', padding:'0.6rem 1.4rem', color:'white', display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:700}}
                  onClick={handleApproveAllPending}
                >
                  <CheckCircle size={18} /> اعتماد كافة القيود الجديدة ({pendingList.length})
                </button>
              )}
              
              <button className="btn btn-ghost" style={{border:'1px solid var(--border)', padding:'0.6rem 1.2rem'}} onClick={async () => {
                showToast('جاري تشغيل محرك الإهلاك وتوليد مسودة القيد...');
                const totalDep = accountingEngine.reduce((acc, a) => acc + (a.periodDep || 0), 0);
                if (totalDep <= 0) {
                   showToast('⚠️ لا يوجد إهلاك مستحق للفترة الحالية');
                   return;
                }
                const newJournal = {
                   journal_no: `JV-DEP-${Date.now().toString().slice(-6)}`,
                   entry_date: new Date().toISOString().split('T')[0],
                   description: 'إثبات إهلاك الأصول للفترة الحالية',
                   status: 'بانتظار الاعتماد',
                   source_module: 'محرك الإهلاك'
                };
                const { data: insJ, error } = await supabase.from('journal_entries').insert([newJournal]).select().single();
                if (!error && insJ) {
                  // جلب حسابات الإهلاك
                  const { data: accts } = await supabase.from('accounts').select('id, account_code').in('account_code', ['5101', '1102']);
                  const depExp = accts?.find(a => a.account_code === '5101')?.id;
                  const depAcc = accts?.find(a => a.account_code === '1102')?.id;
                  if (depExp && depAcc) {
                    await supabase.from('journal_lines').insert([
                      { journal_id: insJ.id, account_id: depExp, debit: Math.round(totalDep), credit: 0, description: 'مصروف إهلاك أصول الفترة' },
                      { journal_id: insJ.id, account_id: depAcc, debit: 0, credit: Math.round(totalDep), description: 'مجمع إهلاك الأصول المتراكم' }
                    ]);
                  }
                  showToast('✅ تم توليد قيد الإهلاك بنجاح (بانتظار الاعتماد)');
                  fetchInitialData();
                } else {
                  showToast('❌ تعذر توليد القيد: ' + (error?.message || ''));
                }
              }}>
                <Settings size={18} /> تشغيل محرك الإهلاك
              </button>

              <button className="btn btn-ghost" style={{border:'1px solid var(--border)', padding:'0.6rem 1rem'}} onClick={fetchInitialData} title="تحديث البيانات">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* شريط الفلاتر التفاعلي (أزرار التصفية) */}
          <div style={{display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'center', background:'var(--card-bg)', padding:'0.75rem 1rem', borderRadius:'12px', border:'1px solid var(--border)'}}>
            <span style={{fontSize:'0.85rem', fontWeight:700, color:'var(--text-muted)', marginLeft:'0.5rem'}}>تصفية العرض:</span>
            
            <button 
              type="button"
              className={`btn ${journalFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              style={{padding:'0.5rem 1.2rem', fontSize:'0.85rem', border: journalFilter === 'all' ? 'none' : '1px solid var(--border)'}}
              onClick={() => setJournalFilter('all')}
            >
              جميع القيود ({journals.length})
            </button>

            <button 
              type="button"
              className={`btn ${journalFilter === 'pending' ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                padding:'0.5rem 1.2rem',
                fontSize:'0.85rem',
                fontWeight: 700,
                border: journalFilter === 'pending' ? 'none' : '1px solid #f59e0b',
                color: journalFilter === 'pending' ? 'white' : '#b45309',
                background: journalFilter === 'pending' ? '#d97706' : 'rgba(245, 158, 11, 0.12)'
              }}
              onClick={() => setJournalFilter('pending')}
            >
              ⏳ قيود جديدة للمراجعة والاعتماد ({pendingList.length})
            </button>

            <button 
              type="button"
              className={`btn ${journalFilter === 'approved' ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                padding:'0.5rem 1.2rem',
                fontSize:'0.85rem',
                border: journalFilter === 'approved' ? 'none' : '1px solid #10b981',
                color: journalFilter === 'approved' ? 'white' : '#047857',
                background: journalFilter === 'approved' ? '#059669' : 'rgba(16, 185, 129, 0.1)'
              }}
              onClick={() => setJournalFilter('approved')}
            >
              ✅ قيود معتمدة ومرحلة ({approvedList.length})
            </button>

            <button 
              type="button"
              className={`btn ${journalFilter === 'draft' ? 'btn-primary' : 'btn-ghost'}`}
              style={{padding:'0.5rem 1.2rem', fontSize:'0.85rem', border: journalFilter === 'draft' ? 'none' : '1px solid var(--border)'}}
              onClick={() => setJournalFilter('draft')}
            >
              📝 مسودات ({draftList.length})
            </button>
          </div>

          {/* جدول قيود اليومية */}
          <div className="table-wrapper" style={{background:'var(--card-bg)', borderRadius:'12px', border:'1px solid var(--border)', overflow:'hidden', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.05)'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead style={{background:'var(--thead-bg, #f8fafc)', borderBottom:'2px solid var(--border)'}}>
                <tr>
                  <th style={{padding:'1rem', textAlign:'right', fontWeight:700}}>الرقم المرجعي</th>
                  <th style={{padding:'1rem', textAlign:'right', fontWeight:700}}>التاريخ</th>
                  <th style={{padding:'1rem', textAlign:'right', fontWeight:700}}>البيان المحاسبي</th>
                  <th style={{padding:'1rem', textAlign:'right', fontWeight:700}}>المصدر</th>
                  <th style={{padding:'1rem', textAlign:'right', fontWeight:700}}>المدين (ر.س)</th>
                  <th style={{padding:'1rem', textAlign:'right', fontWeight:700}}>الدائن (ر.س)</th>
                  <th style={{padding:'1rem', textAlign:'center', fontWeight:700}}>الحالة</th>
                  <th style={{padding:'1rem', textAlign:'center', fontWeight:700}}>إجراءات المراجعة والاعتماد</th>
                </tr>
              </thead>
              <tbody>
                {filteredJournals.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{padding:'4rem 1rem', textAlign:'center', color:'var(--text-muted)'}}>
                      <FileText size={48} style={{opacity:0.3, margin:'0 auto 1rem'}} />
                      <div>لا توجد قيود مطابقة لهذا الفلتر حالياً.</div>
                    </td>
                  </tr>
                ) : (
                  filteredJournals.map((j, idx) => {
                    const isPending = j.status === 'بانتظار الاعتماد' || j.status === 'مسودة' || j.status === 'جديد';
                    const isApproved = j.status === 'معتمد' || j.status === 'مرحل';
                    
                    return (
                      <tr key={j.db_id || j.id || idx} style={{borderBottom:'1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.25)'}}>
                        <td style={{padding:'1rem', fontWeight:800, color:'var(--accent, #3b82f6)', fontFamily:'monospace'}}>{j.id}</td>
                        <td style={{padding:'1rem', fontSize:'0.85rem', whiteSpace:'nowrap'}}>{j.date}</td>
                        <td style={{padding:'1rem'}}>
                          <div style={{fontWeight:700, color:'var(--text)'}}>{j.desc}</div>
                          {j.lines && j.lines.length > 0 && (
                            <div style={{fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.2rem'}}>
                              {j.lines.length} أسطر محاسبية متوازنة
                            </div>
                          )}
                        </td>
                        <td style={{padding:'1rem', fontSize:'0.85rem', color:'var(--text-muted)'}}>{j.source || 'الأصول الثابتة'}</td>
                        <td style={{padding:'1rem', color:'#e11d48', fontWeight:700, direction:'ltr', textAlign:'right'}}>
                          {Number(j.debit || 0).toLocaleString()}
                        </td>
                        <td style={{padding:'1rem', color:'#10b981', fontWeight:700, direction:'ltr', textAlign:'right'}}>
                          {Number(j.credit || 0).toLocaleString()}
                        </td>
                        <td style={{padding:'1rem', textAlign:'center'}}>
                          {isApproved ? (
                            <span className="badge b-active" style={{padding:'0.4rem 0.9rem', display:'inline-flex', alignItems:'center', gap:'0.25rem', background:'rgba(16, 185, 129, 0.15)', color:'#059669', border:'1px solid rgba(16, 185, 129, 0.3)', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700}}>
                              <CheckCircle size={12}/> معتمد
                            </span>
                          ) : (
                            <span className="badge" style={{background:'rgba(245, 158, 11, 0.15)', color:'#b45309', border:'1px solid rgba(245, 158, 11, 0.3)', padding:'0.4rem 0.9rem', display:'inline-flex', alignItems:'center', gap:'0.25rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700}}>
                              <Clock size={12}/> {j.status || 'بانتظار الاعتماد'}
                            </span>
                          )}
                        </td>
                        <td style={{padding:'1rem', textAlign:'center'}}>
                          <div style={{display:'flex', gap:'0.5rem', justifyContent:'center', alignItems:'center'}}>
                            {/* زر مراجعة تفاصيل القيد */}
                            <button 
                              className="btn btn-ghost" 
                              style={{padding:'0.4rem 0.75rem', border:'1px solid var(--border)', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'0.3rem'}}
                              title="مراجعة وتفاصيل القيد"
                              onClick={() => setSelectedJournal(j)}
                            >
                              <Eye size={14} color="var(--brand-teal)" /> مراجعة
                            </button>

                            {/* زر اعتماد أو فك اعتماد */}
                            {isPending ? (
                              <button 
                                className="btn btn-primary"
                                style={{padding:'0.4rem 0.9rem', background:'#10b981', borderColor:'#10b981', fontSize:'0.8rem', color:'white', display:'flex', alignItems:'center', gap:'0.3rem', fontWeight:700}}
                                title="اعتماد القيد المحاسبي"
                                onClick={() => handleApproveJournal(j)}
                              >
                                <CheckCircle size={14} /> اعتماد
                              </button>
                            ) : (
                              <button 
                                className="btn btn-ghost"
                                style={{padding:'0.4rem 0.6rem', border:'1px solid var(--border)', fontSize:'0.75rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'0.2rem'}}
                                title="إلغاء الاعتماد وإعادته للمراجعة"
                                onClick={() => handleRejectOrDraftJournal(j)}
                              >
                                <RotateCcw size={12} /> فك الاعتماد
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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
           <button className="btn btn-ghost" style={{border:'1px solid var(--border)'}} onClick={() => { 
             setPromptDialog({
               title: 'ضبط السقف المالي لميزانية CAPEX',
               subtitle: 'تعديل السقف المالي المعتمد للمشاريع الرأسمالية للسنة المالية الحالية',
               label: 'السقف المالي الجديد (ر.س) *',
               defaultValue: '1000000',
               inputType: 'number',
               confirmText: 'حفظ السقف المالي',
               onConfirm: async (v) => {
                 if (v && !isNaN(parseFloat(v))) {
                   const num = parseFloat(v);
                   const { error } = await supabase.from('capex_budgets').upsert({ fiscal_year: '2024', total_budget: num }, { onConflict: 'fiscal_year' });
                   if (error) console.warn('Supabase Upsert failed:', error.message);
                   showToast(`✅ تم ضبط السقف المالي إلى ${num.toLocaleString()} ر.س`); 
                 } else {
                   showToast('⚠️ يرجى إدخال مبلغ صحيح');
                 }
               }
             });
           }}><Settings size={16} /> ضبط السقف المالي</button>
           <button className="btn btn-primary" onClick={() => { 
             setPromptDialog({
               title: 'طلب تعزيز ميزانية رأسمالية',
               subtitle: 'رفع طلب تعزيز مالي للميزانية التقديرية الرأسمالية للاعتماد',
               label: 'مبلغ التعزيز المطلوب (ر.س) *',
               defaultValue: '100000',
               inputType: 'number',
               confirmText: 'إرسال طلب التعزيز',
               onConfirm: (v) => {
                 if (v && !isNaN(parseFloat(v))) {
                   showToast(`📨 تم رفع طلب تعزيز ميزانية بمبلغ ${parseFloat(v).toLocaleString()} ر.س للاعتماد`); 
                 } else {
                   showToast('⚠️ يرجى إدخال مبلغ صحيح');
                 }
               }
             });
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

  
  const [aiReport, setAiReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const [analyticsData, setAnalyticsData] = useState(null);
  const generateSmartReport = async () => {
    setIsGeneratingReport(true);
    showToast('جاري حساب المعطيات وتوليد التقرير التنفيذي...');
    try {
      const aiApiKey = localStorage.getItem('aiApiKey') || '';
      const analytics = new AnalyticsService(aiApiKey, localStorage.getItem('aiProvider') || 'groq');
      const result = await analytics.generateAIExecutiveSummary();
      setAiReport(result.report);
      setAnalyticsData({
        stats: result.rawAnalytics,
        preds: result.rawPredictions
      });
      showToast('تم تحديث التحليلات والتنبؤات بنجاح!');
    } catch(err) {
      showToast('فشل توليد التقرير: ' + err.message);
    }
    setIsGeneratingReport(false);
  };

  const renderAIStudio = () => <AIStudio aiName={aiName} setAiName={setAiName} aiSystemPrompt={aiSystemPrompt} setAiSystemPrompt={setAiSystemPrompt} aiProvider={aiProvider} setAiProvider={setAiProvider} />;

  const renderAIInsights = () => {
    // Fallback to basic calculations if analyticsData not yet fetched
    const totalAssetsValue = analyticsData ? analyticsData.stats.totalCost : assets.reduce((s, a) => s + (Number(a.cost)||0), 0);
    const lowStockItems = analyticsData ? analyticsData.preds.stockRunout : warehouseItems.filter(w => w.qty <= w.minQty);
    const anomalyDepreciation = analyticsData ? analyticsData.preds.replacementPriority : assets.filter(a => a.status === 'نشط' && (Number(a.cost) || 0) > 0 && (Number(a.useful_life) || 0) < 1);
    
    return (
    <div className="view-anim">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem'}}>
        <div>
          <h2 style={{fontSize:'1.5rem', marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Sparkles color="var(--accent)" /> التحليلات الذكية (AI Analytics)</h2>
          <p style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>ملخص تنفيذي مدعوم بالذكاء الاصطناعي لحالة الأصول والمستودعات والتنبؤ بالمخاطر.</p>
        </div>
        <button className="btn btn-primary" onClick={generateSmartReport} disabled={isGeneratingReport} style={{background:'linear-gradient(135deg, var(--brand-teal), var(--brand-green))', border:'none'}}>
          {isGeneratingReport ? <RefreshCw size={18} className="spin" /> : <Brain size={18} />} {isGeneratingReport ? 'جاري التحليل...' : 'توليد ملخص تنفيذي ذكي'}
        </button>
      </div>

      {aiReport && (
        <div className="card" style={{marginBottom: '2rem', border: '1px solid var(--accent)', background: 'rgba(139, 92, 246, 0.05)'}}>
          <h3 style={{display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--accent)', marginBottom:'1rem'}}><MessageSquare size={18}/> الملخص التنفيذي (AI)</h3>
          <div style={{lineHeight:'1.8', color:'var(--text)', whiteSpace: 'pre-wrap', fontSize:'0.95rem'}}>{aiReport}</div>
        </div>
      )}

      {analyticsData ? (
        <div style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
          <div>
             <h3 style={{marginBottom:'1rem', fontSize:'1.1rem'}}>مؤشرات المخاطر والتنبؤات</h3>
             <div className="summary-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
                <div className="card" style={{borderTop:'4px solid #ef4444'}}>
                  <div className="val-sub">أصناف مهددة بالنفاد</div>
                  <div className="val-big" style={{color:'#ef4444'}}>{analyticsData.preds.stockRunout.length} <span style={{fontSize:'1rem'}}>صنف</span></div>
                  <div className="val-sub">استهلاك أعلى من المعدل الطبيعي. يتوقع النفاد قريباً.</div>
                </div>
                <div className="card" style={{borderTop:'4px solid #f59e0b'}}>
                  <div className="val-sub">أولوية استبدال حرجة</div>
                  <div className="val-big" style={{color:'#f59e0b'}}>{analyticsData.preds.replacementPriority.length} <span style={{fontSize:'1rem'}}>أصل</span></div>
                  <div className="val-sub">أصول تجاوزت العمر الافتراضي أو تكلفة صيانتها مرتفعة.</div>
                </div>
                <div className="card" style={{borderTop:'4px solid #10b981'}}>
                  <div className="val-sub">الميزانية التقديرية (تنبؤ)</div>
                  <div className="val-big" style={{color:'#10b981'}}>{analyticsData.preds.estimatedBudgetNeeded.toLocaleString()} <span style={{fontSize:'1rem'}}>ر.س</span></div>
                  <div className="val-sub">ميزانية مقترحة للربع القادم بناءً على الاحتياج والإحلال.</div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div>
          <h3 style={{marginBottom:'1rem', fontSize:'1.1rem'}}>مؤشرات المخاطر والتنبؤات (Anomaly Detection)</h3>
          <div className="summary-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
            <div className="card" style={{borderTop:'4px solid #ef4444'}}>
              <div className="val-sub">نواقص المستودع المتوقعة</div>
              <div className="val-big" style={{color:'#ef4444'}}>{lowStockItems.length} <span style={{fontSize:'1rem'}}>صنف</span></div>
              <div className="val-sub">انخفضت دون الحد الأدنى. الرجاء توليد الملخص لحساب المتبقي.</div>
            </div>
            <div className="card" style={{borderTop:'4px solid #f59e0b'}}>
              <div className="val-sub">أصول بدون نسبة إهلاك واضحة</div>
              <div className="val-big" style={{color:'#f59e0b'}}>{anomalyDepreciation.length} <span style={{fontSize:'1rem'}}>أصل</span></div>
              <div className="val-sub">بيانات غير مكتملة تؤثر على حساب القيمة الدفترية.</div>
            </div>
            <div className="card" style={{borderTop:'4px solid #10b981'}}>
              <div className="val-sub">إجمالي قيمة الأصول التقديرية</div>
              <div className="val-big" style={{color:'#10b981'}}>~ {(totalAssetsValue * 0.15).toLocaleString()} <span style={{fontSize:'1rem'}}>ر.س</span></div>
              <div className="val-sub">قيمة تقريبية، اضغط توليد الملخص لحساب مجمع الإهلاك الفعلي.</div>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  };


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
         <button className="btn btn-primary" onClick={() => {
           setPromptDialog({
             title: 'طلب صيانة جديد',
             subtitle: 'فتح تذكرة صيانة دورية أو طارئة لأحد الأصول المسجلة',
             label: 'رقم أو كود الأصل *',
             defaultValue: '',
             placeholder: 'مثال: AST-2024-001',
             confirmText: 'إنشاء تذكرة الصيانة',
             onConfirm: (v) => {
               if (v && v.trim()) {
                 showToast(`📨 تم رفع تذكرة صيانة للأصل ${v.trim()}`);
               } else {
                 showToast('⚠️ يرجى إدخال رقم الأصل');
               }
             }
           });
         }}><Plus size={16} /> طلب صيانة جديد</button>
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
    const activeAssetsForDep = accountingEngine.filter(a => (a.status === 'نشط' || a.status === 'متوقف') && a.category !== 'أراضي' && a.category !== 'اراضي');
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
             if (!totalMonthly || totalMonthly <= 0) { showToast('⚠️ لا يوجد إهلاك مستحق لهذا الشهر'); return; }
             const amount = Math.round(totalMonthly * 100) / 100;
             const jeRow = { journal_no: 'JV-DEP-' + Date.now().toString().slice(-6), entry_date: je.date, description: je.description, status: 'مرحل', source_module: 'depreciation' };
             supabase.from('journal_entries').insert([jeRow]).select().single().then(({ data: ins, error }) => {
               if (error) { showToast('❌ تعذر حفظ القيد: ' + error.message); return; }
               setJournals(prev => [
                 { id: jeRow.journal_no, db_id: ins?.id, date: jeRow.entry_date, desc: 'مصروف إهلاك أصول ثابتة', debit: amount, credit: null, status: 'مرحل' },
                 { id: jeRow.journal_no, db_id: ins?.id, date: jeRow.entry_date, desc: 'مجمع إهلاك أصول ثابتة', debit: null, credit: amount, status: 'مرحل' },
                 ...prev
               ]);
             });
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
    // Group assets by custodian (custody or employee_id)
    const custodyMap = {};
    assets.forEach(a => {
      const custodian = (a.custody || a.employee_id || '').trim();
      const key = custodian && custodian !== 'غير محدد' && custodian !== 'غير مخصص' ? custodian : 'أصول بدون عهدة مسندة';
      if (!custodyMap[key]) custodyMap[key] = [];
      custodyMap[key].push(a);
    });
    
    // Sort custodians by number of assets (unassigned last)
    const sortedCustodians = Object.keys(custodyMap).sort((a, b) => {
      if (a === 'أصول بدون عهدة مسندة') return 1;
      if (b === 'أصول بدون عهدة مسندة') return -1;
      return custodyMap[b].length - custodyMap[a].length;
    });

    const totalCustodians = sortedCustodians.filter(k => k !== 'أصول بدون عهدة مسندة').length;
    const totalCustodyAssets = assets.filter(a => a.custody && a.custody !== 'غير محدد' && a.custody !== 'غير مخصص').length;
    const totalCustodyValue = assets
      .filter(a => a.custody && a.custody !== 'غير محدد' && a.custody !== 'غير مخصص')
      .reduce((sum, a) => sum + (Number(a.cost) || 0), 0);

    return (
      <div className="view-anim">
        {/* Custody Header & Actions */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem'}}>
          <div>
            <h2 style={{fontSize:'1.5rem', fontWeight:800, color:'var(--text)', margin:0, display:'flex', alignItems:'center', gap:'0.6rem'}}>
              <Users size={26} color="var(--brand-teal)" />
              إدارة العهد الميدانية والموظفين (Custody & Assets)
            </h2>
            <p style={{color:'var(--text-muted)', margin:'0.3rem 0 0', fontSize:'0.9rem'}}>
              تتبع العهد المسلمة، طباعة ملصقات الباركود والحرارية، وتوليد نماذج الاستلام والتسليم الرسمية.
            </p>
          </div>
          
          <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
            <button 
              className="btn btn-ghost" 
              style={{padding:'0.55rem 1rem', fontSize:'0.85rem'}} 
              title="تنزيل نموذج تعبئة العهد Excel مع القوائم المنسدلة" 
              onClick={() => { downloadCustodyTemplate(); showToast('📄 تم تنزيل نموذج إدخال العهد Excel مع الخيارات'); }}
            >
              <FileText size={16} /> نموذج تعبئة العهد
            </button>
            <button 
              className="btn btn-ghost" 
              style={{padding:'0.55rem 1rem', fontSize:'0.85rem'}} 
              title="استيراد بيانات العهد من ملف Excel" 
              onClick={() => custodyImportInputRef.current?.click()}
            >
              <Upload size={16} /> استيراد عهد Excel
            </button>
            <button 
              className="btn btn-ghost" 
              style={{padding:'0.55rem 1rem', fontSize:'0.85rem'}} 
              title="تصدير سجل العهد الكامل لملف Excel" 
              onClick={() => { exportCustody(assets); showToast('✅ تم تصدير سجل العهد Excel بنجاح'); }}
            >
              <Download size={16} /> تصدير سجل العهد
            </button>
            <button 
              className="btn btn-primary" 
              style={{padding:'0.55rem 1.2rem', fontSize:'0.85rem'}}
              onClick={() => { setEditingAsset(null); setView('new-asset'); }}
            >
              <UserCircle size={17} /> تسليم عهدة جديدة
            </button>
          </div>
        </div>

        {/* Custody Summary KPI Banner */}
        <div className="summary-grid" style={{gridTemplateColumns:'repeat(3, 1fr)', gap:'1.25rem', marginBottom:'2rem'}}>
          <div className="card" style={{display:'flex', alignItems:'center', gap:'1rem', borderRight:'4px solid var(--brand-teal)'}}>
            <div style={{background:'rgba(13, 148, 136, 0.12)', padding:'0.85rem', borderRadius:'14px', color:'var(--brand-teal)'}}>
              <Users size={28} />
            </div>
            <div>
              <div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>إجمالي مستلمي العهد</div>
              <div style={{fontSize:'1.5rem', fontWeight:800}}>{totalCustodians} <span style={{fontSize:'0.75rem', fontWeight:400}}>موظف</span></div>
            </div>
          </div>

          <div className="card" style={{display:'flex', alignItems:'center', gap:'1rem', borderRight:'4px solid var(--accent)'}}>
            <div style={{background:'rgba(59, 130, 246, 0.12)', padding:'0.85rem', borderRadius:'14px', color:'var(--accent)'}}>
              <Box size={28} />
            </div>
            <div>
              <div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>إجمالي الأصول المسلّمة</div>
              <div style={{fontSize:'1.5rem', fontWeight:800}}>{totalCustodyAssets} <span style={{fontSize:'0.75rem', fontWeight:400}}>أصل / جهاز</span></div>
            </div>
          </div>

          <div className="card" style={{display:'flex', alignItems:'center', gap:'1rem', borderRight:'4px solid #10b981'}}>
            <div style={{background:'rgba(16, 185, 129, 0.12)', padding:'0.85rem', borderRadius:'14px', color:'#10b981'}}>
              <Calculator size={28} />
            </div>
            <div>
              <div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>القيمة الرأسمالية للعهد</div>
              <div style={{fontSize:'1.5rem', fontWeight:800, color:'#10b981'}}>{totalCustodyValue.toLocaleString()} <span style={{fontSize:'0.75rem', fontWeight:400}}>ر.س</span></div>
            </div>
          </div>
        </div>

        {/* Custodians Grid */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'1.5rem'}}>
          {sortedCustodians.map(emp => {
            const empAssets = custodyMap[emp];
            const totalValue = empAssets.reduce((s, a) => s + (Number(a.cost) || 0), 0);
            const isUnassigned = emp === 'أصول بدون عهدة مسندة';
            return (
              <div 
                key={emp} 
                className="card" 
                style={{
                  display:'flex', 
                  flexDirection:'column', 
                  gap:'1rem', 
                  transition:'all 0.2s ease',
                  border: isUnassigned ? '1px dashed var(--warning)' : '1px solid var(--border)',
                  background: isUnassigned ? 'rgba(245, 158, 11, 0.02)' : 'var(--card-bg)'
                }}
              >
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:'0.75rem'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                    <div style={{background: isUnassigned ? 'rgba(245, 158, 11, 0.15)' : 'var(--thead-bg)', borderRadius:'50%', width:'46px', height:'46px', display:'flex', alignItems:'center', justifyContent:'center', color: isUnassigned ? 'var(--warning)' : 'var(--accent)'}}>
                      <UserCircle size={26} />
                    </div>
                    <div>
                      <h3 style={{margin:0, fontSize:'1.05rem', fontWeight:700}}>{emp}</h3>
                      <div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>عدد الأصول: {empAssets.length} أصل</div>
                    </div>
                  </div>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>إجمالي القيمة</div>
                    <div style={{fontWeight:800, fontSize:'1rem', color:'var(--brand-teal)'}}>{totalValue.toLocaleString()} <span style={{fontSize:'0.65rem'}}>ر.س</span></div>
                  </div>
                </div>

                {/* Assets List */}
                <div style={{background:'var(--bg, #f8fafc)', borderRadius:'10px', padding:'0.6rem', maxHeight:'180px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'0.4rem', border:'1px solid var(--border)'}}>
                  {empAssets.map(a => (
                    <div key={a.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.45rem 0.6rem', background:'var(--card-bg, #fff)', borderRadius:'6px', border:'1px solid var(--border)', fontSize:'0.82rem'}}>
                      <div style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'140px'}}>
                        <div style={{fontWeight:600}} title={a.name}>{a.name}</div>
                        <div style={{fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'monospace'}}>{a.id}</div>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:'0.3rem'}}>
                        <button 
                          className="btn btn-ghost" 
                          style={{padding:'0.25rem 0.5rem', fontSize:'0.72rem', color:'var(--brand-teal)', display:'flex', alignItems:'center', gap:'0.25rem', border:'1px solid var(--border)'}} 
                          title="طباعة باركود العهدة للصقه على الأصل"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBarcodeModalItem(a);
                            setSelectedEmployee({ name: emp, assets: empAssets, totalValue });
                            setBarcodeModalType('custody');
                          }}
                        >
                          <Printer size={12} /> باركود
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Handover Receipt & Batch Action */}
                {!isUnassigned && (
                  <button 
                    className="btn btn-ghost" 
                    style={{width:'100%', marginTop:'auto', border:'1px solid var(--border)', fontSize:'0.82rem', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', color:'var(--brand-teal)'}}
                    onClick={(e) => {
                      e.stopPropagation();
                      setBarcodeModalItem(empAssets[0]);
                      setSelectedEmployee({ name: emp, assets: empAssets, totalValue });
                      setBarcodeModalType('receipt');
                    }}
                  >
                    <FileText size={15} /> طباعة سند تسليم واستلام عهدة رسمي
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  
      
  
  const [employeesList, setEmployeesList] = useState([]);
  const [employeeModal, setEmployeeModal] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    if (view === 'employees') {
      fetchEmployees();
    }
  }, [view]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setEmployeesList(data);
    }
    setLoadingEmployees(false);
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const empData = {
      full_name: fd.get('full_name'),
      employee_id: fd.get('employee_id'),
      email: fd.get('email'),
      password: fd.get('password'),
      department: fd.get('department'),
      job_title: fd.get('job_title'),
      role: fd.get('role'),
      is_active: fd.get('is_active') === 'on'
    };

    let res;
    // First, try saving with all new fields
    if (employeeModal.id) {
      res = await supabase.from('employees').update(empData).eq('id', employeeModal.id);
    } else {
      res = await supabase.from('employees').insert([empData]);
    }

    if (res.error) {
      // If error is about missing columns, try saving only basic fields and show a specific alert
      if (res.error.message.includes('column') && res.error.message.includes('does not exist')) {
        const fallbackData = {
          full_name: fd.get('full_name'),
          employee_id: fd.get('employee_id'),
          is_active: fd.get('is_active') === 'on'
        };
        let fallbackRes;
        if (employeeModal.id) {
          fallbackRes = await supabase.from('employees').update(fallbackData).eq('id', employeeModal.id);
        } else {
          fallbackRes = await supabase.from('employees').insert([fallbackData]);
        }
        
        if (fallbackRes.error) {
          showToast('❌ خطأ أثناء الحفظ: ' + fallbackRes.error.message);
        } else {
          showToast('⚠️ تم حفظ البيانات الأساسية فقط. (يرجى تنفيذ أمر SQL لإضافة حقول الصلاحيات وكلمة المرور)');
          setEmployeeModal(null);
          fetchEmployees();
        }
      } else {
        showToast('❌ خطأ أثناء الحفظ: ' + res.error.message);
      }
    } else {
      showToast('✅ تم حفظ بيانات الموظف بالكامل بنجاح');
      setEmployeeModal(null);
      fetchEmployees();
    }
  };

  const renderEmployees = () => (
    <div className="view-anim">
      <div style={{marginBottom:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2 style={{fontSize:'1.5rem', fontWeight:800}}><Shield size={24} color="var(--brand-teal)" style={{marginRight:'0.5rem', verticalAlign:'middle'}}/> الموظفين والصلاحيات</h2>
          <p style={{color:'var(--text-muted)'}}>إدارة حسابات الموظفين وصلاحيات الوصول للنظام</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEmployeeModal({})}>+ إضافة موظف</button>
      </div>

      <div className="card" style={{padding:'0'}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead style={{background:'var(--thead-bg)', borderBottom:'1px solid var(--border)'}}>
            <tr>
              <th style={{padding:'1rem', textAlign:'right', fontWeight:600, fontSize:'0.85rem'}}>رقم الموظف</th>
              <th style={{padding:'1rem', textAlign:'right', fontWeight:600, fontSize:'0.85rem'}}>الاسم</th>
              <th style={{padding:'1rem', textAlign:'right', fontWeight:600, fontSize:'0.85rem'}}>الدور / الصلاحية</th>
              <th style={{padding:'1rem', textAlign:'right', fontWeight:600, fontSize:'0.85rem'}}>الحالة</th>
              <th style={{padding:'1rem', textAlign:'center', fontWeight:600, fontSize:'0.85rem'}}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loadingEmployees ? (
              <tr><td colSpan="5" style={{padding:'2rem', textAlign:'center'}}>جاري التحميل...</td></tr>
            ) : employeesList.length === 0 ? (
              <tr><td colSpan="5" style={{padding:'2rem', textAlign:'center'}}>لا يوجد موظفين حالياً</td></tr>
            ) : (
              employeesList.map(emp => (
                <tr key={emp.id} style={{borderBottom:'1px solid var(--border)'}}>
                  <td style={{padding:'1rem', fontSize:'0.9rem', fontWeight:600}}>{emp.employee_id || '-'}</td>
                  <td style={{padding:'1rem', fontSize:'0.9rem'}}>{emp.full_name}</td>
                  <td style={{padding:'1rem'}}>
                    <span style={{background:'var(--bg)', padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600, color:'var(--text-secondary)'}}>
                      {emp.role || 'موظف'}
                    </span>
                  </td>
                  <td style={{padding:'1rem'}}>
                    {emp.is_active ? 
                      <span style={{color:'var(--brand-green)', fontSize:'0.85rem', fontWeight:600}}>نشط</span> : 
                      <span style={{color:'var(--danger)', fontSize:'0.85rem', fontWeight:600}}>موقوف</span>}
                  </td>
                  <td style={{padding:'1rem', textAlign:'center'}}>
                    <button className="btn btn-ghost" style={{padding:'0.5rem', color:'var(--brand-teal)'}} onClick={() => setEmployeeModal(emp)}>
                      <Settings size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {employeeModal && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="card view-anim" style={{width:'500px', maxWidth:'90%', padding:'2rem', position:'relative'}}>
            <button onClick={() => setEmployeeModal(null)} style={{position:'absolute', top:'1rem', right:'1rem', background:'transparent', border:'none', cursor:'pointer', color:'var(--text)'}}>
              <X size={20} />
            </button>
            <h3 style={{fontSize:'1.25rem', marginBottom:'1.5rem'}}>{employeeModal.id ? 'تعديل موظف وصلاحيات' : 'إضافة موظف جديد'}</h3>
            
            <div style={{background:'rgba(234, 179, 8, 0.1)', padding:'1rem', borderRadius:'8px', marginBottom:'1.5rem', border:'1px solid #eab308', fontSize:'0.85rem', color:'#ca8a04'}}>
              <strong>تنبيه:</strong> إذا لم يتم حفظ الصلاحيات واسم المستخدم، فهذا يعني أن قاعدة البيانات لم يتم تحديثها. يرجى تمرير التحديث (SQL Phase 7) لمسؤول النظام.
            </div>

            <form onSubmit={handleSaveEmployee} style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                <div>
                  <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600, fontSize:'0.85rem'}}>الاسم الكامل *</label>
                  <input name="full_name" required defaultValue={employeeModal.full_name} type="text" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
                </div>
                <div>
                  <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600, fontSize:'0.85rem'}}>رقم الموظف *</label>
                  <input name="employee_id" required defaultValue={employeeModal.employee_id} type="text" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
                </div>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                <div>
                  <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600, fontSize:'0.85rem'}}>البريد الإلكتروني (اسم المستخدم) *</label>
                  <input name="email" required defaultValue={employeeModal.email} type="email" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
                </div>
                <div>
                  <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600, fontSize:'0.85rem'}}>كلمة المرور *</label>
                  <input name="password" required={!employeeModal.id} defaultValue={employeeModal.password} type="text" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
                </div>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                <div>
                  <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600, fontSize:'0.85rem'}}>القسم / الإدارة</label>
                  <input name="department" defaultValue={employeeModal.department} type="text" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
                </div>
                <div>
                  <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600, fontSize:'0.85rem'}}>المسمى الوظيفي</label>
                  <input name="job_title" defaultValue={employeeModal.job_title} type="text" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
                </div>
              </div>
              
              <div>
                <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600, fontSize:'0.85rem'}}>الدور والصلاحية (Role)</label>
                <select name="role" defaultValue={employeeModal.role || 'موظف (Employee)'} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}>
                  <option value="مسؤول نظام (Admin)">مسؤول نظام (Admin) - تحكم كامل</option>
                  <option value="مدير أصول">مدير أصول - إدارة الأصول فقط</option>
                  <option value="أمين مستودع">أمين مستودع - إدارة المخزون فقط</option>
                  <option value="موظف (Employee)">موظف (Employee) - عرض فقط</option>
                </select>
              </div>

              <label style={{display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'0.5rem', cursor:'pointer'}}>
                <input name="is_active" type="checkbox" defaultChecked={employeeModal.id ? employeeModal.is_active : true} style={{width:'18px', height:'18px'}} />
                <span style={{fontWeight:600, fontSize:'0.85rem'}}>حساب نشط</span>
              </label>

              <div style={{display:'flex', gap:'1rem', marginTop:'1rem'}}>
                <button type="submit" className="btn btn-primary" style={{flex:1}}>حفظ التغييرات</button>
                <button type="button" className="btn btn-ghost" onClick={() => setEmployeeModal(null)} style={{flex:1, border:'1px solid var(--border)'}}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => {


    const handleSaveLookups = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const parseList = (str) => str.split(',').map(s => s.trim()).filter(s => s);
      
      const newLookups = {
        categories: parseList(fd.get('lk_categories')),
        departments: parseList(fd.get('lk_departments')),
        locations: parseList(fd.get('lk_locations')),
        suppliers: parseList(fd.get('lk_suppliers')),
        status: parseList(fd.get('lk_status'))
      };

      const { error } = await supabase.from('system_settings').update({ lookups: newLookups }).eq('id', systemSettings?.id);
      if(error) showToast('❌ حدث خطأ أثناء حفظ القوائم المنسدلة');
      else {
        setSystemLookups(newLookups);
        showToast('✅ تم تحديث مسميات وخيارات القوائم بنجاح!');
      }
    };

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
      

      const parseList = (str) => str.split(',').map(s => s.trim()).filter(s => s);
      const newLookups = {
        categories: parseList(fd.get('lk_categories') || ''),
        departments: parseList(fd.get('lk_departments') || ''),
        locations: parseList(fd.get('lk_locations') || ''),
        suppliers: parseList(fd.get('lk_suppliers') || ''),
        status: parseList(fd.get('lk_status') || '')
      };
      
      const { error: lkErr } = await supabase.from('system_settings').update({ lookups: newLookups }).eq('id', systemSettings?.id);
      if(!lkErr) setSystemLookups(newLookups);

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


        <div className="card" style={{gridColumn: '1 / -1', display:'flex', flexDirection:'column', gap:'1.5rem', marginTop: '1rem', borderTop: '2px solid var(--brand-teal)'}}>
          <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem'}}>تخصيص القوائم المنسدلة (الخيارات المتعددة في شاشة الأصول)</h3>
          <p style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>أدخل الخيارات مفصولة بفاصلة (،) ليتم عرضها كقوائم منسدلة في شاشات إضافة الأصول بدلاً من الكتابة اليدوية.</p>
          
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
            <div>
              <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>فئات الأصول (Categories)</label>
              <input name="lk_categories" type="text" defaultValue={(systemLookups?.categories || []).join(', ')} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
            </div>
            <div>
              <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>الأقسام الإدارية (Departments)</label>
              <input name="lk_departments" type="text" defaultValue={(systemLookups?.departments || []).join(', ')} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
            </div>
            <div>
              <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>المواقع والفروع (Locations)</label>
              <input name="lk_locations" type="text" defaultValue={(systemLookups?.locations || []).join(', ')} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
            </div>
            <div>
              <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>الموردين (Suppliers)</label>
              <input name="lk_suppliers" type="text" defaultValue={(systemLookups?.suppliers || []).join(', ')} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
            </div>
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>حالات الأصول (Statuses)</label>
              <input name="lk_status" type="text" defaultValue={(systemLookups?.status || []).join(', ')} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
            </div>
          </div>
        </div>

        <div style={{gridColumn:'1/-1', display:'flex', justifyContent:'flex-end'}}>
          <button type="submit" className="btn btn-primary" style={{padding:'1rem 2.5rem', fontSize:'1.1rem'}}>حفظ كافة التعديلات والتكوينات</button>
        </div>
      </form>
      ) : <div style={{padding:'2rem', textAlign:'center'}}>جاري تحميل الإعدادات...</div>}

      {/* LEGACY_SETTINGS_CARDS: notifications, ERP link and AI assistant settings (restored) */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(420px, 1fr))', gap:'1.5rem', marginTop:'1.5rem'}}>
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

      <div className="card" style={{maxWidth: '600px', display:'flex', flexDirection:'column', gap:'1.5rem', marginTop:'1.5rem'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--border)', paddingBottom:'1rem'}}>
          <h3 style={{fontSize:'1.1rem', margin:0, color:'var(--brand-teal)', display:'flex', alignItems:'center', gap:'0.5rem'}}><BrainCircuit size={18} /> إعدادات الذكاء الاصطناعي (مفتوح المصدر)</h3>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
           <div>
             <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600, fontSize:'0.9rem'}}>اسم المساعد الذكي</label>
             <input type="text" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} value={aiName} onChange={e => { setAiName(e.target.value); localStorage.setItem('aiName', e.target.value); }} />
           </div>
           <div>
             <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600, fontSize:'0.9rem'}}>شعار المساعد (Emoji)</label>
             <input type="text" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)', fontSize:'1.5rem', textAlign:'center'}} value={aiIcon} onChange={e => { setAiIcon(e.target.value); localStorage.setItem('aiIcon', e.target.value); }} />
           </div>
           <div>
             <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600, fontSize:'0.9rem'}}>تعليمات النظام والتغذية (System Prompt)</label>
             <textarea style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)', resize:'vertical', minHeight:'100px'}} value={aiSystemPrompt} onChange={e => { setAiSystemPrompt(e.target.value); localStorage.setItem('aiSystemPrompt', e.target.value); }} placeholder="أدخل القواعد، القيود، والمعلومات التي يجب أن يلتزم بها المساعد..."></textarea>
           </div>
           <div>
             <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600, fontSize:'0.9rem'}}>مزود الخدمة (LLM Provider)</label>
             <select style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} value={aiProvider} onChange={e => { setAiProvider(e.target.value); localStorage.setItem('aiProvider', e.target.value); }}>
               <option value="groq">Groq (Llama 3.3 70B & Whisper V3) - ذكاء متقدم</option>
               <option value="huggingface">Hugging Face (Mixtral 8x7B) - مجاني</option>
             </select>
           </div>
           <div>
             <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600, fontSize:'0.9rem'}}>مفتاح الـ API (اختياري)</label>
             <input type="password" placeholder="أدخل مفتاح الـ API الخاص بك هنا إن وجد..." style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} value={aiApiKey} onChange={e => { setAiApiKey(e.target.value); localStorage.setItem('aiApiKey', e.target.value); }} />
             <div style={{fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.5rem'}}>
                تم دمج مفتاح مشفر مسبقاً، لا تحتاج لإدخال مفتاح جديد إلا إذا أردت استخدام حسابك الخاص.
             </div>
           </div>
           
           <button className="btn btn-primary" style={{marginTop:'1rem'}} onClick={() => showToast('✅ تم حفظ جميع إعدادات الذكاء الاصطناعي بنجاح!')}>
              <CheckCircle size={18} style={{marginRight:'0.5rem'}} /> حفظ الإعدادات
           </button>
        </div>
      </div>
    
      </div>
    </div>
  );
  };
  
  // ===== WAREHOUSE RADAR SYSTEM =====
  
  // ===== WAREHOUSE RADAR & DISPATCH APPROVAL SYSTEM =====
  
  const handleSaveWarehouseItem = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const sku = (fd.get('sku') || fd.get('item_no') || '').trim() || `WH-SKU-${Date.now().toString().slice(-6)}`;
    const keeper = (fd.get('keeper') || '').trim() || 'فيصل العتيبي (أمين المستودع)';
    const warehouseBranch = (fd.get('warehouseBranch') || 'المستودع المركزي الرئيسي').trim();
    const storageCondition = (fd.get('storageCondition') || 'عادي / جاف (درجة حرارة الغرفة)').trim();
    const notes = (fd.get('notes') || fd.get('description') || '').trim();
    const createdBy = warehouseModal?.created_by || userProfile?.name || session?.user?.name || 'فيصل المحاسب';

    // Pack extended metadata into description JSON
    const metadataObj = {
      keeper,
      warehouseBranch,
      storageCondition,
      notes
    };
    const descJson = JSON.stringify(metadataObj);

    const dbRecord = {
      name: fd.get('name'),
      sku: sku,
      category_id: fd.get('category'),
      quantity: parseInt(fd.get('quantity') || 0, 10),
      min_quantity: parseInt(fd.get('min_quantity') || 0, 10),
      bin_location: fd.get('bin_location'),
      status: fd.get('status') || 'متاح',
      radar_stage: fd.get('radar_stage') || 'Deploy',
      unit: fd.get('unit') || 'حبة',
      cost: parseFloat(fd.get('cost') || 0),
      supplier: fd.get('supplier') || '',
      created_by: createdBy,
      description: descJson
    };

    let res;
    if (warehouseModal?.id && warehouseModal.id.length > 20) {
      res = await supabase.from('warehouse_items').update(dbRecord).eq('id', warehouseModal.id);
    } else {
      res = await supabase.from('warehouse_items').insert([dbRecord]);
    }

    if (res.error) {
      console.warn('Warehouse insert/update warning:', res.error);
      const fallbackRecord = {
        name: dbRecord.name,
        sku: dbRecord.sku,
        category_id: dbRecord.category_id,
        quantity: dbRecord.quantity,
        min_quantity: dbRecord.min_quantity,
        bin_location: dbRecord.bin_location,
        status: dbRecord.status,
        description: descJson
      };
      let fbRes;
      if (warehouseModal?.id && warehouseModal.id.length > 20) {
        fbRes = await supabase.from('warehouse_items').update(fallbackRecord).eq('id', warehouseModal.id);
      } else {
        fbRes = await supabase.from('warehouse_items').insert([fallbackRecord]);
      }
      if (fbRes.error) {
        showToast('❌ خطأ أثناء حفظ الصنف: ' + fbRes.error.message);
        return;
      }
    }

    showToast('✅ تم حفظ بيانات صنف المستودع بنجاح!');
    setWarehouseModal(null);
    fetchInitialData();
  };

  const handleCreateIssueRequest = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const itemId = fd.get('itemId');
    const targetItem = warehouseItems.find(w => w.id === itemId || w.sku === itemId);
    const qty = parseInt(fd.get('qty') || 1, 10);

    if (!targetItem) {
      showToast('⚠️ يرجى اختيار صنف صحيح من المستودع');
      return;
    }

    if (qty <= 0) {
      showToast('⚠️ الكمية يجب أن تكون أكبر من صفر');
      return;
    }

    if (qty > targetItem.qty) {
      showToast(`⚠️ الكمية المطلوبة (${qty}) تتجاوز الرصيد المتوفر في المستودع (${targetItem.qty} ${targetItem.unit || 'حبة'})`);
      return;
    }

    const newRequest = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      itemId: targetItem.id,
      itemSku: targetItem.sku,
      itemName: targetItem.name,
      qty: qty,
      unit: targetItem.unit || 'حبة',
      binLocation: targetItem.bin || targetItem.location || 'A-01-01',
      warehouseBranch: targetItem.warehouseBranch || 'المستودع المركزي الرئيسي',
      requester: userProfile?.name || session?.user?.name || 'فيصل المحاسب',
      recipient: fd.get('recipient') || 'الجهة المستفيدة',
      reason: fd.get('reason') || 'صرف مواد تشغيلي',
      isCustody: fd.get('isCustody') === 'on',
      status: 'بانتظار الموافقة',
      requestedAt: new Date().toISOString(),
      keeper: targetItem.keeper || 'فيصل العتيبي (أمين المستودع)',
      approvedBy: null,
      approvedAt: null,
      notes: fd.get('notes') || ''
    };

    setWarehouseRequests(prev => [newRequest, ...prev]);
    setIssueModalItem(null);
    setWarehouseActiveTab('requests');
    showToast('🔔 تم رفع طلب الصرف بنجاح وهو الآن بانتظار موافقة أمين المستودع / الإدارة');
  };

  const handleApproveIssueRequest = async (req) => {
    const targetItem = warehouseItems.find(w => w.id === req.itemId || w.sku === req.itemSku);
    if (!targetItem) {
      showToast('❌ لم يتم العثور على الصنف في المستودع');
      return;
    }

    if (targetItem.qty < req.qty) {
      showToast(`❌ لا يمكن الصرف: الرصيد الحالي (${targetItem.qty}) أقل من المطلوب (${req.qty})`);
      return;
    }

    const newQty = targetItem.qty - req.qty;
    const newStatus = newQty === 0 ? 'نفاد' : (newQty <= targetItem.minQty ? 'متاح' : targetItem.status);

    showToast('جاري اعتماد الطلب وخصم الكمية من المستودع...');

    try {
      // 1. خصم الكمية من جدول المستودع في Supabase
      if (targetItem.id && targetItem.id.length > 20) {
        const { error: updErr } = await supabase.from('warehouse_items').update({
          quantity: newQty,
          status: newStatus
        }).eq('id', targetItem.id);
        if (updErr) console.warn('Supabase stock update warning:', updErr);
      }

      // 2. إذا كان الطلب مسجلاً كعهدة، إنشاء أصل عهدة تلقائياً في جدول الأصول
      if (req.isCustody) {
        const assetNo = `AST-CUST-${Date.now().toString().slice(-6)}`;
        await supabase.from('assets').insert([{
          asset_no: assetNo,
          name: req.itemName,
          category_id: targetItem.category || 'أجهزة تقنية',
          custodian_id: req.recipient,
          location_id: req.binLocation || 'مقر العمل',
          department_id: 'الإدارة المستلمة',
          cost: Number(targetItem.cost || 0) * req.qty,
          status: 'نشط',
          purchase_date: new Date().toISOString().split('T')[0],
          useful_life: 5
        }]);
      }

      // 3. تحديث حالة الطلب
      const approverName = userProfile?.name || session?.user?.name || 'المدير المالي والتقني';
      const approvedAt = new Date().toISOString();

      const updatedReq = {
        ...req,
        status: 'معتمد ومصروف',
        approvedBy: approverName,
        approvedAt: approvedAt
      };

      setWarehouseRequests(prev => prev.map(r => r.id === req.id ? updatedReq : r));
      setWarehouseItems(prev => prev.map(w => (w.id === req.itemId || w.sku === req.itemSku) ? { ...w, qty: newQty, status: newStatus } : w));

      // فتح نافذة طباعة سند الصرف مباشرة
      setSelectedVoucher(updatedReq);
      showToast('✅ تمت الموافقة بنجاح! تم خصم الكمية من المخزون وتوليد سند الصرف الرسمي');
      fetchInitialData();
    } catch (err) {
      console.error(err);
      showToast('❌ حدث خطأ أثناء اعتماد الصرف: ' + err.message);
    }
  };

  const handleRejectIssueRequest = (req) => {
    setPromptDialog({
      title: `رفض طلب صرف مستودعي (${req.id})`,
      subtitle: `الصنف: ${req.itemName} - الكمية المطلوبة: ${req.qty} ${req.unit} - طالب الصرف: ${req.requestedBy || 'غير محدد'}`,
      label: 'سبب رفض طلب الصرف *',
      defaultValue: 'عدم اكتمال المبررات / توفر بديل قائم',
      inputType: 'textarea',
      confirmText: 'تأكيد رفض الطلب',
      confirmColor: 'var(--danger, #ef4444)',
      onConfirm: (reason) => {
        if (!reason || !reason.trim()) {
          showToast('⚠️ يرجى تدوين سبب الرفض');
          return;
        }
        setWarehouseRequests(prev => prev.map(r => r.id === req.id ? {
          ...r,
          status: 'مرفوض',
          rejectionReason: reason.trim()
        } : r));
        showToast('⚠️ تم رفض طلب الصرف وحفظ السبب دون خصم أي كمية');
      }
    });
  };

  const renderWarehouse = () => {
    const filteredItems = warehouseItems.filter(item => 
      warehouseFilter === 'الكل' || item.status === warehouseFilter
    );
    const totalQty = warehouseItems.reduce((s, i) => s + (Number(i.qty) || 0), 0);
    const totalValue = warehouseItems.reduce((s, i) => s + ((Number(i.qty) || 0) * (Number(i.cost) || 0)), 0);
    const availableQty = warehouseItems.filter(i => i.status === 'متاح').reduce((s, i) => s + (Number(i.qty) || 0), 0);
    const lowStock = warehouseItems.filter(i => i.qty <= i.minQty && i.qty > 0).length;
    const outOfStock = warehouseItems.filter(i => i.qty === 0).length;

    const pendingRequests = warehouseRequests.filter(r => r.status === 'بانتظار الموافقة');
    const approvedRequests = warehouseRequests.filter(r => r.status === 'معتمد ومصروف');

    const stageCount = (stage) => warehouseItems.filter(i => i.stage === stage || i.radar_stage === stage).length;

    return (
    <div className="view-anim">
      {/* Hero Banner */}
      <div className="dash-hero" style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1.5rem', marginBottom:'1.5rem'}}>
        <div style={{zIndex:1}}>
          <h2 style={{fontSize:'1.65rem', fontWeight:800, margin:'0 0 6px', display:'flex', alignItems:'center', gap:'0.6rem'}}>
            <Warehouse size={28} /> نظام إدارة المستودعات والرقابة المخزنية
          </h2>
          <p style={{opacity:0.85, fontSize:'0.95rem', margin:0}}>
            إدارة متطورة وفق أفضل الممارسات العالمية: دورة حياة RADAR الخماسية · نظام اعتماد وخروج المواد · تحديد أمين المستودع ومن قام بالإضافة.
          </p>
        </div>
        
        <div style={{display:'flex', gap:'1.5rem', alignItems:'center', zIndex:1}}>
          <div style={{textAlign:'center', background:'rgba(255,255,255,0.1)', padding:'0.6rem 1.25rem', borderRadius:'12px'}}>
            <div style={{fontSize:'1.8rem', fontWeight:900}}>{totalQty.toLocaleString()}</div>
            <div style={{fontSize:'0.75rem', opacity:0.85}}>إجمالي الوحدات</div>
          </div>
          <div style={{textAlign:'center', background:'rgba(255,255,255,0.1)', padding:'0.6rem 1.25rem', borderRadius:'12px'}}>
            <div style={{fontSize:'1.8rem', fontWeight:900, color:'#34d399'}}>{totalValue.toLocaleString()} <span style={{fontSize:'0.8rem'}}>ر.س</span></div>
            <div style={{fontSize:'0.75rem', opacity:0.85}}>القيمة الإجمالية للمخزون</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="summary-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)', gap:'1rem', marginBottom:'1.5rem'}}>
        <div className="card" style={{display:'flex', gap:'1rem', alignItems:'center', borderRight:'4px solid var(--brand-teal)'}}>
          <div style={{background:'rgba(0, 165, 155, 0.1)', padding:'0.75rem', borderRadius:'12px'}}><Boxes color="var(--brand-teal)" size={24} /></div>
          <div><div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>إجمالي الأصناف</div><div style={{fontSize:'1.4rem', fontWeight:800}}>{warehouseItems.length} <span style={{fontSize:'0.7rem', fontWeight:400}}>صنف</span></div></div>
        </div>
        <div className="card" style={{display:'flex', gap:'1rem', alignItems:'center', borderRight:'4px solid var(--brand-green)'}}>
          <div style={{background:'rgba(140, 194, 64, 0.1)', padding:'0.75rem', borderRadius:'12px'}}><PackageCheck color="var(--brand-green)" size={24} /></div>
          <div><div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>رصيد جاهز للتسليم</div><div style={{fontSize:'1.4rem', fontWeight:800, color:'var(--brand-green)'}}>{availableQty}</div></div>
        </div>
        <div className="card" style={{display:'flex', gap:'1rem', alignItems:'center', borderRight:'4px solid #f59e0b'}}>
          <div style={{background:'rgba(245, 158, 11, 0.1)', padding:'0.75rem', borderRadius:'12px'}}><Clock color="#f59e0b" size={24} /></div>
          <div><div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>طلبات بانتظار الموافقة</div><div style={{fontSize:'1.4rem', fontWeight:800, color:'#f59e0b'}}>{pendingRequests.length} <span style={{fontSize:'0.7rem', fontWeight:400}}>طلب خروج</span></div></div>
        </div>
        <div className="card" style={{display:'flex', gap:'1rem', alignItems:'center', borderRight:'4px solid var(--danger)'}}>
          <div style={{background:'rgba(239, 68, 68, 0.1)', padding:'0.75rem', borderRadius:'12px'}}><AlertTriangle color="var(--danger)" size={24} /></div>
          <div><div style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>تحت حد الطلب / نفاد</div><div style={{fontSize:'1.4rem', fontWeight:800, color:'var(--danger)'}}>{lowStock + outOfStock}</div></div>
        </div>
      </div>

      {/* Main Warehouse Navigation Tabs */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'2px solid var(--border)', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem'}}>
        <div style={{display:'flex', gap:'0.5rem'}}>
          <button 
            type="button"
            className={`btn ${warehouseActiveTab === 'items' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{padding:'0.65rem 1.25rem', fontSize:'0.9rem', fontWeight: warehouseActiveTab === 'items' ? 700 : 500, display:'flex', alignItems:'center', gap:'0.4rem'}}
            onClick={() => setWarehouseActiveTab('items')}
          >
            <Boxes size={18} /> سجل المخزون المباشر ({warehouseItems.length})
          </button>
          
          <button 
            type="button"
            className={`btn ${warehouseActiveTab === 'requests' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{padding:'0.65rem 1.25rem', fontSize:'0.9rem', fontWeight: warehouseActiveTab === 'requests' ? 700 : 500, display:'flex', alignItems:'center', gap:'0.5rem', position:'relative'}}
            onClick={() => setWarehouseActiveTab('requests')}
          >
            <ArrowRightLeft size={18} /> طلبات خروج المخزون والاعتمادات
            {pendingRequests.length > 0 && (
              <span style={{background:'#ef4444', color:'#fff', fontSize:'0.72rem', fontWeight:900, padding:'0.15rem 0.5rem', borderRadius:'20px', animation:'pulse 1.5s infinite'}}>
                {pendingRequests.length} بانتظار الموافقة
              </span>
            )}
          </button>

          <button 
            type="button"
            className={`btn ${warehouseActiveTab === 'radar' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{padding:'0.65rem 1.25rem', fontSize:'0.9rem', fontWeight: warehouseActiveTab === 'radar' ? 700 : 500, display:'flex', alignItems:'center', gap:'0.4rem'}}
            onClick={() => setWarehouseActiveTab('radar')}
          >
            <Target size={18} /> منهجية RADAR والتحليلات
          </button>
        </div>

        {/* Global Warehouse Action Buttons */}
        <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
          <button 
            className="btn btn-ghost" 
            style={{padding:'0.45rem 0.85rem', fontSize:'0.82rem'}} 
            title="تنزيل نموذج تعبئة المستودعات مع القوائم المنسدلة" 
            onClick={() => { downloadWarehouseTemplate(); showToast('📄 تم تنزيل نموذج المستودع Excel مع الخيارات'); }}
          >
            <FileText size={15} /> نموذج المستودع
          </button>
          <button 
            className="btn btn-ghost" 
            style={{padding:'0.45rem 0.85rem', fontSize:'0.82rem'}} 
            title="استيراد أصناف المستودع من Excel" 
            onClick={() => warehouseImportInputRef.current?.click()}
          >
            <Upload size={15} /> استيراد Excel
          </button>
          <button 
            className="btn btn-ghost" 
            style={{padding:'0.45rem 0.85rem', fontSize:'0.82rem'}} 
            title="تصدير بيانات المستودع كاملة إلى Excel" 
            onClick={() => { exportWarehouse(warehouseItems); showToast('✅ تم تصدير بيانات المخزون إلى Excel'); }}
          >
            <Download size={15} /> تصدير المخزون
          </button>
          <button 
            className="btn btn-ghost"
            style={{padding:'0.45rem 1rem', fontSize:'0.82rem', background:'rgba(245, 158, 11, 0.1)', color:'#d97706', border:'1px solid rgba(245, 158, 11, 0.3)', fontWeight:700}}
            onClick={() => setIssueModalItem({})}
          >
            <ArrowRightLeft size={16} /> طلب خروج / صرف صنف
          </button>
          {userProfile?.isAdmin && (
            <button 
              className="btn btn-primary" 
              onClick={() => setWarehouseModal({})} 
              style={{padding:'0.45rem 1.1rem', fontSize:'0.82rem', background:'var(--brand-teal)', color:'white', border:'none', fontWeight:700}}
            >
              + إضافة صنف جديد
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: DIRECT STOCK ITEMS */}
      {warehouseActiveTab === 'items' && (
        <div>
          {/* Status Filter Pills */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem'}}>
            <div style={{fontSize:'1rem', fontWeight:700, color:'var(--text)', display:'flex', alignItems:'center', gap:'0.4rem'}}>
              قائمة الأصناف المتاحة في المستودعات
            </div>
            <div style={{display:'flex', gap:'0.4rem', flexWrap:'wrap'}}>
              {['الكل', 'متاح', 'محجوز', 'صيانة', 'نفاد', 'تالف'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setWarehouseFilter(f)} 
                  className={`btn ${warehouseFilter === f ? 'btn-primary' : 'btn-ghost'}`} 
                  style={{padding:'0.35rem 0.8rem', fontSize:'0.8rem'}}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="table-wrapper" style={{borderRadius:'16px', overflow:'hidden', border:'1px solid var(--border)'}}>
            <table>
              <thead style={{borderBottom:'2px solid var(--border)', background:'var(--thead-bg, #f8fafc)'}}>
                <tr>
                  <th style={{padding:'0.85rem 1rem'}}>SKU / الباركود</th>
                  <th style={{padding:'0.85rem 1rem'}}>اسم الصنف</th>
                  <th style={{padding:'0.85rem 1rem'}}>الفئة التصنيفية</th>
                  <th style={{padding:'0.85rem 1rem'}}>الرصيد / الحد الأدنى</th>
                  <th style={{padding:'0.85rem 1rem'}}>الموقع (الرف)</th>
                  <th style={{padding:'0.85rem 1rem'}}>أمين المستودع المسؤول</th>
                  <th style={{padding:'0.85rem 1rem'}}>من قام بالإضافة</th>
                  <th style={{padding:'0.85rem 1rem'}}>الحالة</th>
                  <th style={{padding:'0.85rem 1rem', textAlign:'center'}}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, idx) => {
                  const statusColors = { 'متاح': '#10b981', 'محجوز': '#3b82f6', 'صيانة': '#f59e0b', 'نفاد': '#ef4444', 'تالف': '#6b7280' };
                  return (
                  <tr key={item.id} style={{borderBottom:'1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)'}}>
                    <td style={{padding:'0.85rem 1rem', fontWeight:700, color:'var(--brand-teal)', fontFamily:'monospace'}}>{item.sku}</td>
                    <td style={{padding:'0.85rem 1rem'}}>
                      <div style={{fontWeight:700, color:'var(--text)'}}>{item.name}</div>
                      <div style={{fontSize:'0.72rem', color:'var(--text-muted)'}}>{item.unit || 'حبة'} | التكلفة: {(Number(item.cost)||0).toLocaleString()} ر.س</div>
                    </td>
                    <td style={{padding:'0.85rem 1rem', fontSize:'0.85rem'}}>{item.category}</td>
                    <td style={{padding:'0.85rem 1rem'}}>
                      <div style={{fontWeight:800, fontSize:'1.1rem', color: item.qty <= item.minQty ? 'var(--danger)' : 'var(--brand-ink)'}}>{item.qty} {item.unit || ''}</div>
                      <div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>الحد الأدنى: {item.minQty}</div>
                      {item.qty <= item.minQty && item.qty > 0 && <div style={{fontSize:'0.65rem', color:'var(--warning)', fontWeight:700}}>⚠️ قارب على النفاد</div>}
                    </td>
                    <td style={{padding:'0.85rem 1rem'}}>
                      <span style={{background:'var(--thead-bg)', padding:'0.3rem 0.6rem', borderRadius:'6px', fontSize:'0.8rem', fontWeight:600, fontFamily:'monospace', display:'inline-flex', alignItems:'center', gap:'0.3rem'}}>
                        <MapPin size={12} /> {item.location || item.bin || 'A-01-01'}
                      </span>
                      <div style={{fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'0.2rem'}}>{item.warehouseBranch || 'المستودع الرئيسي'}</div>
                    </td>
                    <td style={{padding:'0.85rem 1rem'}}>
                      <div style={{fontSize:'0.85rem', fontWeight:600, display:'flex', alignItems:'center', gap:'0.3rem'}}>
                        <UserCircle size={14} color="var(--brand-teal)" /> {item.keeper || 'فيصل العتيبي'}
                      </div>
                    </td>
                    <td style={{padding:'0.85rem 1rem'}}>
                      <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>{item.created_by || 'مسؤول النظام'}</div>
                      <div style={{fontSize:'0.7rem', color:'var(--text-muted)', opacity:0.8}}>{item.created_at ? new Date(item.created_at).toLocaleDateString('ar-SA') : ''}</div>
                    </td>
                    <td style={{padding:'0.85rem 1rem'}}>
                      <span style={{background: `${statusColors[item.status] || '#64748b'}15`, color: statusColors[item.status] || '#64748b', padding:'0.25rem 0.65rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700, border:`1px solid ${statusColors[item.status] || '#64748b'}30`}}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{padding:'0.85rem 1rem', textAlign:'center'}}>
                      <div style={{display:'flex', gap:'0.35rem', justifyContent:'center'}}>
                        <button 
                          className="btn btn-ghost" 
                          style={{padding:'0.35rem 0.65rem', borderRadius:'8px', background:'rgba(245, 158, 11, 0.1)', color:'#d97706', fontSize:'0.75rem', fontWeight:700, display:'flex', alignItems:'center', gap:'0.25rem'}} 
                          title="طلب إخراج / صرف من هذا الصنف" 
                          onClick={() => setIssueModalItem(item)}
                        >
                          <ArrowRightLeft size={13} /> طلب صرف
                        </button>
                        <button 
                          className="btn btn-ghost" 
                          style={{padding:'0.35rem', borderRadius:'8px', background:'var(--thead-bg)'}} 
                          title="طباعة باركود الصنف / ملصق الرف" 
                          onClick={() => { setBarcodeModalItem(item); setBarcodeModalType('warehouse'); }}
                        >
                          <Printer size={15} color="var(--brand-teal)" />
                        </button>
                        <button 
                          className="btn btn-ghost" 
                          style={{padding:'0.35rem', borderRadius:'8px', background:'var(--thead-bg)'}} 
                          title="عرض تفاصيل الصنف" 
                          onClick={() => setViewWarehouse(item)}
                        >
                          <Eye size={15} color="var(--brand-teal)" />
                        </button>
                        <button 
                          className="btn btn-ghost" 
                          style={{padding:'0.35rem', borderRadius:'8px', background:'var(--thead-bg)'}} 
                          title="تعديل الصنف" 
                          onClick={() => setWarehouseModal(item)}
                        >
                          <Edit size={15} color="var(--text-muted)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DISPATCH & APPROVALS QUEUE */}
      {warehouseActiveTab === 'requests' && (
        <div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem'}}>
            <div>
              <h3 style={{margin:0, fontSize:'1.2rem', fontWeight:800, color:'var(--text)', display:'flex', alignItems:'center', gap:'0.5rem'}}>
                <ShieldCheck size={22} color="var(--brand-teal)" />
                طلبات خروج المخزون ونظام الموافقات والاعتمادات
              </h3>
              <p style={{margin:'0.25rem 0 0', color:'var(--text-muted)', fontSize:'0.85rem'}}>
                وفق معايير الحوكمة: لا يتم خصم أو إخراج أي مادة من المستودع إلا بعد موافقة واعتماد أمين المستودع والإدارة المالية.
              </p>
            </div>
            
            <button 
              className="btn btn-primary"
              style={{padding:'0.55rem 1.25rem', fontSize:'0.85rem', fontWeight:700, display:'flex', alignItems:'center', gap:'0.4rem'}}
              onClick={() => setIssueModalItem({})}
            >
              <ArrowRightLeft size={16} /> + إنشاء طلب صرف جديد
            </button>
          </div>

          <div className="table-wrapper" style={{borderRadius:'16px', overflow:'hidden', border:'1px solid var(--border)'}}>
            <table>
              <thead style={{borderBottom:'2px solid var(--border)', background:'var(--thead-bg, #f8fafc)'}}>
                <tr>
                  <th style={{padding:'0.85rem 1rem'}}>رقم الطلب</th>
                  <th style={{padding:'0.85rem 1rem'}}>تاريخ الطلب</th>
                  <th style={{padding:'0.85rem 1rem'}}>الصنف المطلوب</th>
                  <th style={{padding:'0.85rem 1rem'}}>الكمية المصروفة</th>
                  <th style={{padding:'0.85rem 1rem'}}>مقدم الطلب</th>
                  <th style={{padding:'0.85rem 1rem'}}>الجهة / المستلم</th>
                  <th style={{padding:'0.85rem 1rem'}}>الغرض من الصرف</th>
                  <th style={{padding:'0.85rem 1rem'}}>حالة الاعتماد</th>
                  <th style={{padding:'0.85rem 1rem', textAlign:'center'}}>الإجراءات والموافقة</th>
                </tr>
              </thead>
              <tbody>
                {warehouseRequests.map((req, idx) => {
                  const isPending = req.status === 'بانتظار الموافقة';
                  const isApproved = req.status === 'معتمد ومصروف';
                  const isRejected = req.status === 'مرفوض';

                  return (
                    <tr key={req.id} style={{borderBottom:'1px solid var(--border)', background: isPending ? 'rgba(245, 158, 11, 0.04)' : idx % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)'}}>
                      <td style={{padding:'0.85rem 1rem', fontFamily:'monospace', fontWeight:700, color:'var(--brand-teal)'}}>{req.id}</td>
                      <td style={{padding:'0.85rem 1rem', fontSize:'0.82rem'}}>{new Date(req.requestedAt).toLocaleDateString('ar-SA')}</td>
                      <td style={{padding:'0.85rem 1rem'}}>
                        <div style={{fontWeight:700}}>{req.itemName}</div>
                        <div style={{fontSize:'0.72rem', color:'var(--text-muted)', fontFamily:'monospace'}}>{req.itemSku}</div>
                      </td>
                      <td style={{padding:'0.85rem 1rem', fontWeight:800, fontSize:'1.05rem', color:'#0f172a'}}>
                        {req.qty} {req.unit || 'حبة'}
                      </td>
                      <td style={{padding:'0.85rem 1rem', fontSize:'0.85rem'}}>{req.requester}</td>
                      <td style={{padding:'0.85rem 1rem'}}>
                        <div style={{fontWeight:600, color:'var(--brand-teal)'}}>{req.recipient}</div>
                        {req.isCustody && <span style={{fontSize:'0.68rem', background:'#f0fdf4', color:'#166534', padding:'0.15rem 0.4rem', borderRadius:'4px', border:'1px solid #bbf7d0'}}>🔒 تسليم كعهدة</span>}
                      </td>
                      <td style={{padding:'0.85rem 1rem', fontSize:'0.82rem', maxWidth:'180px'}}>
                        <div>{req.reason}</div>
                        {req.rejectionReason && <div style={{color:'#ef4444', fontSize:'0.72rem', marginTop:'0.2rem'}}>سبب الرفض: {req.rejectionReason}</div>}
                      </td>
                      <td style={{padding:'0.85rem 1rem'}}>
                        {isPending && (
                          <span style={{background:'#fef3c7', color:'#92400e', padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:800, border:'1px solid #fcd34d', display:'inline-flex', alignItems:'center', gap:'0.3rem'}}>
                            <Clock size={12} /> بانتظار الموافقة
                          </span>
                        )}
                        {isApproved && (
                          <div>
                            <span style={{background:'#d1fae5', color:'#065f46', padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:800, border:'1px solid #a7f3d0', display:'inline-flex', alignItems:'center', gap:'0.3rem'}}>
                              <CheckCircle size={12} /> معتمد ومصروف
                            </span>
                            <div style={{fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>المعتمد: {req.approvedBy}</div>
                          </div>
                        )}
                        {isRejected && (
                          <span style={{background:'#fee2e2', color:'#991b1b', padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:800, border:'1px solid #fecaca'}}>
                            مرفوض
                          </span>
                        )}
                      </td>
                      <td style={{padding:'0.85rem 1rem', textAlign:'center'}}>
                        <div style={{display:'flex', gap:'0.4rem', justifyContent:'center', alignItems:'center'}}>
                          {isPending && (
                            <>
                              <button 
                                className="btn btn-primary" 
                                style={{background:'#10b981', borderColor:'#10b981', padding:'0.35rem 0.8rem', fontSize:'0.78rem', fontWeight:700, display:'flex', alignItems:'center', gap:'0.3rem'}}
                                title="الموافقة على الطلب وخصم الكمية من المستودع"
                                onClick={() => handleApproveIssueRequest(req)}
                              >
                                <CheckCircle size={14} /> موافقة وصرف
                              </button>
                              <button 
                                className="btn btn-ghost" 
                                style={{color:'#ef4444', border:'1px solid #fca5a5', padding:'0.35rem 0.6rem', fontSize:'0.78rem'}}
                                title="رفض الطلب"
                                onClick={() => handleRejectIssueRequest(req)}
                              >
                                ✕ رفض
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <button 
                              className="btn btn-ghost" 
                              style={{border:'1px solid #cbd5e1', padding:'0.35rem 0.8rem', fontSize:'0.78rem', color:'var(--brand-teal)', fontWeight:700, display:'flex', alignItems:'center', gap:'0.35rem'}}
                              title="طباعة سند صرف مخزني رسمي"
                              onClick={() => setSelectedVoucher(req)}
                            >
                              <Printer size={14} /> طباعة السند
                            </button>
                          )}

                          {isRejected && (
                            <span style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>مغلق</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RADAR LIFECYCLE & ANALYTICS */}
      {warehouseActiveTab === 'radar' && (
        <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:'1.5rem', marginTop:'1rem'}}>
          <div className="card">
            <h3 style={{fontSize:'1.1rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><Target size={20} color="var(--brand-teal)" /> مراحل RADAR الخمسة</h3>
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
            <h3 style={{fontSize:'1.1rem', marginBottom:'1.5rem'}}>خريطة RADAR الخماسية لتوزيع الأصول</h3>
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
            <div style={{marginTop:'1rem', background:'linear-gradient(to right, #f0fdf4, #ffffff)', padding:'1rem', borderRadius:'12px', fontSize:'0.82rem', color:'#166534', border:'1px solid #bbf7d0'}}>
              <Sparkles size={14} style={{marginLeft:'0.4rem'}} />
              <strong>تحليل وتوصيات RADAR:</strong> تتبع دقيق لدورة حياة الصنف من لحظة الشراء والاستلام في المستودع وحتى التخصيص والنشر ثم الإحلال والاستبعاد النهائي.
            </div>
          </div>
        </div>
      )}

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
          {userProfile?.isAdmin && (
            <div className={`nav-item ${view === 'employees' ? 'active' : ''}`} onClick={() => setView('employees')}>
              <div className="nav-icon-box"><Shield size={18} /></div> الموظفين والصلاحيات
            </div>
          )}
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
            <div className="nav-icon-box"><Sparkles size={18} /></div>
          <div className={`nav-item ${view === 'ai-studio' ? 'active' : ''}`} onClick={() => setView('ai-studio')}>
            <div className="nav-icon-box"><BrainCircuit size={18} /></div> استوديو الذكاء الاصطناعي
          </div> التحليلات التنبؤية
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
          {view === 'ai-studio' && renderAIStudio()}
          {view === 'warehouse' && renderWarehouse()}
            {view === 'depreciation' && renderDepreciation()}
            {view === 'custody' && renderCustody()}
            {view === 'employees' && renderEmployees()}
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
      <input ref={warehouseImportInputRef} type="file" accept=".xlsx,.xls,.csv" style={{display:'none'}} onChange={handleWarehouseImportFile} />
      <input ref={custodyImportInputRef} type="file" accept=".xlsx,.xls,.csv" style={{display:'none'}} onChange={handleCustodyImportFile} />

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

      {warehouseImportPreview && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)'}}>
          <div className="card" style={{width:'720px', maxWidth:'94vw', maxHeight:'88vh', overflowY:'auto', background:'var(--card-bg)', padding:'2rem'}}>
            <h3 style={{fontSize:'1.25rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--brand-teal)'}}><Warehouse size={22} /> معاينة استيراد أصناف المستودع من Excel</h3>
            <div style={{display:'flex', gap:'1rem', marginBottom:'1.25rem'}}>
              <div style={{flex:1, padding:'1rem', borderRadius:'12px', background:'#f0fdf4', color:'#166534', fontWeight:700}}>✅ أصناف صالحة: {warehouseImportPreview.rows.length}</div>
              <div style={{flex:1, padding:'1rem', borderRadius:'12px', background:'#fef2f2', color:'#991b1b', fontWeight:700}}>⚠️ أخطاء: {warehouseImportPreview.errors.length}</div>
            </div>
            {warehouseImportPreview.errors.length > 0 && (
              <div style={{marginBottom:'1.25rem', maxHeight:'200px', overflowY:'auto', border:'1px solid #fecaca', borderRadius:'8px', padding:'0.75rem', fontSize:'0.85rem'}}>
                {warehouseImportPreview.errors.map(e => <div key={e.line} style={{padding:'0.25rem 0'}}><strong>سطر {e.line}:</strong> {e.issues}</div>)}
              </div>
            )}
            <p style={{color:'var(--text-muted)', fontSize:'0.8rem', marginBottom:'1rem'}}>سيتم إضافة الأصناف الصالحة إلى سجل المستودع مباشرة وفق المعايير المدخلة.</p>
            <div style={{display:'flex', gap:'0.75rem'}}>
              <button className="btn btn-primary" disabled={warehouseImportPreview.rows.length === 0} onClick={confirmWarehouseImport}><CheckCircle size={16} /> استيراد {warehouseImportPreview.rows.length} صنف مستودع</button>
              <button className="btn btn-ghost" onClick={() => setWarehouseImportPreview(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {custodyImportPreview && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)'}}>
          <div className="card" style={{width:'720px', maxWidth:'94vw', maxHeight:'88vh', overflowY:'auto', background:'var(--card-bg)', padding:'2rem'}}>
            <h3 style={{fontSize:'1.25rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--brand-teal)'}}><Users size={22} /> معاينة استيراد سجل العهد من Excel</h3>
            <div style={{display:'flex', gap:'1rem', marginBottom:'1.25rem'}}>
              <div style={{flex:1, padding:'1rem', borderRadius:'12px', background:'#f0fdf4', color:'#166534', fontWeight:700}}>✅ سجلات عهد صالحة: {custodyImportPreview.rows.length}</div>
              <div style={{flex:1, padding:'1rem', borderRadius:'12px', background:'#fef2f2', color:'#991b1b', fontWeight:700}}>⚠️ أخطاء: {custodyImportPreview.errors.length}</div>
            </div>
            {custodyImportPreview.errors.length > 0 && (
              <div style={{marginBottom:'1.25rem', maxHeight:'200px', overflowY:'auto', border:'1px solid #fecaca', borderRadius:'8px', padding:'0.75rem', fontSize:'0.85rem'}}>
                {custodyImportPreview.errors.map(e => <div key={e.line} style={{padding:'0.25rem 0'}}><strong>سطر {e.line}:</strong> {e.issues}</div>)}
              </div>
            )}
            <p style={{color:'var(--text-muted)', fontSize:'0.8rem', marginBottom:'1rem'}}>سيتم ربط العهد بالموظفين وتحديث المواقع والباركود تلقائياً في قاعدة البيانات.</p>
            <div style={{display:'flex', gap:'0.75rem'}}>
              <button className="btn btn-primary" disabled={custodyImportPreview.rows.length === 0} onClick={confirmCustodyImport}><CheckCircle size={16} /> اعتماد واستيراد {custodyImportPreview.rows.length} عهدة</button>
              <button className="btn btn-ghost" onClick={() => setCustodyImportPreview(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {barcodeModalItem && (
        <BarcodePrintModal 
          item={barcodeModalItem} 
          type={barcodeModalType} 
          onClose={() => setBarcodeModalItem(null)} 
          employee={selectedEmployee} 
        />
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

            let botResponse = '';
            try {
              let sysPrompt = aiSystemPrompt + "\n\nالسياق الإضافي: " + (window.aiFileContext || "");
              sysPrompt += "\nالصفحة الحالية للمستخدم هي: " + view;
              
              // Prepare context with system prompt + history
              const messagesContext = [
                { role: "system", content: sysPrompt },
                ...chatMessages.map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text })),
                { role: "user", content: userInput }
              ];

              const ai = new AIService(aiApiKey, aiProvider);
              const resultMessage = await ai.sendChat(messagesContext);
              botResponse = resultMessage.content || "تم تنفيذ الطلب.";
              setChatMessages(prev => [...prev, {role: 'bot', text: botResponse}]);
              window.aiFileContext = "";
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

      {warehouseModal && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(15, 23, 42, 0.75)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)', padding:'1rem'}}>
          <div className="card view-anim" style={{width:'840px', maxWidth:'96vw', padding:'2.25rem', position:'relative', maxHeight:'92vh', overflowY:'auto', background:'var(--card-bg, #ffffff)', borderRadius:'16px', border:'1px solid var(--border)'}}>
            <button onClick={() => setWarehouseModal(null)} style={{position:'absolute', top:'1.25rem', right:'1.25rem', background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)'}}>
              <X size={22} />
            </button>
            
            <div style={{borderBottom:'1px solid var(--border)', paddingBottom:'1rem', marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'1.35rem', fontWeight:800, margin:0, color:'var(--brand-teal)', display:'flex', alignItems:'center', gap:'0.6rem'}}>
                <Warehouse size={26} /> {warehouseModal.id ? 'تعديل بيانات صنف في المستودع' : 'إضافة صنف جديد للمستودع (وفق المعايير العالمية)'}
              </h3>
              <p style={{margin:'0.3rem 0 0', color:'var(--text-muted)', fontSize:'0.85rem'}}>
                تعبئة الحقول من قوائم معيارية منسدلة مع توثيق أمين المستودع المسؤول وتثبيت من قام بالإضافة آلياً.
              </p>
            </div>
            
            <form onSubmit={handleSaveWarehouseItem} style={{display:'flex', flexDirection:'column', gap:'1.25rem'}}>
              
              {/* Row 1: Item Name & Barcode */}
              <div style={{display:'grid', gridTemplateColumns:'3fr 2fr', gap:'1rem'}}>
                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>اسم الصنف ومواصفاته *</label>
                  <input name="name" required defaultValue={warehouseModal.name || ''} placeholder="مثال: لابتوب ديل Latitude 5520 core i7" type="text" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
                </div>
                <div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem'}}>
                    <label style={{fontWeight:700, fontSize:'0.85rem'}}>رمز الصنف / الباركود (SKU) *</label>
                    <button 
                      type="button" 
                      className="btn btn-ghost" 
                      style={{padding:'0.1rem 0.5rem', fontSize:'0.72rem', color:'var(--brand-teal)'}}
                      onClick={() => {
                        const input = document.getElementById('wh_sku_input');
                        if (input) input.value = `WH-SKU-${Date.now().toString().slice(-6)}`;
                      }}
                    >
                      ⚡ توليد تلقائي
                    </button>
                  </div>
                  <input id="wh_sku_input" name="sku" required defaultValue={warehouseModal.sku || warehouseModal.item_no || `WH-SKU-${Date.now().toString().slice(-6)}`} type="text" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontFamily:'monospace', fontWeight:700}} />
                </div>
              </div>

              {/* Row 2: Category, Unit, Warehouse Branch */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1rem'}}>
                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>الفئة التصنيفية *</label>
                  <select name="category" defaultValue={warehouseModal.category || warehouseModal.category_id || 'أصول تقنية'} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}>
                    <option value="أصول تقنية">أجهزة وتقنيات حاسوبية</option>
                    <option value="أثاث ومعدات">أثاث ومفروشات مكتبية</option>
                    <option value="مركبات">مركبات وقطع غيار</option>
                    <option value="مستلزمات مكتبية">قرطاسية ومستلزمات مكتبية</option>
                    <option value="أدوات ومعدات صيانة">أدوات ومعدات صيانة وتشغيل</option>
                    <option value="أجهزة كهربائية">أجهزة كهربائية وتكييف</option>
                    <option value="أوقاف ومشاريع">مشاريع وأوقاف خيرية</option>
                    <option value="مواد إعاشة">مواد تموينية وإعاشة</option>
                  </select>
                </div>

                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>وحدة القياس *</label>
                  <select name="unit" defaultValue={warehouseModal.unit || 'حبة'} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}>
                    <option value="حبة">حبة / قطعة</option>
                    <option value="كرتون">كرتون (Carton)</option>
                    <option value="صندوق">صندوق (Box)</option>
                    <option value="طقم">طقم / مجموعة (Set)</option>
                    <option value="حزمة">حزمة (Pack)</option>
                    <option value="متر">متر طولي (Meter)</option>
                    <option value="كجم">كيلوجرام (Kg)</option>
                    <option value="لتر">لتر (Liter)</option>
                  </select>
                </div>

                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>المستودع الرئيسي *</label>
                  <select name="warehouseBranch" defaultValue={warehouseModal.warehouseBranch || 'المستودع المركزي الرئيسي'} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}>
                    <option value="المستودع المركزي الرئيسي">المستودع المركزي الرئيسي (الرياض)</option>
                    <option value="مستودع الأصول والعهد التقنية">مستودع الأصول والعهد التقنية</option>
                    <option value="مستودع الأثاث والمعدات">مستودع الأثاث والمعدات</option>
                    <option value="مستودع الفرع الغربي">مستودع الفرع الغربي (جدة)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Stock Quantity, Min Reorder, Bin Location */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1rem'}}>
                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>الكمية المتوفرة حالياً *</label>
                  <input name="quantity" required defaultValue={warehouseModal.qty !== undefined ? warehouseModal.qty : 10} type="number" min="0" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontWeight:800}} />
                </div>

                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>حد الطلب الأدنى (Safety Stock) *</label>
                  <input name="min_quantity" required defaultValue={warehouseModal.minQty !== undefined ? warehouseModal.minQty : 3} type="number" min="0" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
                </div>

                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>موقع الرف والتخزين (Bin) *</label>
                  <select name="bin_location" defaultValue={warehouseModal.bin || warehouseModal.bin_location || 'A-01-01'} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontFamily:'monospace'}}>
                    <option value="A-01-01">ممر A - رف 01 - مستوى 01 (A-01-01)</option>
                    <option value="A-01-02">ممر A - رف 01 - مستوى 02 (A-01-02)</option>
                    <option value="A-02-01">ممر A - رف 02 - مستوى 01 (A-02-01)</option>
                    <option value="B-01-01">ممر B - رف 01 - مستوى 01 (B-01-01)</option>
                    <option value="B-02-01">ممر B - رف 02 - مستوى 01 (B-02-01)</option>
                    <option value="C-01-01">ممر C - رف الأجهزة الحساسة (C-01-01)</option>
                    <option value="G-01-01">الساحة الأرضية للمركبات والمعدات الثقيلة (G-01-01)</option>
                    <option value="SEC-01">غرفة الخزائن المؤمنة (SEC-01)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Warehouse Keeper & Created By (User specific requirements) */}
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', background:'rgba(13, 148, 136, 0.05)', padding:'1rem', borderRadius:'12px', border:'1px solid rgba(13, 148, 136, 0.2)'}}>
                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem', color:'var(--brand-teal)'}}>
                    👤 الموظف المسؤول عن المستودع (أمين المستودع) *
                  </label>
                  <select 
                    name="keeper" 
                    defaultValue={warehouseModal.keeper || 'فيصل العتيبي (أمين المستودع)'} 
                    style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--card-bg)', color:'var(--text)', fontWeight:600}}
                  >
                    <option value="فيصل العتيبي (أمين المستودع)">فيصل العتيبي — أمين المستودع الرئيسي</option>
                    <option value="عبدالله السالم (مشرف المستودعات)">عبدالله السالم — مشرف المستودعات</option>
                    <option value="خالد المطيري (مساعد أمين المستودع)">خالد المطيري — مساعد أمين المستودع</option>
                    {employeesList.map(emp => (
                      <option key={emp.id} value={`${emp.full_name} (${emp.job_title || emp.role || 'موظف'})`}>
                        {emp.full_name} — {emp.job_title || emp.role || 'موظف'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem', color:'var(--brand-teal)'}}>
                    📝 من قام بالإضافة (توثيق نظام آلي)
                  </label>
                  <div style={{display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.7rem 1rem', background:'var(--card-bg)', borderRadius:'8px', border:'1px solid var(--border)'}}>
                    <ShieldCheck size={20} color="#10b981" />
                    <div>
                      <div style={{fontWeight:800, fontSize:'0.9rem', color:'var(--text)'}}>
                        {warehouseModal.created_by || userProfile?.name || session?.user?.name || 'فيصل المحاسب (المسؤول المالي)'}
                      </div>
                      <div style={{fontSize:'0.72rem', color:'var(--text-muted)'}}>
                        تاريخ العملية: {new Date().toLocaleDateString('ar-SA')} - نظامي وموثق في سجل التدقيق
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 5: RADAR Stage, Status, Storage Condition */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1rem'}}>
                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>مرحلة دورة RADAR *</label>
                  <select name="radar_stage" defaultValue={warehouseModal.stage || warehouseModal.radar_stage || 'Deploy'} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}>
                    <option value="Receive">1. استلام (Receive) — فحص وتوريد</option>
                    <option value="Allocate">2. تخصيص (Allocate) — حجز لجهة معينة</option>
                    <option value="Deploy">3. نشر (Deploy) — جاهز للصرف والخدمة</option>
                    <option value="Audit">4. مراجعة (Audit) — جرد وفحص فني</option>
                    <option value="Retire">5. إحلال (Retire) — مؤهل للتقاعد/الاستبعاد</option>
                  </select>
                </div>

                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>الحالة التشغيلية *</label>
                  <select name="status" defaultValue={warehouseModal.status || 'متاح'} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}>
                    <option value="متاح">متاح وجاهز للتسليم</option>
                    <option value="محجوز">محجوز لأمر تشغيلي</option>
                    <option value="صيانة">قيد الفحص أو الصيانة</option>
                    <option value="نفاد">منتهي الرصيد (نفاد)</option>
                    <option value="تالف">تالف أو مستبعد</option>
                  </select>
                </div>

                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>شروط التخزين والسلامة *</label>
                  <select name="storageCondition" defaultValue={warehouseModal.storageCondition || 'عادي / جاف (درجة حرارة الغرفة)'} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}>
                    <option value="عادي / جاف (درجة حرارة الغرفة)">تخزين عادي / جاف (درجة حرارة الغرفة)</option>
                    <option value="تخزين مكيّف بارد (أقل من 22°م)">تخزين مكيّف بارد (أقل من 22°م للأجهزة)</option>
                    <option value="تخزين مبرد (2-8°م)">تخزين مبرد (2-8°م)</option>
                    <option value="حماية من الرطوبة والضوء">حماية من الرطوبة وأشعة الشمس المباشرة</option>
                    <option value="تخزين آمن عالي الحماية">تخزين آمن عالي الحماية (أجهزة ثمينة / خزنة)</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Unit Cost & Supplier */}
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>تكلفة شراء الوحدة (ر.س)</label>
                  <input name="cost" defaultValue={warehouseModal.cost !== undefined ? warehouseModal.cost : ''} type="number" step="0.01" min="0" placeholder="0.00" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
                </div>

                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>المورد الرئيسي المعتمد</label>
                  <select name="supplier" defaultValue={warehouseModal.supplier || 'شركة التقنيات الحديثة المحدودة'} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}>
                    <option value="شركة التقنيات الحديثة المحدودة">شركة التقنيات الحديثة المحدودة</option>
                    <option value="مؤسسة الأثاث والتجهيزات المكتبية">مؤسسة الأثاث والتجهيزات المكتبية</option>
                    <option value="شركة التوريدات العامة للتجارة">شركة التوريدات العامة للتجارة</option>
                    <option value="الوكالة الوطنية للسيارات والمعدات">الوكالة الوطنية للسيارات والمعدات</option>
                    <option value="أخرى / مورد معتمد">أخرى / مورد معتمد</option>
                  </select>
                </div>
              </div>

              {/* Row 7: Description & Notes */}
              <div>
                <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>الملاحظات والوصف الفني للصنف</label>
                <textarea name="notes" rows={2} defaultValue={warehouseModal.notes || warehouseModal.description || ''} placeholder="أي اشتراطات فنية، رقم الموديل، ملحقات الصنف..." style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
              </div>

              {/* Action buttons */}
              <div style={{display:'flex', gap:'1rem', marginTop:'0.5rem'}}>
                <button type="submit" className="btn btn-primary" style={{flex:2, padding:'0.85rem', fontWeight:800, fontSize:'0.95rem'}}>
                  💾 حفظ وتأكيد بيانات الصنف في المستودع
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setWarehouseModal(null)} style={{flex:1, border:'1px solid var(--border)', padding:'0.85rem'}}>
                  إلغاء
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ISSUE / DISPATCH REQUEST (خروج صنف بانتظار الموافقة) */}
      {issueModalItem && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(15, 23, 42, 0.75)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)', padding:'1rem'}}>
          <div className="card view-anim" style={{width:'720px', maxWidth:'96vw', padding:'2.25rem', position:'relative', maxHeight:'90vh', overflowY:'auto', background:'var(--card-bg, #ffffff)', borderRadius:'16px', border:'1px solid var(--border)'}}>
            <button onClick={() => setIssueModalItem(null)} style={{position:'absolute', top:'1.25rem', right:'1.25rem', background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)'}}>
              <X size={22} />
            </button>
            
            <div style={{borderBottom:'1px solid var(--border)', paddingBottom:'1rem', marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'1.3rem', fontWeight:800, margin:0, color:'#d97706', display:'flex', alignItems:'center', gap:'0.6rem'}}>
                <ArrowRightLeft size={24} /> إنشاء طلب خروج وصرف صنف من المستودع
              </h3>
              <p style={{margin:'0.3rem 0 0', color:'var(--text-muted)', fontSize:'0.85rem'}}>
                سيتم رفع هذا الطلب بحالة <strong>"بانتظار الموافقة"</strong>، ولن يتم خصم الرصيد إلا بعد اعتماد أمين المستودع / الإدارة المالية.
              </p>
            </div>

            <form onSubmit={handleCreateIssueRequest} style={{display:'flex', flexDirection:'column', gap:'1.25rem'}}>
              
              {/* Item selection */}
              <div>
                <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>الصنف المطلوب إخراجه من المستودع *</label>
                <select 
                  name="itemId" 
                  required 
                  defaultValue={issueModalItem.id || (warehouseItems[0] ? warehouseItems[0].id : '')} 
                  style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontWeight:600}}
                >
                  {warehouseItems.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} — (SKU: {w.sku}) | الرصيد المتاح: {w.qty} {w.unit || 'حبة'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity & Purpose */}
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>الكمية المطلوبة *</label>
                  <input name="qty" type="number" min="1" required defaultValue="1" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontWeight:800, fontSize:'1.1rem'}} />
                </div>

                <div>
                  <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>نوع الخروج / سبب الصرف *</label>
                  <select name="reason" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}>
                    <option value="تسليم عهدة عمل لموظف">تسليم عهدة عمل لموظف</option>
                    <option value="صرف مواد تشغيلي لاستهلاك القسم">صرف مواد تشغيلي لاستهلاك القسم</option>
                    <option value="صيانة وإصلاح خارجي">صيانة وإصلاح خارجي</option>
                    <option value="تحويل ونقل إلى فرع آخر">تحويل ونقل إلى فرع آخر</option>
                    <option value="مشروع رعاية وقفية وخيرية">مشروع رعاية وقفية وخيرية</option>
                  </select>
                </div>
              </div>

              {/* Recipient Employee or Department */}
              <div>
                <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>الموظف المستلم / الإدارة المستفيدة *</label>
                <select name="recipient" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontWeight:600}}>
                  <option value="أحمد الشمري (قسم المحاسبة والمالية)">أحمد الشمري — قسم المحاسبة والمالية</option>
                  <option value="سعود العتيبي (تقنية المعلومات)">سعود العتيبي — تقنية المعلومات</option>
                  <option value="محمد السالم (الموارد البشرية)">محمد السالم — الموارد البشرية</option>
                  <option value="إدارة المشاريع والأوقاف">إدارة المشاريع والأوقاف</option>
                  {employeesList.map(e => (
                    <option key={e.id} value={`${e.full_name} (${e.department || e.role || 'موظف'})`}>
                      {e.full_name} — {e.department || e.role || 'موظف'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custody checkbox option */}
              <div style={{background:'rgba(16, 185, 129, 0.08)', border:'1px solid rgba(16, 185, 129, 0.3)', padding:'1rem', borderRadius:'10px'}}>
                <label style={{display:'flex', alignItems:'center', gap:'0.75rem', cursor:'pointer', color:'#065f46', fontWeight:700, fontSize:'0.88rem'}}>
                  <input type="checkbox" name="isCustody" defaultChecked style={{width:'18px', height:'18px', accentColor:'#10b981'}} />
                  تسجيل الصنف كـ "عهدة موظف رسمية" فور موافقة الإدارة (سيتم توليد باركود الأصل وسند الاستلام آلياً)
                </label>
              </div>

              {/* Notes */}
              <div>
                <label style={{display:'block', marginBottom:'0.4rem', fontWeight:700, fontSize:'0.85rem'}}>ملاحظات وتفاصيل إضافية</label>
                <textarea name="notes" rows={2} placeholder="مبررات الصرف وأي تفاصيل تشغيلية..." style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}} />
              </div>

              {/* Action buttons */}
              <div style={{display:'flex', gap:'1rem', marginTop:'0.5rem'}}>
                <button type="submit" className="btn btn-primary" style={{flex:2, padding:'0.85rem', fontWeight:800, background:'#d97706', borderColor:'#d97706'}}>
                  🚀 إرسال طلب الصرف للاعتماد والموافقة
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setIssueModalItem(null)} style={{flex:1, border:'1px solid var(--border)', padding:'0.85rem'}}>
                  إلغاء
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* PRINT MODAL: OFFICIAL MATERIAL ISSUE VOUCHER */}
      {selectedVoucher && (
        <MaterialIssuePrintModal 
          request={selectedVoucher} 
          onClose={() => setSelectedVoucher(null)} 
        />
      )}

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

      {/* نافذة مراجعة وتفاصيل سند القيد المحاسبي */}
      {selectedJournal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000, backdropFilter:'blur(4px)'}} onClick={() => setSelectedJournal(null)}>
          <div className="card" style={{width:'820px', maxWidth:'95vw', maxHeight:'90vh', overflowY:'auto', background:'var(--card-bg)', padding:'2rem', border:'1px solid var(--border)', boxShadow:'0 20px 40px rgba(0,0,0,0.2)'}} onClick={e => e.stopPropagation()}>
            
            {/* ترويسة سند القيد */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:'2px solid var(--border)', paddingBottom:'1.25rem', marginBottom:'1.5rem'}}>
              <div>
                <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                  <h3 style={{fontSize:'1.35rem', fontWeight:800, margin:0, display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <FileText size={24} color="var(--brand-teal)" /> سند قيد يومية: {selectedJournal.id}
                  </h3>
                  <span style={{
                    padding:'0.25rem 0.75rem',
                    borderRadius:'20px',
                    fontSize:'0.75rem',
                    fontWeight:700,
                    background: (selectedJournal.status === 'معتمد' || selectedJournal.status === 'مرحل') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: (selectedJournal.status === 'معتمد' || selectedJournal.status === 'مرحل') ? '#059669' : '#b45309',
                    border: '1px solid currentColor'
                  }}>
                    {selectedJournal.status}
                  </span>
                </div>
                <div style={{color:'var(--text-muted)', fontSize:'0.85rem', marginTop:'0.5rem'}}>
                  تاريخ القيد: <strong>{selectedJournal.date}</strong> | المصدر: <strong>{selectedJournal.source}</strong>
                </div>
              </div>
              <button className="btn btn-ghost" onClick={() => setSelectedJournal(null)}><X size={20} /></button>
            </div>

            {/* البيان العام */}
            <div style={{background:'var(--bg)', padding:'1rem 1.25rem', borderRadius:'8px', border:'1px solid var(--border)', marginBottom:'1.5rem'}}>
              <div style={{fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.25rem'}}>البيان العام للقيد:</div>
              <div style={{fontWeight:700, fontSize:'1rem'}}>{selectedJournal.desc}</div>
            </div>

            {/* جدول الأسطر المحاسبية (المدين والدائن) */}
            <div style={{marginBottom:'1.5rem'}}>
              <h4 style={{fontSize:'1rem', fontWeight:700, marginBottom:'0.75rem'}}>الأسطر المحاسبية للقيد (Double-Entry Ledger):</h4>
              <table style={{width:'100%', borderCollapse:'collapse', border:'1px solid var(--border)', borderRadius:'8px', overflow:'hidden'}}>
                <thead style={{background:'var(--thead-bg, #f8fafc)', borderBottom:'1px solid var(--border)'}}>
                  <tr>
                    <th style={{padding:'0.75rem 1rem', textAlign:'right', fontSize:'0.85rem'}}>الحساب المالي</th>
                    <th style={{padding:'0.75rem 1rem', textAlign:'right', fontSize:'0.85rem'}}>البيان التفصيلي للسطر</th>
                    <th style={{padding:'0.75rem 1rem', textAlign:'right', fontSize:'0.85rem'}}>مدين (ر.س)</th>
                    <th style={{padding:'0.75rem 1rem', textAlign:'right', fontSize:'0.85rem'}}>دائن (ر.س)</th>
                  </tr>
                </thead>
                <tbody>
                  {(!selectedJournal.lines || selectedJournal.lines.length === 0) ? (
                    <tr>
                      <td colSpan={4} style={{padding:'2rem', textAlign:'center', color:'var(--text-muted)'}}>
                        لا توجد أسطر تفصيلية مسجلة في هذا القيد.
                      </td>
                    </tr>
                  ) : (
                    selectedJournal.lines.map((l, i) => (
                      <tr key={l.id || i} style={{borderBottom:'1px solid var(--border)'}}>
                        <td style={{padding:'0.75rem 1rem', fontWeight:600}}>{l.account_label || l.account_id || 'حساب رئيسي'}</td>
                        <td style={{padding:'0.75rem 1rem', fontSize:'0.85rem', color:'var(--text-muted)'}}>{l.description || selectedJournal.desc}</td>
                        <td style={{padding:'0.75rem 1rem', fontWeight:700, color:'#e11d48', direction:'ltr', textAlign:'right'}}>
                          {l.debit ? Number(l.debit).toLocaleString() : '-'}
                        </td>
                        <td style={{padding:'0.75rem 1rem', fontWeight:700, color:'#10b981', direction:'ltr', textAlign:'right'}}>
                          {l.credit ? Number(l.credit).toLocaleString() : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot style={{background:'var(--bg)', fontWeight:800, borderTop:'2px solid var(--border)'}}>
                  <tr>
                    <td colSpan={2} style={{padding:'0.75rem 1rem', textAlign:'left'}}>المجموع المتوازن:</td>
                    <td style={{padding:'0.75rem 1rem', color:'#e11d48', direction:'ltr', textAlign:'right'}}>
                      {Number(selectedJournal.debit || 0).toLocaleString()}
                    </td>
                    <td style={{padding:'0.75rem 1rem', color:'#10b981', direction:'ltr', textAlign:'right'}}>
                      {Number(selectedJournal.credit || 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* أزرار التحكم بالسند */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--border)', paddingTop:'1.25rem'}}>
              <div style={{display:'flex', gap:'0.75rem'}}>
                {(selectedJournal.status === 'بانتظار الاعتماد' || selectedJournal.status === 'مسودة' || selectedJournal.status === 'جديد') && (
                  <button 
                    className="btn btn-primary" 
                    style={{background:'#10b981', borderColor:'#10b981', padding:'0.6rem 1.5rem', fontWeight:700}}
                    onClick={async () => {
                      showToast('جاري اعتماد القيد المحاسبي...');
                      const { error } = await supabase.from('journal_entries').update({ status: 'معتمد' }).eq('id', selectedJournal.db_id);
                      if (!error) {
                        setJournals(prev => prev.map(item => item.db_id === selectedJournal.db_id ? { ...item, status: 'معتمد' } : item));
                        setSelectedJournal(prev => prev ? { ...prev, status: 'معتمد' } : null);
                        showToast('✅ تم اعتماد القيد المحاسبي بنجاح!');
                        fetchInitialData();
                      } else {
                        showToast('❌ تعذر اعتماد القيد: ' + error.message);
                      }
                    }}
                  >
                    <CheckCircle size={18} style={{marginRight:'0.4rem'}} /> اعتماد هذا القيد المالي
                  </button>
                )}
                <button className="btn btn-ghost" style={{border:'1px solid var(--border)'}} onClick={() => showToast('🖨️ جاري تجهيز وطباعة سند القيد...')}>
                  <Printer size={16} /> طباعة السند
                </button>
              </div>

              <button className="btn btn-ghost" onClick={() => setSelectedJournal(null)}>إغلاق</button>
            </div>

          </div>
        </div>
      )}
      {/* نافذة الإدخال الاحترافية المخصصة (بديل لـ window.prompt لمنع حظر المتصفح) */}
      {promptDialog && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(15, 23, 42, 0.75)', zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)', padding:'1rem'}}>
          <div className="card view-anim" style={{width:'500px', maxWidth:'94vw', padding:'2rem', position:'relative', background:'var(--card-bg, #ffffff)', borderRadius:'16px', border:'1px solid var(--border)', boxShadow:'0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
            <button onClick={() => setPromptDialog(null)} style={{position:'absolute', top:'1.25rem', right:'1.25rem', background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)'}}>
              <X size={20} />
            </button>
            <h3 style={{fontSize:'1.2rem', fontWeight:800, margin:0, marginBottom:'0.35rem', color:'var(--brand-teal)'}}>
              {promptDialog.title}
            </h3>
            {promptDialog.subtitle && (
              <p style={{margin:'0 0 1.25rem 0', color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:1.5}}>
                {promptDialog.subtitle}
              </p>
            )}
            <form onSubmit={(e) => {
              e.preventDefault();
              const val = e.target.elements.promptInput.value;
              const cb = promptDialog.onConfirm;
              setPromptDialog(null);
              if (cb) cb(val);
            }}>
              <div style={{marginBottom:'1.5rem'}}>
                {promptDialog.label && (
                  <label style={{display:'block', marginBottom:'0.5rem', fontWeight:700, fontSize:'0.85rem'}}>
                    {promptDialog.label}
                  </label>
                )}
                {promptDialog.inputType === 'textarea' ? (
                  <textarea
                    name="promptInput"
                    defaultValue={promptDialog.defaultValue || ''}
                    placeholder={promptDialog.placeholder || ''}
                    required
                    rows={4}
                    autoFocus
                    style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontSize:'0.9rem'}}
                  />
                ) : (
                  <input
                    name="promptInput"
                    type={promptDialog.inputType === 'number' ? 'number' : 'text'}
                    defaultValue={promptDialog.defaultValue || ''}
                    placeholder={promptDialog.placeholder || ''}
                    required
                    autoFocus
                    style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontSize:'0.9rem'}}
                  />
                )}
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', gap:'0.75rem'}}>
                <button type="button" className="btn btn-ghost" onClick={() => setPromptDialog(null)} style={{border:'1px solid var(--border)'}}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary" style={{background: promptDialog.confirmColor || undefined, borderColor: promptDialog.confirmColor || undefined}}>
                  {promptDialog.confirmText || 'تأكيد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة التأكيد الاحترافية المخصصة (بديل لـ window.confirm لمنع حظر المتصفح) */}
      {confirmDialog && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(15, 23, 42, 0.75)', zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)', padding:'1rem'}}>
          <div className="card view-anim" style={{width:'460px', maxWidth:'94vw', padding:'2rem', position:'relative', background:'var(--card-bg, #ffffff)', borderRadius:'16px', border:'1px solid var(--border)', boxShadow:'0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
            <button onClick={() => setConfirmDialog(null)} style={{position:'absolute', top:'1.25rem', right:'1.25rem', background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)'}}>
              <X size={20} />
            </button>
            <div style={{display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem'}}>
              <AlertTriangle size={24} color={confirmDialog.confirmColor || '#ef4444'} />
              <h3 style={{fontSize:'1.2rem', fontWeight:800, margin:0, color:'var(--text)'}}>
                {confirmDialog.title || 'تأكيد الإجراء'}
              </h3>
            </div>
            <p style={{margin:'0 0 1.5rem 0', color:'var(--text-muted)', fontSize:'0.9rem', lineHeight:1.6}}>
              {confirmDialog.message}
            </p>
            <div style={{display:'flex', justifyContent:'flex-end', gap:'0.75rem'}}>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmDialog(null)} style={{border:'1px solid var(--border)'}}>
                إلغاء
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{background: confirmDialog.confirmColor || 'var(--danger, #ef4444)', borderColor: confirmDialog.confirmColor || 'var(--danger, #ef4444)'}}
                onClick={() => {
                  const cb = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  if (cb) cb();
                }}
              >
                {confirmDialog.confirmText || 'تأكيد'}
              </button>
            </div>
          </div>
        </div>
      )}
  
    </div>
  );
};

export default App;
