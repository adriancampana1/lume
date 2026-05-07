import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderReportToHtml } from './src/render.ts';
import { htmlToPdfBuffer, closeBrowser } from './src/pdf.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const fixture = join(here, 'tests', 'fixtures', 'sample-report.json');
const report = JSON.parse(readFileSync(fixture, 'utf8'));

const html = renderReportToHtml(report);
writeFileSync(join(here, 'preview.html'), html);
const pdf = await htmlToPdfBuffer(html);
writeFileSync(join(here, 'preview.pdf'), pdf);
await closeBrowser();
console.log('preview.html and preview.pdf written to', here);
