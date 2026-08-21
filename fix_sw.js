const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const injection = `
    <script>
      // Auto-reparación del Service Worker
      if ('serviceWorker' in navigator) {
        if (!sessionStorage.getItem('sw-forced-update-v2')) {
          navigator.serviceWorker.getRegistrations().then(function(registrations) {
            if (registrations.length > 0) {
              for(let registration of registrations) {
                registration.unregister();
              }
              sessionStorage.setItem('sw-forced-update-v2', 'true');
              window.location.reload(true);
            }
          });
        }
      }
    </script>
    <script type="module" src="/src/main.tsx"></script>
`;

const newContent = content.replace('<script type="module" src="/src/main.tsx"></script>', injection);
fs.writeFileSync('index.html', newContent);
