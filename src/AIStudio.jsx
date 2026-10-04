import React, { useState } from 'react';
import { 
  Bot, Settings, BookOpen, Database, Link, BarChart3, ShieldCheck, PlayCircle, UploadCloud,
  CheckCircle, Save, ChevronRight, ChevronLeft, Mic, Search, MessageSquare, Zap
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

        {/* Dummy content based on step */}
        <div style={{flex:1}}>
          {currentStep === 0 && (
            <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
              <div>
                <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>اسم المساعد الذكي</label>
                <input type="text" className="input" defaultValue="مستشار الأصول الذكي" style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}/>
              </div>
              <div>
                <label style={{display:'block', marginBottom:'0.5rem', fontWeight:600}}>التعليمات الأساسية (System Prompt)</label>
                <textarea rows={6} className="input" defaultValue="أنت مساعد مالي متخصص في إدارة الأصول والمستودعات في السعودية. يجب أن تستخدم مصطلحات دقيقة مثل العهدة، الجرد، والتراؤف..." style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)'}}></textarea>
              </div>
            </div>
          )}
          {currentStep > 0 && (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--text-muted)'}}>
              <Zap size={48} style={{marginBottom:'1rem', color:'var(--border-hover)'}}/>
              <p>إعدادات {STEPS[currentStep].title} (قيد التطوير الفعلي بناءً على المواصفات)</p>
            </div>
          )}
        </div>
      </div>

      {/* Left Column: Live Preview */}
      <div style={{width:'320px', background:'var(--bg)', borderRadius:'16px', border:'1px solid var(--border)', display:'flex', flexDirection:'column', overflow:'hidden'}}>
        <div style={{padding:'1rem', background:'var(--thead-bg)', borderBottom:'1px solid var(--border)', fontWeight:600, textAlign:'center'}}>
          معاينة حية (Live Preview)
        </div>
        <div style={{flex:1, padding:'1rem', display:'flex', flexDirection:'column', gap:'1rem'}}>
           <div style={{alignSelf:'flex-start', background:'var(--card-bg)', padding:'1rem', borderRadius:'12px 12px 0 12px', border:'1px solid var(--border)', fontSize:'0.9rem'}}>
             مرحباً! أنا المساعد الذكي. كيف يمكنني مساعدتك اليوم في إدارة أصولك؟
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
