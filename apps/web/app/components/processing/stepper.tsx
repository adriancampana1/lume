'use client';
import { copy } from '../../lib/copy.js';
import { motion } from 'motion/react';

const STAGES = [
  'extracting',
  'anonymizing',
  'reconciling',
  'categorizing',
  'aggregating',
  'narrating',
] as const;
export type StageId = (typeof STAGES)[number];

export function Stepper({ current, error }: { current: number; error: string | null }) {
  return (
    <ol className="flex flex-col gap-1">
      {STAGES.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const idle = i > current;
        return (
          <li
            key={s}
            className="lume-step-in grid grid-cols-[28px_1fr_auto] items-center gap-3 py-2"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span
              aria-hidden="true"
              className={`relative grid h-7 w-7 place-items-center rounded-[8px] font-mono text-[11px] font-semibold tabular leading-none transition-colors duration-[260ms] ease-[var(--ease-out-expo)] ${
                done || active
                  ? 'bg-[var(--color-ink)] text-[var(--color-accent)]'
                  : 'border border-[var(--color-border-strong)] bg-transparent text-[var(--color-ink-3)]'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
              {active ? (
                <motion.span
                  className="pointer-events-none absolute -inset-1 rounded-[10px] border border-[var(--color-accent)]"
                  animate={{ opacity: [0.0, 0.7, 0.0], scale: [0.94, 1.04, 0.94] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : null}
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: idle ? 0.55 : 1 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className={`t-body ${done ? 'text-[var(--color-ink-2)]' : 'text-[var(--color-ink)]'}`}
            >
              {copy.processing.stages[s]}
            </motion.span>
            {done ? (
              <span aria-hidden="true" className="t-eyebrow text-[var(--color-ink-3)]">
                ok
              </span>
            ) : active ? (
              <span aria-hidden="true" className="t-eyebrow text-[var(--color-accent-deep)]">
                ···
              </span>
            ) : (
              <span aria-hidden="true" className="t-eyebrow text-[var(--color-ink-3)]/40">
                —
              </span>
            )}
          </li>
        );
      })}
      {error ? (
        <li className="mt-3 rounded-[var(--radius-input)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-3 t-body-s text-[var(--color-danger)]">
          {error}
        </li>
      ) : null}
    </ol>
  );
}
