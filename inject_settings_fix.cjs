const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Replace renderSettings
const startIndex = app.indexOf('const renderSettings = () => (');
const endIndex = app.indexOf('// ===== WAREHOUSE RADAR SYSTEM =====');

if (startIndex !== -1 && endIndex !== -1) {
  const newSettingsCode = `const renderSettings = () => {
    const handleSaveSettings = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const updates = {
        company_name: fd.get('company_name'),
        fiscal_year: fd.get('fiscal_year'),
        currency: fd.get('currency'),
        prefix_asset: fd.get('prefix_asset'),
        prefix_transfer: fd.get('prefix_transfer'),
        prefix_inventory: fd.get('prefix_inventory')
      };
      
      const { error } = await supabase.from('system_settings').update(updates).eq('id', systemSettings?.id);
      if(error) showToast('❌ حدث خطأ أثناء حفظ الإعدادات');
      else {
        showToast('✅ تم حفظ إعدادات المنشأة بنجاح!');
        fetchInitialData();
      }
    };

    return (
    <div className="view-anim">
      <h2 style={{fontSize:'1.5rem', marginBottom:'2rem', fontWeight:800}}><Settings size={24} color="var(--brand-teal)" style={{marginRight:'0.5rem', verticalAlign:'middle'}}/> الإعدادات الشاملة للمنظومة</h2>
      
      {systemSettings ? (
      <form onSubmit={handleSaveSettings} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
        
        <div className="card" style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
          <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem'}}>إعدادات المنشأة العامة</h3>
          
          <div>
            <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>اسم الجهة / الشركة</label>
            <input name="company_name" type="text" defaultValue={systemSettings.company_name} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
          </div>
          <div>
            <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>السنة المالية</label>
            <input name="fiscal_year" type="text" defaultValue={systemSettings.fiscal_year} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
          </div>
          <div>
            <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>العملة الأساسية للنظام</label>
            <input name="currency" type="text" defaultValue={systemSettings.currency} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
          </div>
        </div>
        
        <div className="card" style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
           <h3 style={{fontSize:'1.1rem', color:'var(--brand-teal)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem'}}>أنماط الترقيم التلقائي المخصصة</h3>
           <p style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>سيتم استخدام هذه البوادئ لإنشاء أرقام مرجعية فريدة لكل عملية في النظام.</p>
           
           <div>
             <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>بادئة سجل الأصول الثابتة (Assets)</label>
             <input name="prefix_asset" type="text" defaultValue={systemSettings.prefix_asset} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
           </div>
           <div>
             <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>بادئة حركات التحويل (Transfers)</label>
             <input name="prefix_transfer" type="text" defaultValue={systemSettings.prefix_transfer} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
           </div>
           <div>
             <label style={{fontSize:'0.85rem', fontWeight:700, display:'block', marginBottom:'0.5rem'}}>بادئة محاضر الجرد (Inventory)</label>
             <input name="prefix_inventory" type="text" defaultValue={systemSettings.prefix_inventory} required style={{padding:'0.75rem', width:'100%', borderRadius:'8px', border:'1px solid var(--border)', background:'transparent', color:'var(--text)'}} />
           </div>
        </div>

        <div style={{gridColumn:'1/-1', display:'flex', justifyContent:'flex-end'}}>
          <button type="submit" className="btn btn-primary" style={{padding:'1rem 2.5rem', fontSize:'1.1rem'}}>حفظ كافة التعديلات والتكوينات</button>
        </div>
      </form>
      ) : <div style={{padding:'2rem', textAlign:'center'}}>جاري تحميل الإعدادات...</div>}
    </div>
  );
  };
  
  `;
  app = app.substring(0, startIndex) + newSettingsCode + app.substring(endIndex);
  console.log('Successfully replaced renderSettings');
} else {
  console.log('Could not find renderSettings bounds');
}

// 2. Fix Topbar notification bell (the dummy one)
const topbarBellRegex = /<div style=\{\{position:'relative', cursor:'pointer'\}\} onClick=\{\(\) => setShowNotifications\(!showNotifications\)\}>\s*<Bell size=\{20\} color="var\(--text-muted\)" \/>\s*\{notifications\.length > 0 && <span[^>]+>\{notifications\.length\}<\/span>\}\s*<\/div>\s*\{showNotifications && \([\s\S]*?\}\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>\s*<\/div>\s*<div style=\{\{padding:/;
if (app.match(topbarBellRegex)) {
  const newBell = `<div style={{position:'relative', cursor:'pointer'}} onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={20} color="var(--text-muted)" />
                {notifications.filter(n => !n.is_read).length > 0 && <span style={{position:'absolute', top:'-6px', right:'-6px', background:'#ef4444', color:'white', borderRadius:'50%', fontSize:'0.6rem', width:'16px', height:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>{notifications.filter(n => !n.is_read).length}</span>}
              </div>
              {showNotifications && (
                <div style={{position:'absolute', top:'2.2rem', left:0, width:'340px', background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:'12px', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.25)', zIndex:500, padding:0, overflow:'hidden'}}>
                  <div style={{padding:'1rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--thead-bg)'}}>
                    <div style={{fontWeight:800}}>مركز التنبيهات والمهام</div>
                    <button className="btn btn-ghost" style={{padding:0, fontSize:'0.75rem', color:'var(--brand-teal)'}} onClick={async () => {
                      await supabase.from('notifications').update({is_read: true}).neq('is_read', true);
                      fetchInitialData();
                    }}>تحديد الكل كمقروء</button>
                  </div>
                  <div style={{maxHeight:'350px', overflowY:'auto'}}>
                    {notifications.length === 0 ? (
                      <div style={{padding:'2rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem'}}>لا توجد تنبيهات جديدة.</div>
                    ) : notifications.map(n => (
                      <div key={n.id} style={{padding:'1rem', borderBottom:'1px solid var(--border)', background: n.is_read ? 'transparent' : 'rgba(59, 130, 246, 0.05)'}}>
                        <div style={{display:'flex', gap:'0.5rem', marginBottom:'0.25rem'}}>
                          {n.type === 'warning' ? <AlertTriangle size={16} color="var(--warning)"/> : <Info size={16} color="var(--brand-teal)"/>}
                          <strong style={{fontSize:'0.85rem', color:'var(--text)'}}>{n.title}</strong>
                        </div>
                        <div style={{fontSize:'0.8rem', color:'var(--text-muted)', paddingRight:'1.5rem'}}>{n.message}</div>
                        <div style={{fontSize:'0.7rem', color:'#94a3b8', paddingRight:'1.5rem', marginTop:'0.25rem'}}>{new Date(n.created_at).toLocaleString('ar-SA')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{padding:`;
  app = app.replace(topbarBellRegex, newBell);
  console.log('Successfully replaced Bell');
} else {
  console.log('Could not find Bell bounds');
}

fs.writeFileSync('src/App.jsx', app);
