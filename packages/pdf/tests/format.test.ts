import { describe, expect, it } from 'vitest';
import { formatBRL, formatPct, formatPeriod, formatMonth } from '../src/format.js';

describe('formatBRL', () => {
  it('formats positive cents with thousands separator', () => {
    expect(formatBRL(350000)).toBe('R$ 3.500,00');
  });

  it('formats negative cents preserving sign', () => {
    expect(formatBRL(-8990)).toBe('-R$ 89,90');
  });

  it('handles zero', () => {
    expect(formatBRL(0)).toBe('R$ 0,00');
  });
});

describe('formatPct', () => {
  it('formats fraction as percentage rounded to integer', () => {
    expect(formatPct(0.235)).toBe('24%');
  });

  it('formats negative trends with sign', () => {
    expect(formatPct(-0.12)).toBe('-12%');
  });
});

describe('formatPeriod', () => {
  it('renders YYYY-MM-DD..YYYY-MM-DD as "Abril de 2026"', () => {
    expect(formatPeriod('2026-04-01', '2026-04-30')).toBe('Abril de 2026');
  });

  it('renders multi-month range', () => {
    expect(formatPeriod('2026-02-01', '2026-04-30')).toBe('Fevereiro a Abril de 2026');
  });
});

describe('formatMonth', () => {
  it('formats YYYY-MM as full BR month', () => {
    expect(formatMonth('2026-04')).toBe('Abril');
  });
});
