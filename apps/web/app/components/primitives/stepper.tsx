type Step = { label: string };

type Props = {
  steps: Step[];
  current: number;
};

/** Horizontal top-level progress: upload → onboarding → resultado. Mono numerals. */
export function Stepper({ steps, current }: Props) {
  return (
    <ol
      className="flex items-center gap-2 t-eyebrow text-[var(--color-ink-3)]"
      aria-label={`etapa ${current + 1} de ${steps.length}`}
    >
      {steps.map((step, i) => {
        const isActive = i === current;
        const isDone = i < current;
        const isUpcoming = i > current;
        return (
          <li key={step.label} className="flex flex-1 items-center gap-2 last:flex-none">
            <span
              aria-current={isActive ? 'step' : undefined}
              className={`grid h-[22px] w-[22px] place-items-center rounded-[6px] font-mono text-[11px] font-semibold leading-none transition-colors duration-[200ms] ease-[var(--ease-out-expo)] ${
                isActive || isDone
                  ? 'bg-[var(--color-ink)] text-[var(--color-accent)]'
                  : 'border border-[var(--color-border-strong)] bg-transparent text-[var(--color-ink-3)]'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className={`shrink-0 transition-colors ${isActive ? 'text-[var(--color-ink)]' : ''}`}
            >
              {step.label}
            </span>
            {i < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="ml-1 h-px flex-1 min-w-[16px] bg-[var(--color-border)]"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
