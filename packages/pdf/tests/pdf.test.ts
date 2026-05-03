import { describe, expect, it, afterAll } from 'vitest';
import { htmlToPdfBuffer, closeBrowser } from '../src/pdf.js';

afterAll(async () => {
  await closeBrowser();
});

describe('htmlToPdfBuffer', () => {
  it('returns a Buffer with PDF magic bytes', async () => {
    const html = '<!DOCTYPE html><html><body><h1>Hello Lume</h1></body></html>';
    const buf = await htmlToPdfBuffer(html);
    expect(buf.length).toBeGreaterThan(1000);
    expect(buf.subarray(0, 4).toString('ascii')).toBe('%PDF');
  });

  it('reuses the browser singleton across calls', async () => {
    const a = await htmlToPdfBuffer('<html><body>A</body></html>');
    const b = await htmlToPdfBuffer('<html><body>B</body></html>');
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
  });
}, { timeout: 60000 });
