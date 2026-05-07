'use client';
import { useState } from 'react';
import { Checkbox } from '../primitives/checkbox.js';
import { copy } from '../../lib/copy.js';

export function MarketingOptIn({ initial }: { initial: boolean }) {
  const [value, setValue] = useState(initial);
  const [pending, setPending] = useState(false);
  const onChange = async (checked: boolean) => {
    setValue(checked);
    setPending(true);
    await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ marketingOptIn: checked }),
    });
    setPending(false);
  };
  return (
    <Checkbox
      checked={value}
      disabled={pending}
      onCheckedChange={(v) => onChange(v === true)}
      label={copy.result.marketing.label}
      helper={copy.result.marketing.helper}
    />
  );
}
