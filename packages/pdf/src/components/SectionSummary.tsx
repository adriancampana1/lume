import React from 'react';
import { formatBRL } from '../format.js';
import type { Report } from '@lume/ai';
import { Section } from './Section.js';

type Props = { report: Report; number: string };

const CATEGORY_LABEL: Record<string, string> = {
  moradia: 'moradia',
  mercado: 'mercado',
  restaurante: 'restaurante',
  transporte: 'transporte',
  saude: 'saúde',
  educacao: 'educação',
  lazer_e_hobby: 'lazer e hobby',
  compras: 'compras',
  assinaturas_e_servicos: 'assinaturas e serviços',
  transferencias_e_outros: 'transferências e outros',
};

function topCategory(categories: Report['categories']): { key: string; cents: number } | null {
  const entries = Object.entries(categories);
  if (entries.length === 0) return null;
  let best = entries[0]!;
  for (const e of entries) if (e[1] > best[1]) best = e;
  return { key: best[0], cents: best[1] };
}

export function SectionSummary({ report, number }: Props) {
  const balance = report.totalReceivedCents - report.totalSpentCents;
  const positive = balance >= 0;
  const max = Math.max(report.totalReceivedCents, report.totalSpentCents, 1);
  const inPct = (report.totalReceivedCents / max) * 100;
  const outPct = (report.totalSpentCents / max) * 100;

  const top = topCategory(report.categories);
  const topShare =
    top && report.totalSpentCents > 0
      ? Math.round((top.cents / report.totalSpentCents) * 100)
      : 0;

  const biggest = report.topMerchants[0] ?? null;

  return (
    <Section number={number} title="Resumo do período">
      <p className="lede lede-large">{report.narrative.summary}</p>

      <div className="flow">
        <div className="flow-row">
          <div className="flow-side flow-in">
            <span className="eyebrow">Entradas</span>
            <span className="flow-amt mono">
              {formatBRL(report.totalReceivedCents)}
            </span>
            <div
              className="flow-bar flow-bar-in"
              style={{ width: `${inPct}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="flow-side flow-out">
            <span className="eyebrow">Saídas</span>
            <span className="flow-amt mono">
              {formatBRL(report.totalSpentCents)}
            </span>
            <div
              className="flow-bar flow-bar-out"
              style={{ width: `${outPct}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className={`flow-balance ${positive ? 'is-positive' : 'is-negative'}`}>
          <span className="flow-balance-label eyebrow">
            {positive ? 'Sobrou no período' : 'Fechou negativo'}
          </span>
          <span className="flow-balance-amt mono">
            {positive ? '+ ' : '− '}
            {formatBRL(Math.abs(balance))}
          </span>
        </div>
      </div>

      <div className="highlights">
        <span className="eyebrow highlights-title">Destaques</span>
        <dl className="highlights-list">
          {top && (
            <div className="hl-row">
              <dt>maior categoria</dt>
              <dd className="hl-name">{CATEGORY_LABEL[top.key] ?? top.key}</dd>
              <dd className="hl-amt mono">{formatBRL(top.cents)}</dd>
              <dd className="hl-share mono">{topShare}%</dd>
            </div>
          )}
          {biggest && (
            <div className="hl-row">
              <dt>transação mais alta</dt>
              <dd className="hl-name">{biggest.description.toLowerCase()}</dd>
              <dd className="hl-amt mono">{formatBRL(biggest.totalCents)}</dd>
              <dd className="hl-share mono">
                {CATEGORY_LABEL[biggest.category] ?? biggest.category}
              </dd>
            </div>
          )}
          <div className="hl-row">
            <dt>movimentações</dt>
            <dd className="hl-name">no período</dd>
            <dd className="hl-amt mono">{report.transactionsCount}</dd>
            <dd className="hl-share mono">
              {report.recurring.length} recorrentes
            </dd>
          </div>
        </dl>
      </div>
    </Section>
  );
}
