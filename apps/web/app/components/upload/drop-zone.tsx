'use client';
import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { copy } from '../../lib/copy.js';

const ACCEPT = '.pdf,.ofx,application/pdf,application/x-ofx';
const MAX_FILES = 6;
const MAX_BYTES = 10 * 1024 * 1024;

export function DropZone({ onFiles }: { onFiles: (f: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);

  const handle = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming).slice(0, MAX_FILES);
      const valid = arr.filter((f) => /\.(pdf|ofx)$/i.test(f.name) && f.size <= MAX_BYTES);
      if (valid.length > 0) onFiles(valid);
    },
    [onFiles],
  );

  return (
    <div
      onDragOver={(e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setHover(false);
        handle(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
      }}
      className={`flex h-64 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-card)] border-2 border-dashed bg-[var(--color-cream)]/50 px-6 text-center transition-all duration-200 sm:h-80 ${
        hover
          ? 'scale-[1.005] border-[var(--color-terracotta)] bg-[var(--color-cream)]'
          : 'border-[var(--color-ink)]/25 hover:border-[var(--color-ink)]/50'
      } focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cream)]`}
    >
      <Upload size={36} className="mb-4 text-[var(--color-terracotta)]" />
      <p className="font-serif text-2xl italic" style={{ fontFamily: 'var(--font-serif)' }}>
        {copy.upload.dropzone.hint}
      </p>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{copy.upload.dropzone.cta}</p>
      <p className="mt-3 text-xs text-[var(--color-ink-soft)]">PDF ou OFX, até 6 arquivos, 10MB cada</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) handle(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
