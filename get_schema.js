const fs = require('fs');
const sql = fs.readFileSync('total_schema.sql', 'utf8');

// Regex to capture CREATE TABLE blocks
const tableRegex = /CREATE TABLE [a-zA-Z0-9_]+ \([\s\S]*?\);/g;
const typeRegex = /CREATE TYPE [a-zA-Z0-9_]+ AS ENUM \([\s\S]*?\);/g;

let tables = sql.match(tableRegex) || [];
let types = sql.match(typeRegex) || [];

fs.writeFileSync('clean_schema.sql', types.join('\n\n') + '\n\n' + tables.join('\n\n'));
console.log('Clean schema generated');
