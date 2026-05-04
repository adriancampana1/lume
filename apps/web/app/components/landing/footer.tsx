import { copy } from '../../lib/copy.js';

export function Footer() {
  const { links, tagline } = copy.landing.footer;

  return (
    <footer className="px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-3xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-ink-soft)]">{tagline}</p>
        <nav>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-[var(--color-ink-soft)] underline underline-offset-4 decoration-1 hover:text-[var(--color-terracotta)] hover:decoration-[var(--color-terracotta)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
