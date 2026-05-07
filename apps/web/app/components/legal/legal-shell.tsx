import { PageShell } from '../page-shell.js';
import { Footer } from '../landing/footer.js';

export function LegalShell({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageShell contentWidthClass="max-w-[720px]">
        <p className="lume-rise t-eyebrow">documento legal</p>
        <h1
          className="lume-rise lume-rise-1 mt-3 t-display-m text-[var(--color-ink)]"
          style={{ textWrap: 'balance' }}
        >
          {title}
        </h1>
        <p className="lume-rise lume-rise-2 mt-3 font-mono t-body-s text-[var(--color-ink-3)]">
          atualizado em {updatedAt}
        </p>
        <div className="prose-lume lume-rise lume-rise-3 mt-12">{children}</div>
      </PageShell>
      <Footer />
    </>
  );
}
