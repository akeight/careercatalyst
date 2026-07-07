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
import { LandingAnimations } from "./_components/LandingAnimations";

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef} className="w-full">
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
      <LandingAnimations rootRef={rootRef} />
    </div>
  );
}
