"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-in fade-in duration-700">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">Flexible pricing to fit your fitness journey</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Awdan Starter",
              price: "FREE",
              period: "",
              features: [
                "7-day personalized training plan",
                "Basic daily habit & wellness tips",
                "Access to community challenges",
                "Progress tracker (summary view)",
                "Up to 3 daily nudges",
                "Preview of Nutrition/Recovery",
              ],
              popular: false
            },
            {
              name: "Awdan Pro",
              subtitle: "BASIC",
              price: "499",
              period: "month",
              currency: "EGP",
              usdPrice: "≈ $9.99",
              features: [
                "Everything in Starter, plus:",
                "AI-personalized training (auto-updated)",
                "Nutrition-Lite: meal options, grocery list",
                "Recovery tracking with auto-tunes",
                "Full Performance dashboard",
                "Priority chat support",
              ],
              popular: true
            },
            {
              name: "✨ Awdan Elite",
              subtitle: "PREMIUM",
              price: "1,199",
              period: "month",
              currency: "EGP",
              yearlyPrice: "11,000",
              features: [
                "Everything in Awdan Pro, plus:",
                "Hybrid Access: 4 studio sessions/month",
                "Access to select Hybrid Days",
                "1:1 coach check-in once per month",
                "Custom nutrition & recovery plan",
                "Member discounts for retreats",
              ],
              popular: false
            }
          ].map((plan, idx) => (
            <Card 
              key={idx} 
              className={`p-8 hover:shadow-elegant transition-all animate-in zoom-in duration-500 relative bg-card ${
                plan.popular ? 'border-primary border-2 scale-105' : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                {plan.subtitle && (
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    {plan.subtitle}
                  </p>
                )}
                <h3 className="text-2xl font-bold mb-2 tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  {plan.price === "FREE" ? (
                    <span className="text-5xl font-bold text-primary">FREE</span>
                  ) : (
                    <>
                      <span className="text-muted-foreground text-sm mr-1 font-bold">{plan.currency}</span>
                      <span className="text-5xl font-bold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground font-medium">/{plan.period}</span>
                    </>
                  )}
                </div>
                {plan.usdPrice && (
                  <p className="text-sm text-muted-foreground mt-1">{plan.usdPrice}</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                size="lg" 
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link href="/onboarding">Get Started</Link>
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-8 text-sm">
          All plans include a 7-day free trial • Powered by Awdan Vibes
        </p>
      </div>
    </div>
  );
};

export default Pricing;
