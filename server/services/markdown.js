import fs from 'fs';
import { marked } from 'marked';

export function markdown2Html(filePath) {
  const md = fs.readFileSync(filePath, 'utf8');
  return marked(md);
}