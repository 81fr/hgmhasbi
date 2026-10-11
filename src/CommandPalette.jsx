import React, { useState, useEffect, useRef } from 'react';
import { Search, Box, Warehouse, FileText, User, ArrowRight, X, Sparkles, CornerDownLeft, ShieldCheck, Tag } from 'lucide-react';

const CommandPalette = ({
  isOpen,
  onClose,
  assets = [],
  warehouseItems = [],
  journals = [],
  onSelectAsset,
  onSelectWarehouse,
  onSelectJournal,
  onSelectView
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search Fixed Assets
  const matchingAssets = q
    ? assets.filter(a => 
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.id && a.id.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        (a.serialNumber && a.serialNumber.toLowerCase().includes(q)) ||
        (a.custody && a.custody.toLowerCase().includes(q))
      ).slice(0, 5)
    : [];

  // Search Warehouse
  const matchingWarehouse = q
    ? warehouseItems.filter(w =>
        (w.name && w.name.toLowerCase().includes(q)) ||
        (w.sku && w.sku.toLowerCase().includes(q)) ||
        (w.category && w.category.toLowerCase().includes(q)) ||
        (w.location && w.location.toLowerCase().includes(q))
      ).slice(0, 5)
    : [];

  // Search Journals
  const matchingJournals = q
    ? journals.filter(j =>
        (j.id && String(j.id).toLowerCase().includes(q)) ||
        (j.desc && j.desc.toLowerCase().includes(q)) ||
        (j.reference && j.reference.toLowerCase().includes(q))
      ).slice(0, 4)
    : [];

  // Quick Navigation shortcuts
  const navigationShortcuts = [
    { title: 'لوحة القيادة الاستراتيجية', view: 'dashboard', icon: <Sparkles size={16} color="#8b5cf6" /> },
    { title: 'سجل الأصول الثابتة', view: 'register', icon: <Box size={16} color="#0d9488" /> },
    { title: 'إدارة المستودعات والمخزون', view: 'warehouse', icon: <Warehouse size={16} color="#3b82f6" /> },
    { title: 'دفتر اليومية والقيود المزدوجة', view: 'journal', icon: <FileText size={16} color="#10b981" /> },
    { title: 'إدارة العهد والموظفين', view: 'custody', icon: <User size={16} color="#f59e0b" /> },
    { title: 'حاسبة الإهلاك المالي', view: 'depreciation', icon: <Tag size={16} color="#6366f1" /> },
  ].filter(s => !q || s.title.toLowerCase().includes(q));

  const totalResults = matchingAssets.length + matchingWarehouse.length + matchingJournals.length;

  return (
    <div 
      className="command-palette-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 11000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        direction: 'rtl'
      }}
      onClick={onClose}
    >
      <div 
        className="card command-palette-modal"
        style={{
          width: '680px',
          maxWidth: '92vw',
          background: 'var(--card-bg, #ffffff)',
          color: 'var(--text, #0f172a)',
          borderRadius: '18px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border, #e2e8f0)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1.1rem 1.4rem',
          borderBottom: '1px solid var(--border, #e2e8f0)',
          background: 'var(--bg, #f8fafc)'
        }}>
          <Search size={22} color="var(--brand-teal, #0d9488)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث فورياً في الأصول، المستودعات، العهد، والقيود المحاسبية..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text, #0f172a)',
              fontFamily: 'inherit'
            }}
            onKeyDown={e => {
              if (e.key === 'Escape') onClose();
            }}
          />
          {query && (
            <button 
              className="btn btn-ghost" 
              onClick={() => setQuery('')}
              style={{padding: '0.3rem', borderRadius: '50%'}}
            >
              <X size={16} />
            </button>
          )}
          <span style={{
            fontSize: '0.7rem',
            background: 'var(--border, #e2e8f0)',
            padding: '2px 8px',
            borderRadius: '6px',
            color: 'var(--text-muted, #64748b)',
            fontWeight: 700
          }}>
            ESC للإغلاق
          </span>
        </div>

        {/* Results Body */}
        <div style={{maxHeight: '440px', overflowY: 'auto', padding: '1rem 1.25rem'}}>
          
          {/* Default Navigation shortcuts if no search query */}
          {!q && (
            <div>
              <div style={{fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted, #64748b)', marginBottom: '0.6rem', paddingRight: '0.4rem'}}>
                الوصول السريع إلى الأقسام
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem'}}>
                {navigationShortcuts.map((nav, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      background: 'var(--bg, #f8fafc)',
                      cursor: 'pointer',
                      border: '1px solid var(--border, #e2e8f0)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-teal, #0d9488)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border, #e2e8f0)'}
                    onClick={() => onSelectView(nav.view)}
                  >
                    <div style={{background: '#fff', padding: '6px', borderRadius: '8px', border: '1px solid var(--border)'}}>
                      {nav.icon}
                    </div>
                    <span style={{fontSize: '0.85rem', fontWeight: 700}}>{nav.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results for query */}
          {q && totalResults === 0 && (
            <div style={{textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted, #64748b)'}}>
              <Search size={36} style={{opacity: 0.3, marginBottom: '0.75rem'}} />
              <div style={{fontSize: '0.95rem', fontWeight: 700}}>لم يتم العثور على نتائج تطابق "{query}"</div>
              <div style={{fontSize: '0.8rem', marginTop: '0.25rem'}}>جرب البحث برقم الأصل، اسم الموظف، أو كود الصنف SKU.</div>
            </div>
          )}

          {/* 1. ASSETS RESULTS */}
          {matchingAssets.length > 0 && (
            <div style={{marginBottom: '1.25rem'}}>
              <div style={{fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-teal, #0d9488)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                <Box size={14} /> الأصول الثابتة ({matchingAssets.length})
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
                {matchingAssets.map(asset => (
                  <div
                    key={asset.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '8px',
                      background: 'var(--bg, #f8fafc)',
                      border: '1px solid var(--border, #e2e8f0)',
                      cursor: 'pointer'
                    }}
                    onClick={() => onSelectAsset(asset)}
                  >
                    <div>
                      <div style={{fontWeight: 700, fontSize: '0.88rem'}}>{asset.name}</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', display: 'flex', gap: '0.75rem', marginTop: '2px'}}>
                        <span style={{fontFamily: 'monospace', fontWeight: 600}}>{asset.id}</span>
                        <span>فئة: {asset.category}</span>
                        {asset.custody && <span>العهدة: {asset.custody}</span>}
                      </div>
                    </div>
                    <div style={{textAlign: 'left'}}>
                      <div style={{fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-teal, #0d9488)'}}>
                        {Number(asset.cost || 0).toLocaleString()} ر.س
                      </div>
                      <span style={{fontSize: '0.7rem', color: '#10b981', fontWeight: 700}}>عرض البطاقة ↵</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. WAREHOUSE RESULTS */}
          {matchingWarehouse.length > 0 && (
            <div style={{marginBottom: '1.25rem'}}>
              <div style={{fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                <Warehouse size={14} /> المستودعات والمخزون ({matchingWarehouse.length})
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
                {matchingWarehouse.map(item => (
                  <div
                    key={item.id || item.sku}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '8px',
                      background: 'var(--bg, #f8fafc)',
                      border: '1px solid var(--border, #e2e8f0)',
                      cursor: 'pointer'
                    }}
                    onClick={() => onSelectWarehouse(item)}
                  >
                    <div>
                      <div style={{fontWeight: 700, fontSize: '0.88rem'}}>{item.name}</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', display: 'flex', gap: '0.75rem', marginTop: '2px'}}>
                        <span style={{fontFamily: 'monospace', fontWeight: 600}}>SKU: {item.sku}</span>
                        <span>الموقع: {item.location || 'الرئيسي'}</span>
                      </div>
                    </div>
                    <div style={{textAlign: 'left'}}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: (Number(item.qty) || 0) <= (Number(item.minQty) || 0) ? '#fee2e2' : '#dcfce7',
                        color: (Number(item.qty) || 0) <= (Number(item.minQty) || 0) ? '#dc2626' : '#15803d'
                      }}>
                        الكمية: {item.qty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. JOURNALS RESULTS */}
          {matchingJournals.length > 0 && (
            <div style={{marginBottom: '1rem'}}>
              <div style={{fontSize: '0.75rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                <FileText size={14} /> القيود اليومية المحاسبية ({matchingJournals.length})
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
                {matchingJournals.map(j => (
                  <div
                    key={j.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '8px',
                      background: 'var(--bg, #f8fafc)',
                      border: '1px solid var(--border, #e2e8f0)',
                      cursor: 'pointer'
                    }}
                    onClick={() => onSelectJournal(j)}
                  >
                    <div>
                      <div style={{fontWeight: 700, fontSize: '0.88rem'}}>{j.desc || 'قيد محاسبي'}</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', display: 'flex', gap: '0.75rem', marginTop: '2px'}}>
                        <span style={{fontFamily: 'monospace'}}>JV-{j.id}</span>
                        <span>التاريخ: {j.date}</span>
                      </div>
                    </div>
                    <div style={{textAlign: 'left'}}>
                      <span style={{fontSize: '0.85rem', fontWeight: 800, color: '#0f172a'}}>
                        {Number(j.debit || j.total || 0).toLocaleString()} ر.س
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Hints */}
        <div style={{
          padding: '0.65rem 1.4rem',
          borderTop: '1px solid var(--border, #e2e8f0)',
          background: 'var(--bg, #f8fafc)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted, #64748b)'
        }}>
          <div style={{display: 'flex', gap: '1rem'}}>
            <span>💡 استخدم الأسهم للتنقل</span>
            <span>↵ Enter للاختيار</span>
          </div>
          <div>نظام الرقابة المالية والأصول الذكي</div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
