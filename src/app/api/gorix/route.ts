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
      const responseHeaders = new Headers();
      responseHeaders.set("Cache-Control", "no-store, max-age=0, must-revalidate");
      return NextResponse.json({ content: cachedResponse.content, cached: true }, { headers: responseHeaders });
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
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are the Gorix OS Multi-Agent Venture Builder. The user wants to start a business in Bangladesh.
Generate a JSON object containing an array of exactly 10 step modules tailored for the user's business idea in Bangladesh.
Each step module must have:
- stepNumber (integer 1-10)
- titleBn (string, Bengali title of the step)
- titleEn (string, English title of the step)
- shortDescBn (string, short description in Bengali)
- shortDescEn (string, short description in English)
- fullDescBn (string, detailed breakdown in Bengali, explain the exact process, government portals, and details using markdown format)
- fullDescEn (string, detailed breakdown in English)
- requirements (array of strings, e.g. ["জাতীয় পরিচয়পত্র (NID)", "পাসপোর্ট সাইজ ছবি"])
- fees (string, expected government fees / registration costs in BDT, e.g. "৳২,০০০")
- estimatedTime (string, estimated duration, e.g. "৩-৫ দিন / 3-5 Days")
- actionLabel (string, action button text, e.g. "ট্রেড লাইসেন্স ফর্ম ডাউনলোড")
- actionUrl (string, relevant government portal link, e.g. "http://www.roc.gov.bd/")

Structure of JSON output:
{
  "steps": [
    ...
  ]
}`
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

    const responseHeaders = new Headers();
    responseHeaders.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    return NextResponse.json({ content }, { headers: responseHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

