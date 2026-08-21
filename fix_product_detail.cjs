const fs = require('fs');

let content = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

// Add import if not exists
if (!content.includes("import { configService }")) {
  content = content.replace("import { useState, useMemo", "import { useState, useMemo, useEffect");
  content = "import { configService } from '../services/config';\n" + content;
}

// Add state if not exists
if (!content.includes("const [config, setConfig]")) {
  content = content.replace(
    /export function ProductDetail\(\) \{\n/,
    `export function ProductDetail() {\n  const [config, setConfig] = useState(configService.getConfigSync());\n  useEffect(() => {\n    const handleConfigUpdate = () => setConfig(configService.getConfigSync());\n    window.addEventListener('mare_config_updated', handleConfigUpdate);\n    return () => window.removeEventListener('mare_config_updated', handleConfigUpdate);\n  }, []);\n`
  );
}

// Fix strings
content = content.replace(
  /"Pagas el \$\{config\.reservation\.defaultAdvancePercentage\}% de adelanto para asegurar el producto\."/g,
  "`Pagas el ${config.reservation.defaultAdvancePercentage}% de adelanto para asegurar el producto.`"
);

content = content.replace(
  /"Pagas el 70% restante al recibir o recoger\."/g,
  "`Pagas el ${100 - config.reservation.defaultAdvancePercentage}% restante al recibir o recoger.`"
);

fs.writeFileSync('src/pages/ProductDetail.tsx', content);
