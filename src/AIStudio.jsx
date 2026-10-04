import React, { useState } from 'react';
import { 
  Bot, Settings, BookOpen, Database, Link, BarChart3, ShieldCheck, PlayCircle, UploadCloud,
  CheckCircle, Save, ChevronLeft, Mic, Search, MessageSquare, Zap, Upload, FileText, Globe
} from 'lucide-react';

const STEPS = [
  { id: 'agent_text', icon: <MessageSquare size={18}/>, title: 'الوكيل النصي' },
  { id: 'agent_voice', icon: <Mic size={18}/>, title: 'الوكيل الصوتي' },
  { id: 'appearance', icon: <Settings size={18}/>, title: 'المظهر' },
  { id: 'knowledge', icon: <BookOpen size={18}/>, title: 'قاعدة المعرفة' },
  { id: 'data', icon: <Database size={18}/>, title: 'البيانات والطلبات' },
  { id: 'tools', icon: <Link size={18}/>, title: 'الأدوات والتكاملات' },
  { id: 'analytics', icon: <BarChart3 size={18}/>, title: 'التحليلات والتنبؤات' },
  { id: 'security', icon: <ShieldCheck size={18}/>, title: 'الأمان' },
  { id: 'test', icon: <PlayCircle size={18}/>, title: 'الاختبار' },
  { id: 'deploy', icon: <UploadCloud size={18}/>, title: 'النشر' }
];

export default function AIStudio() {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>اسم المساعد الذكي</label>
              <input type="text" className="input" defaultValue="مستشار الأصول الذكي" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}/>
            </div>
            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>التعليمات الأساسية (System Prompt)</label>
              <textarea rows={6} className="input" defaultValue="أنت مساعد مالي متخصص في إدارة الأصول والمستودعات في السعودية. يجب أن تستخدم مصطلحات دقيقة مثل العهدة، الجرد، والتراؤف..." style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}></textarea>
            </div>
            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>نموذج الذكاء الاصطناعي (LLM)</label>
              <select style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}>
                <option>علاّم (allam-2-7b) - المفضّل</option>
                <option>Llama 3.3 (llama-3.3-70b-versatile)</option>
              </select>
            </div>
          </div>
        );
      case 1:
        return (
          <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
            <div style={{display:'flex', gap:'1rem', alignItems:'center', background:'var(--bg)', padding:'1rem', borderRadius:'8px', border:'1px solid var(--border)'}}>
              <input type="checkbox" defaultChecked id="enable_voice" style={{width:'20px', height:'20px'}}/>
              <label htmlFor="enable_voice" style={{fontWeight:600}}>تفعيل المساعد الصوتي (STT & TTS)</label>
            </div>
            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>نموذج التعرّف على الصوت (STT)</label>
              <select style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}>
                <option>whisper-large-v3-turbo (Groq)</option>
              </select>
            </div>
            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>صوت الرد (TTS)</label>
              <select style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}>
                <option>Orpheus Arabic Saudi - صوت نسائي</option>
                <option>Orpheus Arabic Saudi - صوت رجالي</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>اللون الأساسي للواجهة</label>
              <input type="color" defaultValue="#0ea5e9" style={{width:'60px', height:'40px', padding:'0', cursor:'pointer'}}/>
            </div>
            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>الأيقونة الافتراضية</label>
              <div style={{display:'flex', gap:'1rem'}}>
                <button style={{padding:'1rem', borderRadius:'8px', background:'var(--brand-teal)', color:'white', border:'none'}}><Bot size={24}/></button>
                <button style={{padding:'1rem', borderRadius:'8px', background:'var(--bg)', border:'1px solid var(--border)'}}><MessageSquare size={24}/></button>
                <button style={{padding:'1rem', borderRadius:'8px', background:'var(--bg)', border:'1px solid var(--border)'}}><Sparkles size={24}/></button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
            <div style={{border:'2px dashed var(--border)', padding:'2rem', borderRadius:'12px', textAlign:'center', color:'var(--text-muted)'}}>
              <Upload size={32} style={{marginBottom:'1rem'}}/>
              <p>اسحب وأفلت الملفات هنا (PDF, DOCX, CSV)</p>
              <p style={{fontSize:'0.8rem', marginTop:'0.5rem'}}>لتدريب المساعد على سياسات الجهة ولوائح الأصول</p>
            </div>
            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>الأسئلة الشائعة (FAQ)</label>
              <button style={{padding:'0.75rem', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', width:'100%', display:'flex', justifyContent:'center', alignItems:'center', gap:'0.5rem'}}>
                <Search size={16}/> استيراد من ملف Excel
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            <h4 style={{marginBottom:'0.5rem'}}>صلاحيات القراءة من النظام</h4>
            {['سجل الأصول الثابتة', 'المستودعات والمخزون', 'حملات الجرد', 'الصيانة والأعطال', 'التقارير المالية'].map((item, i) => (
              <div key={i} style={{display:'flex', gap:'1rem', alignItems:'center', background:'var(--bg)', padding:'1rem', borderRadius:'8px', border:'1px solid var(--border)'}}>
                <input type="checkbox" defaultChecked id={'data_' + i} style={{width:'20px', height:'20px'}}/>
                <label htmlFor={'data_' + i} style={{fontWeight:600}}>{item}</label>
              </div>
            ))}
          </div>
        );
      case 5:
        return (
          <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>مفتاح الـ API (Groq)</label>
              <input type="password" value="********************************" readOnly style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}/>
              <p style={{fontSize:'0.75rem', color:'var(--success-text)', marginTop:'0.5rem'}}>✓ متصل وفعال</p>
            </div>
            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>تفعيل الـ Webhooks</label>
              <input type="text" placeholder="https://api.example.com/webhook" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}/>
            </div>
          </div>
        );
      case 6:
        return (
          <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>حساسية التنبؤ بنفاد المخزون</label>
              <input type="range" min="1" max="30" defaultValue="14" style={{width:'100%'}}/>
              <p style={{textAlign:'center', marginTop:'0.5rem', fontSize:'0.85rem'}}>التنبيه قبل 14 يوماً من النفاذ</p>
            </div>
            <div style={{display:'flex', gap:'1rem', alignItems:'center', background:'var(--bg)', padding:'1rem', borderRadius:'8px', border:'1px solid var(--border)'}}>
              <input type="checkbox" defaultChecked id="pred_maintenance" style={{width:'20px', height:'20px'}}/>
              <label htmlFor="pred_maintenance" style={{fontWeight:600}}>تفعيل التحليل الاستباقي للأعطال والمخاطر</label>
            </div>
          </div>
        );
      case 7:
        return (
          <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
            <div style={{background:'var(--card-bg)', padding:'1.5rem', borderRadius:'12px', border:'1px solid var(--border)'}}>
              <h4 style={{marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><ShieldCheck size={18} color="var(--success-text)"/> سياسات الأمان المطبقة</h4>
              <ul style={{listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:'0.75rem', fontSize:'0.9rem'}}>
                <li>✓ المساعد لا يتجاوز صلاحيات المستخدم الحالي (RLS)</li>
                <li>✓ العمليات المؤثرة تتطلب تأكيد (Confirmation)</li>
                <li>✓ جميع الطلبات مسجلة في Audit Log باسم المستخدم</li>
              </ul>
            </div>
          </div>
        );
      case 8:
        return (
          <div style={{display:'flex', flexDirection:'column', gap:'1.5rem', alignItems:'center', justifyContent:'center', height:'100%'}}>
            <PlayCircle size={48} color="var(--brand-teal)"/>
            <h3 style={{marginTop:'1rem'}}>جاهز لاختبار المساعد؟</h3>
            <button className="btn btn-primary" onClick={() => alert('تم اجتياز الفحص بنجاح!')}>إجراء فحص النظام (Health Check)</button>
          </div>
        );
      case 9:
        return (
          <div style={{display:'flex', flexDirection:'column', gap:'1.5rem', alignItems:'center', justifyContent:'center', height:'100%'}}>
            <UploadCloud size={64} color="var(--success-text)"/>
            <h2 style={{marginTop:'1rem'}}>كل شيء جاهز للنشر!</h2>
            <p style={{color:'var(--text-muted)', textAlign:'center', maxWidth:'400px'}}>سيتم تفعيل المساعد الذكي لجميع المستخدمين وفق الصلاحيات المحددة.</p>
            <button className="btn btn-primary" onClick={() => alert('تم نشر المساعد بنجاح!')} style={{background:'linear-gradient(135deg, var(--brand-teal), var(--brand-green))', border:'none', padding:'1rem 3rem', fontSize:'1.1rem'}}>نشر المساعد الذكي 🚀</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{display:'flex', height:'calc(100vh - 100px)', gap:'1.5rem'}}>
      
      {/* Right Column: Stepper */}
      <div style={{width:'260px', background:'var(--card-bg)', borderRadius:'16px', border:'1px solid var(--border)', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'0.5rem', overflowY:'auto'}}>
        <h3 style={{marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'1.1rem'}}><Bot color="var(--accent)"/> مسار الإعداد</h3>
        {STEPS.map((step, idx) => {
          const isActive = idx === currentStep;
          const isPast = idx < currentStep;
          return (
            <button key={step.id} onClick={() => setCurrentStep(idx)} style={{
              display:'flex', alignItems:'center', gap:'0.75rem', padding:'1rem', borderRadius:'12px', cursor:'pointer', transition:'all 0.2s', border:'none',
              background: isActive ? 'var(--brand-teal)' : 'transparent',
              color: isActive ? 'white' : (isPast ? 'var(--text)' : 'var(--text-muted)'),
              textAlign:'right'
            }}>
              <div style={{
                background: isActive ? 'rgba(255,255,255,0.2)' : (isPast ? 'var(--success-bg)' : 'var(--thead-bg)'),
                color: isActive ? 'white' : (isPast ? 'var(--success-text)' : 'var(--text-muted)'),
                width:'32px', height:'32px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center'
              }}>
                {isPast ? <CheckCircle size={16}/> : step.icon}
              </div>
              <span style={{fontWeight: isActive ? '700' : '600', fontSize:'0.95rem'}}>{step.title}</span>
            </button>
          )
        })}
      </div>

      {/* Middle Column: Settings Form */}
      <div style={{flex:1, background:'var(--card-bg)', borderRadius:'16px', border:'1px solid var(--border)', padding:'2rem', display:'flex', flexDirection:'column', overflowY:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', borderBottom:'1px solid var(--border)', paddingBottom:'1rem'}}>
          <h2 style={{fontSize:'1.5rem', color:'var(--text)', display:'flex', alignItems:'center', gap:'0.75rem'}}>
            {STEPS[currentStep].icon} {STEPS[currentStep].title}
          </h2>
          <div style={{display:'flex', gap:'0.5rem'}}>
            <button className="btn btn-ghost"><Save size={16}/> حفظ كمسودة</button>
            <button className="btn btn-primary" onClick={() => setCurrentStep(prev => Math.min(STEPS.length-1, prev + 1))}>
              {currentStep === STEPS.length - 1 ? 'نشر وإنهاء' : 'التالي'} <ChevronLeft size={16}/>
            </button>
          </div>
        </div>

        {/* Dynamic content based on step */}
        <div style={{flex:1}}>
          {renderStepContent()}
        </div>
      </div>

      {/* Left Column: Live Preview */}
      <div style={{width:'320px', background:'var(--bg)', borderRadius:'16px', border:'1px solid var(--border)', display:'flex', flexDirection:'column', overflow:'hidden'}}>
        <div style={{padding:'1rem', background:'var(--thead-bg)', borderBottom:'1px solid var(--border)', fontWeight:600, textAlign:'center'}}>
          معاينة حية (Live Preview)
        </div>
        <div style={{flex:1, padding:'1rem', display:'flex', flexDirection:'column', gap:'1rem', background:'var(--bg)'}}>
           <div style={{alignSelf:'flex-start', background:'var(--card-bg)', padding:'1rem', borderRadius:'12px 12px 0 12px', border:'1px solid var(--border)', fontSize:'0.9rem', boxShadow:'0 2px 4px rgba(0,0,0,0.05)'}}>
             مرحباً! أنا مستشار الأصول الذكي. <br/>كيف يمكنني مساعدتك اليوم في إدارة أصولك؟
           </div>
        </div>
        <div style={{padding:'1rem', borderTop:'1px solid var(--border)', background:'var(--card-bg)'}}>
           <div style={{display:'flex', alignItems:'center', gap:'0.5rem', background:'var(--bg)', border:'1px solid var(--border)', padding:'0.5rem', borderRadius:'20px'}}>
             <Mic size={18} color="var(--text-muted)"/>
             <input type="text" placeholder="اكتب رسالتك..." disabled style={{flex:1, background:'transparent', border:'none', outline:'none', color:'var(--text)'}}/>
             <div style={{background:'var(--brand-teal)', padding:'0.4rem', borderRadius:'50%', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><MessageSquare size={14}/></div>
           </div>
        </div>
      </div>

    </div>
  )
}
