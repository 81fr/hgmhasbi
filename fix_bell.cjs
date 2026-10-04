const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const bellStartIdx = app.indexOf('<div style={{display:\'flex\', alignItems:\'center\', gap:\'1.5rem\', position:\'relative\'}}>');
if (bellStartIdx !== -1) {
  // Let's find the end of this block which ends right before <div style={{padding:'2rem'}}>
  const endIdx = app.indexOf('<div style={{padding:', bellStartIdx);
  if (endIdx !== -1) {
    const newBellBlock = `<div style={{display:'flex', alignItems:'center', gap:'1.5rem', position:'relative'}}>
              <div style={{position:'relative', cursor:'pointer'}} onClick={() => setShowNotifications(!showNotifications)}>
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
        `;
    app = app.substring(0, bellStartIdx) + newBellBlock + app.substring(endIdx);
    fs.writeFileSync('src/App.jsx', app);
    console.log('Fixed Bell!');
  } else {
    console.log('Could not find padding div');
  }
} else {
  console.log('Could not find relative div');
}
