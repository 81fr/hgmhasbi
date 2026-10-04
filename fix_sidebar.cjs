const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const oldSidebarSettings = `<SidebarItem icon={<Settings size={20} />} label="الإعدادات" active={view === 'settings'} onClick={() => setView('settings')} />`;
const newSidebar = `<SidebarItem icon={<History size={20} />} label="سجل العمليات" active={view === 'audit'} onClick={() => setView('audit')} />\n          <SidebarItem icon={<Settings size={20} />} label="الإعدادات" active={view === 'settings'} onClick={() => setView('settings')} />`;

if (app.includes(oldSidebarSettings) && !app.includes('سجل العمليات')) {
  app = app.replace(oldSidebarSettings, newSidebar);
} else {
  // Try to find ANY settings button
  const fallbackRegex = /<SidebarItem icon=\{<Settings size=\{20\} \/>\}[\s\S]*?\/>/;
  app = app.replace(fallbackRegex, newSidebar);
}

fs.writeFileSync('src/App.jsx', app);
console.log('Fixed Sidebar!');
