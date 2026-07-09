"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard segment error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-red-950/10 blur-[100px] pointer-events-none" />
      
      <div className="max-w-md w-full rounded-2xl bg-white/[0.02] border border-red-500/15 backdrop-blur-xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.05)] text-center relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <AlertTriangle className="w-7 h-7" />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-3">
          দুঃখিত, একটি ত্রুটি ঘটেছে!
        </h2>
        <h3 className="text-sm font-semibold text-slate-300 mb-4 font-mono">
          Something went wrong.
        </h3>
        
        <p className="text-xs text-slate-400 leading-relaxed mb-8 max-w-sm mx-auto">
          রোডম্যাপ প্রসেস করার সময় সিস্টেমে সাময়িক সমস্যা দেখা দিয়েছে। অনুগ্রহ করে নিচে রিসেট বাটনে ক্লিক করে আবার চেষ্টা করুন।
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl py-3 px-4 text-xs font-bold flex items-center justify-center space-x-2 transition-all duration-200 shadow-md shadow-red-950/20 cursor-pointer active:scale-95 border-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>পুনরায় চেষ্টা করুন / Try Again</span>
        </button>
      </div>
    </div>
  );
}
