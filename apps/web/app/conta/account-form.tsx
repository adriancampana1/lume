'use client';

import { useState, useTransition } from 'react';
import type { IncomeBracket } from '@lume/shared';

const options: { value: IncomeBracket; label: string }[] = [
  { value: 'up_to_3k', label: 'Até R$3 mil' },
  { value: 'from_3k_to_6k', label: 'R$3 mil – R$6 mil' },
  { value: 'from_6k_to_12k', label: 'R$6 mil – R$12 mil' },
  { value: 'from_12k_to_25k', label: 'R$12 mil – R$25 mil' },
  { value: 'above_25k', label: 'Acima de R$25 mil' },
  { value: 'prefer_not_to_say', label: 'Prefiro não responder' },
];

type Props = {
  initialIncomeBracket: IncomeBracket | null;
  initialMarketingOptIn: boolean;
};

export function AccountForm({ initialIncomeBracket, initialMarketingOptIn }: Props) {
  const [bracket, setBracket] = useState<IncomeBracket>(
    initialIncomeBracket ?? 'prefer_not_to_say',
  );
  const [optIn, setOptIn] = useState(initialMarketingOptIn);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ incomeBracket: bracket, marketingOptIn: optIn }),
      });
      setStatus(res.ok ? 'saved' : 'error');
      if (res.ok) setTimeout(() => setStatus('idle'), 2400);
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="space-y-6"
    >
      <div>
        <label className="block text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
          Faixa de renda mensal
        </label>
        <select
          value={bracket}
          onChange={(e) => setBracket(e.target.value as IncomeBracket)}
          className="mt-2 w-full rounded-[var(--radius-input)] border border-[var(--color-ink)]/15 bg-transparent px-3 py-2.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-terracotta)] focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--color-ink-soft)]">
        <input
          type="checkbox"
          checked={optIn}
          onChange={(e) => setOptIn(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[var(--color-terracotta)]"
        />
        <span>
          Quero receber email quando o criador lançar uma nova ferramenta. Sem spam, sem
          newsletter — apenas avisos pontuais.
        </span>
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-6 py-2.5 text-sm font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-terracotta)] disabled:opacity-60"
        >
          {pending ? 'Salvando…' : 'Salvar'}
        </button>
        {status === 'saved' && (
          <span className="text-xs text-[var(--color-ink-soft)]">Salvo.</span>
        )}
        {status === 'error' && (
          <span className="text-xs text-[var(--color-terracotta)]">Não consegui salvar.</span>
        )}
      </div>
    </form>
  );
}