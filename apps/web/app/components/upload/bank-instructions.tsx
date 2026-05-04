import { Accordion } from '../primitives/accordion.js';
import { copy } from '../../lib/copy.js';

const banks = [
  {
    value: 'itau',
    title: 'Itaú',
    content:
      'No app, abra Cartões ou Conta corrente → Extrato → escolha o período → "Compartilhar" → "Salvar PDF" → envie pra você mesmo.',
  },
  {
    value: 'nubank',
    title: 'Nubank',
    content:
      'No app, toque na conta ou cartão → "Histórico" → ícone de papel no canto → "Exportar" → escolha mês → PDF.',
  },
  {
    value: 'inter',
    title: 'Inter',
    content: 'Menu → Extrato → "Filtrar" mês → "Exportar PDF".',
  },
  {
    value: 'bb',
    title: 'Banco do Brasil',
    content: 'Menu → Conta → Extrato → mudar período → "Compartilhar" → PDF.',
  },
  {
    value: 'bradesco',
    title: 'Bradesco',
    content: 'No app, Conta corrente → Extrato → 3 pontos → "Salvar como PDF".',
  },
  {
    value: 'santander',
    title: 'Santander',
    content: 'Conta corrente → Extrato → ícone de download → escolher PDF.',
  },
];

export function BankInstructions() {
  return (
    <details className="mt-10 rounded-[var(--radius-card)] border border-[var(--color-ink)]/10 px-5 py-2">
      <summary className="cursor-pointer py-3 text-sm font-medium text-[var(--color-ink)]">
        {copy.upload.bankInstructionsTitle}
      </summary>
      <div className="pb-2">
        <Accordion items={banks} />
      </div>
    </details>
  );
}
