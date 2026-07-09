import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { rawIntent } = await request.json();

    if (!rawIntent) {
      return NextResponse.json(
        { error: "rawIntent is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    const agentId = process.env.MISTRAL_AGENT_ID;

    if (!apiKey || !agentId) {
      return NextResponse.json(
        { error: "Mistral credentials are not configured in environment variables." },
        { status: 500 }
      );
    }

    // Call Mistral Chat Completions API with the Agent ID
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
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
            content: rawIntent,
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

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
