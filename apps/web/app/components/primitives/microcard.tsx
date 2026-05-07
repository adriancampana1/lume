import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  eyebrow?: string;
};

export function Microcard({ title, children, icon, eyebrow }: Props) {
  return (
    <div className="rounded-[var(--radius-card-inner)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        {icon ? (
          <div
            aria-hidden="true"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[var(--color-ink)] text-[var(--color-accent)]"
          >
            {icon}
          </div>
        ) : null}
        <div className="min-w-0">
          {eyebrow ? (
            <div className="t-eyebrow mb-1.5 text-[var(--color-ink-3)]">{eyebrow}</div>
          ) : null}
          <h3 className="t-h3 mb-1.5 text-[var(--color-ink)]">{title}</h3>
          <div className="t-body-s text-[var(--color-ink-2)] [&_b]:font-semibold [&_b]:text-[var(--color-ink)] [&_strong]:font-semibold [&_strong]:text-[var(--color-ink)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
