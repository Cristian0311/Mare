const fs = require('fs');
const content = fs.readFileSync('src/utils/filters.ts', 'utf8');

const replacement = `    case 'recommended':
    default:
      // Orden por defecto
      sorted.sort((a, b) => {
        const aScore = (a as any).relevanceScore || 0;
        const bScore = (b as any).relevanceScore || 0;
        if (aScore !== bScore) {
          return bScore - aScore; // Highest score first
        }
        return a.orden - b.orden;
      });
  }`;

const updatedContent = content.replace(/    case 'recommended':[\s\S]*?  }/, replacement);

fs.writeFileSync('src/utils/filters.ts', updatedContent);
