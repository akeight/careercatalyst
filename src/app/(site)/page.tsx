"use client";

import { useRef } from "react";

import { MarketingNav } from "./_components/MarketingNav";
import { HeroSection } from "./_components/HeroSection";
import { MetricStrip } from "./_components/MetricStrip";
import { ProblemSection } from "./_components/ProblemSection";
import { FeatureShowcase } from "./_components/FeatureShowcase";
import { HowItWorks } from "./_components/HowItWorks";
import { ResourcesTeaser } from "./_components/ResourcesTeaser";
import { FinalCTA } from "./_components/FinalCTA";
import { useLandingAnimations } from "./_components/LandingAnimations";

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useLandingAnimations(rootRef);

  return (
    <div ref={rootRef} className="landing-root w-full" data-anim="pending">
      <MarketingNav />
      <main>
        <HeroSection />
        <div className="site-fold relative z-10 bg-background">
          <MetricStrip />
          <ProblemSection />
          <FeatureShowcase />
          <HowItWorks />
          <ResourcesTeaser />
          <FinalCTA />
        </div>
      </main>
    </div>
  );
}
