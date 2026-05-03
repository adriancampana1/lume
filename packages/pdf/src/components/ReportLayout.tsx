import type { Report } from '@lume/ai';
import { formatPeriod } from '../format.js';
import { PDF_STYLES } from '../styles.js';
import { Wordmark } from './Wordmark.js';
import { SectionSummary } from './SectionSummary.js';
import { SectionWhereTheMoneyWent } from './SectionWhereTheMoneyWent.js';
import { SectionTrends } from './SectionTrends.js';
import { SectionRecurring } from './SectionRecurring.js';
import { SectionBenchmark } from './SectionBenchmark.js';
import { SectionRecommendations } from './SectionRecommendations.js';
import { SectionNextSteps } from './SectionNextSteps.js';

type Props = { report: Report };

export function ReportLayout({ report }: Props) {
  const period = formatPeriod(report.periodStart, report.periodEnd);
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <title>Lume — {period}</title>
        <style dangerouslySetInnerHTML={{ __html: PDF_STYLES }} />
      </head>
      <body>
        <main>
          <div className="cover">
            <Wordmark />
            <div>
              <h1>
                A <em>clareza</em> que <br /> faltava nas suas <br /> contas do mês.
              </h1>
              <p className="meta">{period}</p>
            </div>
            <p className="meta">
              Este relatório foi gerado a partir do extrato que você enviou. Os
              arquivos originais foram descartados ao final do processamento.
            </p>
          </div>

          <SectionSummary report={report} />
          <SectionWhereTheMoneyWent report={report} />
          <SectionTrends report={report} />
          <SectionRecurring report={report} />
          <SectionBenchmark report={report} />
          <SectionRecommendations report={report} />
          <SectionNextSteps report={report} />

          <footer className="report-footer">
            Lume · relatório utilitário · sem retenção de dados financeiros · v1.0
          </footer>
        </main>
      </body>
    </html>
  );
}
