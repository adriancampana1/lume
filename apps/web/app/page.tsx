import { Wordmark } from './components/wordmark.js';

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-16">
          <Wordmark size="md" />
        </header>

        <section>
          <h1
            className="font-serif text-4xl leading-[1.1] tracking-tight sm:text-6xl"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            A <em className="text-[var(--color-terracotta)]">clareza</em> que faltava nas
            suas contas do mês.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
            Suba seu extrato e receba um diagnóstico claro de para onde foi cada real, o
            que voltou recorrente e o que merece sua atenção.
          </p>
        </section>
      </div>
    </main>
  );
}
