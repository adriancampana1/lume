import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { renderReportToHtml } from '../src/render.js';
import type { Report } from '@lume/ai';

const fixtures = join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures');
const report: Report = JSON.parse(
  readFileSync(join(fixtures, 'sample-report.json'), 'utf8'),
);

describe('renderReportToHtml', () => {
  it('returns a complete HTML document', () => {
    const html = renderReportToHtml(report);
    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain('<html');
    expect(html).toContain('Lume');
  });

  it('contains all 7 section numbers', () => {
    const html = renderReportToHtml(report);
    for (const n of ['01', '02', '03', '04', '05', '06', '07']) {
      expect(html).toContain(`>${n}</span>`);
    }
  });

  it('omits benchmark section when benchmark is null', () => {
    const noBench: Report = { ...report, benchmark: null };
    const html = renderReportToHtml(noBench);
    expect(html).not.toContain('>05</span>');
  });

  it('embeds narrative summary text', () => {
    const html = renderReportToHtml(report);
    expect(html).toContain('Em abril, você gastou');
  });

  it('does NOT include any social/follow/share CTA (PDF é 100% utilidade)', () => {
    const html = renderReportToHtml(report);
    expect(html.toLowerCase()).not.toMatch(/instagram|seguir|opt-?in|compartilh/);
  });
});
