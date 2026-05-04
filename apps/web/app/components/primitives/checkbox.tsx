'use client';
import * as RC from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { forwardRef, useId, type ReactNode } from 'react';

type Props = RC.CheckboxProps & { label: ReactNode; helper?: ReactNode };

export const Checkbox = forwardRef<HTMLButtonElement, Props>(function Checkbox(
  { label, helper, id, ...props },
  ref,
) {
  const auto = useId();
  const realId = id ?? auto;
  return (
    <label htmlFor={realId} className="flex cursor-pointer items-start gap-3">
      <RC.Root
        id={realId}
        ref={ref}
        className="mt-0.5 h-5 w-5 shrink-0 rounded border border-[var(--color-ink)]/40 bg-[var(--color-cream)] data-[state=checked]:border-[var(--color-terracotta)] data-[state=checked]:bg-[var(--color-terracotta)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cream)]"
        {...props}
      >
        <RC.Indicator className="flex items-center justify-center text-[var(--color-cream)]">
          <Check size={14} strokeWidth={3} />
        </RC.Indicator>
      </RC.Root>
      <div className="text-sm leading-snug">
        <div>{label}</div>
        {helper ? (
          <div className="mt-1 text-xs text-[var(--color-ink-soft)]">{helper}</div>
        ) : null}
      </div>
    </label>
  );
});
