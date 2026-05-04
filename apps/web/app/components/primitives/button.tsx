'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-medium transition-[transform,background-color,color,box-shadow] duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cream)] disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-terracotta)]',
        secondary:
          'bg-transparent text-[var(--color-ink)] underline-offset-[6px] underline decoration-1 hover:decoration-[var(--color-terracotta)] hover:text-[var(--color-terracotta)] rounded-none',
        outline:
          'border border-[var(--color-ink)]/20 text-[var(--color-ink)] hover:border-[var(--color-ink)] bg-transparent',
      },
      size: {
        sm: 'h-10 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = '', variant, size, ...props },
  ref,
) {
  return (
    <button ref={ref} className={`${buttonVariants({ variant, size })} ${className}`} {...props} />
  );
});
