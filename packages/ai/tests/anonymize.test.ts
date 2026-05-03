import { describe, expect, it } from 'vitest';
import { anonymize, ANON_TOKEN } from '../src/anonymize.js';

describe('anonymize', () => {
  it('redacts CPF in standard format', () => {
    const out = anonymize('Titular: João da Silva — CPF 123.456.789-09');
    expect(out).toContain(ANON_TOKEN);
    expect(out).not.toContain('123.456.789-09');
  });

  it('redacts CPF without punctuation', () => {
    const out = anonymize('CPF 12345678909');
    expect(out).not.toContain('12345678909');
  });

  it('redacts CNPJ', () => {
    const out = anonymize('CNPJ 12.345.678/0001-90');
    expect(out).not.toContain('12.345.678/0001-90');
  });

  it('redacts emails', () => {
    const out = anonymize('Contato: foo.bar@example.com');
    expect(out).not.toContain('foo.bar@example.com');
  });

  it('redacts phones in BR formats', () => {
    const out = anonymize('Tel (11) 91234-5678 — fax (11) 1234-5678');
    expect(out).not.toContain('91234-5678');
    expect(out).not.toContain('1234-5678');
  });

  it('redacts CEP', () => {
    const out = anonymize('CEP 01310-100, São Paulo');
    expect(out).not.toContain('01310-100');
  });

  it('redacts agência and conta lines', () => {
    const out = anonymize('Agência 1234  Conta 56789-0');
    expect(out).not.toMatch(/56789-0/);
  });

  it('redacts holder name marked as Titular', () => {
    const out = anonymize('Titular: João Pedro Almeida\nOutra linha');
    expect(out).not.toContain('João Pedro Almeida');
    expect(out).toContain('Outra linha');
  });

  it('preserves transaction descriptions', () => {
    const out = anonymize('PIX REC JOAO - PADARIA SAO PAULO LTDA');
    expect(out).toContain('PADARIA SAO PAULO');
  });

  it('is idempotent', () => {
    const once = anonymize('CPF 123.456.789-09');
    const twice = anonymize(once);
    expect(once).toBe(twice);
  });
});
