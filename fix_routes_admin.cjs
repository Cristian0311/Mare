const fs = require('fs');
let routes = fs.readFileSync('src/AppRoutes.tsx', 'utf8');

routes = routes.replace(/path="mayoristas"/g, 'path="mayorista"');
routes = routes.replace(/path="automatizaciones"/g, 'path="automatizacion"');
routes = routes.replace(/path="almacenamiento"/g, 'path="almacen"');
routes = routes.replace(/path="reabastecimiento"/g, 'path="abastecimiento"');
routes = routes.replace(/path="provincias-municipios"/g, 'path="ubicaciones"');
routes = routes.replace(/path="entregas"/g, 'path="envios"');
routes = routes.replace(/path="migracion-db"/g, 'path="migracion"');

fs.writeFileSync('src/AppRoutes.tsx', routes);
console.log('Routes fixed');
