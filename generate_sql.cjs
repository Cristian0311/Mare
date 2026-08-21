const fs = require('fs');

const content = fs.readFileSync('src/data/categories.ts', 'utf8');

// Using regex or eval is tricky, let's just parse the actual JSON-like structure by transpiling.
// Actually, I can just write a script that runs within Node and imports the ts file.
// Or I can just write the sql directly in the chat since I have access to the categories.
