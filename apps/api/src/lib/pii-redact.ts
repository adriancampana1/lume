const PATTERNS: { name: string; rx: RegExp }[] = [
  { name: 'CPF', rx: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g },
  { name: 'CPF', rx: /(?<![\d.])\d{11}(?![\d.])/g },
  { name: 'CNPJ', rx: /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g },
  { name: 'EMAIL', rx: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  { name: 'PHONE', rx: /(?:\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}-?\d{4}/g },
  { name: 'CEP', rx: /\b\d{5}-\d{3}\b/g },
  { name: 'ACCOUNT', rx: /\b(?:AG|Ag(?:ência|encia)?)\s*:?\s*\d{3,5}\s*(?:CC|Conta)\s*:?\s*\d{4,12}-?\d?\b/gi },
  { name: 'NAME', rx: /\bTitular\s*:\s*[A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-ZÁÉÍÓÚÂÊÔÃÕÇ\s'.-]{4,}/g },
  { name: 'CARD', rx: /\b\d{4}\s\d{4}\s\d{4}\s\d{4}\b/g },
];

export function redactPII(input: string): string {
  let s = input;
  for (const { name, rx } of PATTERNS) {
    s = s.replace(rx, `[REDACTED:${name}]`);
  }
  return s;
}

export function redactValue(value: unknown): unknown {
  if (typeof value === 'string') return redactPII(value);
  if (Array.isArray(value)) return value.map(redactValue);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = redactValue(v);
    return out;
  }
  return value;
}
