import React from 'react';
import { formatPct } from '../format.js';
import type { Report } from '@lume/ai';
import type { Category } from '@lume/shared';
import { Section } from './Section.js';

const LABELS: Record<Category, string> = {
  moradia: 'Moradia',
  mercado: 'Mercado',
  restaurante: 'Restaurante',
  transporte: 'Transporte',
  saude: 'Saúde',
  educacao: 'Educação',
  lazer_e_hobby: 'Lazer e hobby',
  compras: 'Compras',
  assinaturas_e_servicos: 'Assinaturas e serviços',
  transferencias_e_outros: 'Transferências e outros',
};

type Props = { report: Report; number: string };

export function SectionTrends({ report, number }: Props) {
  const moving = report.trends
    .filter((t) => t.direction !== 'flat')
    .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
    .slice(0, 6);

  if (moving.length === 0) return null;

  const maxAbs = moving.reduce(
    (m, t) => Math.max(m, Math.abs(t.changePct)),
    0,
  );

  return (
    <Section number={number} title="Tendências" pageBreak>
      <div className="body-prose" style={{ marginBottom: '6mm' }}>
        <p>{report.narrative.trends}</p>
      </div>
      <div className="bars">
        {moving.map((t, i) => {
          const widthPct =
            maxAbs > 0
              ? Math.min(100, (Math.abs(t.changePct) / maxAbs) * 100)
              : 0;
          const isLead = i === 0;
          const sign = t.direction === 'up' ? '+' : '−';
          return (
            <div key={t.category} className="bar-row">
              <div className="name">{LABELS[t.category]}</div>
              <div className="track">
                <div className="fill" style={{ width: `${widthPct}%` }} />
                {isLead && (
                  <div
                    className="lead-dot"
                    style={{ left: `${widthPct}%` }}
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="total">
                {sign}
                {formatPct(Math.abs(t.changePct))}
                <span className="delta">
                  {t.direction === 'up' ? 'subiu' : 'caiu'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
