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
    <ol className="space-y-3">
      {STAGES.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex items-center gap-4">
            <span
              className={`relative inline-flex h-3 w-3 shrink-0 rounded-full transition-colors ${
                done
                  ? 'bg-[var(--color-terracotta)]'
                  : active
                    ? 'bg-[var(--color-terracotta)]/40'
                    : 'bg-[var(--color-ink)]/15'
              }`}
            >
              {active ? (
                <motion.span
                  className="absolute inset-0 rounded-full bg-[var(--color-terracotta)]/30"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              ) : null}
            </span>
            <motion.span
              initial={{ opacity: 0.3 }}
              animate={{ opacity: done || active ? 1 : 0.4 }}
              transition={{ duration: 0.25 }}
              className={`text-base ${done ? 'text-[var(--color-ink-soft)]' : 'text-[var(--color-ink)]'}`}
            >
              {copy.processing.stages[s]}
            </motion.span>
          </li>
        );
      })}
      {error ? <li className="pt-4 text-sm text-[var(--color-terracotta)]">{error}</li> : null}
    </ol>
  );
}
