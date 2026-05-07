import { MockLlmClient } from '@lume/ai';
import type { LlmClient } from '@lume/ai';

const STATEMENT = {
  bank: 'nubank',
  periodStart: '2025-04-01',
  periodEnd: '2025-04-30',
  openingBalanceCents: 500000,
  closingBalanceCents: 483870,
  declaredTotalDebitsCents: 116130,
  declaredTotalCreditsCents: 100000,
  transactions: [
    { date: '2025-04-02', description: 'IFOOD RESTAURANTE', amountCents: -4500, kind: 'debit' },
    { date: '2025-04-05', description: 'UBER VIAGEM', amountCents: -2800, kind: 'debit' },
    { date: '2025-04-08', description: 'SALARIO EMPRESA', amountCents: 100000, kind: 'credit' },
    { date: '2025-04-12', description: 'NETFLIX MENSAL', amountCents: -3990, kind: 'debit' },
    { date: '2025-04-15', description: 'PAO DE ACUCAR', amountCents: -18750, kind: 'debit' },
    { date: '2025-04-18', description: 'PIX TRANSFERENCIA', amountCents: -50000, kind: 'debit' },
    { date: '2025-04-22', description: 'POSTO IPIRANGA', amountCents: -25000, kind: 'debit' },
    { date: '2025-04-25', description: 'SPOTIFY PREMIUM', amountCents: -2190, kind: 'debit' },
    { date: '2025-04-28', description: 'FARMACIA DROGASIL', amountCents: -8900, kind: 'debit' },
  ],
};

const NARRATIVE = {
  summary:
    'No período analisado seu saldo caiu de R$5.000,00 para R$3.200,00. Saídas concentraram-se em mercado, restaurante e transporte.',
  whereTheMoneyWent:
    'A maior parte das despesas foi para mercado e restaurantes. Transporte aparece em terceiro com gasto regular em apps e combustível.',
  trends: 'Categorias estáveis no período, sem aumentos ou quedas notáveis.',
  recurring:
    'Identificadas duas assinaturas ativas (Netflix e Spotify), totais consistentes mês a mês.',
  benchmark:
    'Faixa de renda informada está em linha com a referência POF/IBGE 2024 para gastos essenciais.',
  recommendations: [
    'Revise as assinaturas mensais e cancele as que não usa.',
    'Defina um teto mensal para restaurantes e delivery.',
    'Considere consolidar transporte com transporte público em rotas frequentes.',
  ],
  nextSteps: 'Volte aqui em 30 dias para comparar evolução.',
};

export function createMockLlmClient(): LlmClient {
  const client = new MockLlmClient();

  client.on('Você é um extrator', async () => JSON.stringify(STATEMENT));

  client.on('Você categoriza descrições', async (opts) => {
    const userText = opts.input
      .filter((p): p is { kind: 'text'; text: string } => p.kind === 'text')
      .map((p) => p.text)
      .join('\n');
    const lines = userText.split('\n').filter((l) => /^\d+\./.test(l.trim()));
    return lines.map((l, i) => `${i + 1}. transferencias_e_outros`).join('\n');
  });

  client.on('Você é um analista financeiro', async () => JSON.stringify(NARRATIVE));

  return client;
}
