'use client';
import { useCallback, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageShell } from '../components/page-shell.js';
import { Stepper } from '../components/primitives/stepper.js';
import { Button } from '../components/primitives/button.js';
import { DropZone } from '../components/upload/drop-zone.js';
import { FileList } from '../components/upload/file-list.js';
import { BankInstructions } from '../components/upload/bank-instructions.js';
import { copy } from '../lib/copy.js';
import { ensureSession, uploadFiles } from '../lib/api.js';

const STEPS = [{ label: 'enviar' }, { label: 'analisar' }, { label: 'receber' }];

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFiles = useCallback((incoming: File[]) => {
    setError(null);
    setFiles((cur) => [...cur, ...incoming].slice(0, 6));
  }, []);

  useEffect(() => {
    const prevent = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) e.preventDefault();
    };
    window.addEventListener('dragover', prevent);
    window.addEventListener('drop', prevent);
    return () => {
      window.removeEventListener('dragover', prevent);
      window.removeEventListener('drop', prevent);
    };
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
      window.location.href = `/login?next=${encodeURIComponent('/processar')}`;
    } catch (err) {
      setError((err as Error).message);
      setPending(false);
    }
  };

  return (
    <PageShell>
      <div className="lume-rise mb-8">
        <Stepper steps={STEPS} current={0} />
      </div>

      <p className="lume-rise lume-rise-1 t-eyebrow">passo 01</p>
      <h1
        className="lume-rise lume-rise-2 mt-3 t-display-m text-[var(--color-ink)]"
        style={{ textWrap: 'balance' }}
      >
        {copy.upload.title}
      </h1>
      <p className="lume-rise lume-rise-3 mt-4 max-w-[52ch] t-body-l text-[var(--color-ink-2)]">
        {copy.upload.subhead}
      </p>

      <div className="lume-rise lume-rise-4 mt-10">
        <DropZone onFiles={onFiles} onReject={setError} />
        <FileList files={files} onRemove={onRemove} />
        <BankInstructions />
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-[var(--radius-input)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-3 t-body-s text-[var(--color-danger)]"
        >
          {error}
        </p>
      ) : null}

      <div className="lume-rise lume-rise-5 mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          type="button"
          disabled={pending || files.length === 0}
          onClick={() => { void submit(); }}
          trailing={!pending ? <ArrowRight size={16} strokeWidth={2.4} /> : null}
        >
          {pending ? 'Enviando…' : copy.upload.cta}
        </Button>
        <p className="t-caption max-w-[44ch] text-[var(--color-ink-3)]">{copy.upload.legal}</p>
      </div>
    </PageShell>
  );
}
