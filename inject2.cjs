const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

if (!app.includes('import ErrorBoundary')) {
  app = app.replace('import React', "import ErrorBoundary from './ErrorBoundary';\nimport React");
}

app = app.replace('{renderContent()}', '<ErrorBoundary>{renderContent()}</ErrorBoundary>');
fs.writeFileSync('src/App.jsx', app);
console.log('Fixed');
