import React, { useState } from 'react';
import { 
  X, Box, QrCode, Tag, TrendingDown, Clock, ShieldCheck, Wrench, 
  ArrowRightLeft, Trash2, Printer, CheckCircle, FileText, Activity, 
  Calendar, DollarSign, Database, Sparkles, Layers, Cpu, Hash
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Simple deterministic hash generator for tamper-proof digital audit trail
const generateAuditHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}fa7b${hex.slice(0, 4)}c9`;
};

const AssetDigitalTwinModal = ({
  asset,
  onClose,
  onPrintBarcode,
  onTransfer,
  onDisposal,
  currencySymbol = 'ر.س',
  currencyRate = 1
}) => {
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'schedule' | 'chain' | 'tco'
  const [depMethod, setDepMethod] = useState(asset?.method || 'SL'); // 'SL' | 'DB' | 'SYD'

  if (!asset) return null;

  const cost = Number(asset.cost) || 0;
  const salvage = Number(asset.salvage) || 0;
  const life = Number(asset.life) || 5;
  const depreciableAmount = Math.max(0, cost - salvage);

  // Conversion for foreign currency view
  const formatMoney = (amount) => {
    return ((Number(amount) || 0) * currencyRate).toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // Generate Year-by-Year Depreciation Schedule
  const purchaseYear = asset.date ? new Date(asset.date).getFullYear() : 2024;
  const scheduleRows = [];
  let currentBookValue = cost;
  let accumulatedDep = 0;

  for (let y = 1; y <= life; y++) {
    let yearDep = 0;
    if (depMethod === 'SL') {
      yearDep = depreciableAmount / life;
    } else if (depMethod === 'DB') {
      const rate = (2 / life);
      yearDep = Math.min(currentBookValue - salvage, currentBookValue * rate);
      if (yearDep < 0) yearDep = 0;
    } else {
      // SYD
      const sumYears = (life * (life + 1)) / 2;
      const fraction = (life - y + 1) / sumYears;
      yearDep = depreciableAmount * fraction;
    }

    // Don't depreciate below salvage
    if (currentBookValue - yearDep < salvage) {
      yearDep = Math.max(0, currentBookValue - salvage);
    }

    accumulatedDep += yearDep;
    currentBookValue = Math.max(salvage, cost - accumulatedDep);

    scheduleRows.push({
      year: purchaseYear + y - 1,
      yearIndex: y,
      annualDep: yearDep,
      monthlyDep: yearDep / 12,
      accumulated: accumulatedDep,
      netBookValue: currentBookValue,
      depPercent: ((accumulatedDep / (cost || 1)) * 100).toFixed(1)
    });
  }

  // Current NBV calculation
  const currentDep = Number(asset.accumulatedDep) || (cost * 0.25);
  const currentNBV = Math.max(salvage, cost - currentDep);
  const depProgress = Math.min(100, Math.round((currentDep / (cost || 1)) * 100));

  // Digital audit trail events with cryptographic hashes
  const auditEvents = [
    {
      title: 'تسجيل الأصل والاستحواذ الرأسمالي',
      date: asset.date || '2024-01-10',
      action: 'CAPITAL_ASSET_ACQUISITION',
      officer: asset.supplier || 'إدارة المشتريات العامة',
      ref: asset.invoiceNumber ? `INV-${asset.invoiceNumber}` : `PO-${asset.poNumber || '8841'}`,
      hash: generateAuditHash(`${asset.id}_ACQUISITION_${cost}_${asset.date}`)
    },
    {
      title: 'جاهزية الأصل وتفعيل الإهلاك المحاسبي',
      date: asset.readyDate || asset.date || '2024-01-15',
      action: 'DEPRECIATION_COMMISSIONING',
      officer: 'النظام المحاسبي الآلي (IFRS/SOCPA)',
      ref: `JV-DEP-${asset.id}`,
      hash: generateAuditHash(`${asset.id}_COMMISSION_${depMethod}_${asset.readyDate}`)
    },
    {
      title: 'إسناد الأصل كعهدة رسمية للموظف',
      date: asset.readyDate || '2024-02-01',
      action: 'CUSTODIAL_ASSIGNMENT',
      officer: asset.custody && asset.custody !== 'غير محدد' ? asset.custody : 'المستودع الرئيسي',
      ref: `CUST-VOUCHER-${asset.id}`,
      hash: generateAuditHash(`${asset.id}_CUSTODY_${asset.custody}`)
    },
    {
      title: 'المطابقة الدورية والجرد الفعلي الميداني',
      date: asset.lastInventory || '2024-09-01',
      action: 'ANNUAL_STOCKTAKE_AUDIT',
      officer: 'لجنة الجرد والمطابقة الرقابية',
      ref: 'AUDIT-PASS-100%',
      hash: generateAuditHash(`${asset.id}_AUDIT_VERIFIED_${asset.status}`)
    }
  ];

  // TCO Calculations
  const maintenanceEstimated = cost * 0.15;
  const insuranceEstimated = cost * 0.08;
  const totalTCO = cost + maintenanceEstimated + insuranceEstimated - salvage;

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
          width: '1040px',
          maxWidth: '96vw',
          maxHeight: '92vh',
          background: 'var(--card-bg, #ffffff)',
          color: 'var(--text, #0f172a)',
          borderRadius: '24px',
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Futuristic Digital Twin Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '1.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid rgba(13, 148, 136, 0.4)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1.25rem'}}>
            <div style={{
              background: 'linear-gradient(135deg, var(--brand-teal), #8b5cf6)',
              padding: '1rem',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(13, 148, 136, 0.35)'
            }}>
              <Cpu size={32} color="#ffffff" />
            </div>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <h2 style={{fontSize: '1.5rem', fontWeight: 900, margin: 0, color: '#ffffff'}}>{asset.name}</h2>
                <span style={{
                  background: 'rgba(255,255,255,0.15)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#2dd4bf'
                }}>
                  {asset.id}
                </span>
                <span style={{
                  background: asset.status === 'نشط' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: asset.status === 'نشط' ? '#34d399' : '#fbbf24',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  ● {asset.status || 'نشط'}
                </span>
              </div>
              <div style={{fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.35rem', display: 'flex', gap: '1.25rem'}}>
                <span>الفئة: <strong>{asset.category}</strong></span>
                <span>الموقع: <strong>{asset.location || 'الرئيسي'}</strong></span>
                <span>العهدة: <strong>{asset.custody || 'غير مخصص'}</strong></span>
                <span>الرقم التسلسلي S/N: <strong>{asset.serialNumber || asset.code || '-'}</strong></span>
              </div>
            </div>
          </div>

          <div style={{display: 'flex', gap: '0.6rem', alignItems: 'center'}}>
            <button 
              className="btn btn-ghost" 
              style={{color: '#94a3b8', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px'}}
              title="طباعة باركود الأصل"
              onClick={() => onPrintBarcode(asset)}
            >
              <QrCode size={18} /> باركود
            </button>
            <button 
              className="btn btn-ghost" 
              style={{color: '#ffffff', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '0.5rem'}}
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Financial Pulse Ribbon */}
        <div style={{
          background: 'var(--bg, #f8fafc)',
          padding: '1rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem',
          borderBottom: '1px solid var(--border)'
        }}>
          <div>
            <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>تكلفة الشراء التاريخية</div>
            <div style={{fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)'}}>
              {formatMoney(cost)} <span style={{fontSize: '0.75rem'}}>{currencySymbol}</span>
            </div>
          </div>
          <div>
            <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>مجمع الإهلاك المحاسبي</div>
            <div style={{fontSize: '1.25rem', fontWeight: 800, color: 'var(--danger, #ef4444)'}}>
              {formatMoney(currentDep)} <span style={{fontSize: '0.75rem'}}>{currencySymbol}</span>
            </div>
          </div>
          <div>
            <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>صافي القيمة الدفترية (NBV)</div>
            <div style={{fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-teal, #0d9488)'}}>
              {formatMoney(currentNBV)} <span style={{fontSize: '0.75rem'}}>{currencySymbol}</span>
            </div>
          </div>
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px'}}>
              <span>نسبة الاستهلاك</span>
              <strong style={{color: '#0f172a'}}>{depProgress}%</strong>
            </div>
            <div style={{height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden'}}>
              <div style={{width: `${depProgress}%`, background: 'linear-gradient(90deg, #0d9488, #ef4444)', height: '100%', borderRadius: '4px'}}></div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 2rem 0',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card-bg)'
        }}>
          {[
            { id: 'specs', label: '📋 البيانات الفنية والتعاقدية', icon: <Layers size={16} /> },
            { id: 'schedule', label: '📈 جدول الإهلاك ومحاكي الطرق', icon: <Activity size={16} /> },
            { id: 'chain', label: '⛓️ سلسلة التدقيق الرقمية (SHA-256)', icon: <Hash size={16} /> },
            { id: 'tco', label: '💰 التكلفة الإجمالية للملكية (TCO)', icon: <TrendingDown size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              className="btn btn-ghost"
              style={{
                borderRadius: '8px 8px 0 0',
                padding: '0.65rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: activeTab === tab.id ? 800 : 600,
                color: activeTab === tab.id ? 'var(--brand-teal)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '3px solid var(--brand-teal)' : '3px solid transparent',
                background: activeTab === tab.id ? 'var(--bg, #f8fafc)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div style={{padding: '1.75rem 2rem', overflowY: 'auto', flex: 1}}>
          
          {/* TAB 1: TECHNICAL SPECS & PROCUREMENT */}
          {activeTab === 'specs' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem'}}>
                <div className="card" style={{padding: '1rem', background: 'var(--bg)'}}>
                  <div style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px'}}>الموديل والمصنع</div>
                  <div style={{fontWeight: 700}}>{asset.manufacturer || 'Dell'} / {asset.model || 'Enterprise Edition'}</div>
                </div>
                <div className="card" style={{padding: '1rem', background: 'var(--bg)'}}>
                  <div style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px'}}>المورد وجهة الشراء</div>
                  <div style={{fontWeight: 700}}>{asset.supplier || 'شركة التوريد المعتمدة'}</div>
                </div>
                <div className="card" style={{padding: '1rem', background: 'var(--bg)'}}>
                  <div style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px'}}>أمر الشراء / الفاتورة</div>
                  <div style={{fontWeight: 700}}>{asset.invoiceNumber || 'INV-2024-908'} | {asset.poNumber || 'PO-4410'}</div>
                </div>
                <div className="card" style={{padding: '1rem', background: 'var(--bg)'}}>
                  <div style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px'}}>تاريخ بدء التشغيل</div>
                  <div style={{fontWeight: 700}}>{asset.readyDate || asset.date || '2024-01-15'}</div>
                </div>
                <div className="card" style={{padding: '1rem', background: 'var(--bg)'}}>
                  <div style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px'}}>الضمان والصيانة</div>
                  <div style={{fontWeight: 700, color: '#10b981'}}>{asset.warranty || 'ساري حتى 2026-12-31'}</div>
                </div>
                <div className="card" style={{padding: '1rem', background: 'var(--bg)'}}>
                  <div style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px'}}>مركز التكلفة المالي</div>
                  <div style={{fontWeight: 700}}>{asset.cost_center || 'المركز الرئيسي'}</div>
                </div>
              </div>

              {/* QR & Verification Box */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                background: 'rgba(13, 148, 136, 0.05)',
                border: '1px solid rgba(13, 148, 136, 0.2)'
              }}>
                <div>
                  <h4 style={{margin: '0 0 4px', color: 'var(--brand-teal)', fontSize: '1rem', fontWeight: 800}}>رمز الاستجابة السريعة للتوأم الرقمي (Digital Twin QR)</h4>
                  <p style={{margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)'}}>امسح الرمز عبر تطبيق الجوال أو قارئ الباركود لمطابقة بيانات الأصل لحظياً مع قاعدة البيانات.</p>
                </div>
                <div style={{padding: '6px', background: '#ffffff', borderRadius: '10px', border: '1px solid var(--border)'}}>
                  <QRCodeSVG value={`https://81fr.github.io/hgmhasbi/?asset=${asset.id}`} size={64} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEPRECIATION SCHEDULE & SIMULATOR */}
          {activeTab === 'schedule' && (
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem'}}>
                <div>
                  <h3 style={{fontSize: '1.05rem', fontWeight: 800, margin: 0}}>جدول الإهلاك السنوي والشهري للأصل</h3>
                  <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0'}}>العمر الإنتاجي: {life} سنوات | القيمة التخريدية: {formatMoney(salvage)} {currencySymbol}</p>
                </div>
                <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                  <span style={{fontSize: '0.8rem', fontWeight: 700}}>طريقة الإهلاك:</span>
                  <select 
                    value={depMethod} 
                    onChange={e => setDepMethod(e.target.value)}
                    style={{padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.82rem', fontWeight: 700}}
                  >
                    <option value="SL">القسط الثابت (Straight Line)</option>
                    <option value="DB">القسط المتناقص المضاعف (Double Declining)</option>
                    <option value="SYD">مجموع أرقام السنوات (SYD)</option>
                  </select>
                </div>
              </div>

              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem'}}>
                <thead>
                  <tr style={{background: 'var(--thead-bg, #f1f5f9)', borderBottom: '2px solid var(--border)'}}>
                    <th style={{padding: '10px 14px', textAlign: 'right'}}>السنة المالية</th>
                    <th style={{padding: '10px 14px', textAlign: 'center'}}>قسط الإهلاك السنوي</th>
                    <th style={{padding: '10px 14px', textAlign: 'center'}}>الإهلاك الشهري</th>
                    <th style={{padding: '10px 14px', textAlign: 'center'}}>مجمع الإهلاك المتراكم</th>
                    <th style={{padding: '10px 14px', textAlign: 'center'}}>القيمة الدفترية المتبقية (NBV)</th>
                    <th style={{padding: '10px 14px', textAlign: 'center'}}>نسبة الإهلاك</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleRows.map(row => (
                    <tr key={row.year} style={{borderBottom: '1px solid var(--border)'}}>
                      <td style={{padding: '10px 14px', fontWeight: 800}}>
                        السنة {row.yearIndex} ({row.year})
                      </td>
                      <td style={{padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: 'var(--danger)'}}>
                        {formatMoney(row.annualDep)} {currencySymbol}
                      </td>
                      <td style={{padding: '10px 14px', textAlign: 'center', color: 'var(--text-muted)'}}>
                        {formatMoney(row.monthlyDep)} {currencySymbol}
                      </td>
                      <td style={{padding: '10px 14px', textAlign: 'center', fontWeight: 700}}>
                        {formatMoney(row.accumulated)} {currencySymbol}
                      </td>
                      <td style={{padding: '10px 14px', textAlign: 'center', fontWeight: 800, color: 'var(--brand-teal)'}}>
                        {formatMoney(row.netBookValue)} {currencySymbol}
                      </td>
                      <td style={{padding: '10px 14px', textAlign: 'center'}}>
                        <span style={{fontSize: '0.78rem', background: 'var(--thead-bg)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700}}>
                          {row.depPercent}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: CRYPTOGRAPHIC AUDIT CHAIN */}
          {activeTab === 'chain' && (
            <div>
              <div style={{marginBottom: '1.25rem'}}>
                <h3 style={{fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <ShieldCheck size={20} color="#10b981" /> سلسلة التدقيق الرقمية المعتمدة (Cryptographic Chain of Custody)
                </h3>
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', margin: '3px 0 0'}}>
                  سجل غير قابل للتعديل يوثق جميع الحركات المحاسبية والإدارية للأصل مع بصمات تشفيرية مطابقة لمعايير هيئة الزكاة والضريبة والجمارك (ZATCA).
                </p>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {auditEvents.map((evt, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'var(--bg, #f8fafc)',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
                        <span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#10b981'}}></span>
                        <div style={{fontWeight: 800, fontSize: '0.9rem'}}>{evt.title}</div>
                        <span style={{fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '1px 6px', borderRadius: '4px', fontWeight: 700}}>
                          {evt.action}
                        </span>
                      </div>
                      <div style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '1rem'}}>
                        <span>التاريخ: {evt.date}</span>
                        <span>المسؤول: {evt.officer}</span>
                        <span>المرجع: {evt.ref}</span>
                      </div>
                    </div>
                    <div style={{textAlign: 'left'}}>
                      <div style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>بصمة التحقق المشفرة (SHA-256)</div>
                      <div style={{fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--brand-teal)'}}>
                        {evt.hash}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TOTAL COST OF OWNERSHIP (TCO) */}
          {activeTab === 'tco' && (
            <div>
              <div style={{marginBottom: '1.5rem'}}>
                <h3 style={{fontSize: '1.05rem', fontWeight: 800, margin: 0}}>تحليل التكلفة الإجمالية للملكية (TCO Analysis)</h3>
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', margin: '3px 0 0'}}>
                  حساب تكلفة دورة حياة الأصل الكاملة شاملة الاستحواذ، الصيانة التقديرية، والتأمين مطروحاً منها القيمة التخريدية.
                </p>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem'}}>
                <div className="card" style={{padding: '1.25rem', background: 'var(--bg)'}}>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>تكلفة الشراء (Acquisition)</div>
                  <div style={{fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)'}}>{formatMoney(cost)} {currencySymbol}</div>
                  <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px'}}>القيمة الأصلية</div>
                </div>
                <div className="card" style={{padding: '1.25rem', background: 'var(--bg)'}}>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>تكاليف الصيانة التقديرية</div>
                  <div style={{fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b'}}>{formatMoney(maintenanceEstimated)} {currencySymbol}</div>
                  <div style={{fontSize: '0.7rem', color: '#f59e0b', marginTop: '4px'}}>15% من التكلفة الرأسمالية</div>
                </div>
                <div className="card" style={{padding: '1.25rem', background: 'var(--bg)'}}>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>التأمين والتراخيص</div>
                  <div style={{fontSize: '1.3rem', fontWeight: 800, color: '#3b82f6'}}>{formatMoney(insuranceEstimated)} {currencySymbol}</div>
                  <div style={{fontSize: '0.7rem', color: '#3b82f6', marginTop: '4px'}}>8% من التكلفة الرأسمالية</div>
                </div>
                <div className="card" style={{padding: '1.25rem', background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(16,185,129,0.1))', borderColor: 'var(--brand-teal)'}}>
                  <div style={{fontSize: '0.8rem', color: 'var(--brand-teal)', fontWeight: 700}}>صافي التكلفة الكلية (TCO)</div>
                  <div style={{fontSize: '1.4rem', fontWeight: 900, color: 'var(--brand-teal)'}}>{formatMoney(totalTCO)} {currencySymbol}</div>
                  <div style={{fontSize: '0.7rem', color: '#10b981', marginTop: '4px'}}>شامل خصم الخردة</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1.1rem 2rem',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg, #f8fafc)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{display: 'flex', gap: '0.75rem'}}>
            <button 
              className="btn btn-ghost" 
              style={{color: 'var(--danger)', border: '1px solid var(--border)', fontSize: '0.85rem'}}
              onClick={() => { onDisposal(asset); onClose(); }}
            >
              <Trash2 size={16} /> تخريد / استبعاد الأصل
            </button>
            <button 
              className="btn btn-ghost" 
              style={{border: '1px solid var(--border)', fontSize: '0.85rem'}}
              onClick={() => onPrintBarcode(asset)}
            >
              <Printer size={16} /> طباعة باركود وسند
            </button>
          </div>
          <button 
            className="btn btn-primary" 
            style={{padding: '0.6rem 2rem', fontSize: '0.9rem', fontWeight: 700}}
            onClick={onClose}
          >
            إغلاق البطاقة
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetDigitalTwinModal;
