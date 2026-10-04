const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add missing states right after setWarehouseItems
const stateSearch = 'const [warehouseItems, setWarehouseItems] = useState([]);';
const stateReplace = `const [warehouseItems, setWarehouseItems] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [systemSettings, setSystemSettings] = useState(null);
  const [dbNotifications, setDbNotifications] = useState([]);`;
app = app.replace(stateSearch, stateReplace);

// 2. Fix fetchInitialData to use proper setters
const fetchSearch = /const \{ data: logsData \}[\s\S]*?setNotifications\(notifs\);/;
const fetchReplace = `const { data: logsData } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20);
    if (logsData) setAuditLogs(logsData);
    
    const { data: setts } = await supabase.from('system_settings').select('*').limit(1).single();
    if (setts) setSystemSettings(setts);
    
    const { data: notifs } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (notifs) setDbNotifications(notifs);`;
app = app.replace(fetchSearch, fetchReplace);

// 3. Fix Bell Dropdown rendering
const bellStart = app.indexOf('<div style={{position:\'relative\', cursor:\'pointer\'}} onClick={() => setShowNotifications(!showNotifications)}>');
const bellEndStr = '</div>\n          </div>\n        </header>';
const bellEnd = app.indexOf(bellEndStr, bellStart);

if(bellStart !== -1 && bellEnd !== -1) {
  const newBell = `<div style={{position:'relative', cursor:'pointer'}} onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={20} color="var(--text-muted)" />
                {dbNotifications.filter(n => !n.is_read).length > 0 && <span style={{position:'absolute', top:'-6px', right:'-6px', background:'#ef4444', color:'white', borderRadius:'50%', fontSize:'0.6rem', width:'16px', height:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>{dbNotifications.filter(n => !n.is_read).length}</span>}
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
                    {dbNotifications.length === 0 ? (
                      <div style={{padding:'2rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem'}}>لا توجد تنبيهات جديدة.</div>
                    ) : dbNotifications.map(n => (
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
  app = app.substring(0, bellStart) + newBell + app.substring(bellEnd);
}

fs.writeFileSync('src/App.jsx', app);
console.log('Fixed runtime crash successfully!');
