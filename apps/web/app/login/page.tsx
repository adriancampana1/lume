import Link from 'next/link';
import { Wordmark } from '../components/wordmark.js';
import { SignInButton } from './sign-in-button.js';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next ?? '/conta';

  return (
    <main className="min-h-screen px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-md">
        <header className="mb-12">
          <Wordmark size="sm" />
        </header>

        <h1
          className="font-serif text-3xl leading-[1.1] tracking-tight sm:text-5xl"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          Bem-vindo.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-soft)]">
          Entre com Google para receber sua análise por email. Não pedimos senha, não
          guardamos seu extrato.
        </p>

        {sp.error && (
          <p className="mt-6 rounded-[var(--radius-input)] border border-[var(--color-terracotta)]/30 bg-[var(--color-terracotta)]/5 px-4 py-3 text-sm text-[var(--color-terracotta-dim)]">
            Não conseguimos entrar agora. Tente novamente em instantes.
          </p>
        )}

        <SignInButton callbackUrl={next} />

        <p className="mt-8 text-xs leading-relaxed text-[var(--color-ink-soft)]">
          Ao entrar, você aceita nossos{' '}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={'/privacidade' as any} className="underline">
            termos de privacidade
          </Link>
          . Seus extratos são processados em segundos e nunca persistidos.
        </p>
      </div>
    </main>
  );
}