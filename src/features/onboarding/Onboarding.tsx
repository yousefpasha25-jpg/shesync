"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BrandLogo } from "@/components/ui/BrandLogo";

// Import steps from sub-files
import { Step1, Step2, Step3, Step4, Step5 } from "@/features/onboarding/Steps1-5";
import { Step6, Step7, Step8, Step9, Step10, Step11 } from "@/features/onboarding/Steps6-11";
import { OnboardingData } from "./types";
import { saveOnboardingDataAction } from "@/features/onboarding/actions";

const TOTAL_STEPS = 11;

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const progress = (step / TOTAL_STEPS) * 100;

  // Create anonymous session on mount if needed
  useEffect(() => {
    const initSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // In a real app, you might want to sign in anonymously or redirect to login
        // await supabase.auth.signInAnonymously();
      }
      setIsInitialized(true);
    };
    initSession();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <BrandLogo size="lg" withText={false} className="animate-pulse mb-4" />
        <p className="text-muted-foreground">Preparing your Awdan Experience...</p>
      </div>
      </div>
    );
  }

  const handleNext = (data: any) => {
    setOnboardingData({ ...onboardingData, ...data });
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleComplete = async (finalData?: any) => {
    try {
      const dataToSave = finalData || onboardingData;
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth Error:", authError);
        toast({
          variant: "destructive",
          title: "Session error",
          description: "Please log in to save your progress.",
        });
        router.push("/login");
        return;
      }

      await saveOnboardingDataAction(dataToSave);

      // 6. Redirect immediately to Dashboard.
      router.push("/dashboard");
    } catch (error: any) {
      console.warn("Onboarding error object:", JSON.stringify(error, null, 2));
      toast({
        variant: "destructive",
        title: "Database Error",
        description: error.message || error.details || "Failed to save profile. Please check schema.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {[1, 7, 11].includes(step) ? (
        <div className="w-full h-screen fixed inset-0">
          {step === 1 && <Step1 onNext={handleNext} onBack={handleBack} initialData={onboardingData} progress={progress} currentStep={step} totalSteps={TOTAL_STEPS} />}
          {step === 7 && <Step7 onNext={handleNext} onBack={handleBack} initialData={onboardingData} progress={progress} currentStep={step} totalSteps={TOTAL_STEPS} />}
          {step === 11 && <Step11 onComplete={handleComplete} onBack={handleBack} allData={onboardingData} progress={progress} currentStep={step} totalSteps={TOTAL_STEPS} />}
        </div>
      ) : (
        <Card className="w-full max-w-2xl shadow-lg animate-in fade-in zoom-in duration-300">
          <CardHeader className="relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <BrandLogo size="sm" />
            </div>
            <CardDescription className="text-sm text-muted-foreground relative z-10">
              Step {step} of {TOTAL_STEPS} • {Math.round(progress)}%
            </CardDescription>
            <Progress value={progress} className="mt-4 relative z-10" />
          </CardHeader>
          <CardContent>
            {step === 2 && <Step2 onNext={handleNext} onBack={handleBack} onSkip={handleSkip} initialData={onboardingData} />}
            {step === 3 && <Step3 onNext={handleNext} onBack={handleBack} initialData={onboardingData} />}
            {step === 4 && <Step4 onNext={handleNext} onBack={handleBack} initialData={onboardingData} />}
            {step === 5 && <Step5 onNext={handleNext} onBack={handleBack} onSkip={handleSkip} initialData={onboardingData} />}
            {step === 6 && <Step6 onNext={handleNext} onBack={handleBack} initialData={onboardingData} />}
            {step === 8 && <Step8 onNext={handleNext} onBack={handleBack} initialData={onboardingData} />}
            {step === 9 && <Step9 onNext={handleNext} onBack={handleBack} initialData={onboardingData} />}
            {step === 10 && <Step10 onNext={handleNext} onBack={handleBack} onSkip={handleSkip} initialData={onboardingData} />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
