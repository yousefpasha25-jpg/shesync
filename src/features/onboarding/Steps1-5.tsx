"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { step1Schema, step2Schema, step3Schema, step4Schema, step5Schema } from "./types";

const STEP1_IMAGE = "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2670&auto=format&fit=crop";

export function Step1({ onNext, onBack, initialData, progress, currentStep, totalSteps }: any) {
  const form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema) as any,
    defaultValues: {
      name: initialData.name || "",
      age: initialData.age || "",
      height_cm: initialData.height_cm || "",
      weight_kg: initialData.weight_kg || "",
    },
  });

  return (
    <div className="fixed inset-0">
      <div className="absolute inset-0">
        <Image src={STEP1_IMAGE} alt="Welcome" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>
      <div className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-white font-semibold">Awdan Vibes</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/80">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>
      <div className="relative h-full overflow-y-auto pt-40">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
              <div className="text-center space-y-3 mb-6">
                <h2 className="text-4xl font-bold text-white">Welcome to Awdan Vibes</h2>
                <p className="text-lg text-white/90">Let's get to know your body, mind, and rhythm.</p>
              </div>
              <div className="bg-background/95 backdrop-blur-md rounded-xl p-6 shadow-lg space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="25" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="height_cm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="160" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight_kg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="60" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-lg">
                  Next <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export function Step2({ onNext, onBack, onSkip, initialData }: any) {
  const form = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: initialData,
  });

  const isPregnant = form.watch("is_pregnant");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-bold">Pregnancy Information</h2>
          <p className="text-sm text-muted-foreground italic">Help us tailor your fitness plan safely (Optional)</p>
        </div>
        <FormField
          control={form.control}
          name="is_pregnant"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-lg border border-primary/20 bg-primary/5">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-5 w-5 mt-1" />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base font-medium cursor-pointer">I am currently pregnant</FormLabel>
              </div>
            </FormItem>
          )}
        />
        {isPregnant && (
          <FormField
            control={form.control}
            name="pregnancy_weeks"
            render={({ field }) => (
              <FormItem className="pl-8">
                <FormLabel>How many weeks pregnant are you?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Select pregnancy stage" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="first_trimester">First trimester (1-12 weeks)</SelectItem>
                    <SelectItem value="second_trimester">Second trimester (13-27 weeks)</SelectItem>
                    <SelectItem value="third_trimester">Third trimester (28-40 weeks)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex gap-3 pt-4">
          <Button type="button" onClick={onBack} variant="outline" size="lg" className="h-12"><ArrowLeft className="mr-2 h-5 w-5" /> Back</Button>
          <Button type="button" onClick={onSkip} variant="ghost" size="lg" className="h-12">Skip</Button>
          <Button type="submit" size="lg" className="flex-1 h-12">Next <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </form>
    </Form>
  );
}

export function Step3({ onNext, onBack, initialData }: any) {
  const form = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
    defaultValues: { goals: initialData.goals || [] },
  });

  const goals = [
    { id: "weight_management", label: "Weight management" },
    { id: "fat_loss", label: "Burn fat" },
    { id: "muscle_building", label: "Build muscle" },
    { id: "strength", label: "Increase strength" },
    { id: "general_fitness", label: "General fitness" },
    { id: "hormonal_balance", label: "Hormonal balance" },
    { id: "stress", label: "Reduce stress" },
    { id: "better_sleep", label: "Improve sleep" },
    { id: "energy", label: "Boost energy" },
    { id: "postpartum", label: "Postpartum recovery" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-bold">What are your main goals?</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {goals.map((goal) => (
            <FormField
              key={goal.id}
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem key={goal.id} className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(goal.id)}
                      onCheckedChange={(checked) => {
                        const value = field.value || [];
                        return checked ? field.onChange([...value, goal.id]) : field.onChange(value.filter((v: string) => v !== goal.id));
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal text-base cursor-pointer">{goal.label}</FormLabel>
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

export function Step4({ onNext, onBack, initialData }: any) {
  const form = useForm<z.infer<typeof step4Schema>>({ resolver: zodResolver(step4Schema), defaultValues: initialData });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Lifestyle & Routine</h2>
        <FormField
          control={form.control}
          name="work_schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work schedule</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="h-12"><SelectValue placeholder="Select schedule" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="regular_9_5">Regular 9-5</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="shift">Shift work</SelectItem>
                  </SelectContent>
                </Select>
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

export function Step5({ onNext, onBack, onSkip, initialData }: any) {
  const form = useForm<z.infer<typeof step5Schema>>({ 
    resolver: zodResolver(step5Schema) as any, 
    defaultValues: initialData 
  });
  const cycleEnabled = form.watch("cycle_enabled");
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Menstrual Cycle Tracking</h2>
        <FormField
          control={form.control}
          name="cycle_enabled"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-3 p-4 rounded-lg border">
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              <FormLabel>Enable tracking</FormLabel>
            </FormItem>
          )}
        />
        {cycleEnabled && (
          <div className="space-y-4 pl-4">
            <FormField
              control={form.control}
              name="last_period_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Last period start</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("h-12 text-left", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
        )}
        <div className="flex gap-3 pt-4">
          <Button type="button" onClick={onBack} variant="outline" size="lg" className="h-12"><ArrowLeft className="mr-2 h-5 w-5" /> Back</Button>
          <Button type="submit" size="lg" className="flex-1 h-12">Next <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </form>
    </Form>
  );
}
