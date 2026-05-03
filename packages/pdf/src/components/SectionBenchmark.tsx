import { formatPct } from '../format.js';
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

export function SectionBenchmark({ report }: Props) {
  if (!report.benchmark) return null;

  const total = report.totalSpentCents || 1;
  const yoursPct = (cat: Category) =>
    (report.categories[cat] ?? 0) / total;

  const rows = (Object.keys(LABELS) as Category[]).map((cat) => ({
    cat,
    yours: yoursPct(cat),
    bench: report.benchmark!.byCategoryPct[cat] ?? 0,
  }));

  return (
    <Section number="05" title="Comparativo com sua faixa" pageBreak>
      <div className="body-prose" style={{ marginBottom: '6mm' }}>
        <p>{report.narrative.benchmark}</p>
        <p style={{ color: 'var(--ink-soft)', fontSize: '9pt' }}>
          Fonte: {report.benchmark.reference}.
        </p>
      </div>
      {rows.map(({ cat, yours, bench }) => (
        <div key={cat} className="cat-bar">
          <div className="name">{LABELS[cat]}</div>
          <div className="track" style={{ position: 'relative' }}>
            <div
              className="fill"
              style={{
                width: `${Math.min(100, yours * 100)}%`,
                background: 'var(--terracotta)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: `${Math.min(100, bench * 100)}%`,
                width: '1mm',
                height: '100%',
                background: 'var(--ink)',
              }}
            />
          </div>
          <div className="total">{formatPct(yours)} · {formatPct(bench)}</div>
        </div>
      ))}
      <p style={{ color: 'var(--ink-soft)', fontSize: '9pt', marginTop: '4mm' }}>
        Barra terracota = você. Marcador escuro = média da sua faixa.
      </p>
    </Section>
  );
}
