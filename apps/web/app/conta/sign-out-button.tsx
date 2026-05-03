'use client';

import { useTransition } from 'react';

export function SignOutButton() {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await fetch('/api/auth/csrf');
          const { csrfToken } = (await res.json()) as { csrfToken: string };
          await fetch('/api/auth/signout', {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ csrfToken, callbackUrl: '/' }).toString(),
            credentials: 'include',
          });
          window.location.href = '/';
        })
      }
      className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)] disabled:opacity-60"
    >
      {pending ? 'Saindo…' : 'Sair'}
    </button>
  );
}