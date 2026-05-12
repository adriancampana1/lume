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
      className="cursor-pointer t-eyebrow text-[var(--color-ink-2)] transition-colors duration-[200ms] ease-[var(--ease-out-expo)] hover:text-[var(--color-ink)] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
    >
      {pending ? 'saindo…' : 'sair'}
    </button>
  );
}
