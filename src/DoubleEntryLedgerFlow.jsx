import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, DollarSign, Layers, Play, Zap, FileText, Sparkles, HelpCircle } from 'lucide-react';
import { sfx } from './audioEffects';

export default function DoubleEntryLedgerFlow({
  totals,
  currencySymbol = 'ر.س',
  journals = []
}) {
  const [selectedFlow, setSelectedFlow] = useState('acquisition'); // 'acquisition' | 'depreciation' | 'disposal' | 'warehouse'

  const flows = [
    {
      id: 'acquisition',
      title: '1. اقتناء وشراء أصل جديد',
      desc: 'قيد إثبات التكلفة الرأسمالية للأصل وإخراج النقدية أو إثبات الذمة للمورد',
      debit: { code: '1201', name: 'حساب الأصول الثابتة', amount: totals.cost, color: '#3b82f6', role: 'زيادة في الأصول (مدين)' },
      credit: { code: '1101 / 2101', name: 'البنك / الموردون', amount: totals.cost, color: '#10b981', role: 'نقص نقدية أو التزام (دائن)' },
      rule: 'معيار IAS 16: يتم رسملة كافة التكاليف اللازمة لجعل الأصل جاهزاً للاستخدام المقصود.'
    },
    {
      id: 'depreciation',
      title: '2. قيد الإهلاك السنوي الدوري',
      desc: 'توزيع التكلفة القابلة للإهلاك على العمر الإنتاجي للأصل مقابل قائمة الدخل',
      debit: { code: '5102', name: 'مصروف إهلاك الأصول (قائمة الدخل)', amount: totals.dep > 0 ? totals.dep : 45000, color: '#ef4444', role: 'أثر مباشر على الأرباح والخسائر (مدين)' },
      credit: { code: '1209', name: 'مجمع إهلاك الأصول (المركز المالي)', amount: totals.dep > 0 ? totals.dep : 45000, color: '#8b5cf6', role: 'حساب عكسي يخفض قيمة الأصول (دائن)' },
      rule: 'معيار IAS 16 الفقرة 43: يعترف بمصروف الإهلاك في الربح أو الخسارة ما لم يدرج في القيمة الدفترية لأصل آخر.'
    },
    {
      id: 'warehouse',
      title: '3. صرف صنف مستودعي كأصل ثابت',
      desc: 'تحويل صنف من مخزون المستودعات الرأسمالية إلى أصل تشغيلي في الخدمة',
      debit: { code: '1201', name: 'الأصول الثابتة التشغيلية', amount: 85000, color: '#3b82f6', role: 'قيد تشغيلي بالخدمة (مدين)' },
      credit: { code: '1301', name: 'مخزون المستودع المركزي', amount: 85000, color: '#f59e0b', role: 'تخفيض رصيد المستودع (دائن)' },
      rule: 'سند صرف مخزني معتمد يولد قيد تسوية فورية وتحديث لموقع العهدة وباركود الأصل.'
    },
    {
      id: 'disposal',
      title: '4. استبعاد وتخريد أصل ثابت',
      desc: 'إقفال تكلفة الأصل ومجمع إهلاكه وإثبات أرباح أو خسائر الاستبعاد',
      debit: { code: '1209 & 4205', name: 'مجمع الإهلاك + خسائر الاستبعاد', amount: 35000, color: '#ec4899', role: 'إقفال المجمع وإثبات الأثر (مدين)' },
      credit: { code: '1201', name: 'تكلفة الأصل المستبعد', amount: 35000, color: '#64748b', role: 'شطب التكلفة التاريخية من الدفاتر (دائن)' },
      rule: 'معيار IAS 16 الفقرة 67: يلغى الاعتراف بالقيمة الدفترية للأصل عند استبعاده نهائياً.'
    }
  ];

  const current = flows.find(f => f.id === selectedFlow) || flows[0];

  return (
    <div style={{
      background: 'var(--card-bg)',
      borderRadius: '24px',
      border: '1px solid var(--border)',
      padding: '2rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
      direction: 'rtl'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--brand-teal), var(--brand-green))',
              color: 'white',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowLeftRight size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>
              مخطط التدفق المالي والقيد المزدوج التفاعلي (Double-Entry Ledger Visualizer)
            </h3>
          </div>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            محاكاة بصرية تفاعلية لحركة الأرصدة والمديونية والدائنية وفق معايير المحاسبة الدولية (IFRS & SOCPA).
          </p>
        </div>

        {/* Transaction Flow Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg)', padding: '0.35rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
          {flows.map(f => (
            <button
              key={f.id}
              onClick={() => {
                sfx.playClick();
                setSelectedFlow(f.id);
              }}
              style={{
                background: selectedFlow === f.id ? 'var(--card-bg)' : 'transparent',
                color: selectedFlow === f.id ? 'var(--brand-teal)' : 'var(--text-muted)',
                fontWeight: selectedFlow === f.id ? 800 : 600,
                border: selectedFlow === f.id ? '1px solid var(--border)' : 'none',
                borderRadius: '10px',
                padding: '0.5rem 0.9rem',
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: selectedFlow === f.id ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {f.title}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Canvas: Two Big Account Nodes connected by Animated Flow */}
      <div style={{
        background: 'linear-gradient(180deg, var(--bg) 0%, rgba(0, 165, 155, 0.03) 100%)',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        padding: '2.5rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(0, 165, 155, 0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.6,
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '2rem',
          position: 'relative',
          zIndex: 1
        }}>
          {/* DEBIT NODE */}
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '18px',
            border: `2px solid ${current.debit.color}`,
            padding: '1.75rem',
            boxShadow: `0 12px 30px ${current.debit.color}20`,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{
                background: `${current.debit.color}15`,
                color: current.debit.color,
                fontWeight: 800,
                fontSize: '0.8rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                border: `1px solid ${current.debit.color}40`
              }}>
                الطرف المدين (Debit) 🟢
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                #{current.debit.code}
              </span>
            </div>

            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
              {current.debit.name}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {current.debit.role}
            </div>

            <div style={{
              background: 'var(--bg)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>المبلغ المحيد:</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: current.debit.color, fontFamily: 'monospace' }}>
                +{Number(current.debit.amount || 0).toLocaleString()} {currencySymbol}
              </span>
            </div>
          </div>

          {/* FLOW ARROW & BALANCE BRIDGE */}
          <div style={{ textAlign: 'center', padding: '0 1rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-teal), var(--brand-green))',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              boxShadow: '0 0 25px rgba(0, 165, 155, 0.4)',
              animation: 'pulseGlow 2s infinite'
            }}>
              <ArrowLeftRight size={28} />
            </div>

            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}>
              <CheckCircle2 size={13} />
              متوازن = 0 فرق
            </div>
          </div>

          {/* CREDIT NODE */}
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '18px',
            border: `2px solid ${current.credit.color}`,
            padding: '1.75rem',
            boxShadow: `0 12px 30px ${current.credit.color}20`,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{
                background: `${current.credit.color}15`,
                color: current.credit.color,
                fontWeight: 800,
                fontSize: '0.8rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                border: `1px solid ${current.credit.color}40`
              }}>
                الطرف الدائن (Credit) 🔵
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                #{current.credit.code}
              </span>
            </div>

            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
              {current.credit.name}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {current.credit.role}
            </div>

            <div style={{
              background: 'var(--bg)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>المبلغ الدائن:</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: current.credit.color, fontFamily: 'monospace' }}>
                -{Number(current.credit.amount || 0).toLocaleString()} {currencySymbol}
              </span>
            </div>
          </div>
        </div>

        {/* Regulatory Note */}
        <div style={{
          marginTop: '2rem',
          background: 'rgba(0, 165, 155, 0.08)',
          border: '1px solid rgba(0, 165, 155, 0.25)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.86rem',
          color: 'var(--text)'
        }}>
          <Sparkles size={18} color="var(--brand-teal)" style={{ flexShrink: 0 }} />
          <span>
            <strong>التأصيل المحاسبي المعياري:</strong> {current.rule}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0% { transform: scale(1); box-shadow: 0 0 15px rgba(0, 165, 155, 0.3); }
          50% { transform: scale(1.08); box-shadow: 0 0 30px rgba(0, 165, 155, 0.7); }
          100% { transform: scale(1); box-shadow: 0 0 15px rgba(0, 165, 155, 0.3); }
        }
      `}</style>
    </div>
  );
}
