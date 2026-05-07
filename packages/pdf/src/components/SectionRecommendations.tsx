import React from 'react';
import type { Report } from '@lume/ai';
import { Section } from './Section.js';

type Props = { report: Report; number: string };

export function SectionRecommendations({ report, number }: Props) {
  return (
    <Section number={number} title="Recomendações acionáveis" pageBreak>
      <ol className="recommendations">
        {report.narrative.recommendations.map((rec, i) => (
          <li key={i}>{rec}</li>
        ))}
      </ol>
    </Section>
  );
}
