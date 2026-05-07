import React, { type ReactNode } from 'react';

type Props = {
  number: string;
  title: string;
  pageBreak?: boolean;
  children: ReactNode;
};

export function Section({ number, title, pageBreak = false, children }: Props) {
  return (
    <section className={pageBreak ? 'page-break' : ''}>
      <header className="section-head">
        <span className="num">
          <span>{number}</span>
          <span className="dash">—</span>
        </span>
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
}
