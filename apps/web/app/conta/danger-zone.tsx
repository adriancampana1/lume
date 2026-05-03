'use client';

import { useState, useTransition } from 'react';

export function DangerZone() {
  const [pendingExport, startExport] = useTransition();
  const [pendingDelete, startDelete] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6 border-b border-[var(--color-ink)]/10 pb-6">
        <div>
          <p className="text-sm font-medium text-[var(--color-ink)]">Exportar meus dados</p>
          <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
            JSON com perfil, sessões e metadados de relatórios. Sem conteúdo financeiro
            (não armazenamos).
          </p>
        </div>
        <button
          type="button"
          onClick={exportData}
          disabled={pendingExport}
          className="shrink-0 rounded-[var(--radius-pill)] border border-[var(--color-ink)]/20 bg-transparent px-5 py-2 text-sm text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]/60 disabled:opacity-60"
        >
          {pendingExport ? 'Gerando…' : 'Baixar'}
        </button>
      </div>

      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-[var(--color-ink)]">Excluir minha conta</p>
          <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
            Marca seu perfil como excluído imediatamente. Eliminação definitiva em 30 dias.
            Esta ação não tem desfazer pelo app.
          </p>
        </div>
        {confirmDelete ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={deleteAccount}
              disabled={pendingDelete}
              className="rounded-[var(--radius-pill)] bg-[var(--color-terracotta)] px-5 py-2 text-sm font-medium text-[var(--color-cream)] hover:bg-[var(--color-terracotta-dim)] disabled:opacity-60"
            >
              {pendingDelete ? 'Excluindo…' : 'Confirmar'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-[var(--radius-pill)] px-3 py-2 text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="shrink-0 rounded-[var(--radius-pill)] border border-[var(--color-terracotta)]/40 bg-transparent px-5 py-2 text-sm text-[var(--color-terracotta)] transition-colors hover:border-[var(--color-terracotta)]"
          >
            Excluir
          </button>
        )}
      </div>

      {error && <p className="text-xs text-[var(--color-terracotta)]">{error}</p>}
    </div>
  );
}