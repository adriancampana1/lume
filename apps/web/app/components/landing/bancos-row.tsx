const bancos = ['Itaú', 'Nubank', 'Inter', 'Banco do Brasil', 'Bradesco', 'Santander'];

export function BancosRow() {
  return (
    <div className="flex flex-col gap-3">
      <span className="t-eyebrow">lê extratos de</span>
      <ul className="flex flex-wrap items-center gap-x-2 gap-y-2 t-body-s text-[var(--color-ink)]">
        {bancos.map((banco, i) => (
          <li key={banco} className="inline-flex items-center gap-2">
            <span>{banco}</span>
            {i < bancos.length - 1 ? (
              <span
                aria-hidden="true"
                className="inline-block h-[3px] w-[3px] rounded-full bg-[var(--color-ink-3)]/60"
              />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
