const fs = require('fs');
const content = fs.readFileSync('src/hooks/useCheckoutForm.ts', 'utf8');

const updatedContent = content
  .replace(/if \(\!data.apellidos.trim\(\)\) newErrors.apellidos = 'Los apellidos son obligatorios';/, '// validation removed')
  .replace(/data.apellidos.trim\(\) !== '' &&/, '');

fs.writeFileSync('src/hooks/useCheckoutForm.ts', updatedContent);
