'use client';
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  trailing?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, helper, error, trailing, id, className = '', ...props },
  ref,
) {
  const auto = useId();
  const realId = id ?? auto;
  const helpId = helper || error ? `${realId}-help` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={realId} className="t-body-s font-medium text-[var(--color-ink)]">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={realId}
          ref={ref}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={helpId}
          className={`block w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface-sunk)] px-3.5 py-3 t-body text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] transition-[border-color,box-shadow] duration-[200ms] ease-[var(--ease-out-expo)] focus:border-[var(--color-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-inset aria-[invalid=true]:border-[var(--color-danger)] aria-[invalid=true]:ring-[var(--color-danger)] disabled:opacity-50 disabled:cursor-not-allowed ${trailing ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        {trailing ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]">
            {trailing}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={helpId} className="t-caption text-[var(--color-danger)]">
          {error}
        </p>
      ) : helper ? (
        <p id={helpId} className="t-caption text-[var(--color-ink-3)]">
          {helper}
        </p>
      ) : null}
    </div>
  );
});
