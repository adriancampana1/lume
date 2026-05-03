import { describe, expect, it } from 'vitest';
import { detectInputKind } from '../src/route.js';

describe('detectInputKind', () => {
  it('detects PDF by magic bytes', () => {
    const buf = Buffer.from('%PDF-1.7\n...rest', 'utf8');
    expect(detectInputKind(buf, 'extrato.pdf')).toBe('pdf');
  });

  it('detects OFX by header', () => {
    const buf = Buffer.from('OFXHEADER:100\nDATA:OFXSGML\n...', 'utf8');
    expect(detectInputKind(buf, 'extrato.ofx')).toBe('ofx');
  });

  it('detects XML-flavored OFX', () => {
    const buf = Buffer.from('<?xml version="1.0"?>\n<OFX>...</OFX>', 'utf8');
    expect(detectInputKind(buf, 'export.ofx')).toBe('ofx');
  });

  it('falls back to extension when bytes inconclusive', () => {
    const buf = Buffer.from('garbage', 'utf8');
    expect(detectInputKind(buf, 'a.pdf')).toBe('pdf');
    expect(detectInputKind(buf, 'a.ofx')).toBe('ofx');
  });

  it('throws on unsupported extension and bytes', () => {
    const buf = Buffer.from('xx');
    expect(() => detectInputKind(buf, 'a.csv')).toThrow(/unsupported/i);
  });
});
