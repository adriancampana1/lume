import React from 'react';
import type { Report } from '@lume/ai';
import { formatPeriod, formatMonth } from '../format.js';
import { PDF_STYLES } from '../styles.js';
import { Wordmark } from './Wordmark.js';
import { SectionSummary } from './SectionSummary.js';
import { SectionIncome } from './SectionIncome.js';
import { SectionWhereTheMoneyWent } from './SectionWhereTheMoneyWent.js';
import { SectionTrends } from './SectionTrends.js';
import { SectionRecurring } from './SectionRecurring.js';
import { SectionBenchmark } from './SectionBenchmark.js';
import { SectionRecommendations } from './SectionRecommendations.js';
import { SectionNextSteps } from './SectionNextSteps.js';

type Props = { report: Report };

function periodDisplay(periodStart: string, periodEnd: string): string {
  const startMonth = formatMonth(periodStart);
  const endMonth = formatMonth(periodEnd);
  const year = periodEnd.slice(0, 4);
  if (startMonth === endMonth) return `${startMonth} · ${year}`;
  return `${startMonth} – ${endMonth} · ${year}`;
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

export function ReportLayout({ report }: Props) {
  const period = formatPeriod(report.periodStart, report.periodEnd);
  const cover = periodDisplay(report.periodStart, report.periodEnd);
  const issued = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const hasTrends =
    report.trends.filter((t) => t.direction !== 'flat').length > 0;
  const hasBenchmark = report.benchmark != null;

  let n = 1;
  const summaryNum = pad2(n++);
  const incomeNum = pad2(n++);
  const spendNum = pad2(n++);
  const recurringNum = pad2(n++);
  const benchmarkNum = hasBenchmark ? pad2(n++) : null;
  const trendsNum = hasTrends ? pad2(n++) : null;
  const recsNum = pad2(n++);
  const nextStepsNum = pad2(n++);

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <title>Lume — ${period}</title>
        <style dangerouslySetInnerHTML={{ __html: PDF_STYLES }} />
      </head>
      <body>
        <main>
          <div className="watermark" aria-hidden="true">
            lume<span className="pulse" />
          </div>

          <div className="cover">
            <div className="top">
              <Wordmark size="md" />
              <div className="period mono">{cover}</div>
            </div>

            <div>
              <div className="display">
                <span className="label">Relatório financeiro mensal</span>
                <h1>
                  clareza<span className="accent-dot" aria-hidden="true" />
                </h1>
              </div>
              <p className="subtitle">
                A <b>visão completa</b> de para onde foi o seu dinheiro no
                período.
              </p>
            </div>

            <div className="footnote">
              <p className="privacy">
                Este relatório foi gerado a partir do extrato que você enviou.
                Os arquivos originais foram descartados ao final do
                processamento. Nenhum dado financeiro fica retido.
              </p>
            </div>
          </div>

          <SectionSummary report={report} number={summaryNum} />
          <SectionIncome report={report} number={incomeNum} />
          <SectionWhereTheMoneyWent report={report} number={spendNum} />
          <SectionRecurring report={report} number={recurringNum} />
          {hasBenchmark && benchmarkNum && (
            <SectionBenchmark report={report} number={benchmarkNum} />
          )}
          {hasTrends && trendsNum && (
            <SectionTrends report={report} number={trendsNum} />
          )}
          <SectionRecommendations report={report} number={recsNum} />
          <SectionNextSteps report={report} number={nextStepsNum} />

          <footer className="report-footer">
            <span>lume · privacidade preservada</span>
            <span className="version">v1.0</span>
          </footer>
        </main>
      </body>
    </html>
  );
}
