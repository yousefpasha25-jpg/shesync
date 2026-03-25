import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SheSync by Awdan Vibes — AI Fitness for Women",
  description: "The AI-powered wellness platform built exclusively for women. Hormonal cycle syncing, personalized workouts, MENA-culturally aware nutrition, and an empathetic AI coach.",
  keywords: ["women fitness", "cycle syncing", "AI coach", "femtech", "personalized workouts", "MENA nutrition"],
  openGraph: {
    title: "SheSync by Awdan Vibes",
    description: "Elite AI coaching tailored to your hormonal cycle. Personalized workouts + nutrition — built for women.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#D4607A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground min-h-screen pb-24`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LanguageProvider>
            <TopNav />
            <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 w-full">
              {children}
            </main>
            <BottomNav />
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
