"use client";

import { useState, useEffect } from "react";
import InvestmentCalculator from "@/components/InvestmentCalculator";
import OnboardingModal from "@/components/OnboardingModal";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // Check if the user has completed onboarding before
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    if (onboardingCompleted) {
      setShowOnboarding(false);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem("onboardingCompleted", "true");
    // Here you can also save the user's data to your backend or state management
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
      <InvestmentCalculator />
    </main>
  );
}
