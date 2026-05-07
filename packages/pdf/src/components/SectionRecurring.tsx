import React from 'react';
import { formatBRL } from '../format.js';
import type { Report } from '@lume/ai';
import { Section } from './Section.js';

type Props = { report: Report; number: string };

const STATUS_LABEL = {
  active: 'Ativo',
  dormant: 'Dormente',
  increasing: 'Crescendo',
} as const;

export function SectionRecurring({ report, number }: Props) {
  return (
    <Section number={number} title="Recorrências e assinaturas" pageBreak>
      <div className="body-prose" style={{ marginBottom: '6mm' }}>
        <p>{report.narrative.recurring}</p>
      </div>
      {report.recurring.length === 0 ? (
        <p className="empty">
          Não identificamos recorrências claras nos meses analisados.
        </p>
      ) : (
        <div className="recurring-list">
          {report.recurring
            .slice()
            .sort((a, b) => b.averageAmountCents - a.averageAmountCents)
            .map((r) => {
              const badgeClass =
                r.status === 'dormant'
                  ? 'badge dormant'
                  : r.status === 'increasing'
                    ? 'badge increasing'
                    : 'badge';
              return (
                <div key={r.description} className="recurring-card">
                  <div className="head">
                    <span className="desc">{r.description}</span>
                    <span className="amount">
                      {formatBRL(r.averageAmountCents)}
                    </span>
                  </div>
                  <div className="meta">
                    <span className={badgeClass}>
                      <span className="dot" aria-hidden="true" />
                      {STATUS_LABEL[r.status]}
                    </span>
                    <span>
                      {r.monthsSeen}{' '}
                      {r.monthsSeen === 1 ? 'mês' : 'meses'}
                    </span>
                    <span>última {r.lastSeenDate}</span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </Section>
  );
}
