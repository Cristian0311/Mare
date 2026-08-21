const fs = require('fs');
let routes = fs.readFileSync('src/AppRoutes.tsx', 'utf8');

if (!routes.includes('Navigate')) {
    routes = routes.replace("import { Routes, Route, useLocation } from 'react-router-dom';", "import { Routes, Route, useLocation, Navigate } from 'react-router-dom';");
}

routes = routes.replace(
    '<Route path="configuracion" element={<AdminSettings />} />\n        </Route>',
    '<Route path="configuracion" element={<AdminSettings />} />\n          <Route path="*" element={<Navigate to="/admin" replace />} />\n        </Route>'
);

fs.writeFileSync('src/AppRoutes.tsx', routes);
console.log('Wildcard added');
