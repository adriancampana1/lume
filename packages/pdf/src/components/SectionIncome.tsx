import React from 'react';
import { formatBRL } from '../format.js';
import type { Report } from '@lume/ai';
import { Section } from './Section.js';

type Props = { report: Report; number: string };

export function SectionIncome({ report, number }: Props) {
  const sources = report.incomeSources ?? [];

  return (
    <Section number={number} title="Entradas">
      <div className="body-prose" style={{ marginBottom: '6mm' }}>
        <p>
          Origens das receitas reconhecidas no período, ordenadas por valor.
          Movimentações entre contas próprias e estornos não entram nesta
          lista.
        </p>
      </div>

      {sources.length === 0 ? (
        <p className="empty">
          Nenhuma entrada identificada no período analisado.
        </p>
      ) : (
        <>
          <div className="income-list">
            {sources.map((s) => (
              <div key={s.description} className="income-row">
                <span className="name">{s.description}</span>
                <span className="occ">
                  {s.occurrences === 1
                    ? '1 entrada'
                    : `${s.occurrences} entradas`}
                </span>
                <span className="amt">{formatBRL(s.totalCents)}</span>
              </div>
            ))}
          </div>
          <div className="income-total">
            <span className="label">Total recebido</span>
            <span className="amt">
              {formatBRL(report.totalReceivedCents)}
            </span>
          </div>
        </>
      )}
    </Section>
  );
}
