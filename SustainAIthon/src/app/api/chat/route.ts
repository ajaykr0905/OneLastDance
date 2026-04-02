import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieve, formatContext } from "@/lib/rag";

const SYSTEM_PROMPT = `You are WildGuard AI, an expert assistant for Indian wildlife conservation built for the Sustain-a-thon hackathon.

You have access to a live database of 250+ wildlife sanctuaries, national parks, tiger reserves, and bird sanctuaries across 25 Indian states, along with profiles of 20 leading conservation scientists and curated conservation resources.

Rules:
- Answer questions accurately using ONLY the provided context data when available.
- Format all responses in clean markdown with headers, bullet points, and bold text where appropriate.
- When listing sanctuaries, include their type (NP/WLS/TR/BS), state, and linked NGO if available.
- If the user asks about something not in the context, say so honestly and provide general conservation knowledge.
- Be concise but thorough. Prefer tables for comparative data.
- Always be encouraging about conservation efforts.
- When citing scientists, mention their state and Wikipedia link.
- For general greetings, introduce yourself and suggest what you can help with.`;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("query" in body) ||
      typeof (body as Record<string, unknown>).query !== "string"
    ) {
      return NextResponse.json(
        { response: "Invalid request format. Send { query: string }." },
        { status: 400 },
      );
    }

    const query = (body as { query: string }).query.trim();
    if (!query) {
      return NextResponse.json(
        { response: "Please provide a non-empty query." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      const ragResult = retrieve(query);
      const context = formatContext(ragResult);

      return NextResponse.json({
        response: `**WildGuard AI** is running in **offline mode** (no Gemini API key configured).\n\nHere's what I found in the database for your query:\n\n${context}\n\n---\n*To enable AI-powered responses, add your Gemini API key to \`.env.local\`.*`,
      });
    }

    const ragResult = retrieve(query);
    const context = formatContext(ragResult);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "System instructions: " + SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am WildGuard AI, ready to help with Indian wildlife conservation queries. I'll use the provided database context to give accurate, markdown-formatted responses." }],
        },
      ],
    });

    const userMessage = `User query: "${query}"\n\nRelevant database context:\n${context}`;
    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("API_KEY_INVALID") || message.includes("PERMISSION_DENIED")) {
      return NextResponse.json(
        { response: "**API key error.** Please check your `GOOGLE_GEMINI_API_KEY` in `.env.local`." },
        { status: 401 },
      );
    }

    if (message.includes("RESOURCE_EXHAUSTED") || message.includes("429")) {
      return NextResponse.json(
        { response: "**Rate limit reached.** Please wait a moment and try again." },
        { status: 429 },
      );
    }

    console.error("[chat/route] Error:", message);
    return NextResponse.json(
      { response: "Something went wrong processing your request. Please try again." },
      { status: 500 },
    );
  }
}
