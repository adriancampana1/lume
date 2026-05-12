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
    <div className="mt-5">
      <p className="t-eyebrow mb-2.5">
        <span className="font-mono tabular">
          {String(files.length).padStart(2, '0')}/06
        </span>
        <span className="ml-2">arquivos</span>
      </p>
      <ul className="overflow-hidden rounded-[var(--radius-card-inner)] border border-[var(--color-border)] bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
        {files.map((f, i) => (
          <li
            key={`${f.name}-${i}`}
            className="lume-step-in group grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--color-surface-sunk)]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink-2)]"
            >
              <FileText size={16} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="truncate t-body-s font-medium text-[var(--color-ink)]">{f.name}</p>
              <p className="font-mono tabular text-[12px] text-[var(--color-ink-3)]">
                {fmtBytes(f.size)}
              </p>
            </div>
            <span className="hidden font-mono tabular text-[11px] text-[var(--color-ink-3)] sm:inline">
              {String(i + 1).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-[8px] text-[var(--color-ink-3)] transition-colors hover:bg-[var(--color-bg)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              aria-label={`Remover ${f.name}`}
            >
              <X size={15} strokeWidth={2} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
