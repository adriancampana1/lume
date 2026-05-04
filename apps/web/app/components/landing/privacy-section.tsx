import { Microcard } from '../primitives/microcard.js';
import { copy } from '../../lib/copy.js';

export function PrivacySection() {
  const { title, microcards } = copy.landing.privacy;

  return (
    <section className="px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <h2
          className="mb-12 font-serif text-3xl tracking-tight sm:text-4xl"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          {title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {microcards.map((card, i) => (
            <Microcard key={i} title={card.title}>
              {card.body}
            </Microcard>
          ))}
        </div>
      </div>
    </section>
  );
}
