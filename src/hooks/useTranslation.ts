"use client";

import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// Stub translations for Landing page
const translations = {
  en: {
    landing: {
      title: "Discover Your Body's Natural Rhythm",
      subtitle: "The ultimate fitness and wellness companion for women, powered by AI and synced with your cycle.",
      features: {
        cycle: "Cycle Syncing",
        cycleDesc: "Tailor your workouts to your hormonal phases.",
        nutrition: "Clinical Nutrition",
        nutritionDesc: "Personalized meal plans for your goals.",
        workouts: "Smart Workouts",
        workoutsDesc: "AI-generated training that evolves with you.",
        ai: "AI Coach",
        aiDesc: "24/7 expert guidance at your fingertips."
      },
      cta: {
        main: "Get Started Now",
        join: "Join thousands of women today",
        free: "Try for free • No credit card required"
      }
    }
  },
  ar: {
    landing: {
      title: "اكتشفي إيقاع جسمك الطبيعي",
      subtitle: "الرفيق الأمثل للياقة البدنية والعافية للنساء، مدعوماً بالذكاء الاصطناعي ومتزامناً مع دورتك.",
      features: {
        cycle: "مزامنة الدورة",
        cycleDesc: "خصصي تمارينك لتناسب مراحل توازنك الهرموني.",
        nutrition: "تغذية إكلينيكية",
        nutritionDesc: "خطط وجبات مخصصة لأهدافك.",
        workouts: "تمارين ذكية",
        workoutsDesc: "تدريبات تم إنشاؤها عبر الذكاء الاصطناعي تتطور معك.",
        ai: "مدرب ذكاء اصطناعي",
        aiDesc: "إرشاد خبير على مدار الساعة بين يديك."
      },
      cta: {
        main: "ابدئي الآن",
        join: "انضمي إلى آلاف النساء اليوم",
        free: "جربي مجاناً • لا حاجة لبطاقة ائتمان"
      }
    }
  }
};

export const useTranslation = () => {
  const { language } = useLanguage();

  return useMemo(() => {
    const t = translations[language as keyof typeof translations] || translations.en;
    const isRTL = language === 'ar';
    return { t, isRTL, language };
  }, [language]);
};
