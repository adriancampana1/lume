'use client';
import { useCallback, useState, type ChangeEvent, type DragEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import { copy } from '../../lib/copy.js';

const ACCEPT = '.pdf,.ofx,application/pdf,application/x-ofx';
const MAX_FILES = 6;
const MAX_BYTES = 10 * 1024 * 1024;

export function DropZone({
  onFiles,
  onReject,
}: {
  onFiles: (f: File[]) => void;
  onReject?: (reason: string) => void;
}) {
  const [active, setActive] = useState(false);

  const handle = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming).slice(0, MAX_FILES);
      const valid: File[] = [];
      const rejected: string[] = [];
      for (const f of arr) {
        if (!/\.(pdf|ofx)$/i.test(f.name)) rejected.push(`${f.name}: extensão inválida (use PDF ou OFX)`);
        else if (f.size > MAX_BYTES) rejected.push(`${f.name}: maior que 10MB`);
        else valid.push(f);
      }
      if (valid.length > 0) onFiles(valid);
      if (rejected.length > 0 && onReject) onReject(rejected.join('; '));
    },
    [onFiles, onReject],
  );

  return (
    <label
      htmlFor="dropzone-input"
      onDragOver={(e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={(e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setActive(false);
        handle(e.dataTransfer.files);
      }}
      aria-label="Solte ou selecione seus extratos"
      className={`group relative flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-[var(--radius-card)] border border-dashed bg-[var(--color-bg)] px-6 py-12 text-center transition-[border-color,background-color] duration-[360ms] ease-[var(--ease-out-expo)] focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[var(--color-focus)] sm:py-16 ${
        active
          ? 'border-[var(--color-ink)] bg-[var(--color-surface)]'
          : 'border-[var(--color-border-strong)] hover:border-[var(--color-ink)]'
      }`}
      style={{ borderWidth: '1.5px' }}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-[360ms] ease-[var(--ease-out-expo)] ${
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% -10%, var(--color-accent-soft), transparent 60%)',
        }}
      />

      <span
        aria-hidden="true"
        className="relative grid h-12 w-12 place-items-center rounded-[12px] bg-[var(--color-ink)] text-[var(--color-accent)]"
      >
        <ArrowUp size={22} strokeWidth={2} />
      </span>

      <p className="relative t-h3 text-[var(--color-ink)]">{copy.upload.dropzone.hint}</p>
      <p className="relative t-body-s text-[var(--color-ink-2)]">{copy.upload.dropzone.cta}</p>
      <p className="relative t-caption">
        <span className="font-mono">PDF</span> ou <span className="font-mono">OFX</span>
        <span className="mx-2 text-[var(--color-ink-3)]/50">·</span>
        até <span className="font-mono">6×</span> arquivos
        <span className="mx-2 text-[var(--color-ink-3)]/50">·</span>
        <span className="font-mono">10MB</span> cada
      </p>

      <input
        id="dropzone-input"
        type="file"
        multiple
        accept={ACCEPT}
        className="sr-only"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) handle(e.target.files);
          e.target.value = '';
        }}
      />
    </label>
  );
}
