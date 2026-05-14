'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/primitives/button.js';

type Props = { callbackUrl: string };

export function SignInButton({ callbackUrl }: Props) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch('/api/auth/csrf')
      .then((r) => r.json())
      .then((data: { csrfToken: string }) => setCsrfToken(data.csrfToken))
      .catch(() => {});
  }, []);

  function handleClick() {
    if (pending || !csrfToken) return;
    setPending(true);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/auth/signin/google';

    const csrf = document.createElement('input');
    csrf.type = 'hidden';
    csrf.name = 'csrfToken';
    csrf.value = csrfToken;
    form.appendChild(csrf);

    const cb = document.createElement('input');
    cb.type = 'hidden';
    cb.name = 'callbackUrl';
    cb.value = callbackUrl;
    form.appendChild(cb);

    document.body.appendChild(form);
    form.submit();
  }

  return (
    <Button
      type="button"
      disabled={pending || !csrfToken}
      trailing={!pending && csrfToken ? <ArrowRight size={16} strokeWidth={2.4} /> : null}
      onClick={handleClick}
    >
      {pending ? 'Indo pro Google…' : 'Entrar com Google'}
    </Button>
  );
}
