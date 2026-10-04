const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add Validations to handleAddAsset
const handleAddRegex = /const dbRecord = \{/;
const newValidations = `
    const parsedCost = n('cost');
    const parsedSalvage = n('salvage');
    if (parsedSalvage > parsedCost) {
      showToast('❌ خطأ: لا يمكن أن تكون القيمة المتبقية أكبر من تكلفة الأصل.');
      return;
    }
    const parsedDate = g('date') || new Date().toISOString().split('T')[0];
    if (g('status') === 'مستبعد' && g('disposalDate') && g('disposalDate') < parsedDate) {
       showToast('❌ خطأ: لا يمكن استبعاد أصل بتاريخ أقدم من تاريخ شرائه.');
       return;
    }

    const dbRecord = {`;
app = app.replace(handleAddRegex, newValidations);

// 2. Add File Attachment field to renderNewAsset
const warrantyRegex = /<F label="الضمان \(مدة\/نهاية\)"><input name="warranty" type="text" defaultValue=\{ea\?\.warranty\} placeholder="مثال: سنتين تنتهي 2026" style=\{inp\} \/><\/F>\s*<\/div>\s*<\/div>/;
const attachmentField = `<F label="الضمان (مدة/نهاية)"><input name="warranty" type="text" defaultValue={ea?.warranty} placeholder="مثال: سنتين تنتهي 2026" style={inp} /></F>
            </div>
          </div>
          
          <div style={{padding:'2rem', borderBottom:'1px solid var(--border)'}}>
            <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><FileText size={20}/> 5. المرفقات</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem'}}>
              <F label="إرفاق فاتورة الشراء (PDF / JPG)"><input name="invoiceFile" type="file" style={inp} accept=".pdf,image/*" onChange={() => showToast('💡 ملاحظة: رفع الملفات يتطلب تفعيل مساحة تخزين Supabase Storage.')} /></F>
              <F label="إرفاق صورة الأصل"><input name="assetImage" type="file" style={inp} accept="image/*" onChange={() => showToast('💡 ملاحظة: سيتم معالجة الصورة لاحقاً في التخزين السحابي.')}/></F>
            </div>
          </div>`;
app = app.replace(warrantyRegex, attachmentField);

// 3. Add Settings & Audit Log views to Sidebar and App
const renderAuditLogsCode = `
  const renderAuditLogs = () => (
    <div className="view-anim">
      <div style={{marginBottom:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2 style={{fontSize:'1.5rem', fontWeight:800}}><History size={24} color="var(--brand-teal)" style={{marginRight:'0.5rem', verticalAlign:'middle'}}/> سجل العمليات (Audit Log)</h2>
          <p style={{color:'var(--text-muted)'}}>هذا السجل محمي للقراءة فقط، يسجل جميع الحركات التي تمت في النظام لدواعي التدقيق والأمان.</p>
        </div>
      </div>
      <div className="card" style={{padding:0, overflow:'hidden', border:'1px solid var(--border)'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.9rem'}}>
          <thead style={{background:'var(--thead-bg)'}}>
            <tr>
              <th style={{padding:'1rem', textAlign:'right', borderBottom:'2px solid var(--border)'}}>التاريخ والوقت</th>
              <th style={{padding:'1rem', textAlign:'right', borderBottom:'2px solid var(--border)'}}>الإجراء</th>
              <th style={{padding:'1rem', textAlign:'right', borderBottom:'2px solid var(--border)'}}>الكيان</th>
              <th style={{padding:'1rem', textAlign:'right', borderBottom:'2px solid var(--border)'}}>التفاصيل (JSON)</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log, i) => (
              <tr key={i} style={{borderBottom:'1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.3)'}}>
                <td style={{padding:'1rem', color:'var(--text-muted)'}}>{new Date(log.created_at).toLocaleString('ar-SA')}</td>
                <td style={{padding:'1rem', fontWeight:700, color:'var(--brand-teal)'}}>{log.action}</td>
                <td style={{padding:'1rem'}}><span className="badge">{log.entity_name}</span></td>
                <td style={{padding:'1rem', fontFamily:'monospace', fontSize:'0.8rem', color:'#64748b'}}>{JSON.stringify(log.new_values)}</td>
              </tr>
            ))}
            {auditLogs.length === 0 && <tr><td colSpan="4" style={{padding:'2rem', textAlign:'center', color:'var(--text-muted)'}}>لا توجد حركات مسجلة حالياً.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
`;

const settingsInjectRegex = /const renderSettings = \(\) => \(/;
app = app.replace(settingsInjectRegex, renderAuditLogsCode + "\n  const renderSettings = () => (");

// Now update Settings UI to include missing tabs mentioned in PRD
const settingsCode = `const renderSettings = () => (
    <div className="view-anim">
      <h2 style={{fontSize:'1.5rem', marginBottom:'2rem', fontWeight:800}}><Settings size={24} color="var(--brand-teal)" style={{marginRight:'0.5rem', verticalAlign:'middle'}}/> الإعدادات الشاملة (قيد التطوير)</h2>
      
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
        <div className="card" style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
          <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem'}}>إعدادات المنشأة العامة</h3>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontWeight:600}}>اسم الجهة / الشركة</div>
              <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>شركة الأعمال المتطورة المحدودة</div>
            </div>
            <button className="btn btn-ghost" onClick={() => showToast('قيد التطوير: تعديل اسم المنشأة')}>تعديل</button>
          </div>
          <div style={{height:'1px', background:'var(--border)'}}></div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontWeight:600}}>السنة المالية والعملة</div>
              <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>2024 - الريال السعودي (ر.س)</div>
            </div>
            <button className="btn btn-ghost" onClick={() => showToast('قيد التطوير: إعدادات مالية')}>تعديل</button>
          </div>
        </div>

        <div className="card" style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
          <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem'}}>المستخدمون والصلاحيات (RBAC)</h3>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontWeight:600}}>إدارة المستخدمين</div>
              <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>إضافة مستخدمين (محاسب، مدقق، الخ)</div>
            </div>
            <button className="btn btn-primary" onClick={() => showToast('قيد التطوير: إدارة الأدوار والصلاحيات من قاعدة البيانات')}>إدارة</button>
          </div>
          <div style={{height:'1px', background:'var(--border)'}}></div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontWeight:600}}>النسخ الاحتياطي للأمان</div>
              <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>أخذ نسخة احتياطية من قاعدة البيانات</div>
            </div>
            <button className="btn btn-primary" style={{background:'var(--success)', borderColor:'var(--success)'}} onClick={() => showToast('قيد التطوير: خدمة أخذ نسخة من Supabase')}>نسخ احتياطي</button>
          </div>
        </div>
        
        <div className="card" style={{display:'flex', flexDirection:'column', gap:'1.5rem', gridColumn:'1/-1'}}>
           <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem'}}>أنماط الترقيم التلقائي</h3>
           <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.5rem'}}>
             <div>
               <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>بادئة الأصول (Assets)</label>
               <input type="text" defaultValue="AST-2024-" style={{padding:'0.5rem', width:'100%', borderRadius:'6px', border:'1px solid var(--border)'}} disabled />
             </div>
             <div>
               <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>بادئة التحويلات (Transfers)</label>
               <input type="text" defaultValue="TRF-2024-" style={{padding:'0.5rem', width:'100%', borderRadius:'6px', border:'1px solid var(--border)'}} disabled />
             </div>
             <div>
               <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>بادئة الجرد (Inventory)</label>
               <input type="text" defaultValue="INV-2024-" style={{padding:'0.5rem', width:'100%', borderRadius:'6px', border:'1px solid var(--border)'}} disabled />
             </div>
           </div>
        </div>
      </div>
    </div>
  );`;
app = app.replace(/const renderSettings = \(\) => \([\s\S]*?<\/div>\s*\);\s*(?=const renderContent)/, settingsCode + "\n\n  ");

// 4. Update Main render to support audit logs
const viewRegex = /\{view === 'settings' && renderSettings\(\)\}/;
app = app.replace(viewRegex, `{view === 'settings' && renderSettings()}\n        {view === 'audit' && renderAuditLogs()}`);

const sidebarSettingsRegex = /<SidebarItem icon=\{<Settings size=\{20\} \/>\} label="???????" active=\{view === 'settings'\} onClick=\{\(\) => setView\('settings'\)\} \/>/;
const newSidebar = `<SidebarItem icon={<History size={20} />} label="سجل العمليات" active={view === 'audit'} onClick={() => setView('audit')} />
          <SidebarItem icon={<Settings size={20} />} label="الإعدادات" active={view === 'settings'} onClick={() => setView('settings')} />`;
app = app.replace(sidebarSettingsRegex, newSidebar);

fs.writeFileSync('src/App.jsx', app);
console.log("Injected Final Touches");
