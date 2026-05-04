import { copy } from '../../lib/copy.js';

export function HowItWorks() {
  const { title, steps } = copy.landing.howItWorks;

  return (
    <section id="como-funciona" className="px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <h2
          className="mb-12 font-serif text-3xl tracking-tight sm:text-4xl"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          {title}
        </h2>
        <ol className="space-y-10">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-6">
              <span
                className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-ink)]/20 text-sm font-medium text-[var(--color-ink-soft)]"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-serif text-xl italic text-[var(--color-ink)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-[var(--color-ink-soft)]">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
