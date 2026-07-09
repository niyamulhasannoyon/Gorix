"use client";

import React, { useState, useEffect } from "react";
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
  BookOpen,
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
  status: StepStatus;
  icon: React.ComponentType<any>;
}

// Custom Premium Markdown Parser for Gorix OS
function parseInlineFormatting(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-slate-100 bg-violet-950/30 px-1.5 py-0.5 rounded border border-violet-500/10">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="text-violet-300 font-medium not-italic">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function renderMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, index) => {
    const trimmedLine = line.trim();

    // 1. Headers
    if (trimmedLine.startsWith("####")) {
      return (
        <h4 key={index} className="text-xs font-bold text-violet-400 mt-5 mb-2 flex items-center space-x-1.5 font-mono uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          <span>{trimmedLine.replace("####", "").replace(/\*\*/g, "").trim()}</span>
        </h4>
      );
    }
    if (trimmedLine.startsWith("###")) {
      return (
        <h3 key={index} className="text-sm font-extrabold text-white mt-8 mb-4 border-b border-white/5 pb-2 tracking-wide">
          {trimmedLine.replace("###", "").replace(/\*\*/g, "").trim()}
        </h3>
      );
    }
    if (trimmedLine.startsWith("##")) {
      return (
        <h2 key={index} className="text-base font-bold text-white mt-10 mb-5">
          {trimmedLine.replace("##", "").replace(/\*\*/g, "").trim()}
        </h2>
      );
    }
    if (trimmedLine.startsWith("#")) {
      return (
        <h1 key={index} className="text-lg font-extrabold text-white mt-12 mb-6">
          {trimmedLine.replace("#", "").replace(/\*\*/g, "").trim()}
        </h1>
      );
    }

    // 2. Unordered lists
    if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      const content = trimmedLine.replace(/^[\-\*]\s+/, "");
      return (
        <div key={index} className="pl-4 my-1 flex items-start space-x-2 text-slate-300 text-xs leading-relaxed">
          <span className="text-violet-400 mt-1 select-none">•</span>
          <div className="flex-1">{parseInlineFormatting(content)}</div>
        </div>
      );
    }

    // 3. Divider lines
    if (trimmedLine === "---") {
      return <hr key={index} className="border-white/5 my-6" />;
    }

    // 4. Empty paragraph
    if (trimmedLine === "") {
      return <div key={index} className="h-3" />;
    }

    // 5. Standard paragraph
    return (
      <p key={index} className="text-slate-300 my-2 text-xs leading-relaxed">
        {parseInlineFormatting(line)}
      </p>
    );
  });
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentResponse, setAgentResponse] = useState<string>("");
  const [selectedStepId, setSelectedStepId] = useState<string>("step_1");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [startIndex, setStartIndex] = useState(0);

  const SUGGESTIONS = [
    "ঢাকার মধ্যে একটি ই-কমার্স ও ক্লোথিং ব্র্যান্ড",
    "সাভারে ডেইরি ও কৃষি ফার্মিং",
    "আইটি ও সফটওয়্যার কনসালটেন্সি",
    "অর্গানিক গ্রোসারি ই-কমার্স",
    "ঢাকার প্রিমিয়াম রেস্টুরেন্ট ও ক্যাফে",
    "থার্ড-পার্টি লজিস্টিকস ও হোম ডেলিভারি",
    "একটি অনলাইন এডুকেশন প্ল্যাটফর্ম",
    "একটি বিউটি সেলুন ও চেইন লাউঞ্জ",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % SUGGESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const visibleSuggestions = [];
  for (let i = 0; i < 4; i++) {
    visibleSuggestions.push(SUGGESTIONS[(startIndex + i) % SUGGESTIONS.length]);
  }

  // Local state representing the 10 venture steps
  const [steps, setSteps] = useState<PipelineStep[]>([
    {
      id: "step_1",
      stepNumber: 1,
      titleBn: "আইডিয়া ও সত্তা নির্ধারণ",
      titleEn: "Entity Definition",
      shortDescBn: "ব্যবসার ক্যাটাগরি ও আইনি কাঠামো নির্ধারণ করা।",
      shortDescEn: "Define category, scale, and legal structure of the venture.",
      status: "PENDING",
      icon: Compass,
    },
    {
      id: "step_2",
      stepNumber: 2,
      titleBn: "কোম্পানি নিবন্ধন ও নাম ছাড়পত্র",
      titleEn: "RJSC Name Clearance",
      shortDescBn: "আরজেএসসি থেকে কোম্পানির নাম অনুমোদন ও নিবন্ধন।",
      shortDescEn: "Clear and register your company name under RJSC.",
      status: "PENDING",
      icon: FileText,
    },
    {
      id: "step_3",
      stepNumber: 3,
      titleBn: "ট্রেড লাইসেন্স সংগ্রহ",
      titleEn: "Trade License Acquisition",
      shortDescBn: "সিটি কর্পোরেশন বা ইউনিয়ন পরিষদ থেকে লাইসেন্স সংগ্রহ করা।",
      shortDescEn: "Obtain local commercial permit from City Corp or Union Parishad.",
      status: "PENDING",
      icon: Shield,
    },
    {
      id: "step_4",
      stepNumber: 4,
      titleBn: "ই-টিন (e-TIN) নিবন্ধন",
      titleEn: "Tax ID (e-TIN) Registration",
      shortDescBn: "এনবিআর থেকে ট্যাক্স আইডেন্টিফিকেশন নম্বর তৈরি।",
      shortDescEn: "Generate Taxpayer Identification Number from NBR.",
      status: "PENDING",
      icon: Hash,
    },
    {
      id: "step_5",
      stepNumber: 5,
      titleBn: "ভ্যাট ও বিন (BIN) নিবন্ধন",
      titleEn: "VAT Registration (BIN)",
      shortDescBn: "ব্যবসায়িক আইডেন্টিফিকেশন নম্বর (BIN) সংগ্রহ।",
      shortDescEn: "Register for Business Identification Number from NBR.",
      status: "PENDING",
      icon: Percent,
    },
    {
      id: "step_6",
      stepNumber: 6,
      titleBn: "ব্যাংক হিসাব ও পেমেন্ট গেটওয়ে",
      titleEn: "Corporate Bank & PG Setup",
      shortDescBn: "বাণিজ্যিক ব্যাংক অ্যাকাউন্ট খোলা ও পেমেন্ট গেটওয়ে সেটআপ।",
      shortDescEn: "Open commercial bank account and integrate payment gateways.",
      status: "PENDING",
      icon: Landmark,
    },
    {
      id: "step_7",
      stepNumber: 7,
      titleBn: "এআই লোগো ও ব্র্যান্ডিং",
      titleEn: "AI Logo & Branding",
      shortDescBn: "Gorix AI দিয়ে ব্র্যান্ডের লোগো ও থিম কিট তৈরি।",
      shortDescEn: "Create brand logos, themes, and social kits using Gorix AI.",
      status: "PENDING",
      icon: Palette,
    },
    {
      id: "step_8",
      stepNumber: 8,
      titleBn: "ওয়েবসাইট ও টেক ইনফ্রাস্ট্রাকচার",
      titleEn: "Web & Tech Boilerplate",
      shortDescBn: "Next.js কমার্স বা ল্যান্ডিং পেজ ওয়েবসাইট ডিপ্লয়মেন্ট।",
      shortDescEn: "Deploy React/Next.js store or landing structure on Vercel.",
      status: "PENDING",
      icon: Code,
    },
    {
      id: "step_9",
      stepNumber: 9,
      titleBn: "ডিজিটাল মার্কেটিং ও কনটেন্ট",
      titleEn: "Marketing & Launch Plan",
      shortDescBn: "ফেসবুক কমার্স পেজ ও কনটেন্ট মার্কেটিং ক্যাম্পেইন লঞ্চ।",
      shortDescEn: "Setup Facebook Commerce structure, pixel, and SMS campaigns.",
      status: "PENDING",
      icon: Megaphone,
    },
    {
      id: "step_10",
      stepNumber: 10,
      titleBn: "কমপ্লায়েন্স ও ট্যাক্স রিটার্ন",
      titleEn: "Tax & Budget Compliance",
      shortDescBn: "বার্ষিক ট্যাক্স রিটার্ন ও ব্যবসার অডিট প্রস্তুতি।",
      shortDescEn: "Bookkeeping setup aligning with current Bangladesh Budget.",
      status: "PENDING",
      icon: CheckSquare,
    },
  ]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsGenerating(true);
    setErrorMsg("");
    setAgentResponse("");

    // Set first few steps as IN_PROGRESS to simulate action starting
    setSteps((prev) =>
      prev.map((step, idx) => {
        if (idx === 0) return { ...step, status: "IN_PROGRESS" };
        return { ...step, status: "PENDING" };
      })
    );

    try {
      const res = await fetch("/api/gorix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawIntent: searchQuery }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate blueprint");
      }

      const data = await res.json();
      setAgentResponse(data.content);

      // Randomize state progress to simulate successful agent outputs
      setSteps((prev) =>
        prev.map((step, idx) => {
          if (idx < 3) return { ...step, status: "COMPLETED" };
          if (idx === 3) return { ...step, status: "IN_PROGRESS" };
          return { ...step, status: "PENDING" };
        })
      );
      setSelectedStepId("step_4");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      setSteps((prev) => prev.map((step) => ({ ...step, status: "PENDING" })));
    } finally {
      setIsGenerating(false);
    }
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
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.2)] border border-white/10 bg-black/40">
              <img src="/logo.png" alt="Gorix OS Logo" className="w-full h-full object-cover scale-[1.4]" />
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
              Mistral Integration Active
            </span>
          </div>
        </header>

        {/* Hero Section / AI Input */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full text-xs font-medium text-violet-400 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mistral Agent Portal</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            সহজে শুরু করুন আপনার <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">স্বপ্নের উদ্যোগ</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base mb-8 max-w-xl mx-auto">
            আপনার ব্যবসায়িক পরিকল্পনাটি নিচের বক্সে লিখুন। Gorix OS এর সাথে যুক্ত এআই এজেন্ট সরাসরি বাংলাদেশ সরকারের নিয়মাবলী ও ট্যাক্স আইন অনুযায়ী কাজ করবে।
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
                  placeholder="আমি ঢাকার মধ্যে একটি ই-কমার্স ও ক্লোথিং ব্র্যান্ড শুরু করতে চাই..."
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

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold max-w-xl mx-auto">
              {errorMsg}
            </div>
          )}

          {/* Suggestions */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 min-h-[38px] transition-all duration-300">
            {visibleSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setSearchQuery(`আমি ${suggestion} শুরু করতে চাই`)}
                className="text-xs text-slate-400 hover:text-white hover:border-violet-500/30 bg-white/[0.02] hover:bg-violet-500/5 border border-white/5 rounded-lg px-3 py-1.5 transition-all duration-300 shadow-sm hover:shadow-[0_0_10px_rgba(139,92,246,0.1)] active:scale-95"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </section>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Timeline Grid (10 Steps) */}
          <div className="lg:col-span-7">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Zap className="w-4.5 h-4.5 text-violet-400" />
                <span>প্রজেক্ট ব্লুপ্রিন্ট / Pipeline Modules</span>
              </h2>
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
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedStepId(step.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedStepId(step.id);
                      }
                    }}
                    className={`relative rounded-2xl bg-white/[0.02] border p-5 cursor-pointer backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.01] select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 focus-visible:outline-offset-2 ${
                      isSelected
                        ? "border-violet-500/50 bg-white/[0.04] shadow-[0_0_30px_rgba(139,92,246,0.1)]"
                        : style.border
                    } ${style.glow}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2.5 rounded-xl bg-white/[0.02] border border-white/5 ${style.iconColor}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-semibold font-mono tracking-wider border rounded-full px-2 py-0.5 ${style.badge}`}>
                        {style.badgeText}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] text-violet-400/70 font-mono tracking-widest uppercase mb-1">
                        ধাপ ০{step.stepNumber}
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-violet-300">
                        {step.titleBn}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {step.shortDescBn}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic AI Output Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <BookOpen className="w-4.5 h-4.5 text-violet-400" />
              <span>রোডম্যাপ আউটপুট / Generated Roadmap</span>
            </h2>

            <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                  <p className="text-xs text-slate-400 animate-pulse">
                    Mistral AI Agent আপনার ব্যবসার রোডম্যাপ কম্পাইল করছে...
                  </p>
                </div>
              ) : agentResponse ? (
                <div className="flex-1 flex flex-col">
                  <div className="text-[10px] font-mono text-violet-400 mb-4 tracking-wider uppercase">
                    PROVEN BLUEPRINT GENERATED SUCCESSFULLY
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[550px] pr-2 scrollbar-thin space-y-1 text-slate-300">
                    {renderMarkdown(agentResponse)}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">Gorix OS AI Engine</span>
                    <button
                      onClick={() => handleToggleStatus(activeStep.id)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg px-3 py-1.5 text-[10px] font-semibold flex items-center space-x-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ধাপ আপডেট করুন</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01] mb-2 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.05)]">
                    <img src="/logo.png" alt="Gorix OS Symbol" className="w-full h-full object-cover scale-[1.4]" />
                  </div>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    কোনো রোডম্যাপ পাওয়া যায়নি। অনুসন্ধান বক্সে আপনার ব্যবসার ধারণা লিখে "রোডম্যাপ তৈরি করুন" বাটনে ক্লিক করুন।
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
}
