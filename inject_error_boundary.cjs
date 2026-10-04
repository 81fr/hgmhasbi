const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

if (!app.includes('import ErrorBoundary')) {
  app = app.replace('import React', "import ErrorBoundary from './ErrorBoundary';\nimport React");
}

const mainSearch = "<main style={{flex: 1, height: '100vh', overflowY: 'auto', background: 'var(--bg)'}}>";
if (app.includes(mainSearch) && !app.includes('<ErrorBoundary>')) {
  app = app.replace(mainSearch, mainSearch + '\n        <ErrorBoundary>');
  
  const mainEnd = '</main>';
  const lastMain = app.lastIndexOf(mainEnd);
  app = app.substring(0, lastMain) + '        </ErrorBoundary>\n      ' + app.substring(lastMain);
  
  fs.writeFileSync('src/App.jsx', app);
  console.log('ErrorBoundary injected');
} else {
  console.log('Main not found or already injected');
}
