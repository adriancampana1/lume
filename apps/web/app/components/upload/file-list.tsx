'use client';
import { X, FileText } from 'lucide-react';

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function FileList({ files, onRemove }: { files: File[]; onRemove: (i: number) => void }) {
  if (files.length === 0) return null;
  return (
    <ul className="mt-6 divide-y divide-[var(--color-ink)]/10 rounded-[var(--radius-card)] border border-[var(--color-ink)]/10">
      {files.map((f, i) => (
        <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileText size={18} className="shrink-0 text-[var(--color-terracotta)]" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{f.name}</p>
              <p className="text-xs text-[var(--color-ink-soft)]">{fmtBytes(f.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="rounded-full p-1.5 text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)]"
            aria-label="Remover arquivo"
          >
            <X size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}
