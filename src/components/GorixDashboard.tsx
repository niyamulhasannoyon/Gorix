"use client";

import React, { useState } from "react";
import {
  Compass,
  FileText,
  Shield,
  Hash,
  Percent,
  Landmark,
  Palette,
  Code,
  Megaphone,
  CheckSquare,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Zap,
} from "lucide-react";

// Types
export type StepStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface PipelineStep {
  id: string;
  stepNumber: number;
  titleBn: string;
  titleEn: string;
  shortDescBn: string;
  shortDescEn: string;
  fullDescBn: string;
  fullDescEn: string;
  status: StepStatus;
  estimatedTime: string;
  icon: React.ComponentType<any>;
  details: {
    requirements: string[];
    fees: string;
    actionLabel: string;
    actionUrl?: string;
  };
}

export default function GorixDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<string>("step_1");

  // Local state representing the 10 venture steps
  const [steps, setSteps] = useState<PipelineStep[]>([
    {
      id: "step_1",
      stepNumber: 1,
      titleBn: "আইডিয়া ও সত্তা নির্ধারণ",
      titleEn: "Entity Definition",
      shortDescBn: "ব্যবসার ক্যাটাগরি ও আইনি কাঠামো নির্ধারণ করা।",
      shortDescEn: "Define category, scale, and legal structure of the venture.",
      fullDescBn: "ব্যবসার আকার ও ধরনের উপর ভিত্তি করে লিমিটেড কোম্পানি, অংশীদারি নাকি একমালিকানা ব্যবসা উপযুক্ত তা নির্বাচন করা। এটি আপনার ভবিষ্যৎ আইনি বাধ্যবাধকতা নিয়ন্ত্রণ করবে।",
      fullDescEn: "Select the legal structure (Sole Proprietorship, Partnership, or Private Limited) matching your business scale, which dictates your liability and compliance requirements.",
      status: "COMPLETED",
      estimatedTime: "১ দিন / 1 Day",
      icon: Compass,
      details: {
        requirements: ["জাতীয় পরিচয়পত্র (NID)", "পাসপোর্ট সাইজ ছবি", "অফিস স্পেসের চুক্তিপত্র"],
        fees: "ফ্রি (Gorix OS এর অন্তর্ভুক্ত)",
        actionLabel: "সত্তা গাইড দেখুন",
      },
    },
    {
      id: "step_2",
      stepNumber: 2,
      titleBn: "কোম্পানি নিবন্ধন ও নাম ছাড়পত্র",
      titleEn: "RJSC Name Clearance",
      shortDescBn: "আরজেএসসি থেকে কোম্পানির নাম অনুমোদন ও নিবন্ধন (প্রযোজ্য ক্ষেত্রে)।",
      shortDescEn: "Clear and register your company name under RJSC (if Private Limited).",
      fullDescBn: "যদি আপনার ব্যবসাটি প্রাইভেট লিমিটেড কোম্পানি হয়, তবে RJSC পোর্টাল থেকে ইউনিক নামের ছাড়পত্র নিয়ে মেমোরেন্ডাম অব অ্যাসোসিয়েশন (MoA) তৈরি করতে হবে।",
      fullDescEn: "For Private Limited setup, apply for name clearance on the RJSC portal, draft the Memorandum of Association (MoA), and complete registration.",
      status: "COMPLETED",
      estimatedTime: "৩-৭ দিন / 3-7 Days",
      icon: FileText,
      details: {
        requirements: ["প্রস্তাবিত নামসমূহ", "উদ্যোক্তাদের NID ও ইমেইল", "MoA ও AoA খসড়া"],
        fees: "৳১,০০০ (নাম ছাড়পত্র) + সরকারি স্ট্যাম্প শুল্ক",
        actionLabel: "RJSC পোর্টালে যান",
        actionUrl: "http://www.roc.gov.bd/",
      },
    },
    {
      id: "step_3",
      stepNumber: 3,
      titleBn: "ট্রেড লাইসেন্স সংগ্রহ",
      titleEn: "Trade License Acquisition",
      shortDescBn: "সিটি কর্পোরেশন বা ইউনিয়ন পরিষদ থেকে লাইসেন্স সংগ্রহ করা।",
      shortDescEn: "Obtain local commercial permit from City Corp or Union Parishad.",
      fullDescBn: "আপনার ব্যবসার অফিসের ভৌগোলিক অবস্থানের ওপর ভিত্তি করে সংশ্লিষ্ট সিটি কর্পোরেশন, পৌরসভা বা ইউনিয়ন পরিষদ থেকে বাণিজ্যিক পরিচালনার অনুমতিপত্র সংগ্রহ করতে হবে।",
      fullDescEn: "Depending on your office address, obtain a trade license from the relevant City Corporation or local Union Parishad office for lawful operations.",
      status: "IN_PROGRESS",
      estimatedTime: "৩-৫ দিন / 3-5 Days",
      icon: Shield,
      details: {
        requirements: ["ভাড়ার চুক্তিপত্র বা হোল্ডিং ট্যাক্স রশিদ", "NID কপি", "তিন কপি ছবি", "ইউটিলিটি বিলের কপি"],
        fees: "৳২,০০০ - ৳১৫,০০০ (ব্যবসার ধরণ ও অবস্থানভেদে)",
        actionLabel: "ফর্ম ডাউনলোড করুন",
      },
    },
    {
      id: "step_4",
      stepNumber: 4,
      titleBn: "ই-টিন (e-TIN) নিবন্ধন",
      titleEn: "Tax ID (e-TIN) Registration",
      shortDescBn: "এনবিআর থেকে ট্যাক্স আইডেন্টিফিকেশন নম্বর তৈরি।",
      shortDescEn: "Generate Taxpayer Identification Number from NBR.",
      fullDescBn: "জাতীয় রাজস্ব বোর্ড (NBR) থেকে ব্যবসার নামে ই-টিন গ্রহণ করতে হবে। ট্রেড লাইসেন্স কার্যকর রাখতে এবং ব্যাংক হিসাব খুলতে এটি বাধ্যবাধকতা।",
      fullDescEn: "Register for an online Taxpayer Identification Number (e-TIN) on the NBR portal. Mandatory for trade validation and opening corporate accounts.",
      status: "IN_PROGRESS",
      estimatedTime: "১ দিন / 1 Day",
      icon: Hash,
      details: {
        requirements: ["NID নম্বর", "সচল মোবাইল নম্বর", "ট্রেড লাইসেন্স (প্রযোজ্য ক্ষেত্রে)"],
        fees: "ফ্রি (সরকারি পোর্টাল)",
        actionLabel: "NBR টিন পোর্টাল",
        actionUrl: "https://secure.incometax.gov.bd/TINHome",
      },
    },
    {
      id: "step_5",
      stepNumber: 5,
      titleBn: "ভ্যাট ও বিন (BIN) নিবন্ধন",
      titleEn: "VAT Registration (BIN)",
      shortDescBn: "পণ্য বা সেবার জন্য ব্যবসায়িক আইডেন্টিফিকেশন নম্বর সংগ্রহ।",
      shortDescEn: "Register for Business Identification Number from NBR.",
      fullDescBn: "ব্যবসার বার্ষিক লেনদেনের ওপর ভিত্তি করে অনলাইন ভ্যাট পোর্টাল থেকে ভ্যাট রেজিস্ট্রেশন বা BIN নম্বর গ্রহণ করা প্রয়োজন, বিশেষ করে ট্রেডিং বা সেবা খাতের জন্য।",
      fullDescEn: "Obtain your Business Identification Number (BIN) via the online VAT system. Mandatory for customs, governmental bids, and retail transactions.",
      status: "PENDING",
      estimatedTime: "২ দিন / 2 Days",
      icon: Percent,
      details: {
        requirements: ["ট্রেড লাইসেন্স", "e-TIN সার্টিফিকেট", "ব্যাংক সলভেন্সি সার্টিফিকেট", "IRC/ERC (আমদানি-রপ্তানির ক্ষেত্রে)"],
        fees: "ফ্রি (অনলাইন আবেদন)",
        actionLabel: "ভ্যাট পোর্টালে যান",
        actionUrl: "https://vat.gov.bd/",
      },
    },
    {
      id: "step_6",
      stepNumber: 6,
      titleBn: "ব্যাংক হিসাব ও পেমেন্ট গেটওয়ে",
      titleEn: "Corporate Bank & PG Setup",
      shortDescBn: "বাণিজ্যিক ব্যাংক অ্যাকাউন্ট খোলা ও পেমেন্ট গেটওয়ে সেটআপ।",
      shortDescEn: "Open commercial bank account and integrate payment gateways.",
      fullDescBn: "ব্যবসার নামে একটি ডেডিকেটেড চলতি হিসাব (Current Account) খোলা এবং অনলাইনে গ্রাহকের পেমেন্ট (বিকাশ, নগদ, কার্ড) গ্রহণের জন্য SSLCommerz বা শুরোপে ইন্টিগ্রেট করা।",
      fullDescEn: "Open a corporate current bank account and deploy digital payment integration (bKash, Nagad, cards) using local gateways like SSLCommerz.",
      status: "PENDING",
      estimatedTime: "৩-৫ দিন / 3-5 Days",
      icon: Landmark,
      details: {
        requirements: ["ট্রেড লাইসেন্স কপি", "e-TIN", "উদ্যোক্তাদের NID ও ছবি", "ব্যাংক ফর্ম ও নমিনী তথ্য"],
        fees: "৳১,০০০ - ৳৫,০০০ (প্রাথমিক ডিপোজিট)",
        actionLabel: "গেটওয়ে ইন্টিগ্রেশন চেক করুন",
      },
    },
    {
      id: "step_7",
      stepNumber: 7,
      titleBn: "এআই লোগো ও ব্র্যান্ডিং",
      titleEn: "AI Logo & Branding",
      shortDescBn: "Gorix AI দিয়ে ব্র্যান্ডের লোগো, থিম ও কনটেন্ট কিট তৈরি।",
      shortDescEn: "Create brand logos, themes, and social kits using Gorix AI.",
      fullDescBn: "আপনার ব্যবসার মূল থিম ও লক্ষ্য অনুযায়ী এআই ইঞ্জিন দিয়ে হাই-রেজোলিউশন ইউনিক লোগো, ব্র্যান্ড কালার প্যালেট ও সোশ্যাল মিডিয়া কিট স্বয়ংক্রিয়ভাবে তৈরি করুন।",
      fullDescEn: "Auto-generate high-fidelity corporate logos, color schemes, and media kits using localized Gorix visual branding models.",
      status: "PENDING",
      estimatedTime: "১০ মিনিট / 10 Mins",
      icon: Palette,
      details: {
        requirements: ["ব্যবসার নাম", "পছন্দের রঙ ও স্লোগান", "ক্যাটাগরি টাইপ"],
        fees: "ফ্রি (Gorix OS এর অন্তর্ভুক্ত)",
        actionLabel: "লোগো জেনারেটর খুলুন",
      },
    },
    {
      id: "step_8",
      stepNumber: 8,
      titleBn: "ওয়েবসাইট ও টেক ইনফ্রাস্ট্রাকচার",
      titleEn: "Web & Tech Boilerplate",
      shortDescBn: "Next.js কমার্স বা ল্যান্ডিং পেজ ওয়েবসাইট ডিপ্লয়মেন্ট।",
      shortDescEn: "Deploy React/Next.js store or landing structure on Vercel.",
      fullDescBn: "বাংলা ও ইংরেজি দ্বি-ভাষিক সুবিধা, এসইও ফ্রেন্ডলি কাঠামো এবং ফাস্ট লোডিং স্পিড সহ Next.js ই-কমার্স বা সার্ভিস ল্যান্ডিং পেজ ও ডোমেইন হোস্টিং সেটআপ।",
      fullDescEn: "Launch a custom dynamic Next.js application with built-in dual-language optimization, fast routing, and Vercel edge deployment.",
      status: "PENDING",
      estimatedTime: "১ দিন / 1 Day",
      icon: Code,
      details: {
        requirements: ["ডোমেইন নাম", "পেমেন্ট গেটওয়ে API কী", "প্রোডাক্ট ক্যাটালগ খসড়া"],
        fees: "৳১,২০/বছর (ডোমেইন) + হোস্টিং ফ্রি টায়ার",
        actionLabel: "কোড বয়লারপ্লেট ডাউনলোড",
      },
    },
    {
      id: "step_9",
      stepNumber: 9,
      titleBn: "ডিজিটাল মার্কেটিং ও কনটেন্ট",
      titleEn: "Marketing & Launch Plan",
      shortDescBn: "ফেসবুক কমার্স পেজ ও কনটেন্ট মার্কেটিং ক্যাম্পেইন লঞ্চ।",
      shortDescEn: "Setup Facebook Commerce structure, pixel, and SMS campaigns.",
      fullDescBn: "বাংলাদেশি ক্রেতাদের টার্গেট করে ফেসবুক পেজ সেটআপ, মেটা পিক্সেল ইন্টিগ্রেশন, কাস্টমার রিলেশনশিপ বট এবং বাংলা এসএমএস গেটওয়ে মার্কেটিং প্ল্যান বাস্তবায়ন।",
      fullDescEn: "Implement localized customer reach plans involving Meta Pixel setup, Facebook shop sync, and bulk SMS target messaging platforms.",
      status: "PENDING",
      estimatedTime: "২ দিন / 2 Days",
      icon: Megaphone,
      details: {
        requirements: ["ফেসবুক পেজ এক্সেস", "বিজ্ঞাপন বাজেট কার্ড", "টার্গেটেড অডিয়েন্স প্রোফাইল"],
        fees: "৳৫,০০০ - ৳১০,০০০ (প্রাথমিক বিজ্ঞাপন বাজেট)",
        actionLabel: "ক্যাম্পেইন শিডিউলার",
      },
    },
    {
      id: "step_10",
      stepNumber: 10,
      titleBn: "কমপ্লায়েন্স ও ট্যাক্স রিটার্ন",
      titleEn: "Tax & Budget Compliance",
      shortDescBn: "বার্ষিক ট্যাক্স রিটার্ন ও ব্যবসার অডিট প্রস্তুতি।",
      shortDescEn: "Bookkeeping setup aligning with current Bangladesh Budget.",
      fullDescBn: "চলতি অর্থবছরের বাজেট নীতিমালা করের হিসাব রাখা, বার্ষিক আয়-ব্যয়ের অডিট ফাইল সংরক্ষণ এবং নির্দিষ্ট সময়ে ট্রেড লাইসেন্স রিনিউ করার সহজ ড্যাশবোর্ড ট্র্যাকিং।",
      fullDescEn: "Ensure compliance with the national tax bracket. Automate tax calculations and setup calendar alerts for trade license renewals.",
      status: "PENDING",
      estimatedTime: "চলমান / Ongoing",
      icon: CheckSquare,
      details: {
        requirements: ["ইনভয়েস লগ", "মাসিক খরচ হিসাব", "ট্যাক্স সার্টিফিকেট ফাইল"],
        fees: "ট্যাক্স স্ল্যাব অনুযায়ী কর",
        actionLabel: "ট্যাক্স ক্যালকুলেটর",
      },
    },
  ]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsGenerating(true);
    // Simulate multi-agent processing animation
    setTimeout(() => {
      setIsGenerating(false);
      // Randomize state progress to demonstrate update capabilities
      setSteps((prev) =>
        prev.map((step, idx) => {
          if (idx === 0) return { ...step, status: "COMPLETED" };
          if (idx === 1) return { ...step, status: "COMPLETED" };
          if (idx === 2) return { ...step, status: "IN_PROGRESS" };
          return { ...step, status: "PENDING" };
        })
      );
      setSelectedStepId("step_3"); // Focus on the next active item
    }, 2800);
  };

  const handleToggleStatus = (id: string) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === id) {
          const nextStatusMap: Record<StepStatus, StepStatus> = {
            PENDING: "IN_PROGRESS",
            IN_PROGRESS: "COMPLETED",
            COMPLETED: "PENDING",
          };
          return { ...step, status: nextStatusMap[step.status] };
        }
        return step;
      })
    );
  };

  const activeStep = steps.find((s) => s.id === selectedStepId) || steps[0];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-violet-500/30 overflow-x-hidden relative">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* Top Navbar */}
        <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Sparkles className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl border border-white/20 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-violet-400 bg-clip-text text-transparent">
                Gorix OS
              </span>
              <span className="text-[10px] block text-violet-400/80 uppercase font-mono tracking-widest leading-none">
                Venture Orchestrator
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              Live: BD Budget 2026/27
            </span>
          </div>
        </header>

        {/* Hero Section / AI Input */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full text-xs font-medium text-violet-400 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Agent BD Engine 2.0</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            সহজে শুরু করুন আপনার <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">স্বপ্নের উদ্যোগ</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base mb-8 max-w-xl mx-auto">
            আপনার ব্যবসায়িক ধারণাটি নিচে লিখুন। Gorix AI বাংলাদেশ সরকারের আইন, কর এবং বাজার ব্যবস্থা বিশ্লেষণ করে একটি ১০-ধাপের রোডম্যাপ তৈরি করবে।
          </p>

          {/* AI Search Bar */}
          <form onSubmit={handleGenerate} className="relative">
            <div className="relative rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] focus-within:border-violet-500/40 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300">
              <div className="flex items-center">
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="আমি একটি ক্লোথিং ব্র্যান্ড বা রিসেলার বিজনেস শুরু করতে চাই..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 focus:outline-none px-3 py-3 text-sm md:text-base font-medium"
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl px-5 py-3 text-xs md:text-sm font-semibold flex items-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] whitespace-nowrap"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                      <span>বিশ্লেষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>রোডম্যাপ তৈরি করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Suggestions */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["অর্গানিক ফুড শপ", "সফ্টওয়্যার এজেন্সি", "অনলাইন বুটিক হাউজ"].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setSearchQuery(`আমি একটি ${suggestion} শুরু করতে চাই`)}
                className="text-xs text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg px-3 py-1.5 transition-all duration-150"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </section>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Timeline Grid (10 Steps) */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Zap className="w-4.5 h-4.5 text-violet-400" />
                <span>প্রজেক্ট ব্লুপ্রিন্ট / Blueprint Roadmap</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                ১০ টির মধ্যে ৩ টি ধাপ প্রক্রিয়াধীন
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((step) => {
                const IconComponent = step.icon;
                const isSelected = step.id === selectedStepId;
                
                // Status Styling Config
                const statusStyles = {
                  COMPLETED: {
                    border: "border-emerald-500/10 hover:border-emerald-500/30",
                    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    badgeText: "সম্পূর্ণ",
                    iconColor: "text-emerald-400",
                    glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]",
                  },
                  IN_PROGRESS: {
                    border: "border-violet-500/20 hover:border-violet-500/40",
                    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20 animate-pulse",
                    badgeText: "চলমান",
                    iconColor: "text-violet-400",
                    glow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.12)]",
                  },
                  PENDING: {
                    border: "border-white/5 hover:border-white/10",
                    badge: "bg-slate-800/40 text-slate-400 border-white/5",
                    badgeText: "অপেক্ষমান",
                    iconColor: "text-slate-400",
                    glow: "hover:shadow-none",
                  },
                };

                const style = statusStyles[step.status];

                return (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStepId(step.id)}
                    className={`relative rounded-2xl bg-white/[0.02] border p-5 cursor-pointer backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.01] select-none ${
                      isSelected
                        ? "border-violet-500/50 bg-white/[0.04] shadow-[0_0_30px_rgba(139,92,246,0.1)]"
                        : style.border
                    } ${style.glow}`}
                  >
                    {/* Top row of card */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2.5 rounded-xl bg-white/[0.02] border border-white/5 ${style.iconColor}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-semibold font-mono tracking-wider border rounded-full px-2 py-0.5 ${style.badge}`}>
                        {style.badgeText}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div>
                      <div className="text-[10px] text-violet-400/70 font-mono tracking-widest uppercase mb-1">
                        ধাপ ০{step.stepNumber} / Step 0{step.stepNumber}
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-violet-300">
                        {step.titleBn}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {step.shortDescBn}
                      </p>
                    </div>

                    {/* Progress Connecting Light Indicator (only active on selected state) */}
                    {isSelected && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action / Detail Drawer (Right panel) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <span>ধাপের বিস্তারিত / Execution Hub</span>
            </h2>

            <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
              {/* Outer decorative line glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

              {/* Top Meta */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono text-violet-400 tracking-wider">
                  STEP 0{activeStep.stepNumber} DETAILS
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{activeStep.estimatedTime}</span>
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl font-bold text-white mb-2">{activeStep.titleBn}</h3>
              <p className="text-[13px] text-slate-300 leading-relaxed mb-6 border-b border-white/5 pb-6">
                {activeStep.fullDescBn}
              </p>

              {/* Required Documents / Items */}
              <div className="mb-6">
                <h4 className="text-xs font-mono tracking-wider text-slate-400 uppercase mb-3 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-violet-400" />
                  <span>প্রয়োজনীয় নথিপত্র / Required Files</span>
                </h4>
                <ul className="space-y-2">
                  {activeStep.details.requirements.map((req, index) => (
                    <li key={index} className="text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-violet-500 mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Estimated Fees */}
              <div className="mb-6 p-3.5 rounded-xl bg-white/[0.01] border border-white/5 flex justify-between items-center">
                <span className="text-xs text-slate-400">সরকারি/আনুমানিক খরচ:</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {activeStep.details.fees}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                {activeStep.details.actionUrl ? (
                  <a
                    href={activeStep.details.actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl py-3 px-4 text-xs font-bold flex items-center justify-center space-x-2 transition-all duration-200"
                  >
                    <span>{activeStep.details.actionLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl py-3 px-4 text-xs font-bold flex items-center justify-center space-x-2 transition-all duration-200"
                  >
                    <span>{activeStep.details.actionLabel}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleToggleStatus(activeStep.id)}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl py-3 px-4 text-xs font-bold flex items-center justify-center space-x-2 transition-all duration-200 shadow-md shadow-violet-950/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {activeStep.status === "COMPLETED"
                      ? "ধাপটি অসম্পূর্ণ চিহ্নিত করুন"
                      : "ধাপটি সম্পন্ন চিহ্নিত করুন"}
                  </span>
                </button>
              </div>

              {/* Help & Support */}
              <div className="mt-6 border-t border-white/5 pt-4 text-center">
                <p className="text-[10px] text-slate-500">
                  বাংলাদেশী আইন বা ফর্ম পূরণে সমস্যা হচ্ছে?{" "}
                  <span className="text-violet-400 cursor-pointer hover:underline">
                    হেল্পডেস্ক সাপোর্ট নিন
                  </span>
                </p>
              </div>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
}
