import React, { useState } from 'react';
import { 
  X, Sparkles, TrendingUp, TrendingDown, DollarSign, PieChart, 
  Layers, Calculator, Download, CheckCircle, ArrowRight 
} from 'lucide-react';

const FinancialScenarioSimulatorModal = ({
  isOpen,
  onClose,
  totals = { cost: 0, nbv: 0, dep: 0 },
  currencySymbol = 'ر.س'
}) => {
  // Scenario sliders
  const [capexGrowth, setCapexGrowth] = useState(15); // % change in CAPEX (+15%)
  const [opexChange, setOpexChange] = useState(-5); // % change in Maintenance (-5%)
  const [usefulLifeChange, setUsefulLifeChange] = useState(0); // years change
  const [expectedRoi, setExpectedRoi] = useState(12); // Expected ROA (12%)

  if (!isOpen) return null;

  const baseCost = totals.cost || 5000000;
  const baseNbv = totals.nbv || 3500000;
  const baseDep = totals.dep || 1500000;

  // Calculations under the scenario
  const newCapexAmount = baseCost * (1 + capexGrowth / 100);
  const additionalInvestment = newCapexAmount - baseCost;
  const newAnnualDepreciation = (newCapexAmount * 0.12) * (usefulLifeChange !== 0 ? (1 - usefulLifeChange * 0.05) : 1);
  const projectedNbv = Math.round(baseNbv + additionalInvestment - newAnnualDepreciation);
  const projectedRevenueImpact = Math.round(newCapexAmount * (expectedRoi / 100));
  const opexSavings = Math.round((baseCost * 0.05) * (opexChange / 100));

  return (
    <div 
      className="view-anim"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        direction: 'rtl'
      }}
      onClick={onClose}
    >
      <div 
        className="card"
        style={{
          width: '920px',
          maxWidth: '96vw',
          maxHeight: '92vh',
          background: 'var(--card-bg, #ffffff)',
          color: 'var(--text, #0f172a)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: '#ffffff',
          padding: '1.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '16px'}}>
              <Sparkles size={28} />
            </div>
            <div>
              <h2 style={{fontSize: '1.4rem', fontWeight: 900, margin: 0}}>
                مختبر محاكاة الأثر المالي والاستثماري (Financial What-If Sandbox)
              </h2>
              <div style={{fontSize: '0.85rem', opacity: 0.9, marginTop: '2px'}}>
                نمذجة تنبؤية فورية لقرارات التوسع الرأسمالي، سياسات الإهلاك، ومعدلات العائد الاستثماري.
              </div>
            </div>
          </div>
          <button 
            className="btn btn-ghost" 
            style={{color: '#fff', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '0.5rem'}}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          
          {/* Sliders Area */}
          <div style={{background: 'var(--bg, #f8fafc)', padding: '1.5rem', borderRadius: '18px', border: '1px solid var(--border)'}}>
            <h3 style={{fontSize: '1.05rem', fontWeight: 800, margin: '0 0 1.25rem', color: '#4f46e5'}}>
              🎛️ ضبط متغيرات السيناريو التنبؤي:
            </h3>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem'}}>
              
              {/* Slider 1: CAPEX Growth */}
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px'}}>
                  <span>نسبة نمو الاستثمار الرأسمالي (CAPEX Growth):</span>
                  <span style={{color: '#4f46e5', fontWeight: 900}}>{capexGrowth > 0 ? `+${capexGrowth}%` : `${capexGrowth}%`}</span>
                </div>
                <input 
                  type="range" 
                  min="-30" 
                  max="60" 
                  step="5"
                  value={capexGrowth} 
                  onChange={e => setCapexGrowth(Number(e.target.value))}
                  style={{width: '100%', accentColor: '#4f46e5', cursor: 'pointer'}} 
                />
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)'}}>
                  <span>-30% انكماش</span>
                  <span>+60% توسع سريع</span>
                </div>
              </div>

              {/* Slider 2: OPEX Change */}
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px'}}>
                  <span>تغير تكاليف الصيانة والتشغيل (OPEX Shift):</span>
                  <span style={{color: opexChange < 0 ? '#10b981' : '#ef4444', fontWeight: 900}}>{opexChange > 0 ? `+${opexChange}%` : `${opexChange}%`}</span>
                </div>
                <input 
                  type="range" 
                  min="-25" 
                  max="25" 
                  step="5"
                  value={opexChange} 
                  onChange={e => setOpexChange(Number(e.target.value))}
                  style={{width: '100%', accentColor: '#10b981', cursor: 'pointer'}} 
                />
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)'}}>
                  <span>-25% ترشيد إنفاق</span>
                  <span>+25% ارتفاع تكاليف</span>
                </div>
              </div>

              {/* Slider 3: Useful Life Shift */}
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px'}}>
                  <span>تعديل العمر الافتراضي الإنتاجي للأصول:</span>
                  <span style={{color: '#8b5cf6', fontWeight: 900}}>{usefulLifeChange > 0 ? `+${usefulLifeChange} سنوات` : usefulLifeChange < 0 ? `${usefulLifeChange} سنوات` : 'بدون تغيير'}</span>
                </div>
                <input 
                  type="range" 
                  min="-2" 
                  max="4" 
                  step="1"
                  value={usefulLifeChange} 
                  onChange={e => setUsefulLifeChange(Number(e.target.value))}
                  style={{width: '100%', accentColor: '#8b5cf6', cursor: 'pointer'}} 
                />
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)'}}>
                  <span>-2 سنة (تسريع إهلاك)</span>
                  <span>+4 سنوات (إطالة عمر)</span>
                </div>
              </div>

              {/* Slider 4: Expected ROA */}
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px'}}>
                  <span>العائد المستهدف على الأصول (Target ROA):</span>
                  <span style={{color: '#0d9488', fontWeight: 900}}>{expectedRoi}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="25" 
                  step="1"
                  value={expectedRoi} 
                  onChange={e => setExpectedRoi(Number(e.target.value))}
                  style={{width: '100%', accentColor: '#0d9488', cursor: 'pointer'}} 
                />
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)'}}>
                  <span>5% محافظ</span>
                  <span>25% نمو مرتفع</span>
                </div>
              </div>

            </div>
          </div>

          {/* Projected Outcomes Grid */}
          <div>
            <h3 style={{fontSize: '1.05rem', fontWeight: 800, margin: '0 0 1rem'}}>
              📊 النتائج المالية التنبؤية للسيناريو:
            </h3>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem'}}>
              
              <div className="card" style={{padding: '1.25rem', borderRight: '4px solid #4f46e5'}}>
                <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>إجمالي المحفظة الرأسمالية المتوقعة</div>
                <div style={{fontSize: '1.4rem', fontWeight: 900, color: '#4f46e5', marginTop: '4px'}}>
                  {newCapexAmount.toLocaleString()} <span style={{fontSize: '0.75rem'}}>{currencySymbol}</span>
                </div>
                <div style={{fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: '4px'}}>
                  فارق: {additionalInvestment > 0 ? `+${additionalInvestment.toLocaleString()}` : additionalInvestment.toLocaleString()} {currencySymbol}
                </div>
              </div>

              <div className="card" style={{padding: '1.25rem', borderRight: '4px solid #0d9488'}}>
                <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>صافي القيمة الدفترية المتوقعة (NBV)</div>
                <div style={{fontSize: '1.4rem', fontWeight: 900, color: '#0d9488', marginTop: '4px'}}>
                  {projectedNbv.toLocaleString()} <span style={{fontSize: '0.75rem'}}>{currencySymbol}</span>
                </div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px'}}>
                  بعد احتساب الإهلاك السنوي المحدث
                </div>
              </div>

              <div className="card" style={{padding: '1.25rem', borderRight: '4px solid #10b981'}}>
                <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>العائد السنوي المتولد من الأصول</div>
                <div style={{fontSize: '1.4rem', fontWeight: 900, color: '#10b981', marginTop: '4px'}}>
                  {projectedRevenueImpact.toLocaleString()} <span style={{fontSize: '0.75rem'}}>{currencySymbol}</span>
                </div>
                <div style={{fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: '4px'}}>
                  بمعدل عائد {expectedRoi}%
                </div>
              </div>

            </div>
          </div>

          {/* AI Executive Recommendation */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(79,70,229,0.06), rgba(139,92,246,0.06))',
            border: '1px solid rgba(79,70,229,0.2)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{background: '#4f46e5', color: '#fff', padding: '0.6rem', borderRadius: '12px'}}>
              <Calculator size={24} />
            </div>
            <div>
              <div style={{fontWeight: 800, fontSize: '0.95rem', color: '#4f46e5'}}>
                توصية المستشار المالي الرقمي (Traouf Strategic Synthesis):
              </div>
              <div style={{fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.6, marginTop: '2px'}}>
                تُظهر المحاكاة أن زيادة الاستثمار بنسبة <strong>{capexGrowth}%</strong> مع خفض تكاليف الصيانة عبر عقود الضمان المسبقة ستعزز العائد على المحفظة الرأسمالية وتوفر تدفقات تشغيلية نقدية إضافية تدعم المركز المالي للمؤسسة.
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '1.25rem 2rem',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg, #f8fafc)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          <button className="btn btn-primary" style={{padding: '0.65rem 1.75rem', fontWeight: 800}} onClick={onClose}>
            اعتماد وحفظ الدراسة
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialScenarioSimulatorModal;
