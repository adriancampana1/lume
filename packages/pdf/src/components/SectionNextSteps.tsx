import type { Report } from '@lume/ai';
import { Section } from './Section.js';

type Props = { report: Report };

export function SectionNextSteps({ report }: Props) {
  return (
    <Section number="07" title="Próximos passos">
      <p className="lede">{report.narrative.nextSteps}</p>
    </Section>
  );
}
