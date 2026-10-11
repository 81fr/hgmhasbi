import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, X, Tag, FileText, CheckCircle, MapPin, User, Box, ShieldCheck } from 'lucide-react';

const BarcodePrintModal = ({ item, type = 'asset', onClose, employee }) => {
  const [printMode, setPrintMode] = useState('thermal'); // 'thermal' (single label), 'a4_sheet' (grid labels), 'receipt' (custody handover form)
  const barcodeSvgRef = useRef(null);

  if (!item) return null;

  // Extract clean fields
  const barcodeValue = String(item.id || item.code || item.sku || item.asset_no || 'AST-0001');
  const itemName = item.name || 'أصل غير مسمى';
  const itemCategory = item.category || item.category_id || 'عام';
  const custodianName = item.custody || item.employee_id || employee?.full_name || employee?.name || 'غير محدد';
  const location = item.location || item.location_id || item.bin || item.bin_location || 'المركز الرئيسي';
  const serialNo = item.serialNumber || item.serial_number || item.code || '-';
  const dateStr = item.date || item.purchase_date || new Date().toISOString().split('T')[0];

  // Render Code 128 barcode into SVG
  useEffect(() => {
    if (barcodeSvgRef.current && barcodeValue) {
      try {
        JsBarcode(barcodeSvgRef.current, barcodeValue, {
          format: 'CODE128',
          lineColor: '#000000',
          width: 2,
          height: 48,
          displayValue: true,
          fontSize: 13,
          font: 'monospace',
          textMargin: 3,
          margin: 6
        });
      } catch (e) {
        console.warn('Barcode generation warning:', e);
      }
    }
  }, [barcodeValue, printMode]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="barcode-modal-backdrop" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(5px)',
      padding: '1rem'
    }} onClick={onClose}>
      
      {/* Modal Container */}
      <div 
        className="card barcode-modal-container" 
        style={{
          width: '920px',
          maxWidth: '96vw',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'var(--card-bg, #ffffff)',
          color: 'var(--text, #0f172a)',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border, #e2e8f0)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Screen-Only Header */}
        <div className="no-print" style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--border, #e2e8f0)', paddingBottom:'1.25rem', marginBottom:'1.5rem'}}>
          <div>
            <h2 style={{fontSize:'1.35rem', fontWeight:800, margin:0, display:'flex', alignItems:'center', gap:'0.6rem', color:'var(--brand-teal, #0d9488)'}}>
              <Tag size={24} /> نظام طباعة ملصقات الباركود والعهد الاحترافي
            </h2>
            <p style={{fontSize:'0.85rem', color:'var(--text-muted, #64748b)', margin:'0.25rem 0 0'}}>
              توليد وطباعة باركود Code 128 و QR للصق المباشر على الأجهزة والعهد والمستودعات وفق المواصفات القياسية.
            </p>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{padding:'0.5rem', borderRadius:'8px'}}><X size={20} /></button>
        </div>

        {/* Mode Selector Tabs (Screen-Only) */}
        <div className="no-print" style={{display:'flex', gap:'0.75rem', marginBottom:'1.5rem', background:'var(--bg, #f8fafc)', padding:'0.5rem', borderRadius:'12px', border:'1px solid var(--border, #e2e8f0)'}}>
          <button 
            type="button"
            className={`btn ${printMode === 'thermal' ? 'btn-primary' : 'btn-ghost'}`}
            style={{flex:1, padding:'0.6rem 1rem', fontSize:'0.85rem', fontWeight: printMode === 'thermal' ? 700 : 500}}
            onClick={() => setPrintMode('thermal')}
          >
            🏷️ ملصق حراري للعهدة (Thermal Label 70x45mm)
          </button>
          
          <button 
            type="button"
            className={`btn ${printMode === 'a4_sheet' ? 'btn-primary' : 'btn-ghost'}`}
            style={{flex:1, padding:'0.6rem 1rem', fontSize:'0.85rem', fontWeight: printMode === 'a4_sheet' ? 700 : 500}}
            onClick={() => setPrintMode('a4_sheet')}
          >
            📄 صفحة ملصقات مجمعة (A4 Multi-Tags)
          </button>

          {type === 'custody' && (
            <button 
              type="button"
              className={`btn ${printMode === 'receipt' ? 'btn-primary' : 'btn-ghost'}`}
              style={{flex:1, padding:'0.6rem 1rem', fontSize:'0.85rem', fontWeight: printMode === 'receipt' ? 700 : 500}}
              onClick={() => setPrintMode('receipt')}
            >
              📋 نموذج تسليم عهدة رسمي للتوقيع
            </button>
          )}
        </div>

        {/* Print Preview Area */}
        <div className="printable-content" style={{background:'#f1f5f9', padding:'2rem', borderRadius:'12px', border:'2px dashed #cbd5e1', display:'flex', justifyContent:'center', alignItems:'center', minHeight:'320px'}}>
          
          {/* MODE 1: THERMAL LABEL (70x45mm) */}
          {printMode === 'thermal' && (
            <div id="thermal-label-print" style={{
              width: '380px',
              background: '#ffffff',
              color: '#000000',
              padding: '16px 20px',
              borderRadius: '8px',
              border: '2px solid #000000',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              direction: 'rtl'
            }}>
              {/* Header */}
              <div style={{borderBottom:'1.5px solid #000000', paddingBottom:'6px', marginBottom:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:900, fontSize:'13px', letterSpacing:'0.5px'}}>المملكة العربية السعودية</div>
                  <div style={{fontSize:'10px', color:'#333333'}}>إدارة الأصول الثابتة والعهد</div>
                </div>
                <div style={{fontWeight:900, fontSize:'14px', background:'#000000', color:'#ffffff', padding:'2px 8px', borderRadius:'4px'}}>
                  FAR TAG
                </div>
              </div>

              {/* Item Details */}
              <div style={{marginBottom:'8px'}}>
                <div style={{fontWeight:800, fontSize:'15px', color:'#000000', marginBottom:'3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{itemName}</div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px', fontSize:'11px', color:'#222222'}}>
                  <div><strong>المستلم / العهدة:</strong> {custodianName}</div>
                  <div><strong>المكان / الموقع:</strong> {location}</div>
                  <div><strong>الفئة:</strong> {itemCategory}</div>
                  <div><strong>الرقم التسلسلي:</strong> {serialNo}</div>
                </div>
              </div>

              {/* Barcode and QR Section */}
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', background:'#ffffff', padding:'6px 0', borderTop:'1px dashed #666666'}}>
                <div style={{textAlign:'center', flex:1}}>
                  <svg ref={barcodeSvgRef} style={{maxWidth:'100%', height:'52px'}} />
                </div>
                <div style={{border:'1px solid #000000', padding:'4px', borderRadius:'4px', background:'#ffffff'}}>
                  <QRCodeSVG 
                    value={JSON.stringify({ tag: barcodeValue, name: itemName, cust: custodianName, loc: location, date: dateStr })} 
                    size={64}
                    level="M"
                  />
                </div>
              </div>

              {/* Footer */}
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'9px', color:'#555555', marginTop:'4px', borderTop:'1px solid #cccccc', paddingTop:'4px'}}>
                <span>التاريخ: {dateStr}</span>
                <span style={{fontWeight:700}}>لا تنزع هذا الملصق تحت طائلة المسؤولية</span>
              </div>
            </div>
          )}

          {/* MODE 2: MULTI-TAGS A4 PREVIEW */}
          {printMode === 'a4_sheet' && (
            <div id="a4-sheet-print" style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px',
              background: '#ffffff',
              padding: '16px',
              borderRadius: '8px'
            }}>
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} style={{
                  border: '1.5px solid #000000',
                  padding: '10px',
                  borderRadius: '6px',
                  background: '#ffffff',
                  color: '#000000',
                  fontSize: '11px',
                  textAlign: 'right'
                }}>
                  <div style={{display:'flex', justifyContent:'space-between', fontWeight:800, borderBottom:'1px solid #000', paddingBottom:'3px', marginBottom:'4px'}}>
                    <span>بطاقة عهدة رسمية</span>
                    <span style={{fontFamily:'monospace'}}>{barcodeValue}</span>
                  </div>
                  <div style={{fontWeight:700, fontSize:'12px'}}>{itemName}</div>
                  <div style={{fontSize:'10px', color:'#333'}}>العهدة: {custodianName} | {location}</div>
                  <div style={{display:'flex', justifyContent:'center', margin:'6px 0'}}>
                    <QRCodeSVG value={JSON.stringify({ tag: barcodeValue, name: itemName, cust: custodianName, loc: location })} size={52} />
                  </div>
                  <div style={{textAlign:'center', fontFamily:'monospace', fontWeight:900, fontSize:'12px'}}>{barcodeValue}</div>
                </div>
              ))}
            </div>
          )}

          {/* MODE 3: CUSTODY HANDOVER RECEIPT FORM (سند تسليم عهدة رسمي) */}
          {printMode === 'receipt' && (
            <div id="custody-receipt-print" style={{
              width: '100%',
              background: '#ffffff',
              color: '#000000',
              padding: '30px 40px',
              borderRadius: '8px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              direction: 'rtl',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {/* Header */}
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'2.5px solid #0f172a', paddingBottom:'16px', marginBottom:'20px'}}>
                <div>
                  <h2 style={{margin:0, fontSize:'1.4rem', fontWeight:900, color:'#0f172a'}}>نموذج تسليم واستلام عهدة عينية</h2>
                  <div style={{fontSize:'0.85rem', color:'#64748b', marginTop:'4px'}}>نظام الأصول الثابتة والرقابة الإدارية والمالية</div>
                </div>
                <div style={{textAlign:'left', fontSize:'0.85rem', color:'#334155'}}>
                  <div><strong>رقم السند:</strong> RC-CUST-{Date.now().toString().slice(-6)}</div>
                  <div><strong>التاريخ:</strong> {dateStr}</div>
                </div>
              </div>

              {/* Employee Info Box */}
              <div style={{background:'#f8fafc', padding:'14px 18px', borderRadius:'8px', border:'1px solid #e2e8f0', marginBottom:'20px'}}>
                <h4 style={{margin:'0 0 10px', fontSize:'0.95rem', fontWeight:800, color:'#0d9488'}}>بيانات الموظف المستلم (صاحب العهدة):</h4>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'12px', fontSize:'0.85rem'}}>
                  <div><strong>الاسم الكامل:</strong> {custodianName}</div>
                  <div><strong>الرقم الوظيفي:</strong> {employee?.employee_id || item.employee_id || '102'}</div>
                  <div><strong>الإدارة / القسم:</strong> {item.department || employee?.department || 'الإدارة العامة'}</div>
                  <div><strong>مقر ومكان العهدة:</strong> {location}</div>
                  <div><strong>المسمى الوظيفي:</strong> {employee?.job_title || 'موظف مسؤول'}</div>
                  <div><strong>الحالة:</strong> على رأس العمل</div>
                </div>
              </div>

              {/* Asset Table */}
              <div style={{marginBottom:'24px'}}>
                <h4 style={{margin:'0 0 10px', fontSize:'0.95rem', fontWeight:800, color:'#0d9488'}}>تفاصيل الأصل المسلم كعهدة:</h4>
                <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.85rem', border:'1px solid #000'}}>
                  <thead>
                    <tr style={{background:'#f1f5f9', borderBottom:'1px solid #000'}}>
                      <th style={{padding:'8px', border:'1px solid #000'}}>رقم الأصل / الباركود</th>
                      <th style={{padding:'8px', border:'1px solid #000'}}>اسم الأصل / الوصف</th>
                      <th style={{padding:'8px', border:'1px solid #000'}}>الرقم التسلسلي (S/N)</th>
                      <th style={{padding:'8px', border:'1px solid #000'}}>القيمة التقديرية (ر.س)</th>
                      <th style={{padding:'8px', border:'1px solid #000'}}>الحالة الفنية</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{padding:'10px', border:'1px solid #000', fontFamily:'monospace', fontWeight:700, textAlign:'center'}}>{barcodeValue}</td>
                      <td style={{padding:'10px', border:'1px solid #000', fontWeight:600}}>{itemName}</td>
                      <td style={{padding:'10px', border:'1px solid #000', textAlign:'center'}}>{serialNo}</td>
                      <td style={{padding:'10px', border:'1px solid #000', textAlign:'center'}}>{Number(item.cost || 0).toLocaleString()}</td>
                      <td style={{padding:'10px', border:'1px solid #000', textAlign:'center'}}>{item.status || 'ممتازة - يعمل'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Acknowledgement Statement */}
              <div style={{background:'#fffbeb', padding:'12px 16px', borderRadius:'6px', border:'1px solid #fde68a', fontSize:'0.8rem', color:'#92400e', marginBottom:'28px', lineHeight:1.6}}>
                <strong>إقرار وتعهد:</strong> أقر أنا الموظف الموضح اسمي أعلاه بأنني استلمت الأصل الموصوف بحالة سليمة وصالحة للاستخدام، وأتعهد بالمحافظة عليه واستخدامه في مصلحة العمل فقط، وأتحمل المسؤولية الكاملة عن أي تلف أو ضياع ناتج عن سوء الاستخدام أو الإهمال، كما أتعهد بإعادته فور طلب الإدارة أو عند انتهاء العلاقة التعاقدية.
              </div>

              {/* Signatures */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'20px', textAlign:'center', paddingTop:'16px', borderTop:'1px solid #cbd5e1'}}>
                <div>
                  <div style={{fontSize:'0.85rem', fontWeight:800, marginBottom:'40px'}}>توقيع الموظف المستلم</div>
                  <div style={{borderBottom:'1px dotted #000', width:'80%', margin:'0 auto'}}></div>
                </div>
                <div>
                  <div style={{fontSize:'0.85rem', fontWeight:800, marginBottom:'40px'}}>مسؤول الأصول والمستودعات</div>
                  <div style={{borderBottom:'1px dotted #000', width:'80%', margin:'0 auto'}}></div>
                </div>
                <div>
                  <div style={{fontSize:'0.85rem', fontWeight:800, marginBottom:'40px'}}>اعتماد الإدارة المالية</div>
                  <div style={{borderBottom:'1px dotted #000', width:'80%', margin:'0 auto'}}></div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons (Screen-Only) */}
        <div className="no-print" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1.75rem', borderTop:'1px solid var(--border, #e2e8f0)', paddingTop:'1.25rem'}}>
          <div style={{fontSize:'0.85rem', color:'var(--text-muted, #64748b)'}}>
            💡 تدعم الطباعة كافة طابعات الملصقات الحرارية (Zebra, Xprinter, TSC) وطابعات الليزر العادية.
          </div>
          
          <div style={{display:'flex', gap:'0.75rem'}}>
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{padding:'0.65rem 1.8rem', display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:700, fontSize:'0.95rem'}}
              onClick={handlePrint}
            >
              <Printer size={18} /> طباعة الآن
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{border:'1px solid var(--border, #e2e8f0)'}}>
              إغلاق
            </button>
          </div>
        </div>

      </div>

      {/* Embedded Print CSS to print cleanly without UI elements */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .barcode-modal-backdrop, .barcode-modal-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .printable-content, .printable-content * {
            visibility: visible !important;
          }
          .printable-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}</style>
    </div>
  );
};

export default BarcodePrintModal;
