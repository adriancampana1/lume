import { Hero } from './components/landing/hero.js';
import { HowItWorks } from './components/landing/how-it-works.js';
import { WhatShows } from './components/landing/what-shows.js';
import { PrivacySection } from './components/landing/privacy-section.js';
import { FinalCta } from './components/landing/final-cta.js';
import { Footer } from './components/landing/footer.js';

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <WhatShows />
      <PrivacySection />
      <FinalCta />
      <Footer />
    </>
  );
}
