'use client';
import * as RC from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { forwardRef, useId, type ReactNode } from 'react';

type Props = RC.CheckboxProps & { label: ReactNode; helper?: ReactNode };

export const Checkbox = forwardRef<HTMLButtonElement, Props>(function Checkbox(
  { label, helper, id, className = '', ...props },
  ref,
) {
  const auto = useId();
  const realId = id ?? auto;
  return (
    <label htmlFor={realId} className={`flex cursor-pointer items-start gap-3 ${className}`}>
      <RC.Root
        id={realId}
        ref={ref}
        className="mt-[3px] h-5 w-5 shrink-0 rounded-[5px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] transition-[background-color,border-color] duration-[200ms] ease-[var(--ease-out-expo)] hover:border-[var(--color-border-ink)] data-[state=checked]:border-[var(--color-ink)] data-[state=checked]:bg-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        {...props}
      >
        <RC.Indicator className="flex items-center justify-center text-[var(--color-accent)]">
          <Check size={13} strokeWidth={3} />
        </RC.Indicator>
      </RC.Root>
      <div className="t-body-s text-[var(--color-ink)] leading-snug">
        <span className="select-none">{label}</span>
        {helper ? (
          <div className="mt-1 t-caption text-[var(--color-ink-3)]">{helper}</div>
        ) : null}
      </div>
    </label>
  );
});
