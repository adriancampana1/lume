'use client';

import { useTransition } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/primitives/button.js';

type Props = { callbackUrl: string };

export function SignInButton({ callbackUrl }: Props) {
  const [pending, start] = useTransition();
  return (
    <Button
      type="button"
      disabled={pending}
      trailing={!pending ? <ArrowRight size={16} strokeWidth={2.4} /> : null}
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
    >
      {pending ? 'Indo pro Google…' : 'Entrar com Google'}
    </Button>
  );
}
