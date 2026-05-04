'use client';
export function PdfPreview({ reportId }: { reportId: string }) {
  const src = `${process.env['NEXT_PUBLIC_API_URL']}/reports/${reportId}/pdf#page=1&toolbar=0`;
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-ink)]/15 shadow-[0_2px_24px_-12px_rgba(43,29,18,0.25)]">
      <object data={src} type="application/pdf" className="block h-[480px] w-full sm:h-[640px]">
        <p className="p-6 text-sm text-[var(--color-ink-soft)]">
          Seu navegador não suporta preview inline. Use o botão &quot;Baixar PDF&quot; acima.
        </p>
      </object>
    </div>
  );
}
