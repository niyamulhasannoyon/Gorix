import { NextResponse } from "next/server";

// Simple memory-based rate limiting (replace with Redis/Upstash for serverless deployment)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Simple in-memory response cache (replace with Vercel KV / Redis for production caching)
const cacheMap = new Map<string, { content: string; expiry: number }>();

export async function POST(request: Request) {
  try {
    const { rawIntent } = await request.json();

    if (!rawIntent) {
      return NextResponse.json(
        { error: "rawIntent is required" },
        { status: 400 }
      );
    }

    // 1. Rate Limiting Check (Max 10 requests per hour per IP)
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();
    const limitRecord = rateLimitMap.get(ip);
    if (limitRecord) {
      if (now > limitRecord.resetTime) {
        // Reset window
        rateLimitMap.set(ip, { count: 1, resetTime: now + 3600 * 1000 });
      } else if (limitRecord.count >= 10) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Maximum 10 requests per hour. (অনুরোধের সীমা অতিক্রম হয়েছে। প্রতি ঘণ্টায় সর্বোচ্চ ১০ বার চেষ্টা করতে পারেন।)" },
          { status: 429 }
        );
      } else {
        limitRecord.count += 1;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 3600 * 1000 });
    }

    // 2. Input Validation (Type check and length cap)
    if (typeof rawIntent !== "string") {
      return NextResponse.json(
        { error: "rawIntent must be a string" },
        { status: 400 }
      );
    }

    if (rawIntent.length > 500) {
      return NextResponse.json(
        { error: "Input exceeds maximum limit of 500 characters. (ইনপুট ৫০০ অক্ষরের বেশি হতে পারবে না।)" },
        { status: 400 }
      );
    }

    // 3. Basic Prompt Injection Stripping & Sanitization
    const promptInjectionKeywords = [
      "ignore previous instructions",
      "ignore system rules",
      "system reset",
      "you must now act as",
      "override instructions",
      "ignore guidelines",
      "ignore constraints"
    ];

    let sanitizedIntent = rawIntent.trim();
    for (const keyword of promptInjectionKeywords) {
      const regex = new RegExp(keyword, "gi");
      sanitizedIntent = sanitizedIntent.replace(regex, "");
    }

    // 4. Response Caching Check (24-hour cache duration)
    const normalizedKey = sanitizedIntent.toLowerCase().replace(/\s+/g, " ");
    const cachedResponse = cacheMap.get(normalizedKey);
    if (cachedResponse && now < cachedResponse.expiry) {
      return NextResponse.json({ content: cachedResponse.content, cached: true });
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    const agentId = process.env.MISTRAL_AGENT_ID;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Mistral API Key is not configured." },
        { status: 500 }
      );
    }

    let response;
    let data;
    let content = "";

    // 1. Try to call the Mistral Agents completions endpoint
    if (agentId) {
      try {
        response = await fetch("https://api.mistral.ai/v1/agents/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            agent_id: agentId,
            messages: [
              {
                role: "user",
                content: sanitizedIntent,
              },
            ],
          }),
        });

        if (response.ok) {
          data = await response.json();
          content = data.choices?.[0]?.message?.content || "";
        } else {
          console.warn(`Mistral Agent API failed with status ${response.status}. Falling back to standard model.`);
        }
      } catch (err) {
        console.error("Agent API invocation error, falling back:", err);
      }
    }

    // 2. Fallback to standard chat completions if the agent failed or is not configured
    if (!content) {
      response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            {
              role: "system",
              content: `You are the Gorix OS Multi-Agent Venture Builder. The user wants to start a business in Bangladesh.
Generate an end-to-end actionable 10-step execution pipeline tailored for Bangladesh (including Trade License, e-TIN, bank account setup, etc. using BDT).
Respond in a mix of clean Bengali and English, keeping the formatting extremely professional and detailed.`
            },
            {
              role: "user",
              content: sanitizedIntent,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: `Mistral API error: ${response.statusText}`, details: errorText },
          { status: response.status }
        );
      }

      data = await response.json();
      content = data.choices?.[0]?.message?.content || "";
    }

    // Store in cache (expire in 24 hours)
    if (content) {
      cacheMap.set(normalizedKey, {
        content,
        expiry: now + 24 * 3600 * 1000,
      });
    }

    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

