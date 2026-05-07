'use client';

import { useState, useTransition } from 'react';
import { Button } from '../components/primitives/button.js';

export function DangerZone() {
  const [pendingExport, startExport] = useTransition();
  const [pendingDelete, startDelete] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/require-await
  async function exportData() {
    startExport(async () => {
      setError(null);
      const res = await fetch('/api/me/data', { credentials: 'include' });
      if (!res.ok) {
        setError('Não consegui exportar agora.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lume-meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async function deleteAccount() {
    startDelete(async () => {
      setError(null);
      const res = await fetch('/api/me/delete', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        setError('Não consegui excluir agora.');
        return;
      }
      window.location.href = '/?deleted=1';
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <p className="t-body font-semibold text-[var(--color-ink)]">Exportar meus dados</p>
          <p className="mt-1.5 max-w-[52ch] t-body-s text-[var(--color-ink-2)]">
            JSON com perfil, sessões e metadados de relatórios. Sem conteúdo financeiro (não
            armazenamos).
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => void exportData()}
          disabled={pendingExport}
          dot={false}
        >
          {pendingExport ? 'Gerando…' : 'Baixar'}
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <p className="t-body font-semibold text-[var(--color-ink)]">Excluir minha conta</p>
          <p className="mt-1.5 max-w-[52ch] t-body-s text-[var(--color-ink-2)]">
            Marca seu perfil como excluído imediatamente. Eliminação definitiva em 30 dias. Esta
            ação não tem desfazer pelo app.
          </p>
        </div>
        {confirmDelete ? (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="md"
              onClick={() => void deleteAccount()}
              disabled={pendingDelete}
              dot={false}
            >
              {pendingDelete ? 'Excluindo…' : 'Confirmar'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setConfirmDelete(false)}
              dot={false}
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => setConfirmDelete(true)}
            dot={false}
            className="border-[var(--color-danger)] text-[var(--color-danger)] hover:border-[var(--color-danger)]"
          >
            Excluir
          </Button>
        )}
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-[var(--radius-input)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-3 t-body-s text-[var(--color-danger)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
