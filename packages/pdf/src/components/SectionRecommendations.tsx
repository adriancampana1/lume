import type { Report } from '@lume/ai';
import { Section } from './Section.js';

type Props = { report: Report };

export function SectionRecommendations({ report }: Props) {
  return (
    <Section number="06" title="Recomendações acionáveis" pageBreak>
      <ol className="recommendations">
        {report.narrative.recommendations.map((rec, i) => (
          <li key={i}>{rec}</li>
        ))}
      </ol>
    </Section>
  );
}
