import React from 'react';
import type { Report } from '@lume/ai';
import { Section } from './Section.js';

type Props = { report: Report; number: string };

export function SectionNextSteps({ report, number }: Props) {
  return (
    <Section number={number} title="Próximos passos">
      <p className="lede">{report.narrative.nextSteps}</p>
    </Section>
  );
}
