'use client';

import { useState, useTransition } from 'react';
import type { IncomeBracket } from '@lume/shared';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '../components/primitives/button.js';
import { Checkbox } from '../components/primitives/checkbox.js';

const options: { value: IncomeBracket; label: string }[] = [
  { value: 'up_to_3k', label: 'Até R$ 3 mil' },
  { value: 'from_3k_to_6k', label: 'R$ 3 mil – R$ 6 mil' },
  { value: 'from_6k_to_12k', label: 'R$ 6 mil – R$ 12 mil' },
  { value: 'from_12k_to_25k', label: 'R$ 12 mil – R$ 25 mil' },
  { value: 'above_25k', label: 'Acima de R$ 25 mil' },
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
      <div className="flex flex-col gap-2">
        <label htmlFor="income-bracket" className="t-body-s font-medium text-[var(--color-ink)]">
          Faixa de renda mensal
        </label>
        <div className="relative">
          <select
            id="income-bracket"
            value={bracket}
            onChange={(e) => setBracket(e.target.value as IncomeBracket)}
            className="block w-full appearance-none rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface-sunk)] px-3.5 py-3 pr-10 t-body text-[var(--color-ink)] transition-[border-color,box-shadow] duration-[200ms] ease-[var(--ease-out-expo)] focus:border-[var(--color-focus)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-focus)]"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]"
          />
        </div>
      </div>

      <Checkbox
        checked={optIn}
        onCheckedChange={(v) => setOptIn(v === true)}
        label="Quero receber email quando o criador lançar uma nova ferramenta."
        helper="Sem spam, sem newsletter — apenas avisos pontuais."
      />

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending} size="md">
          {pending ? 'Salvando…' : 'Salvar'}
        </Button>
        {status === 'saved' ? (
          <span className="inline-flex items-center gap-1.5 t-caption text-[var(--color-ink-2)]">
            <Check size={12} strokeWidth={2.6} className="text-[var(--color-accent-deep)]" />
            <span>Salvo</span>
          </span>
        ) : null}
        {status === 'error' ? (
          <span className="t-caption text-[var(--color-danger)]">Não consegui salvar.</span>
        ) : null}
      </div>
    </form>
  );
}
