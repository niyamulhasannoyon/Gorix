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
  Copy,
  Check,
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

// Custom Premium Claude-style Markdown Parser for Gorix OS
function parseInlineFormatting(text: string) {
  if (!text) return "";
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-[#e6e1da] bg-[#222220] px-1.5 py-0.5 rounded border border-[#2e2e2b]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="text-[#d2c4b4] font-medium not-italic">{part.slice(1, -1)}</em>;
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
        <h4 key={index} className="text-[10px] font-mono font-bold text-[#a19a91] mt-5 mb-2 tracking-widest uppercase flex items-center space-x-1.5">
          <span className="w-1 h-1 rounded-full bg-[#d2c4b4]" />
          <span>{trimmedLine.replace("####", "").replace(/\*\*/g, "").trim()}</span>
        </h4>
      );
    }
    if (trimmedLine.startsWith("###")) {
      return (
        <h3 key={index} className="text-sm font-serif font-bold text-[#e6e1da] mt-6 mb-3 border-b border-[#222220] pb-1.5 tracking-tight">
          {trimmedLine.replace("###", "").replace(/\*\*/g, "").trim()}
        </h3>
      );
    }
    if (trimmedLine.startsWith("##")) {
      return (
        <h2 key={index} className="text-base font-serif font-bold text-[#e6e1da] mt-8 mb-4 tracking-tight">
          {trimmedLine.replace("##", "").replace(/\*\*/g, "").trim()}
        </h2>
      );
    }
    if (trimmedLine.startsWith("#")) {
      return (
        <h1 key={index} className="text-lg font-serif font-bold text-[#e6e1da] mt-10 mb-5 tracking-tight">
          {trimmedLine.replace("#", "").replace(/\*\*/g, "").trim()}
        </h1>
      );
    }

    // 2. Unordered lists
    if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      const content = trimmedLine.replace(/^[\-\*]\s+/, "");
      return (
        <div key={index} className="pl-4 my-1 flex items-start space-x-2 text-[#a19a91] text-xs leading-relaxed">
          <span className="text-[#d2c4b4] mt-1.5 select-none">•</span>
          <div className="flex-1 text-[#e6e1da]">{parseInlineFormatting(content)}</div>
        </div>
      );
    }

    // 3. Divider lines
    if (trimmedLine === "---") {
      return <hr key={index} className="border-[#222220] my-5" />;
    }

    // 4. Empty paragraph
    if (trimmedLine === "") {
      return <div key={index} className="h-2.5" />;
    }

    // 5. Standard paragraph
    return (
      <p key={index} className="text-[#a19a91] my-1.5 text-xs leading-relaxed">
        {parseInlineFormatting(line)}
      </p>
    );
  });
}

export default function GorixDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<string>("step_1");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"step" | "blueprint">("step");
  const [copiedToast, setCopiedToast] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const compileFullBlueprintMarkdown = () => {
    return steps
      .map(
        (s) => `## ধাপ ০${s.stepNumber}: ${s.titleBn} (${s.titleEn})
**সময়কাল:** ${s.estimatedTime}
**ফি / আনুমানিক খরচ:** ${s.details.fees}

${s.fullDescBn}

### প্রয়োজনীয় নথিপত্র:
${s.details.requirements.map((r) => `- ${r}`).join("\n")}
`
      )
      .join("\n\n---\n\n");
  };

  const handleCopy = (activeStep: PipelineStep) => {
    const textToCopy =
      activeTab === "step"
        ? `## ধাপ ০${activeStep.stepNumber}: ${activeStep.titleBn} (${activeStep.titleEn})
**সময়কাল:** ${activeStep.estimatedTime}
**ফি / আনুমানিক খরচ:** ${activeStep.details.fees}

${activeStep.fullDescBn}

### প্রয়োজনীয় নথিপত্র:
${activeStep.details.requirements.map((r) => `- ${r}`).join("\n")}`
        : compileFullBlueprintMarkdown();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    });
  };

  const SUGGESTIONS = [
    "অর্গানিক ফুড শপ",
    "সফ্টওয়্যার এজেন্সি",
    "অনলাইন বুটিক হাউজ",
    "রেস্টুরেন্ট ও ক্যাফে",
    "লজিস্টিকস ও ডেলিভারি",
    "এডুটেক স্টার্টআপ",
    "ডেইরি ও এগ্রো ফার্ম",
    "লাইফস্টাইল ও সেলুন",
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
        requirements: ["ভাড়ার চুক্তিপত্র বা হোল্ডিং ট্যাক্স রশিদ", "NID kopi", "তিন কপি ছবি", "ইউটিলিটি বিলের কপি"],
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

  // Load steps from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("gorix_venture_steps");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSteps((prev) =>
            prev.map((origStep) => {
              const matched = parsed.find((p: any) => p.id === origStep.id);
              if (matched) {
                return { ...origStep, status: matched.status };
              }
              return origStep;
            })
          );
        }
      } catch (e) {
        console.error("Failed to load steps from localStorage", e);
      }
    }
  }, []);

  // Save steps to localStorage helper
  const saveStepsToStorage = (updatedSteps: PipelineStep[]) => {
    try {
      const serializable = updatedSteps.map((s) => ({ id: s.id, status: s.status }));
      localStorage.setItem("gorix_venture_steps", JSON.stringify(serializable));
    } catch (e) {
      console.error("Failed to save steps to localStorage", e);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsGenerating(true);
    setErrorMsg("");

    // Set first few steps as IN_PROGRESS to simulate action starting
    setSteps((prev) => {
      const nextSteps = prev.map((step, idx) => {
        if (idx === 0) return { ...step, status: "IN_PROGRESS" as StepStatus };
        return { ...step, status: "PENDING" as StepStatus };
      });
      saveStepsToStorage(nextSteps);
      return nextSteps;
    });

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
      let parsedData;
      try {
        parsedData = JSON.parse(data.content);
      } catch (err) {
        console.error("Failed to parse API content as JSON", err);
        throw new Error("এআই রেসপন্সটি সঠিক জেসন (JSON) ফরম্যাটে পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন। (Malformed AI Output)");
      }

      if (parsedData && Array.isArray(parsedData.steps) && parsedData.steps.length > 0) {
        const icons = [Compass, FileText, Shield, Hash, Percent, Landmark, Palette, Code, Megaphone, CheckSquare];
        const updatedSteps = parsedData.steps.map((item: any, idx: number) => {
          return {
            id: `step_${idx + 1}`,
            stepNumber: item.stepNumber || idx + 1,
            titleBn: item.titleBn || `ধাপ ০${idx + 1}`,
            titleEn: item.titleEn || `Step 0${idx + 1}`,
            shortDescBn: item.shortDescBn || "",
            shortDescEn: item.shortDescEn || "",
            fullDescBn: item.fullDescBn || "",
            fullDescEn: item.fullDescEn || "",
            status: (idx < 2 ? "COMPLETED" : idx === 2 ? "IN_PROGRESS" : "PENDING") as StepStatus,
            estimatedTime: item.estimatedTime || "১ দিন / 1 Day",
            icon: icons[idx] || Compass,
            details: {
              requirements: Array.isArray(item.requirements) ? item.requirements : [],
              fees: item.fees || "ফ্রি (Gorix OS এর অন্তর্ভুক্ত)",
              actionLabel: item.actionLabel || "বিস্তারিত দেখুন",
              actionUrl: item.actionUrl || undefined
            }
          };
        });

        setSteps(updatedSteps);
        saveStepsToStorage(updatedSteps);
        setSelectedStepId("step_3"); // Focus on the first active item
      } else {
        throw new Error("এআই রেসপন্সে কোনো রোডম্যাপ অবজেক্ট পাওয়া যায়নি।");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      setSteps((prev) => {
        const nextSteps = prev.map((step) => ({ ...step, status: "PENDING" as StepStatus }));
        saveStepsToStorage(nextSteps);
        return nextSteps;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    // 1. Optimistic Update (Immediate Local State)
    const originalSteps = [...steps];
    
    const updated = steps.map((step) => {
      if (step.id === id) {
        const nextStatusMap: Record<StepStatus, StepStatus> = {
          PENDING: "IN_PROGRESS",
          IN_PROGRESS: "COMPLETED",
          COMPLETED: "PENDING",
        };
        return { ...step, status: nextStatusMap[step.status] };
      }
      return step;
    });
    
    setSteps(updated);
    saveStepsToStorage(updated);

    // 2. Simulated DB sync endpoint invocation with rollback on fail
    try {
      await new Promise<void>((resolve, reject) => {
        // 5% chance of simulated network error
        setTimeout(() => {
          if (Math.random() < 0.05) {
            reject(new Error("Network connection error"));
          } else {
            resolve();
          }
        }, 600);
      });
      console.log(`Step ${id} status successfully synced to cloud database.`);
    } catch (err) {
      console.error("Failed to sync step status, rolling back state.", err);
      // Rollback to original state on failure
      setSteps(originalSteps);
      saveStepsToStorage(originalSteps);
      alert("নেটওয়ার্ক ত্রুটির কারণে প্রজেক্ট আপডেট সিঙ্ক করা যায়নি। আবার চেষ্টা করুন। (Network Sync Error: Rollback applied)");
    }
  };

  const activeStep = steps.find((s) => s.id === selectedStepId) || steps[0];

  return (
    <div className="min-h-screen bg-[#141413] text-[#e6e1da] font-sans selection:bg-[#d2c4b4]/20 selection:text-[#e6e1da] overflow-x-hidden relative antialiased">
      {/* Background Subtle Editorial Sand Orb */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#d2c4b4]/[0.02] blur-[120px] pointer-events-none" />

      {/* Clean Paper Texture Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Top Navbar - Clean, Elegant Spacing */}
        <header className="flex justify-between items-center mb-16 border-b border-[#222220] pb-6 select-none">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden border border-[#2e2e2b] bg-[#1c1c1a]">
              <img src="/logo.png" alt="Gorix OS Logo" className="w-full h-full object-cover scale-[1.2]" />
            </div>
            <div>
              <span className="text-base font-serif font-bold tracking-wide text-[#e6e1da]">
                Gorix OS
              </span>
              <span className="text-[9px] block text-[#a19a91] tracking-widest leading-none font-mono uppercase mt-0.5">
                Venture Orchestrator
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono tracking-widest text-[#a19a91] uppercase">
              Live: BD Budget 2026/27
            </span>
          </div>
        </header>

        {/* Hero Section / AI Input - Centered Editorial */}
        <section className="text-center max-w-3xl mx-auto mb-20 select-none">
          <div className="inline-flex items-center space-x-1.5 bg-[#1c1c1a] border border-[#2e2e2b] px-3 py-1 rounded-full text-[10px] font-mono text-[#a19a91] mb-6">
            <Sparkles className="w-3 h-3 text-[#d2c4b4]" />
            <span>MULTI-AGENT BD ENGINE 2.0</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-[#e6e1da] mb-4">
            সহজে শুরু করুন আপনার <span className="text-[#d2c4b4] italic">স্বপ্নের উদ্যোগ</span>
          </h1>
          <p className="text-[#a19a91] text-xs md:text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            আপনার ব্যবসায়িক ধারণাটি নিচে লিখুন। Gorix AI বাংলাদেশ সরকারের আইন, কর এবং বাজার ব্যবস্থা বিশ্লেষণ করে একটি ১০-ধাপের সম্পূর্ণ রোডম্যাপ তৈরি করে দেবে।
          </p>

          {/* AI Search Bar */}
          <form onSubmit={handleGenerate} className="relative max-w-2xl mx-auto">
            <div className="relative rounded-xl bg-[#1c1c1a] border border-[#2e2e2b] focus-within:border-[#a19a91]/50 p-1.5 transition-all duration-300">
              <div className="flex items-center">
                <div className="pl-3 text-[#807a73]">
                  <Search className="w-4 h-4 stroke-[1.5]" />
                </div>
                <input
                  type="text"
                  maxLength={500}
                  placeholder="আমি একটি ক্লোথিং ব্র্যান্ড বা ক্যাফে বিজনেস শুরু করতে চাই..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 text-[#e6e1da] placeholder-stone-600 focus:ring-0 focus:outline-none px-3 py-2 text-xs md:text-sm font-sans"
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="bg-[#e0d8cc] hover:bg-[#d2c4b4] text-[#141413] rounded-lg px-4 py-2.5 text-xs font-semibold flex items-center space-x-1.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer active:scale-95 border-0"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin mr-1" />
                      <span>বিশ্লেষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>রোডম্যাপ তৈরি করুন</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[1.8]" />
                    </>
                  )}
                </button>
              </div>
            </div>
            {/* Character counter & Helper text */}
            <div className="mt-2 flex justify-between items-center px-1 text-[9px] font-mono select-none">
              <span className="text-stone-600">সর্বোচ্চ ৫০০ অক্ষর / Max 500 chars</span>
              <span className={searchQuery.length >= 450 ? "text-amber-500 font-semibold" : "text-stone-600"}>
                {searchQuery.length} / 500
              </span>
            </div>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 p-3 rounded-lg bg-red-950/10 border border-red-900/20 text-red-400 text-xs font-medium max-w-xl mx-auto text-center font-sans">
              {errorMsg}
            </div>
          )}

          {/* Suggestions */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 min-h-[38px] transition-all duration-300">
            {visibleSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setSearchQuery(`আমি একটি ${suggestion} শুরু করতে চাই`)}
                className="text-[11px] text-[#a19a91] hover:text-[#e6e1da] hover:border-[#a19a91]/30 bg-[#1c1c1a] border border-[#2e2e2b] rounded-md px-3 py-1.5 transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
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
            <div className="flex justify-between items-center mb-6 select-none">
              <h2 className="text-base font-serif font-bold text-[#e6e1da] flex items-center space-x-2 tracking-tight">
                <Zap className="w-4 h-4 text-[#d2c4b4] stroke-[1.5]" />
                <span>প্রজেক্ট ব্লুপ্রিন্ট / Blueprint Roadmap</span>
              </h2>
              <span className="text-[11px] font-mono text-[#a19a91] uppercase tracking-wider">
                ১০ টি ধাপের রোডম্যাপ
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {steps.map((step) => {
                const IconComponent = step.icon;
                const isSelected = step.id === selectedStepId;
                
                // Status Styling Config - Muted Warm Tones
                const statusStyles = {
                  COMPLETED: {
                    border: "border-[#222220] hover:border-[#2e2e2b]",
                    badge: "bg-[#1c241c] text-[#a0cfa0] border-[#243324]",
                    badgeText: "সম্পূর্ণ",
                    iconColor: "text-[#a0cfa0] stroke-[1.2]",
                  },
                  IN_PROGRESS: {
                    border: "border-[#2e2e2b] hover:border-[#383733]",
                    badge: "bg-[#24221c] text-[#d4b27a] border-[#383324] animate-pulse",
                    badgeText: "চলমান",
                    iconColor: "text-[#d4b27a] stroke-[1.2]",
                  },
                  PENDING: {
                    border: "border-[#222220] hover:border-[#2e2e2b]",
                    badge: "bg-[#1c1c1a] text-[#807a73] border-[#222220]",
                    badgeText: "অপেক্ষমান",
                    iconColor: "text-[#807a73] stroke-[1.2]",
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
                    className={`relative rounded-xl bg-[#1b1b19] border p-6 cursor-pointer transition-all duration-300 hover:scale-[1.005] select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c5b5a5]/50 focus-visible:outline-offset-2 ${
                      isSelected
                        ? "border-[#c5b5a5]/40 bg-[#1c1c1a] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                        : style.border
                    }`}
                  >
                    {/* Top row of card */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg bg-[#141413]/60 border border-[#222220] ${style.iconColor}`}>
                        <IconComponent className="w-4 h-4 stroke-[1.2]" />
                      </div>
                      <span className={`text-[9px] font-semibold font-mono tracking-wider border rounded-md px-2 py-0.5 uppercase ${style.badge}`}>
                        {style.badgeText}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div>
                      <div className="text-[9px] text-[#a19a91] font-mono tracking-widest uppercase mb-1">
                        ধাপ ০{step.stepNumber} / Step 0{step.stepNumber}
                      </div>
                      <h3 className="text-sm font-serif font-bold text-[#e6e1da] mb-1.5 tracking-tight">
                        {step.titleBn}
                      </h3>
                      <p className="text-xs text-[#a19a91] line-clamp-2 leading-relaxed">
                        {step.shortDescBn}
                      </p>
                    </div>

                    {/* Progress Connecting Light Indicator (only active on selected state) */}
                    {isSelected && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#c5b5a5]/40 to-transparent" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action / Detail Drawer (Right panel) - Claude-Style Artifact Workspace */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 flex flex-col min-h-[750px] relative">
            {/* Artifact Outer Header */}
            <div className="flex justify-between items-center mb-4 select-none">
              <h2 className="text-sm font-serif font-bold text-[#e6e1da] flex items-center space-x-2 tracking-tight">
                <span className="w-2 h-2 rounded-full bg-[#d2c4b4]" />
                <span>উদ্যোগ ওয়ার্কস্পেস / Artifact Hub</span>
              </h2>
              <span className="text-[9px] font-mono font-semibold text-[#a19a91] bg-[#1c1c1a] border border-[#2e2e2b] px-2 py-0.5 rounded uppercase tracking-wider">
                preview
              </span>
            </div>

            {/* Claude-Style Artifact Canvas */}
            <div className="flex-1 rounded-xl bg-[#1b1b19] border border-[#222220] shadow-2xl relative overflow-hidden flex flex-col p-[2px]">
              {/* Decorative top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-stone-800 via-[#d2c4b4]/30 to-stone-800" />
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#d2c4b4]/[0.01] rounded-full blur-2xl pointer-events-none" />

              {/* Claude Tabs Header */}
              <div className="flex justify-between items-center bg-[#141413]/40 border-b border-[#222220] px-4 py-3 select-none relative z-10">
                {/* Left: Doc details */}
                <div className="flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-[#a19a91] stroke-[1.2]" />
                  <span className="text-xs font-mono font-bold text-[#e6e1da]">
                    {activeTab === "step" ? `STEP_0${activeStep.stepNumber}_GUIDE.md` : "COMPLETE_BLUEPRINT.md"}
                  </span>
                </div>

                {/* Right: Tab selectors and Copy action */}
                <div className="flex items-center space-x-3">
                  <div className="flex bg-[#141413] border border-[#222220] rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab("step")}
                      className={`text-[9px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        activeTab === "step"
                          ? "bg-[#e0d8cc] text-[#141413] shadow-sm"
                          : "text-[#a19a91] hover:text-[#e6e1da]"
                      }`}
                    >
                      ধাপের তথ্য
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("blueprint")}
                      className={`text-[9px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        activeTab === "blueprint"
                          ? "bg-[#e0d8cc] text-[#141413] shadow-sm"
                          : "text-[#a19a91] hover:text-[#e6e1da]"
                      }`}
                    >
                      ব্লুপ্রিন্ট
                    </button>
                  </div>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(activeStep)}
                    title="কপি করুন / Copy to clipboard"
                    className="p-1.5 rounded-lg bg-transparent hover:bg-white/[0.04] border border-[#222220] text-[#a19a91] hover:text-[#e6e1da] transition-all cursor-pointer"
                  >
                    {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 stroke-[1.5]" />}
                  </button>
                </div>
              </div>

              {/* Artifact Body Container */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin flex flex-col justify-between relative z-10 h-[640px]">
                
                {/* Tab content rendering */}
                <div className="flex-1">
                  {activeTab === "step" ? (
                    <div>
                      {/* Step Metadata Header */}
                      <div className="flex justify-between items-center mb-4 text-[9px] font-mono text-[#a19a91] border-b border-[#222220] pb-2">
                        <span className="text-[#d2c4b4] tracking-widest uppercase">0{activeStep.stepNumber} / 10 MODULE</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-[#a19a91] stroke-[1.2]" />
                          <span>{activeStep.estimatedTime}</span>
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <h3 className="text-lg font-serif font-bold text-[#e6e1da] mb-3 tracking-tight">{activeStep.titleBn}</h3>
                      <div className="text-xs text-[#a19a91] leading-relaxed space-y-2 mb-6">
                        {renderMarkdown(activeStep.fullDescBn)}
                      </div>

                      {/* Requirements */}
                      <div className="mb-6 border-t border-[#222220] pt-4">
                        <h4 className="text-[10px] font-mono tracking-widest text-[#a19a91] uppercase mb-3 flex items-center space-x-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#d2c4b4] stroke-[1.2]" />
                          <span>প্রয়োজনীয় নথিপত্র / Requirements</span>
                        </h4>
                        <ul className="space-y-2">
                          {activeStep.details.requirements.map((req, index) => (
                            <li key={index} className="text-xs text-[#e6e1da] flex items-start space-x-2">
                              <span className="text-[#d2c4b4] mt-1 select-none">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Fees */}
                      <div className="mb-6 p-3 rounded-lg bg-[#141413]/60 border border-[#222220] flex justify-between items-center select-none">
                        <span className="text-xs text-[#a19a91]">সরকারি / আনুমানিক খরচ:</span>
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
                            className="w-full bg-transparent hover:bg-white/[0.03] border border-[#2e2e2b] text-[#e6e1da] rounded-lg py-2.5 px-4 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all duration-200"
                          >
                            <span>{activeStep.details.actionLabel}</span>
                            <ExternalLink className="w-3.5 h-3.5 stroke-[1.5]" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            className="w-full bg-transparent hover:bg-white/[0.03] border border-[#2e2e2b] text-[#e6e1da] rounded-lg py-2.5 px-4 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all duration-200 cursor-pointer"
                          >
                            <span>{activeStep.details.actionLabel}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(activeStep.id)}
                          className="w-full bg-[#e0d8cc] hover:bg-[#d2c4b4] text-[#141413] rounded-lg py-2.5 px-4 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all duration-200 cursor-pointer active:scale-95 border-0"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.8]" />
                          <span>
                            {activeStep.status === "COMPLETED"
                              ? "ধাপটি অসম্পূর্ণ চিহ্নিত করুন"
                              : "ধাপটি সম্পন্ন চিহ্নিত করুন"}
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Full Blueprint Report View */}
                      <div className="flex justify-between items-center mb-4 text-[9px] font-mono text-[#a19a91] border-b border-[#222220] pb-2">
                        <span className="text-[#d2c4b4] tracking-widest uppercase">FULL PROJECT REPORT</span>
                        <span>১০ টি ধাপের রূপরেখা</span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-[#e6e1da] mb-4 tracking-tight">
                        উদ্যোগের সামগ্রিক রোডম্যাপ / Full Venture Blueprint
                      </h3>
                      
                      <div className="text-xs text-[#a19a91] space-y-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin leading-relaxed">
                        {renderMarkdown(compileFullBlueprintMarkdown())}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom static layout parts (disclaimer & helpdesk) */}
                <div className="mt-8 pt-4 border-t border-[#222220]">
                  {/* Helpdesk */}
                  <div className="text-center mb-4 select-none">
                    <p className="text-[10px] text-[#a19a91]">
                      বাংলাদেশী আইন বা ফর্ম পূরণে সমস্যা হচ্ছে?{" "}
                      <button
                        type="button"
                        className="text-[#d2c4b4] cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d2c4b4] rounded px-1 bg-transparent border-0"
                      >
                        হেল্পডেস্ক সাপোর্ট নিন
                      </button>
                    </p>
                  </div>

                  {/* Legal Disclaimer */}
                  <div className="p-3.5 rounded-lg bg-[#1d1b18] border border-amber-900/10 text-[9px] text-[#c2b29f]/90 leading-relaxed font-sans text-left select-none">
                    <strong>সতর্কতা / Disclaimer:</strong> এটি একটি এআই-জেনারেটেড রোডম্যাপ। যেকোনো কর, আইনি বা আর্থিক সিদ্ধান্ত গ্রহণের পূর্বে সংশ্লিষ্ট সরকারি দপ্তর (RJSC, NBR, সিটি কর্পোরেশন) থেকে অফিসিয়াল তথ্য নিশ্চিত করুন।
                  </div>
                </div>

              </div>

            </div>

            {/* Local Toast copied indicator */}
            {copiedToast && (
              <div className="absolute bottom-6 right-6 z-50 bg-[#1c241c] border border-emerald-500/20 text-[#a0cfa0] text-[11px] px-4 py-2.5 rounded-lg shadow-lg animate-fade-in flex items-center space-x-2 font-semibold select-none font-sans">
                <Check className="w-4 h-4 text-emerald-400 stroke-[1.8]" />
                <span>ক্লিপবোর্ডে কপি করা হয়েছে! (Copied to Clipboard)</span>
              </div>
            )}
          </div>

        </div>
        
      </div>
    </div>
  );
}
