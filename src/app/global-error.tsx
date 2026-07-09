"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global app error caught:", error);
  }, [error]);

  return (
    <html lang="bn" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-[#0B0F19] text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden" suppressHydrationWarning>
        {/* Decorative Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-rose-950/20 blur-[120px] pointer-events-none" />
        
        <div className="max-w-md w-full rounded-2xl bg-white/[0.02] border border-rose-500/20 backdrop-blur-xl p-8 shadow-[0_0_50px_rgba(244,63,94,0.05)] text-center relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
            <AlertTriangle className="w-7 h-7" />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-3">
            সিস্টেমে গুরুতর ত্রুটি দেখা দিয়েছে!
          </h2>
          <h3 className="text-sm font-semibold text-slate-300 mb-4 font-mono">
            A critical system error occurred.
          </h3>
          
          <p className="text-xs text-slate-400 leading-relaxed mb-8 max-w-sm mx-auto">
            অ্যাপ্লিকেশন লোড করার সময় সমস্যা হয়েছে। আপনার ব্রাউজার ক্যাশ রিসেট করতে বা পুনরায় পেজটি লোড করতে নিচের বাটনে ক্লিক করুন।
          </p>

          <button
            type="button"
            onClick={() => reset()}
            className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl py-3 px-4 text-xs font-bold flex items-center justify-center space-x-2 transition-all duration-200 shadow-md shadow-rose-950/20 cursor-pointer active:scale-95 border-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>অ্যাপ্লিকেশন রিবুট করুন / Recover App</span>
          </button>
        </div>
      </body>
    </html>
  );
}
