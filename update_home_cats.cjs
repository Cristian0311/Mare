const fs = require('fs');
const content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const updatedContent = content.replace(
  /<Link[\s\S]*?to="\/categorias"[\s\S]*?Ver<br\/>Todas[\s\S]*?<\/Link>/,
  ""
);

fs.writeFileSync('src/pages/Home.tsx', updatedContent);
