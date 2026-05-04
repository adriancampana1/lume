'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Wordmark } from '../components/wordmark.js';
import { DropZone } from '../components/upload/drop-zone.js';
import { FileList } from '../components/upload/file-list.js';
import { BankInstructions } from '../components/upload/bank-instructions.js';
import { copy } from '../lib/copy.js';
import { ensureSession, uploadFiles } from '../lib/api.js';

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFiles = useCallback((incoming: File[]) => {
    setError(null);
    setFiles((cur) => {
      const merged = [...cur, ...incoming].slice(0, 6);
      return merged;
    });
  }, []);

  const onRemove = (i: number) => setFiles((cur) => cur.filter((_, j) => j !== i));

  const submit = async () => {
    if (files.length === 0) {
      setError('Adicione ao menos 1 arquivo.');
      return;
    }
    setPending(true);
    setError(null);
    try {
      await ensureSession();
      await uploadFiles(files);
      const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? '/api';
      window.location.href = `${apiUrl}/auth/signin/google?callbackUrl=${encodeURIComponent('/processar')}`;
    } catch (err) {
      setError((err as Error).message);
      setPending(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 sm:py-16">
      <header className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex">
          <Wordmark size="sm" />
        </Link>
      </header>

      <section className="mx-auto mt-10 max-w-3xl">
        <h1 className="font-serif text-3xl italic sm:text-5xl" style={{ fontFamily: 'var(--font-serif)' }}>
          {copy.upload.title}
        </h1>
        <p className="mt-3 text-base text-[var(--color-ink-soft)]">{copy.upload.subhead}</p>

        <div className="mt-10">
          <DropZone onFiles={onFiles} />
          <FileList files={files} onRemove={onRemove} />
          <BankInstructions />
        </div>

        {error ? (
          <p className="mt-6 text-sm text-[var(--color-terracotta)]">{error}</p>
        ) : null}

        <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={pending || files.length === 0}
            onClick={submit}
            className="inline-flex h-14 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-10 text-lg font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-terracotta)] disabled:opacity-50"
          >
            {pending ? 'Enviando…' : copy.upload.cta}
          </button>
          <p className="text-xs leading-relaxed text-[var(--color-ink-soft)] sm:max-w-md">
            {copy.upload.legal}
          </p>
        </div>
      </section>
    </main>
  );
}
