import React, { useRef } from 'react';
import { Printer, X, CheckCircle, FileText, Package, User, Calendar, ShieldCheck, MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const MaterialIssuePrintModal = ({ request, onClose }) => {
  if (!request) return null;

  const handlePrint = () => {
    window.print();
  };

  const voucherNo = request.id || `MIV-${Date.now().toString().slice(-6)}`;
  const issueDate = request.approvedAt ? new Date(request.approvedAt).toLocaleDateString('ar-SA') : new Date().toLocaleDateString('ar-SA');
  const requestDate = request.requestedAt ? new Date(request.requestedAt).toLocaleDateString('ar-SA') : issueDate;

  return (
    <div 
      className="barcode-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(5px)',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="card"
        style={{
          width: '880px',
          maxWidth: '96vw',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#ffffff',
          color: '#0f172a',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Action bar (Screen-only) */}
        <div className="no-print" style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #e2e8f0', paddingBottom:'1rem', marginBottom:'1.5rem'}}>
          <div style={{display:'flex', alignItems:'center', gap:'0.6rem'}}>
            <FileText size={22} color="#0d9488" />
            <h3 style={{margin:0, fontSize:'1.2rem', fontWeight:800, color:'#0f172a'}}>معاينة وطباعة سند صرف مخزني رسمي</h3>
          </div>
          <div style={{display:'flex', gap:'0.75rem'}}>
            <button className="btn btn-primary" onClick={handlePrint} style={{background:'#0d9488', color:'#fff', padding:'0.6rem 1.4rem', fontWeight:700, display:'flex', alignItems:'center', gap:'0.4rem'}}>
              <Printer size={18} /> طباعة السند (A4)
            </button>
            <button className="btn btn-ghost" onClick={onClose} style={{border:'1px solid #cbd5e1', padding:'0.6rem 1rem'}}>
              <X size={18} /> إغلاق
            </button>
          </div>
        </div>

        {/* Official Printable Voucher Content */}
        <div className="printable-voucher" style={{fontFamily:'Arial, Tahoma, sans-serif', direction:'rtl', color:'#0f172a'}}>
          
          {/* Header */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'3px double #0f172a', paddingBottom:'1.25rem', marginBottom:'1.5rem'}}>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'1.35rem', fontWeight:900, color:'#0f172a', letterSpacing:'-0.5px'}}>المملكة العربية السعودية</div>
              <div style={{fontSize:'1.1rem', fontWeight:800, color:'#0d9488', marginTop:'0.2rem'}}>جمعية تراؤف لرعاية الأيتام بحفر الباطن</div>
              <div style={{fontSize:'0.85rem', color:'#64748b', marginTop:'0.2rem'}}>إدارة المستودعات والخدمات المساندة</div>
            </div>

            <div style={{textAlign:'center'}}>
              <div style={{border:'2px solid #0f172a', padding:'0.6rem 1.5rem', borderRadius:'8px', background:'#f8fafc', fontWeight:900, fontSize:'1.25rem', letterSpacing:'0.5px'}}>
                سند صرف وإخراج مواد من المستودع
              </div>
              <div style={{fontSize:'0.8rem', color:'#64748b', marginTop:'0.4rem'}}>Material Issue Voucher (MIV)</div>
            </div>

            <div style={{textAlign:'left'}}>
              <div style={{display:'inline-block', border:'1px solid #cbd5e1', padding:'0.4rem', borderRadius:'8px', background:'#ffffff'}}>
                <QRCodeSVG value={JSON.stringify({ voucher: voucherNo, item: request.itemName, qty: request.qty, to: request.recipient, date: issueDate })} size={70} />
              </div>
              <div style={{fontSize:'0.75rem', fontWeight:700, marginTop:'0.25rem', color:'#475569', direction:'ltr', textAlign:'center'}}>{voucherNo}</div>
            </div>
          </div>

          {/* Meta Info Grid */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'0.75rem', background:'#f8fafc', padding:'1rem', borderRadius:'8px', border:'1px solid #e2e8f0', marginBottom:'1.5rem', fontSize:'0.88rem'}}>
            <div>
              <span style={{color:'#64748b'}}>رقم السند: </span>
              <strong style={{fontFamily:'monospace', color:'#0f172a'}}>{voucherNo}</strong>
            </div>
            <div>
              <span style={{color:'#64748b'}}>تاريخ الطلب: </span>
              <strong>{requestDate}</strong>
            </div>
            <div>
              <span style={{color:'#64748b'}}>تاريخ الموافقة والصرف: </span>
              <strong>{issueDate}</strong>
            </div>
            <div>
              <span style={{color:'#64748b'}}>المستودع المصروف منه: </span>
              <strong>{request.warehouseBranch || 'المستودع المركزي الرئيسي'}</strong>
            </div>
            <div>
              <span style={{color:'#64748b'}}>مقدم الطلب: </span>
              <strong>{request.requester || 'غير محدد'}</strong>
            </div>
            <div>
              <span style={{color:'#64748b'}}>الجهة / الموظف المستلم: </span>
              <strong style={{color:'#0d9488'}}>{request.recipient || 'الجهة الطالبة'}</strong>
            </div>
            <div style={{gridColumn:'1 / -1'}}>
              <span style={{color:'#64748b'}}>الغرض من الصرف / سبب الإخراج: </span>
              <strong>{request.reason || 'استخدام تشغيلي معتمد'}</strong>
            </div>
          </div>

          {/* Items Table */}
          <div style={{marginBottom:'1.5rem'}}>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.88rem', border:'1px solid #cbd5e1'}}>
              <thead>
                <tr style={{background:'#0f172a', color:'#ffffff', textAlign:'center'}}>
                  <th style={{padding:'0.6rem 0.5rem', border:'1px solid #334155', width:'50px'}}>#</th>
                  <th style={{padding:'0.6rem 0.75rem', border:'1px solid #334155', width:'130px'}}>رمز الصنف (SKU)</th>
                  <th style={{padding:'0.6rem 0.75rem', border:'1px solid #334155', textAlign:'right'}}>اسم ووصف الصنف المصروف</th>
                  <th style={{padding:'0.6rem 0.75rem', border:'1px solid #334155', width:'90px'}}>الوحدة</th>
                  <th style={{padding:'0.6rem 0.75rem', border:'1px solid #334155', width:'90px'}}>الموقع (الرف)</th>
                  <th style={{padding:'0.6rem 0.75rem', border:'1px solid #334155', width:'100px'}}>الكمية المصروفة</th>
                  <th style={{padding:'0.6rem 0.75rem', border:'1px solid #334155', width:'120px'}}>نوع الإخراج</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{textAlign:'center', background:'#ffffff'}}>
                  <td style={{padding:'0.75rem 0.5rem', border:'1px solid #cbd5e1'}}>1</td>
                  <td style={{padding:'0.75rem 0.75rem', border:'1px solid #cbd5e1', fontFamily:'monospace', fontWeight:700, color:'#0d9488'}}>{request.itemSku || request.itemId || 'SKU-001'}</td>
                  <td style={{padding:'0.75rem 0.75rem', border:'1px solid #cbd5e1', textAlign:'right'}}>
                    <div style={{fontWeight:700}}>{request.itemName}</div>
                    {request.notes && <div style={{fontSize:'0.75rem', color:'#64748b', marginTop:'0.2rem'}}>{request.notes}</div>}
                  </td>
                  <td style={{padding:'0.75rem 0.75rem', border:'1px solid #cbd5e1'}}>{request.unit || 'حبة'}</td>
                  <td style={{padding:'0.75rem 0.75rem', border:'1px solid #cbd5e1', fontFamily:'monospace'}}>{request.binLocation || 'A-01-01'}</td>
                  <td style={{padding:'0.75rem 0.75rem', border:'1px solid #cbd5e1', fontWeight:900, fontSize:'1.1rem', color:'#0f172a'}}>{request.qty}</td>
                  <td style={{padding:'0.75rem 0.75rem', border:'1px solid #cbd5e1', fontSize:'0.8rem'}}>
                    {request.isCustody ? '🔒 عهدة شخصية' : '📦 صرف تشغيلي'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Custody Notice if applicable */}
          {request.isCustody && (
            <div style={{background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'8px', padding:'0.75rem 1rem', marginBottom:'1.5rem', fontSize:'0.82rem', color:'#166534'}}>
              <strong>📌 إقرار عهدة موظف:</strong> أقر أنا المستلم الموضح اسمه أدناه بأن المواد/الأجهزة المسجلة بهذا السند قد تم استلامها عهدة شخصية تحت مسؤوليتي المباشرة وأتعهد بالمحافظة عليها وإعادتها عند انتهاء الغرض أو إخلاء الطرف.
            </div>
          )}

          {/* Signatures 3-Column Box */}
          <div style={{border:'1px solid #cbd5e1', borderRadius:'8px', padding:'1.25rem', marginTop:'1.5rem', background:'#f8fafc'}}>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.5rem', textAlign:'center'}}>
              
              {/* Warehouse Keeper */}
              <div style={{borderLeft:'1px solid #e2e8f0', paddingLeft:'1rem'}}>
                <div style={{fontSize:'0.82rem', color:'#64748b', marginBottom:'0.25rem'}}>أمين المستودع (مُسلّم المواد)</div>
                <div style={{fontWeight:800, fontSize:'0.95rem', minHeight:'1.5rem'}}>{request.keeper || 'فيصل العتيبي'}</div>
                <div style={{margin:'2rem auto 0.5rem', width:'80%', borderBottom:'1px dashed #94a3b8'}}></div>
                <div style={{fontSize:'0.75rem', color:'#94a3b8'}}>التوقيع والختم</div>
              </div>

              {/* Approver / Financial Manager */}
              <div style={{borderLeft:'1px solid #e2e8f0', paddingLeft:'1rem'}}>
                <div style={{fontSize:'0.82rem', color:'#64748b', marginBottom:'0.25rem'}}>المعتمد (مدير المستودعات / المشرف)</div>
                <div style={{fontWeight:800, fontSize:'0.95rem', minHeight:'1.5rem', color:'#0d9488'}}>{request.approvedBy || 'المدير المالي والتقني'}</div>
                <div style={{margin:'2rem auto 0.5rem', width:'80%', borderBottom:'1px dashed #94a3b8'}}></div>
                <div style={{fontSize:'0.75rem', color:'#94a3b8'}}>الاعتماد الرسمي</div>
              </div>

              {/* Recipient */}
              <div>
                <div style={{fontSize:'0.82rem', color:'#64748b', marginBottom:'0.25rem'}}>المستلم (الجهة الطالبة / الموظف)</div>
                <div style={{fontWeight:800, fontSize:'0.95rem', minHeight:'1.5rem'}}>{request.recipient || 'المستلم'}</div>
                <div style={{margin:'2rem auto 0.5rem', width:'80%', borderBottom:'1px dashed #94a3b8'}}></div>
                <div style={{fontSize:'0.75rem', color:'#94a3b8'}}>التوقيع وتاريخ الاستلام</div>
              </div>

            </div>
          </div>

          {/* Footer note */}
          <div style={{textAlign:'center', marginTop:'1.5rem', fontSize:'0.72rem', color:'#94a3b8'}}>
            تم إصدار هذا السند آلياً عبر نظام تراؤف المحاسبي لإدارة الأصول والمستودعات V5.0 — صالح وموثق إلكترونياً.
          </div>

        </div>

      </div>

      {/* Print-specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-voucher, .printable-voucher * {
            visibility: visible;
          }
          .printable-voucher {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 15mm !important;
            margin: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 11pt !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
};

export default MaterialIssuePrintModal;
