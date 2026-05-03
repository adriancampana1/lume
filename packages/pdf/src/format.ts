const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function formatBRL(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const reais = Math.floor(abs / 100);
  const cs = abs % 100;
  const reaisStr = reais.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}R$ ${reaisStr},${cs.toString().padStart(2, '0')}`;
}

export function formatPct(fraction: number): string {
  const pct = Math.round(fraction * 100);
  return `${pct}%`;
}

export function formatMonth(yyyyMM: string): string {
  const idx = Number.parseInt(yyyyMM.slice(5, 7), 10) - 1;
  return MONTHS_PT[idx] ?? yyyyMM;
}

export function formatPeriod(periodStart: string, periodEnd: string): string {
  const startMonth = Number.parseInt(periodStart.slice(5, 7), 10) - 1;
  const endMonth = Number.parseInt(periodEnd.slice(5, 7), 10) - 1;
  const year = periodEnd.slice(0, 4);
  if (startMonth === endMonth) {
    return `${MONTHS_PT[startMonth]} de ${year}`;
  }
  return `${MONTHS_PT[startMonth]} a ${MONTHS_PT[endMonth]} de ${year}`;
}
