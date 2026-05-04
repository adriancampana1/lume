'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
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
    const res = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/onboarding`, {
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
    <form onSubmit={submit} className="space-y-4">
      <fieldset className="space-y-3">
        <legend className="text-base font-medium">{copy.onboarding.question}</legend>
        <p className="text-xs text-[var(--color-ink-soft)]">{copy.onboarding.helper}</p>
        <div className="mt-4 space-y-2">
          {copy.onboarding.options.map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-input)] border p-4 transition-colors ${
                value === o.value
                  ? 'border-[var(--color-terracotta)] bg-[var(--color-cream)]'
                  : 'border-[var(--color-ink)]/15 hover:border-[var(--color-ink)]/40'
              }`}
            >
              <input
                type="radio"
                name="income"
                value={o.value}
                checked={value === o.value}
                onChange={() => setValue(o.value)}
                className="h-4 w-4 accent-[var(--color-terracotta)]"
              />
              <span className="text-base">{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {err ? <p className="text-sm text-[var(--color-terracotta)]">{err}</p> : null}
      <button
        type="submit"
        disabled={pending || !value}
        className="inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-8 text-base font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-terracotta)] disabled:opacity-50"
      >
        {pending ? 'Salvando…' : copy.onboarding.cta}
      </button>
    </form>
  );
}
