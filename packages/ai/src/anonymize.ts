export const ANON_TOKEN = '[REDACTED]';

const RULES: Array<{ name: string; re: RegExp }> = [
  { name: 'cpf-formatted', re: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g },
  { name: 'cnpj', re: /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g },
  { name: 'cpf-raw', re: /(?<![\d.\-/])\d{11}(?![\d.\-/])/g },
  { name: 'cnpj-raw', re: /(?<![\d.\-/])\d{14}(?![\d.\-/])/g },
  { name: 'cep', re: /\b\d{5}-\d{3}\b/g },
  { name: 'phone-mobile', re: /\(?\d{2}\)?\s?9\d{4}-?\d{4}/g },
  { name: 'phone-landline', re: /\(?\d{2}\)?\s?\d{4}-?\d{4}/g },
  { name: 'email', re: /\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g },
  { name: 'agency-account', re: /\b(?:Ag(?:ê|e)ncia|Conta)\s*[:#]?\s*\d{1,5}-?\d{0,2}\b/gi },
  { name: 'titular-line', re: /^(\s*)(?:Titular|Cliente|Correntista)\s*[:\-]\s*[^\n]+$/gim },
];

export function anonymize(input: string): string {
  let out = input;
  for (const { re } of RULES) {
    out = out.replace(re, (match) => {
      if (/^(\s*)(?:Titular|Cliente|Correntista)/i.test(match)) {
        const prefix = match.match(/^(\s*)(?:Titular|Cliente|Correntista)\s*[:\-]\s*/i);
        return prefix ? `${prefix[0]}${ANON_TOKEN}` : ANON_TOKEN;
      }
      return ANON_TOKEN;
    });
  }
  return out;
}

export function anonymizeBuffer(buf: Buffer): Buffer {
  return Buffer.from(anonymize(buf.toString('utf8')));
}
