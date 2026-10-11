import React, { useState } from 'react';
import { 
  Warehouse, Box, MapPin, AlertTriangle, CheckCircle, PackagePlus, 
  ArrowRightLeft, Eye, RefreshCw, Layers, ShieldCheck, Tag, Info, Calculator
} from 'lucide-react';

const WarehouseRackMap = ({ warehouseItems = [], onSelectRackItem, onRequestIssue }) => {
  const [selectedBin, setSelectedBin] = useState('A-01-03');
  const [selectedAisle, setSelectedAisle] = useState('A'); // 'A' | 'B' | 'C' | 'G' | 'D'

  // Pre-defined warehouse aisles and bins configuration
  const aislesConfig = {
    A: {
      name: 'الممر A — الأصول والأنظمة التقنية',
      description: 'أجهزة الخوادم، اللابتوبات، الطابعات، ومعدات الشبكات الحساسة',
      color: '#3b82f6',
      bins: ['A-01-01', 'A-01-02', 'A-01-03', 'A-02-01', 'A-02-05', 'A-03-01', 'A-03-02']
    },
    B: {
      name: 'الممر B — الأثاث المكتبي والتجهيزات',
      description: 'المكاتب التنفيذية، الكراسي المريحة، وطاولات الاجتماعات',
      color: '#8b5cf6',
      bins: ['B-01-01', 'B-01-02', 'B-02-01', 'B-02-02', 'B-03-01', 'B-03-02']
    },
    C: {
      name: 'الممر C — شاشات العرض والوسائط',
      description: 'شاشات ذكية تفاعلية، أجهزة بروجكتور، وسماعات قاعات المؤتمرات',
      color: '#0d9488',
      bins: ['C-01-01', 'C-01-02', 'C-02-01']
    },
    G: {
      name: 'الممر G — المركبات والرافعات الشوكية',
      description: 'رافعات كاتربيلر، سيارات نقل وتوزيع، ومعدات المستودع اللوجستية',
      color: '#f59e0b',
      bins: ['G-01-01', 'G-02-01']
    },
    D: {
      name: 'الممر D — التكييف والتبريد والمرافق',
      description: 'وحدات تكييف مركزي، مكيفات سبليت، ومولدات طوارئ',
      color: '#ef4444',
      bins: ['D-01-01', 'D-01-04']
    }
  };

  // Find items inside a bin
  const getBinItems = (binCode) => {
    return warehouseItems.filter(item => (item.location || '').trim().toUpperCase() === binCode.toUpperCase());
  };

  // Calculate bin status
  const getBinStatus = (binCode) => {
    const items = getBinItems(binCode);
    if (items.length === 0) return { status: 'empty', label: 'خالي', color: '#94a3b8' };
    const hasZero = items.some(i => (Number(i.qty) || 0) === 0);
    if (hasZero) return { status: 'out', label: 'نفاد مخزون', color: '#ef4444' };
    const hasLow = items.some(i => (Number(i.qty) || 0) <= (Number(i.minQty) || 0));
    if (hasLow) return { status: 'low', label: 'تحت حد الطلب', color: '#f59e0b' };
    return { status: 'ok', label: 'طبيعي وممتلئ', color: '#10b981' };
  };

  const currentAisle = aislesConfig[selectedAisle];
  const selectedBinItems = getBinItems(selectedBin);
  const selectedBinStatus = getBinStatus(selectedBin);

  // EOQ Calculation (Economic Order Quantity)
  // Annual Demand D = 120 units, Setup Cost S = 50 SAR, Holding Cost H = 15 SAR
  const annualDemand = 120;
  const orderCost = 50;
  const holdingCost = 15;
  const eoqUnits = Math.round(Math.sqrt((2 * annualDemand * orderCost) / holdingCost));

  return (
    <div className="view-anim" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      
      {/* Header & Aisle Selector */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '18px',
        padding: '1.5rem 1.75rem',
        boxShadow: '0 4px 15px -3px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{fontSize: '1.35rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
            <Warehouse size={26} color="var(--brand-teal)" />
            الخريطة التفاعلية لممرات ورفوف المستودع (Smart Visual Racks WMS 4.0)
          </h2>
          <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0'}}>
            تتبع مواقع التخزين المكانية (Aisles & Bins)، مراقبة الإشغال، وحساب كمية الطلب الاقتصادية (EOQ).
          </p>
        </div>

        {/* Legend Pills */}
        <div style={{display: 'flex', gap: '0.75rem', fontSize: '0.78rem', fontWeight: 700}}>
          <span style={{display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981'}}>
            <span style={{width: '10px', height: '10px', borderRadius: '50%', background: '#10b981'}}></span> متاح وممتلئ
          </span>
          <span style={{display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b'}}>
            <span style={{width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b'}}></span> تحت حد الطلب
          </span>
          <span style={{display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444'}}>
            <span style={{width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444'}}></span> نفاد الصنف
          </span>
          <span style={{display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8'}}>
            <span style={{width: '10px', height: '10px', borderRadius: '50%', background: '#94a3b8'}}></span> رف شاغر
          </span>
        </div>
      </div>

      {/* Aisle Selection Buttons */}
      <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
        {Object.entries(aislesConfig).map(([key, a]) => (
          <button
            key={key}
            type="button"
            className={`btn ${selectedAisle === key ? 'btn-primary' : 'btn-ghost'}`}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: selectedAisle === key ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: selectedAisle === key ? 'none' : '1px solid var(--border)'
            }}
            onClick={() => {
              setSelectedAisle(key);
              setSelectedBin(a.bins[0]);
            }}
          >
            <span style={{width: '10px', height: '10px', borderRadius: '50%', background: a.color}}></span>
            {a.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Visual Racks on Left, Selected Bin Inspector on Right */}
      <div style={{display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '1.5rem'}}>
        
        {/* Racks Layout Canvas */}
        <div className="card" style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem'}}>
            <div>
              <h3 style={{fontSize: '1.05rem', fontWeight: 800, margin: 0, color: currentAisle.color}}>{currentAisle.name}</h3>
              <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{currentAisle.description}</div>
            </div>
            <span style={{fontSize: '0.75rem', fontWeight: 800, background: 'var(--thead-bg)', padding: '3px 10px', borderRadius: '8px'}}>
              {currentAisle.bins.length} رفوف تخزين
            </span>
          </div>

          {/* Interactive Bins Rack */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '0.5rem 0'}}>
            {currentAisle.bins.map(bin => {
              const status = getBinStatus(bin);
              const items = getBinItems(bin);
              const isSelected = selectedBin === bin;

              return (
                <div
                  key={bin}
                  style={{
                    background: isSelected ? 'var(--card-bg)' : 'var(--bg, #f8fafc)',
                    border: isSelected ? `2.5px solid ${status.color}` : '1.5px solid var(--border)',
                    boxShadow: isSelected ? `0 8px 25px -4px ${status.color}35` : 'none',
                    borderRadius: '14px',
                    padding: '1.1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onClick={() => setSelectedBin(bin)}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                    <div style={{fontFamily: 'monospace', fontWeight: 900, fontSize: '0.95rem', color: isSelected ? status.color : 'var(--text)'}}>
                      {bin}
                    </div>
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: status.color,
                      display: 'inline-block',
                      boxShadow: `0 0 6px ${status.color}`
                    }}></span>
                  </div>

                  <div style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px'}}>
                    الأصناف: <strong>{items.length}</strong>
                  </div>

                  <div style={{fontSize: '0.75rem', fontWeight: 700, color: status.color}}>
                    {status.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* EOQ AI Reorder Recommendation Strip */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(13,148,136,0.06), rgba(59,130,246,0.06))',
            border: '1px solid rgba(13,148,136,0.2)',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <Calculator size={22} color="var(--brand-teal)" />
              <div>
                <div style={{fontWeight: 800, fontSize: '0.85rem'}}>محرك حساب كمية الطلب الاقتصادية (EOQ Wilson)</div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>الدفعة الشرائية الأمثل لتقليل تكاليف التخزين والتوريد: <strong>{eoqUnits} وحدة / دفعة</strong></div>
              </div>
            </div>
            <span style={{fontSize: '0.75rem', color: '#0d9488', fontWeight: 800, background: '#fff', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(13,148,136,0.2)'}}>
              دقة التنبؤ: 98%
            </span>
          </div>
        </div>

        {/* Selected Bin Detailed Inspector */}
        <div className="card" style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          <div style={{borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>موقع الرف المحدد:</div>
              <h3 style={{fontSize: '1.25rem', fontWeight: 900, margin: 0, fontFamily: 'monospace', color: selectedBinStatus.color}}>
                {selectedBin}
              </h3>
            </div>
            <span style={{
              background: `${selectedBinStatus.color}15`,
              color: selectedBinStatus.color,
              padding: '4px 12px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 800
            }}>
              {selectedBinStatus.label}
            </span>
          </div>

          {/* Stored Items in Bin */}
          <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            {selectedBinItems.length === 0 ? (
              <div style={{textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)'}}>
                <Box size={40} style={{opacity: 0.3, marginBottom: '0.5rem'}} />
                <div style={{fontWeight: 700, fontSize: '0.9rem'}}>هذا الرف شاغر حالياً</div>
                <div style={{fontSize: '0.78rem', marginTop: '2px'}}>يمكن تسكين أصناف جديدة واردة في هذا الموقع.</div>
              </div>
            ) : (
              selectedBinItems.map(item => (
                <div 
                  key={item.id || item.sku}
                  style={{
                    background: 'var(--bg, #f8fafc)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{fontWeight: 800, fontSize: '0.92rem'}}>{item.name}</div>
                    <span style={{fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)', background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)'}}>
                      {item.sku}
                    </span>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.8rem'}}>
                    <div>الكمية المتوفرة: <strong style={{color: (Number(item.qty)||0) <= (Number(item.minQty)||0) ? '#ef4444' : '#10b981'}}>{item.qty} وحدة</strong></div>
                    <div>حد إعادة الطلب: <strong>{item.minQty || 1} وحدة</strong></div>
                    <div>فئة الصنف: <span>{item.category}</span></div>
                    <div>حالة الصنف: <span>{item.status || 'متاح'}</span></div>
                  </div>

                  <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem'}}>
                    <button
                      className="btn btn-primary"
                      style={{flex: 1, padding: '0.45rem', fontSize: '0.78rem', borderRadius: '8px'}}
                      onClick={() => onRequestIssue(item)}
                    >
                      <ArrowRightLeft size={13} /> إذن صرف مباشر
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{border: '1px solid var(--border)', padding: '0.45rem 0.75rem', fontSize: '0.78rem', borderRadius: '8px'}}
                      onClick={() => onSelectRackItem(item)}
                    >
                      <Eye size={13} /> عرض الصنف
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WarehouseRackMap;
