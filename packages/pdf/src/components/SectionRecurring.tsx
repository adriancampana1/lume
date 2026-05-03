import { formatBRL } from '../format.js';
import type { Report } from '@lume/ai';
import { Section } from './Section.js';

type Props = { report: Report };

const STATUS_LABEL = {
  active: 'Ativo',
  dormant: 'Dormente',
  increasing: 'Crescendo',
} as const;

export function SectionRecurring({ report }: Props) {
  return (
    <Section number="04" title="Recorrências e assinaturas" pageBreak>
      <div className="body-prose" style={{ marginBottom: '6mm' }}>
        <p>{report.narrative.recurring}</p>
      </div>
      {report.recurring.length === 0 ? (
        <p style={{ color: 'var(--ink-soft)' }}>
          Não identificamos recorrências claras nos meses analisados.
        </p>
      ) : (
        report.recurring
          .slice()
          .sort((a, b) => b.averageAmountCents - a.averageAmountCents)
          .map((r) => (
            <div
              key={r.description}
              className={`recurring-card ${r.status === 'dormant' ? 'dormant' : r.status === 'increasing' ? 'increasing' : ''}`}
            >
              <div className="head">
                <span style={{ fontWeight: 500 }}>{r.description}</span>
                <span>{formatBRL(r.averageAmountCents)}</span>
              </div>
              <div className="meta">
                {STATUS_LABEL[r.status]} · {r.monthsSeen}{' '}
                {r.monthsSeen === 1 ? 'mês' : 'meses'} · última vez {r.lastSeenDate}
              </div>
            </div>
          ))
      )}
    </Section>
  );
}
