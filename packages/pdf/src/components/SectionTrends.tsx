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

export function SectionTrends({ report }: Props) {
  const moving = report.trends
    .filter((t) => t.direction !== 'flat')
    .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
    .slice(0, 6);

  return (
    <Section number="03" title="Tendências" pageBreak>
      <div className="body-prose" style={{ marginBottom: '6mm' }}>
        <p>{report.narrative.trends}</p>
      </div>
      {moving.length === 0 ? (
        <p style={{ color: 'var(--ink-soft)' }}>
          Sem variações relevantes detectadas com os meses analisados.
        </p>
      ) : (
        <div>
          {moving.map((t) => (
            <div key={t.category} className="cat-bar">
              <div className="name">{LABELS[t.category]}</div>
              <div className="track">
                <div
                  className="fill"
                  style={{
                    width: `${Math.min(100, Math.abs(t.changePct) * 100)}%`,
                    background:
                      t.direction === 'up' ? 'var(--terracotta)' : 'var(--ink-soft)',
                  }}
                />
              </div>
              <div className="total">
                {t.direction === 'up' ? '+' : ''}
                {formatPct(t.changePct)}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
