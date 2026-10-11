import React, { useState, useMemo } from 'react';
import { Network, Users, Box, ChevronDown, ChevronRight, Search, Printer, Eye, X, ShieldCheck, MapPin, Building2 } from 'lucide-react';
import { sfx } from './audioEffects';

export default function CustodyOrgTreeModal({
  isOpen,
  onClose,
  assets = [],
  employees = [],
  onSelectAsset,
  onPrintClearance
}) {
  const [search, setSearch] = useState('');
  const [expandedDepts, setExpandedDepts] = useState({ 'الكل': true });
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  // Group assets by Custody (Employee) and Department
  const orgTree = useMemo(() => {
    const tree = {};

    assets.forEach(asset => {
      const dept = asset.department || 'إدارة عامة غير مصنفة';
      const cust = asset.custody || 'عهدة مستودعية عامة';

      if (!tree[dept]) {
        tree[dept] = {
          name: dept,
          employees: {},
          totalValue: 0,
          totalCount: 0
        };
      }

      if (!tree[dept].employees[cust]) {
        tree[dept].employees[cust] = {
          name: cust,
          assets: [],
          totalValue: 0
        };
      }

      tree[dept].employees[cust].assets.push(asset);
      tree[dept].employees[cust].totalValue += (Number(asset.cost) || 0);
      tree[dept].totalValue += (Number(asset.cost) || 0);
      tree[dept].totalCount += 1;
    });

    return tree;
  }, [assets]);

  const toggleDept = (dept) => {
    sfx.playClick();
    setExpandedDepts(prev => ({
      ...prev,
      [dept]: !prev[dept]
    }));
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      padding: '1rem',
      fontFamily: '"Tajawal", sans-serif',
      direction: 'rtl'
    }}>
      <div style={{
        width: '920px',
        maxWidth: '96vw',
        maxHeight: '90vh',
        background: 'var(--card-bg, #0f172a)',
        borderRadius: '24px',
        border: '1px solid rgba(0, 165, 155, 0.35)',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7), 0 0 35px rgba(0,165,155,0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 2rem',
          background: 'linear-gradient(90deg, rgba(0, 165, 155, 0.15), rgba(140, 194, 64, 0.1))',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--brand-teal), var(--brand-green))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(0, 165, 155, 0.5)'
            }}>
              <Network size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>
                شجرة ارتباط العهد والهيكل التنظيمي (Interactive Custody Org Tree)
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                تتبع هرمي مباشر لتوزيع العهد والأصول الثابتة على الإدارات والموظفين مع التحقق والطباعة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          padding: '1rem 2rem',
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="ابحث باسم الموظف أو الإدارة أو اسم الأصل أو رمزه..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 2.4rem 0.65rem 0.9rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--card-bg)',
                color: 'var(--text)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            إجمالي الأصول المقيدة: <strong>{assets.length}</strong>
          </div>
        </div>

        {/* Tree Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {Object.entries(orgTree).map(([deptName, deptData]) => {
            const isDeptExpanded = expandedDepts[deptName] !== false; // default true
            
            // Check if matches search
            const q = search.toLowerCase();
            const matchingEmployees = Object.entries(deptData.employees).filter(([empName, empData]) => {
              if (!search) return true;
              return empName.toLowerCase().includes(q) ||
                deptName.toLowerCase().includes(q) ||
                empData.assets.some(a => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || (a.code && a.code.toLowerCase().includes(q)));
            });

            if (search && matchingEmployees.length === 0) return null;

            return (
              <div
                key={deptName}
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                {/* Department Node Header */}
                <div
                  onClick={() => toggleDept(deptName)}
                  style={{
                    padding: '1rem 1.5rem',
                    background: 'var(--card-bg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    borderBottom: isDeptExpanded ? '1px solid var(--border)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isDeptExpanded ? <ChevronDown size={18} color="var(--brand-teal)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
                    <Building2 size={20} color="var(--brand-teal)" />
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{deptName}</span>
                    <span style={{
                      background: 'rgba(0, 165, 155, 0.1)',
                      color: 'var(--brand-teal)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      {deptData.totalCount} أصل
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {deptData.totalValue.toLocaleString()} ر.س
                  </div>
                </div>

                {/* Employees under Department */}
                {isDeptExpanded && (
                  <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {matchingEmployees.map(([empName, empData]) => (
                      <div
                        key={empName}
                        style={{
                          background: 'var(--card-bg)',
                          borderRadius: '12px',
                          border: '1px solid var(--border)',
                          padding: '1rem 1.25rem'
                        }}
                      >
                        {/* Employee Bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, var(--brand-teal), var(--brand-green))',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              {empName.slice(0, 2)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text)' }}>
                                {empName}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {empData.assets.length} عهدة مسجلة • إجمالي القيمة: {empData.totalValue.toLocaleString()} ر.س
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              sfx.playClick();
                              if (onPrintClearance) onPrintClearance({ name: empName, assets: empData.assets, totalValue: empData.totalValue });
                            }}
                            className="btn btn-ghost"
                            style={{
                              border: '1px solid var(--border)',
                              padding: '0.35rem 0.8rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            <Printer size={13} /> طباعة إخلاء طرف
                          </button>
                        </div>

                        {/* Assets Chips */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.6rem' }}>
                          {empData.assets.map(asset => (
                            <div
                              key={asset.id}
                              onClick={() => {
                                sfx.playClick();
                                if (onSelectAsset) {
                                  onSelectAsset(asset);
                                  onClose();
                                }
                              }}
                              style={{
                                background: 'var(--bg)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                padding: '0.6rem 0.85rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--brand-teal)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {asset.name}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                  {asset.id} • {asset.category}
                                </div>
                              </div>
                              <Eye size={14} color="var(--brand-teal)" style={{ flexShrink: 0, marginRight: '0.5rem' }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
