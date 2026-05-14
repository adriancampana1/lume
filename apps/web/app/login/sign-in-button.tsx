'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/primitives/button.js';

type Props = { callbackUrl: string };

export function SignInButton({ callbackUrl }: Props) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [csrfFailed, setCsrfFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setCsrfFailed(false);
    setCsrfToken(null);
    const load = (attempt: number) => {
      fetch('/api/auth/csrf')
        .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
        .then((data: { csrfToken: string }) => { if (!cancelled) setCsrfToken(data.csrfToken); })
        .catch(() => {
          if (cancelled) return;
          if (attempt < 3) setTimeout(() => load(attempt + 1), 800 * attempt);
          else setCsrfFailed(true);
        });
    };
    load(1);
    return () => { cancelled = true; };
  }, [retryKey]);

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

  if (csrfFailed) {
    return (
      <Button type="button" variant="secondary" onClick={() => setRetryKey((k) => k + 1)}>
        Tentar novamente
      </Button>
    );
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
