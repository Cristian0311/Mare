const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const repairScript = `
    <script>
      // PWA Lockout Auto-Recovery
      window.addEventListener('error', function(e) {
        if (e.message && (e.message.includes('Failed to fetch dynamically imported module') || e.message.includes('Importing a module script failed'))) {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
              for(let registration of registrations) {
                registration.unregister();
              }
              window.location.reload(true);
            });
          }
        }
      }, true);

      // Limpieza preventiva (v3)
      if ('serviceWorker' in navigator && !sessionStorage.getItem('sw-forced-update-v3')) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          if (registrations.length > 0) {
            for(let registration of registrations) {
              registration.unregister();
            }
            sessionStorage.setItem('sw-forced-update-v3', 'true');
            window.location.reload(true);
          }
        });
      }
    </script>
`;

html = html.replace(/<script>[\s\S]*?\/\/ Auto-reparación del Service Worker[\s\S]*?<\/script>/, repairScript.trim());

fs.writeFileSync('index.html', html);
console.log('Fixed index.html');
