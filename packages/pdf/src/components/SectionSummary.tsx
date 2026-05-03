import { formatBRL } from '../format.js';
import type { Report } from '@lume/ai';
import { Section } from './Section.js';

type Props = { report: Report };

export function SectionSummary({ report }: Props) {
  return (
    <Section number="01" title="Resumo do período">
      <p className="lede">{report.narrative.summary}</p>
      <div className="kpi-row">
        <div className="kpi">
          <div className="label">Total gasto</div>
          <div className="value">{formatBRL(report.totalSpentCents)}</div>
        </div>
        <div className="kpi">
          <div className="label">Total recebido</div>
          <div className="value">{formatBRL(report.totalReceivedCents)}</div>
        </div>
        <div className="kpi">
          <div className="label">Transações</div>
          <div className="value">{report.transactionsCount}</div>
        </div>
      </div>
    </Section>
  );
}
