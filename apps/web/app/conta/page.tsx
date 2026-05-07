import { PageShell } from '../components/page-shell.js';
import { requireUser } from '../lib/session.js';
import { AccountForm } from './account-form.js';
import { DangerZone } from './danger-zone.js';
import { SignOutButton } from './sign-out-button.js';

const incomeLabels: Record<string, string> = {
  up_to_3k: 'Até R$ 3 mil',
  from_3k_to_6k: 'R$ 3 mil – R$ 6 mil',
  from_6k_to_12k: 'R$ 6 mil – R$ 12 mil',
  from_12k_to_25k: 'R$ 12 mil – R$ 25 mil',
  above_25k: 'Acima de R$ 25 mil',
  prefer_not_to_say: 'Prefere não responder',
};

export default async function ContaPage() {
  const user = await requireUser();
  const incomeLabel =
    user.incomeBracket && incomeLabels[user.incomeBracket]
      ? incomeLabels[user.incomeBracket]
      : 'Não definido';

  return (
    <PageShell actions={[]}>
      <div className="lume-rise flex items-center justify-between">
        <p className="t-eyebrow">minha conta</p>
        <SignOutButton />
      </div>

      <h1
        className="lume-rise lume-rise-1 mt-3 t-display-m text-[var(--color-ink)]"
        style={{ textWrap: 'balance' }}
      >
        Olá{user.name ? `, ${user.name.split(' ')[0]}` : ''}.
      </h1>
      <p className="lume-rise lume-rise-2 mt-3 font-mono t-body-s text-[var(--color-ink-2)]">
        {user.email}
      </p>

      <section className="lume-rise lume-rise-3 mt-14">
        <p className="t-eyebrow">preferências</p>
        <p className="mt-3 t-body text-[var(--color-ink-2)]">
          Faixa de renda atual:{' '}
          <strong className="font-semibold text-[var(--color-ink)]">{incomeLabel}</strong>
        </p>
        <div className="mt-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7">
          <AccountForm
            initialIncomeBracket={user.incomeBracket}
            initialMarketingOptIn={user.marketingOptIn}
          />
        </div>
      </section>

      <section className="lume-rise lume-rise-4 mt-14">
        <p className="t-eyebrow">privacidade</p>
        <p className="mt-3 max-w-[60ch] t-body text-[var(--color-ink-2)]">
          Você pode exportar tudo o que temos sobre você ou excluir sua conta a qualquer momento. A
          exclusão é imediata; reversível por 30 dias.
        </p>
        <div className="mt-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7">
          <DangerZone />
        </div>
      </section>
    </PageShell>
  );
}
