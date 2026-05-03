import { formatBRL } from '../format.js';
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

type Props = { report: Report };

export function SectionWhereTheMoneyWent({ report }: Props) {
  const sorted = (Object.entries(report.categories) as Array<[Category, number]>)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] ?? 1;

  return (
    <Section number="02" title="Para onde foi o dinheiro" pageBreak>
      <div className="body-prose" style={{ marginBottom: '6mm' }}>
        <p>{report.narrative.whereTheMoneyWent}</p>
      </div>
      <div>
        {sorted.map(([cat, total]) => (
          <div key={cat} className="cat-bar">
            <div className="name">{LABELS[cat]}</div>
            <div className="track">
              <div className="fill" style={{ width: `${(total / max) * 100}%` }} />
            </div>
            <div className="total">{formatBRL(total)}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
