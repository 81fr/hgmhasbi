const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = "const [warehouseItems, setWarehouseItems] = useState([";
const replacement = `const [auditLogs, setAuditLogs] = useState([]);
  const [systemSettings, setSystemSettings] = useState(null);
  const [dbNotifications, setDbNotifications] = useState([]);
  
  const [warehouseItems, setWarehouseItems] = useState([`;

if (app.includes(targetStr) && !app.includes('const [systemSettings')) {
  app = app.replace(targetStr, replacement);
  fs.writeFileSync('src/App.jsx', app);
  console.log('States ACTUALLY injected!');
} else {
  console.log('Target not found or already injected');
}
