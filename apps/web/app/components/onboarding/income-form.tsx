'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import { ArrowRight } from 'lucide-react';
import { Button } from '../primitives/button.js';
import { copy } from '../../lib/copy.js';

export function IncomeForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search?.get('next') ?? '/processar';
  const [value, setValue] = useState<string>('');
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) {
      setErr('Escolha uma opção.');
      return;
    }
    setPending(true);
    setErr(null);
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ incomeBracket: value }),
    });
    if (!res.ok) {
      setErr('Não conseguimos salvar. Tente novamente.');
      setPending(false);
      return;
    }
    router.push(next as Route);
  };

  return (
    <form onSubmit={(e) => { void submit(e); }} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="t-h3 text-[var(--color-ink)]">{copy.onboarding.question}</legend>
        <p className="t-body-s text-[var(--color-ink-2)]">{copy.onboarding.helper}</p>
        <div className="mt-5 flex flex-col gap-2">
          {copy.onboarding.options.map((o, i) => {
            const checked = value === o.value;
            return (
              <label
                key={o.value}
                className={`group flex cursor-pointer items-center gap-3 rounded-[var(--radius-card-inner)] border px-4 py-3.5 transition-[border-color,background-color,transform] duration-[200ms] ease-[var(--ease-out-expo)] ${
                  checked
                    ? 'border-[var(--color-border-ink)] bg-[var(--color-surface)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] hover:-translate-y-px'
                }`}
              >
                <input
                  type="radio"
                  name="income"
                  value={o.value}
                  checked={checked}
                  onChange={() => setValue(o.value)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors duration-[180ms] ease-[var(--ease-out-expo)] ${
                    checked
                      ? 'border-[var(--color-ink)] bg-[var(--color-ink)]'
                      : 'border-[var(--color-border-strong)] bg-transparent'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full bg-[var(--color-accent)] transition-opacity duration-[180ms] ease-[var(--ease-out-expo)]"
                    style={{ opacity: checked ? 1 : 0 }}
                  />
                </span>
                <span className="t-body text-[var(--color-ink)]">{o.label}</span>
                <span className="ml-auto t-eyebrow font-mono text-[var(--color-ink-3)] tabular">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {err ? (
        <p
          role="alert"
          className="rounded-[var(--radius-input)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-3 t-body-s text-[var(--color-danger)]"
        >
          {err}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending || !value}
        trailing={!pending ? <ArrowRight size={16} strokeWidth={2.4} /> : null}
      >
        {pending ? 'Salvando…' : copy.onboarding.cta}
      </Button>
    </form>
  );
}
