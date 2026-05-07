import { copy } from '../../lib/copy.js';

export function HowItWorks() {
  const { title, steps } = copy.landing.howItWorks;

  return (
    <section id="como-funciona" className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <header className="lg:col-span-4">
            <span className="t-eyebrow">01 · como funciona</span>
            <h2 className="mt-4 t-display-m text-[var(--color-ink)]" style={{ textWrap: 'balance' }}>
              {title}.
            </h2>
            <p className="mt-4 max-w-[36ch] t-body text-[var(--color-ink-2)]">
              Três passos. Nada de planilha, nada de categorizar à mão, nada de login no banco.
            </p>
          </header>

          <ol className="lg:col-span-8 lg:pt-1.5">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="grid grid-cols-[auto_1fr] items-start gap-x-5 border-t border-[var(--color-border)] py-7 first:border-t-0 first:pt-0 sm:gap-x-8"
              >
                <span
                  className="font-mono tabular text-[13px] font-semibold leading-[28px] text-[var(--color-ink-3)]"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="t-h2 text-[var(--color-ink)]" style={{ textWrap: 'balance' }}>
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-[60ch] t-body text-[var(--color-ink-2)]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
