const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const searchStr = 'const [warehouseItems, setWarehouseItems] = useState([';
const replaceStr = `const [auditLogs, setAuditLogs] = useState([]);
  const [systemSettings, setSystemSettings] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [warehouseItems, setWarehouseItems] = useState([`;

if (app.includes(searchStr)) {
  app = app.replace(searchStr, replaceStr);
  fs.writeFileSync('src/App.jsx', app);
  console.log('States injected properly!');
} else {
  console.log('Not found');
}
