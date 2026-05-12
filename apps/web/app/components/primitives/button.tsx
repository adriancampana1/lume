'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

const buttonVariants = cva(
  'group inline-flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-btn)] font-semibold tracking-[-0.012em] transition-[transform,background-color,color,border-color,box-shadow] duration-[220ms] ease-[var(--ease-out-expo)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:pointer-events-none disabled:text-[var(--color-ink-3)] disabled:bg-[var(--color-surface-sunk)] active:scale-[0.985] active:translate-y-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-ink)] text-[var(--color-ink-inverse)] hover:-translate-y-px',
        secondary:
          'bg-transparent text-[var(--color-ink)] border border-[var(--color-border)] hover:border-[var(--color-border-ink)] hover:-translate-y-px',
        ghost:
          'bg-transparent text-[var(--color-ink-2)] hover:text-[var(--color-ink)]',
        destructive:
          'bg-[var(--color-danger)] text-[var(--color-ink-inverse)] hover:-translate-y-px',
      },
      size: {
        sm: 'h-9 px-3.5 text-[13px]',
        md: 'h-11 px-4 text-[14px]',
        lg: 'h-[52px] px-5 text-[15px]',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: { variant: 'primary', size: 'lg', block: false },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Show the lime indicator dot before the label (primary CTAs). Defaults true on primary. */
  dot?: boolean;
  /** Trailing slot — usually an arrow icon. */
  trailing?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = '', variant = 'primary', size, block, dot, trailing, children, ...props },
  ref,
) {
  const showDot = dot ?? variant === 'primary';
  return (
    <button
      ref={ref}
      className={`${buttonVariants({ variant, size, block })} ${className}`}
      {...props}
    >
      {showDot ? (
        <span
          aria-hidden="true"
          className="lume-dot inline-block h-[7px] w-[7px] rounded-full bg-[var(--color-accent)]"
          style={{ boxShadow: '0 0 10px var(--color-accent)' }}
        />
      ) : null}
      <span>{children}</span>
      {trailing ? (
        <span
          aria-hidden="true"
          className="inline-flex transition-transform duration-[320ms] ease-[var(--ease-out-expo)] group-hover:translate-x-[3px]"
        >
          {trailing}
        </span>
      ) : null}
    </button>
  );
});
