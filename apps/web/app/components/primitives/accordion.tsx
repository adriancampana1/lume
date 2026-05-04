'use client';
import * as RA from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

type Item = { value: string; title: string; content: ReactNode };

export function Accordion({ items }: { items: Item[] }) {
  return (
    <RA.Root type="single" collapsible className="divide-y divide-[var(--color-ink)]/10">
      {items.map((it) => (
        <RA.Item key={it.value} value={it.value} className="py-1">
          <RA.Header>
            <RA.Trigger className="group flex w-full items-center justify-between py-4 text-left text-base font-medium text-[var(--color-ink)] transition-colors hover:text-[var(--color-terracotta)]">
              <span>{it.title}</span>
              <ChevronDown
                size={18}
                className="transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </RA.Trigger>
          </RA.Header>
          <RA.Content className="overflow-hidden text-sm leading-relaxed text-[var(--color-ink-soft)] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="pb-4">{it.content}</div>
          </RA.Content>
        </RA.Item>
      ))}
    </RA.Root>
  );
}
