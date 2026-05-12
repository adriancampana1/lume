'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/primitives/button.js';

type Props = { callbackUrl: string };

export function SignInButton({ callbackUrl }: Props) {
  const [pending, setPending] = useState(false);
  const csrfRef = useRef<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/csrf')
      .then((r) => r.json())
      .then((data: { csrfToken: string }) => {
        csrfRef.current = data.csrfToken;
      })
      .catch(() => {});
  }, []);

  function handleClick() {
    if (pending) return;
    setPending(true);

    const submit = (token: string) => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/api/auth/signin/google';
      const csrf = document.createElement('input');
      csrf.name = 'csrfToken';
      csrf.value = token;
      form.appendChild(csrf);
      const cb = document.createElement('input');
      cb.name = 'callbackUrl';
      cb.value = callbackUrl;
      form.appendChild(cb);
      document.body.appendChild(form);
      form.submit();
    };

    if (csrfRef.current) {
      submit(csrfRef.current);
    } else {
      fetch('/api/auth/csrf')
        .then((r) => r.json())
        .then((data: { csrfToken: string }) => submit(data.csrfToken))
        .catch(() => setPending(false));
    }
  }

  return (
    <Button
      type="button"
      disabled={pending}
      trailing={!pending ? <ArrowRight size={16} strokeWidth={2.4} /> : null}
      onClick={handleClick}
    >
      {pending ? 'Indo pro Google…' : 'Entrar com Google'}
    </Button>
  );
}
