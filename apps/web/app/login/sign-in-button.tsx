'use client';

import { useTransition } from 'react';

type Props = { callbackUrl: string };

export function SignInButton({ callbackUrl }: Props) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await fetch('/api/auth/csrf');
          const { csrfToken } = (await res.json()) as { csrfToken: string };
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = '/api/auth/signin/google';
          const csrf = document.createElement('input');
          csrf.name = 'csrfToken';
          csrf.value = csrfToken;
          form.appendChild(csrf);
          const cb = document.createElement('input');
          cb.name = 'callbackUrl';
          cb.value = callbackUrl;
          form.appendChild(cb);
          document.body.appendChild(form);
          form.submit();
        })
      }
      className="mt-10 inline-flex items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-7 py-3.5 text-sm font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-terracotta)] disabled:opacity-60"
    >
      {pending ? 'Indo pro Google…' : 'Entrar com Google'}
    </button>
  );
}