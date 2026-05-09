import { StatementSchema, type Statement, type Bank } from './types.js';

const BANK_BY_BANKID: Record<string, Bank> = {
  '001': 'bb',
  '033': 'santander',
  '077': 'inter',
  '104': 'caixa',
  '237': 'bradesco',
  '260': 'nubank',
  '341': 'itau',
};

function tagValue(text: string, tag: string): string | null {
  const re = new RegExp(`<${tag}>([^<\\n\\r]*)`, 'i');
  const m = re.exec(text);
  return m && m[1] !== undefined ? m[1].trim() : null;
}

function tagValuesAll(text: string, tag: string): string[] {
  const re = new RegExp(`<${tag}>([^<\\n\\r]*)`, 'gi');
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m[1] !== undefined) out.push(m[1].trim());
  }
  return out;
}

function parseDate(raw: string): string {
  // Strip OFX timezone suffix e.g. [-3:BRT] or [+5:30:IST]
  const t = raw.trim().replace(/\[.*\]$/, '');
  // OFX standard: YYYYMMDD[HHMMSS][TZ]
  let m = /^(\d{4})(\d{2})(\d{2})/.exec(t);
  if (m) {
    const y = Number(m[1]);
    if (y >= 1900 && y <= 2099) return `${m[1]}-${m[2]}-${m[3]}`;
  }
  // ISO: YYYY-MM-DD
  m = /^(\d{4})-(\d{2})-(\d{2})/.exec(t);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  // BR slash: DD/MM/YYYY
  m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(t);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  // BR compact: DDMMYYYY[HHMMSS]
  m = /^(\d{2})(\d{2})(\d{4})/.exec(t);
  if (m) {
    const d = Number(m[1]);
    const mo = Number(m[2]);
    const y = Number(m[3]);
    if (d >= 1 && d <= 31 && mo >= 1 && mo <= 12 && y >= 1900 && y <= 2099) {
      return `${m[3]}-${m[2]}-${m[1]}`;
    }
  }
  throw new Error(`OFX: unrecognized date format: ${JSON.stringify(raw)}`);
}

function parseAmountCents(s: string): number {
  const cleaned = s.replace(/[^\d.\-]/g, '');
  const n = Number.parseFloat(cleaned);
  if (!Number.isFinite(n)) throw new Error(`invalid amount: ${s}`);
  return Math.round(n * 100);
}

export function parseOfx(buf: Buffer): Statement {
  const text = buf.toString('utf8');

  const bankId = tagValue(text, 'BANKID') ?? '';
  const bank: Bank = BANK_BY_BANKID[bankId] ?? 'unknown';

  const dtStart = tagValue(text, 'DTSTART');
  const dtEnd = tagValue(text, 'DTEND');
  if (!dtStart || !dtEnd) throw new Error('OFX missing DTSTART/DTEND');

  const trnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
  const transactions = [];
  let totalDebits = 0;
  let totalCredits = 0;
  let m: RegExpExecArray | null;
  while ((m = trnRegex.exec(text)) !== null) {
    const block = m[1] ?? '';
    const dt = tagValue(block, 'DTPOSTED');
    const amt = tagValue(block, 'TRNAMT');
    const memo = tagValue(block, 'MEMO') ?? tagValue(block, 'NAME') ?? '';
    if (!dt || !amt) continue;
    const amountCents = parseAmountCents(amt);
    const kind: 'debit' | 'credit' = amountCents < 0 ? 'debit' : 'credit';
    transactions.push({
      date: parseDate(dt),
      description: memo,
      amountCents,
      kind,
    });
    if (amountCents < 0) totalDebits += Math.abs(amountCents);
    else totalCredits += amountCents;
  }

  const closingRaw = tagValuesAll(text, 'BALAMT').slice(-1)[0] ?? '0';
  const closingBalanceCents = parseAmountCents(closingRaw);
  const openingBalanceCents = closingBalanceCents - (totalCredits - totalDebits);

  return StatementSchema.parse({
    bank,
    periodStart: parseDate(dtStart),
    periodEnd: parseDate(dtEnd),
    openingBalanceCents,
    closingBalanceCents,
    declaredTotalDebitsCents: totalDebits,
    declaredTotalCreditsCents: totalCredits,
    transactions,
  });
}
