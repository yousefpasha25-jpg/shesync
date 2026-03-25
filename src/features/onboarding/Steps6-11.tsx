"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";
import Image from "next/image";
import { step6Schema, step7Schema, step8Schema, step9Schema, step10Schema } from "./types";

const STEP7_IMAGE = "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2670&auto=format&fit=crop";
const STEP11_IMAGE = "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2670&auto=format&fit=crop";

export function Step6({ onNext, onBack, initialData }: any) {
  const form = useForm<z.infer<typeof step6Schema>>({ resolver: zodResolver(step6Schema) as any, defaultValues: initialData });
  const modalities = [
    { id: "strength", label: "Strength training" },
    { id: "cardio", label: "Cardio" },
    { id: "yoga", label: "Yoga" },
    { id: "pilates", label: "Pilates" },
    { id: "hiit", label: "HIIT" },
  ];
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Fitness Preferences</h2>
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                {["beginner", "intermediate", "advanced"].map((lvl) => (
                  <FormItem key={lvl} className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value={lvl} />
                    <FormLabel className="font-normal capitalize">{lvl}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          {modalities.map((mod) => (
            <FormField
              key={mod.id}
              control={form.control}
              name="modalities"
              render={({ field }) => (
                <FormItem key={mod.id} className="flex items-center space-x-3 space-y-0">
                  <Checkbox checked={field.value?.includes(mod.id)} onCheckedChange={(checked) => {
                    const value = field.value || [];
                    return checked ? field.onChange([...value, mod.id]) : field.onChange(value.filter((v: string) => v !== mod.id));
                  }} />
                  <FormLabel className="font-normal">{mod.label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="button" onClick={onBack} variant="outline" size="lg" className="h-12"><ArrowLeft className="mr-2 h-5 w-5" /> Back</Button>
          <Button type="submit" size="lg" className="flex-1 h-12">Next <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </form>
    </Form>
  );
}

export function Step7({ onNext, onBack, initialData, progress, currentStep, totalSteps }: any) {
  const form = useForm<z.infer<typeof step7Schema>>({ 
    resolver: zodResolver(step7Schema) as any, 
    defaultValues: {
      ...initialData,
      preferred_duration_min: initialData.preferred_duration_min || "",
    } 
  });
  return (
    <div className="fixed inset-0">
      <div className="absolute inset-0">
        <Image src={STEP7_IMAGE} alt="Workout" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>
      {/* Header same as Step 1 */}
      <div className="relative h-full overflow-y-auto pt-40">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
              <h2 className="text-4xl font-bold text-white text-center mb-6">Workout Intensity</h2>
              <div className="bg-background/95 backdrop-blur-md rounded-xl p-6 space-y-6">
                <FormField
                  control={form.control}
                  name="preferred_duration_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (min)</FormLabel>
                      <Input type="number" {...field} className="h-12" />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full h-12">Next <ArrowRight className="ml-2 h-5 w-5" /></Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export function Step8({ onNext, onBack, initialData }: any) {
  const form = useForm<z.infer<typeof step8Schema>>({ 
    resolver: zodResolver(step8Schema) as any, 
    defaultValues: {
      ...initialData,
      water_liters: initialData.water_liters || "",
    }
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Nutrition</h2>
        <FormField
          control={form.control}
          name="water_liters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Water (Liters)</FormLabel>
              <Input type="number" step="0.1" {...field} className="h-12" />
            </FormItem>
          )}
        />
        <div className="flex gap-3 pt-4">
          <Button type="button" onClick={onBack} variant="outline" size="lg" className="h-12"><ArrowLeft className="mr-2 h-5 w-5" /> Back</Button>
          <Button type="submit" size="lg" className="flex-1 h-12">Next <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </form>
    </Form>
  );
}

export function Step9({ onNext, onBack, initialData }: any) {
  const form = useForm<z.infer<typeof step9Schema>>({ resolver: zodResolver(step9Schema) as any, defaultValues: initialData });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Equipment</h2>
        <FormField
          control={form.control}
          name="equipment_context"
          render={({ field }) => (
            <FormItem>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                {["home_gym", "commercial_gym", "bodyweight"].map((ctx) => (
                  <FormItem key={ctx} className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value={ctx} />
                    <FormLabel className="font-normal capitalize">{ctx.replace("_", " ")}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />
        <div className="flex gap-3 pt-4">
          <Button type="button" onClick={onBack} variant="outline" size="lg" className="h-12"><ArrowLeft className="mr-2 h-5 w-5" /> Back</Button>
          <Button type="submit" size="lg" className="flex-1 h-12">Next <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </form>
    </Form>
  );
}

export function Step10({ onNext, onBack, initialData, onSkip }: any) {
  const form = useForm<z.infer<typeof step10Schema>>({ resolver: zodResolver(step10Schema) as any, defaultValues: initialData });
  
  const providers = ["Apple Health", "Google Fit", "Fitbit", "Garmin", "WHOOP", "Oura Ring"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="text-left space-y-2 mb-8">
          <h2 className="text-3xl font-bold">Connect your devices</h2>
          <p className="text-muted-foreground">Syncing with your world for deeper insights.</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium">Select wearables to connect (optional)</p>
          <p className="text-xs text-muted-foreground mb-4">Connect your devices for better insights and tracking</p>
          
          <FormField
            control={form.control}
            name="wearable_providers"
            render={() => (
              <FormItem className="space-y-3">
                {providers.map((provider) => (
                  <FormField
                    key={provider}
                    control={form.control}
                    name="wearable_providers"
                    render={({ field }) => {
                      const isSelected = field.value?.includes(provider);
                      return (
                        <FormItem
                          key={provider}
                          className={`flex flex-row items-center space-x-3 space-y-0 p-4 rounded-xl border cursor-pointer transition-colors ${
                            isSelected 
                              ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(132,198,99,0.15)]" 
                              : "bg-background hover:bg-muted/50 border-input"
                          }`}
                        >
                          <FormControl>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                const value = field.value || [];
                                return checked
                                  ? field.onChange([...value, provider])
                                  : field.onChange(value.filter((v: string) => v !== provider));
                              }}
                              className={`rounded-full h-5 w-5 border-2 ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"}`}
                            />
                          </FormControl>
                          <FormLabel className="font-medium flex-1 cursor-pointer text-base">
                            {provider}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-6 shrink-0 mt-auto">
          <Button type="button" onClick={onBack} variant="outline" size="lg" className="h-12 w-24">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button type="button" onClick={onSkip} variant="ghost" size="lg" className="h-12 px-2 text-muted-foreground shrink-0">
            Skip
          </Button>
          <Button type="submit" size="lg" className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-lg">
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function Step11({ onComplete, onBack, allData }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const handleComplete = async () => {
    setIsLoading(true);
    await onComplete({ ...allData, consent_given: true });
    setIsLoading(false);
  };
  return (
    <div className="fixed inset-0">
      <div className="absolute inset-0">
        <Image src={STEP11_IMAGE} alt="SheSync" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>
      <div className="relative h-full overflow-y-auto pt-40 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-4 pt-4">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-2">You're all set! 🎉</h2>
            <div className="bg-background/95 backdrop-blur-md rounded-xl p-6 text-foreground text-left">
              <h4 className="font-bold border-b pb-2 mb-4">Profile Summary</h4>
              <p>Name: {allData.name}</p>
              <p>Age: {allData.age}</p>
              <p>Goals: {allData.goals?.join(", ")}</p>
            </div>
            
            <div className="flex items-start space-x-3 text-left">
              <Checkbox 
                id="consent" 
                checked={consentGiven} 
                onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="consent" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                I agree to the Terms of Service and Privacy Policy. I explicitly consent to the processing of my health data for coaching purposes.
              </label>
            </div>

            <div className="flex gap-3 pt-6 pb-8">
              <Button type="button" onClick={onBack} variant="outline" size="lg" className="h-12">Back</Button>
              <Button onClick={handleComplete} size="lg" className="flex-1 h-12 bg-primary text-white" disabled={isLoading || !consentGiven}>
                {isLoading ? "Saving..." : "Start Your Journey"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
