import Link from 'next/link';
import { PageShell } from '../components/page-shell.js';
import { SignInButton } from './sign-in-button.js';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; callbackUrl?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.callbackUrl ?? sp.next ?? '/conta';

  return (
    <PageShell actions={[]}>
      <p className="lume-rise t-eyebrow">entrar</p>
      <h1
        className="lume-rise lume-rise-1 mt-3 t-display-m text-[var(--color-ink)]"
        style={{ textWrap: 'balance' }}
      >
        Bem-vindo.
      </h1>
      <p className="lume-rise lume-rise-2 mt-4 max-w-[52ch] t-body-l text-[var(--color-ink-2)]">
        Entre com Google para receber sua análise por email. Não pedimos senha, não guardamos seu
        extrato.
      </p>

      {sp.error ? (
        <p
          role="alert"
          className="lume-rise lume-rise-3 mt-6 rounded-[var(--radius-input)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-3 t-body-s text-[var(--color-danger)]"
        >
          Não conseguimos entrar agora. Tente novamente em instantes.
        </p>
      ) : null}

      <div className="lume-rise lume-rise-4 mt-8">
        <SignInButton callbackUrl={next} />
      </div>

      <p className="lume-rise lume-rise-5 mt-8 max-w-[60ch] t-caption">
        Ao entrar, você aceita nossos{' '}
        <Link
          href="/privacidade"
          className="text-[var(--color-ink)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-4 hover:decoration-[var(--color-accent-edge)]"
        >
          termos de privacidade
        </Link>
        . Seus extratos são processados em segundos e nunca persistidos.
      </p>
    </PageShell>
  );
}
