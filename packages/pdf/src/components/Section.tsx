import type { ReactNode } from 'react';

type Props = {
  number: string;
  title: string;
  pageBreak?: boolean;
  children: ReactNode;
};

export function Section({ number, title, pageBreak = false, children }: Props) {
  return (
    <section className={pageBreak ? 'page-break' : ''}>
      <h2 className="section-title">
        <span className="num">{number}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
