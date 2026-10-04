const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const searchStr = 'const [warehouseItems, setWarehouseItems] = useState([]);';
const replaceStr = `const [warehouseItems, setWarehouseItems] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [systemSettings, setSystemSettings] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);`;

if (app.includes(searchStr) && !app.includes('const [auditLogs')) {
  app = app.replace(searchStr, replaceStr);
  fs.writeFileSync('src/App.jsx', app);
  console.log('States injected!');
} else {
  console.log('Either could not find warehouseItems state or already injected');
}

// Ensure the fetches are there
const fetchSearch = "const { data: whData, error: whErr } = await supabase.from('warehouse_items').select('*');";
const fetchReplace = `const { data: logsData } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20);
    if (logsData) setAuditLogs(logsData);
    
    const { data: setts } = await supabase.from('system_settings').select('*').limit(1).single();
    if (setts) setSystemSettings(setts);
    
    const { data: notifs } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (notifs) setNotifications(notifs);

    const { data: whData, error: whErr } = await supabase.from('warehouse_items').select('*');`;

if (app.includes(fetchSearch) && !app.includes("await supabase.from('audit_logs')")) {
  app = app.replace(fetchSearch, fetchReplace);
  fs.writeFileSync('src/App.jsx', app);
  console.log('Fetches injected!');
} else {
  console.log('Fetches already there or could not find.');
}
