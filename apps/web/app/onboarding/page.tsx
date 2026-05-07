import { Suspense } from 'react';
import { PageShell } from '../components/page-shell.js';
import { IncomeForm } from '../components/onboarding/income-form.js';
import { copy } from '../lib/copy.js';

export const metadata = { title: 'Onboarding · Lume' };

export default function OnboardingPage() {
  return (
    <PageShell actions={[]}>
      <p className="lume-rise t-eyebrow">faltam segundos</p>
      <h1
        className="lume-rise lume-rise-1 mt-3 t-display-m text-[var(--color-ink)]"
        style={{ textWrap: 'balance' }}
      >
        {copy.onboarding.title}
      </h1>
      <div className="lume-rise lume-rise-2 mt-10">
        <Suspense>
          <IncomeForm />
        </Suspense>
      </div>
    </PageShell>
  );
}
