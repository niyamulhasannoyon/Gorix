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
                content: rawIntent,
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

      data = await response.json();
      content = data.choices?.[0]?.message?.content || "";
    }

    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

