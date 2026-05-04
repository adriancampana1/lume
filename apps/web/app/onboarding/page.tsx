import { Suspense } from 'react';
import Link from 'next/link';
import { Wordmark } from '../components/wordmark.js';
import { IncomeForm } from '../components/onboarding/income-form.js';
import { copy } from '../lib/copy.js';

export const metadata = { title: 'Onboarding · Lume' };

export default function OnboardingPage() {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 sm:py-16">
      <header className="mx-auto max-w-2xl">
        <Link href="/" className="inline-flex">
          <Wordmark size="sm" />
        </Link>
      </header>
      <section className="mx-auto mt-12 max-w-2xl">
        <h1 className="font-serif text-3xl italic sm:text-5xl" style={{ fontFamily: 'var(--font-serif)' }}>
          {copy.onboarding.title}
        </h1>
        <div className="mt-10">
          <Suspense>
            <IncomeForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
