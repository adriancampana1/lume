import { NarrativeSchema, type Narrative } from './types.js';
import type { LlmClient } from './llm/client.js';
import type { Aggregations } from './aggregate.js';
import type { Benchmark } from './types.js';
import { NARRATIVE_SYSTEM } from './prompts.js';
import { validateNarrative } from './validate-narrative.js';

export type ComposeInput = {
  llm: LlmClient;
  aggregations: Aggregations;
  benchmark: Benchmark | null;
  economyMode?: boolean;
};

function stripFences(s: string): string {
  return s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
}

function buildContext(aggs: Aggregations, bench: Benchmark | null): string {
  return JSON.stringify({ aggregations: aggs, benchmark: bench }, null, 2);
}

function deterministicFallback(aggs: Aggregations): Narrative {
  const reais = (c: number) => `R$ ${(c / 100).toFixed(0)}`;
  const top = [...Object.entries(aggs.categoryTotals)]
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3)
    .filter(([, v]) => (v as number) > 0);

  return {
    summary: `Período de ${aggs.monthsCovered} ${aggs.monthsCovered === 1 ? 'mês' : 'meses'} com ${aggs.transactionsCount} transações. Você gastou ${reais(aggs.totalSpentCents)} e recebeu ${reais(aggs.totalReceivedCents)}.`,
    whereTheMoneyWent:
      top.length > 0
        ? `As três maiores categorias foram: ${top.map(([c, v]) => `${c} (${reais(v as number)})`).join(', ')}.`
        : 'Sem gastos significativos no período.',
    trends:
      aggs.monthsCovered >= 2
        ? 'Veja gráficos do relatório para tendências por categoria.'
        : 'Com apenas 1 mês de dados, ainda não temos tendência confiável.',
    recurring:
      aggs.recurring.length > 0
        ? `Identificamos ${aggs.recurring.length} recorrências. Veja a seção dedicada.`
        : 'Não identificamos recorrências claras neste período.',
    benchmark: 'Comparativo com benchmark indisponível para este relatório.',
    recommendations: [
      'Revisar despesas recorrentes que possam ter ficado dormentes.',
      'Avaliar se categorias acima do benchmark refletem prioridades atuais.',
      'Voltar a olhar este relatório em 30 dias com extratos atualizados.',
    ],
    nextSteps: 'Volte em 30 dias para acompanhar a evolução.',
  };
}

export async function composeNarrative(input: ComposeInput): Promise<Narrative> {
  const ctx = buildContext(input.aggregations, input.benchmark);
  const economy = input.economyMode ?? false;
  const attempts = economy ? 1 : 2;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const result = await input.llm.call({
      model: economy ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-6',
      system: NARRATIVE_SYSTEM,
      maxTokens: economy ? 1500 : 3000,
      temperature: 0.3,
      input: [{ kind: 'text', text: ctx }],
    });

    const cleaned = stripFences(result.text);
    let parsed: Narrative;
    try {
      parsed = NarrativeSchema.parse(JSON.parse(cleaned));
    } catch {
      continue;
    }

    const allText = Object.values(parsed)
      .flatMap((v) => (Array.isArray(v) ? v : [v]))
      .join(' ');

    const validation = validateNarrative({
      narrative: allText,
      aggregations: input.aggregations,
    });
    if (validation.ok) return parsed;
  }

  return deterministicFallback(input.aggregations);
}
