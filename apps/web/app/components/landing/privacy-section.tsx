import { Lock, Eraser, Mail, Scale } from 'lucide-react';
import { copy } from '../../lib/copy.js';
import { Microcard } from '../primitives/microcard.js';

const ICONS = [Lock, Eraser, Mail, Scale];

export function PrivacySection() {
  const { microcards } = copy.landing.privacy;

  return (
    <section id="privacidade" className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <header className="lg:col-span-5">
            <span className="t-eyebrow">03 · seus dados</span>
            <h2
              className="mt-4 t-display-m text-[var(--color-ink)]"
              style={{ textWrap: 'balance' }}
            >
              Privacidade não é detalhe técnico —{' '}
              <span className="relative inline-block whitespace-nowrap rounded-[5px] bg-[var(--color-accent)] px-[8px] py-[2px] text-[var(--color-accent-deep)]">
                é o ponto
              </span>
              .
            </h2>
            <p className="mt-5 max-w-[36ch] t-body text-[var(--color-ink-2)]">
              Seu extrato fica em memória durante o processamento e é apagado em segundos. Nada
              armazenado, nada indexado, nada vendido.
            </p>
            <p className="mt-6 t-eyebrow text-[var(--color-ink-3)]">
              compromisso técnico · lgpd
            </p>
          </header>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7 lg:pt-1.5">
            {microcards.map((card, i) => {
              const Icon = ICONS[i % ICONS.length] ?? Lock;
              return (
                <Microcard
                  key={card.title}
                  title={card.title}
                  icon={<Icon size={14} strokeWidth={2.2} />}
                >
                  {card.body}
                </Microcard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
