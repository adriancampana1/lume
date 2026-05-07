'use client';
import * as RA from '@radix-ui/react-accordion';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

type Item = { value: string; title: string; content: ReactNode };

export function Accordion({ items }: { items: Item[] }) {
  return (
    <RA.Root
      type="single"
      collapsible
      className="border-y border-[var(--color-border)] divide-y divide-[var(--color-border)]"
    >
      {items.map((it) => (
        <RA.Item key={it.value} value={it.value}>
          <RA.Header>
            <RA.Trigger className="group flex w-full items-center justify-between gap-4 py-4 text-left t-h3 text-[var(--color-ink)] transition-colors hover:text-[var(--color-ink-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">
              <span>{it.title}</span>
              <ChevronRight
                size={18}
                strokeWidth={2}
                className="shrink-0 text-[var(--color-ink-3)] transition-transform duration-[280ms] ease-[var(--ease-out-expo)] group-data-[state=open]:rotate-90"
                aria-hidden="true"
              />
            </RA.Trigger>
          </RA.Header>
          <RA.Content className="overflow-hidden t-body-s text-[var(--color-ink-2)] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="pb-5">{it.content}</div>
          </RA.Content>
        </RA.Item>
      ))}
    </RA.Root>
  );
}
