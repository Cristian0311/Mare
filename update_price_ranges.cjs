const fs = require('fs');
const content = fs.readFileSync('src/components/ui/FilterSidebar.tsx', 'utf8');

const updatedContent = content.replace(
  /const priceRanges = \[[\s\S]*?\];/,
  `const priceRanges = [
    { label: 'Menos de 10,000 MN', min: undefined, max: 10000 },
    { label: '10,000 – 25,000 MN', min: 10000, max: 25000 },
    { label: '25,000 – 50,000 MN', min: 25000, max: 50000 },
    { label: 'Más de 50,000 MN', min: 50000, max: undefined },
  ];`
);

fs.writeFileSync('src/components/ui/FilterSidebar.tsx', updatedContent);
