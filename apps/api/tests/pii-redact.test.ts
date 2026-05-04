import { describe, expect, it } from 'vitest';
import { redactPII } from '../src/lib/pii-redact.js';

describe('redactPII', () => {
  it.each([
    ['CPF formatado', 'cliente 123.456.789-09 chegou', 'cliente [REDACTED:CPF] chegou'],
    ['CPF cru', '12345678909', '[REDACTED:CPF]'],
    ['CNPJ formatado', '12.345.678/0001-95', '[REDACTED:CNPJ]'],
    ['email', 'fulano@example.com', '[REDACTED:EMAIL]'],
    ['telefone +55', '+55 11 91234-5678', '[REDACTED:PHONE]'],
    ['telefone curto', '(11) 4321-1234', '[REDACTED:PHONE]'],
    ['CEP', '01310-100', '[REDACTED:CEP]'],
    ['agência+conta', 'AG 1234 CC 56789-0', '[REDACTED:ACCOUNT]'],
    ['nome titular linha', 'Titular: ADRIAN P CAMPANA', '[REDACTED:NAME]'],
    ['cartão 16d', '4444 5555 6666 7777', '[REDACTED:CARD]'],
  ])('redacts %s', (_label, input, expected) => {
    expect(redactPII(input)).toBe(expected);
  });

  it('preserves non-PII text', () => {
    expect(redactPII('saldo: R$ 1.234,56')).toBe('saldo: R$ 1.234,56');
  });

  it('redacts inside JSON-stringified object', () => {
    const o = { user: 'fulano@x.com', cpf: '123.456.789-09' };
    const out = redactPII(JSON.stringify(o));
    expect(out).not.toContain('fulano@x.com');
    expect(out).not.toContain('123.456.789-09');
  });
});
