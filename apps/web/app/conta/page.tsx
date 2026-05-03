import { Wordmark } from '../components/wordmark.js';
import { requireUser } from '../lib/session.js';
import { AccountForm } from './account-form.js';
import { DangerZone } from './danger-zone.js';
import { SignOutButton } from './sign-out-button.js';

const incomeLabels: Record<string, string> = {
  up_to_3k: 'Até R$3 mil',
  from_3k_to_6k: 'R$3 mil – R$6 mil',
  from_6k_to_12k: 'R$6 mil – R$12 mil',
  from_12k_to_25k: 'R$12 mil – R$25 mil',
  above_25k: 'Acima de R$25 mil',
  prefer_not_to_say: 'Prefere não responder',
};

export default async function ContaPage() {
  const user = await requireUser();
  const incomeLabel =
    user.incomeBracket && incomeLabels[user.incomeBracket]
      ? incomeLabels[user.incomeBracket]
      : 'Não definido';

  return (
    <main className="min-h-screen px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <header className="mb-12 flex items-center justify-between">
          <Wordmark size="sm" />
          <SignOutButton />
        </header>

        <section>
          <h1
            className="font-serif text-3xl leading-[1.1] sm:text-5xl"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Olá{user.name ? `, ${user.name.split(' ')[0]}` : ''}.
          </h1>
          <p className="mt-3 text-base text-[var(--color-ink-soft)]">{user.email}</p>
        </section>

        <section className="mt-14">
          <h2 className="text-sm uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Suas preferências
          </h2>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            Faixa de renda atual: <strong className="text-[var(--color-ink)]">{incomeLabel}</strong>
          </p>
          <div className="mt-6">
            <AccountForm
              initialIncomeBracket={user.incomeBracket}
              initialMarketingOptIn={user.marketingOptIn}
            />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-sm uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Sua privacidade
          </h2>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            Você pode exportar tudo o que temos sobre você ou excluir sua conta a qualquer
            momento. A exclusão é imediata; reversível por 30 dias.
          </p>
          <div className="mt-6">
            <DangerZone />
          </div>
        </section>
      </div>
    </main>
  );
}