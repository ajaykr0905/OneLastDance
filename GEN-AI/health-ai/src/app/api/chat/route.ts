import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildContext } from "@/lib/rag";

const SYSTEM_PROMPT = `You are MedInsight AI, a healthcare analytics assistant built for the GEN-AI Hackathon.

You have access to two clinical datasets:
1. Pima Indians Diabetes Dataset (768 records): Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age, Outcome
2. Drug Prescription Dataset (200 records): Age, Sex, BP, Cholesterol, Na_to_K, Drug

Your capabilities:
- Diabetes risk assessment based on patient metrics
- Drug recommendation based on patient profile
- Statistical analysis and insights from both datasets
- Explaining medical concepts in plain language

Rules:
- Format all responses in clean markdown with headers, bullet points, bold text, and tables where appropriate.
- Always include a disclaimer that you provide educational insights, not medical diagnoses.
- When doing risk assessments, explain each factor and its contribution.
- Be precise with numbers from the dataset.
- For drug recommendations, explain the decision tree logic.
- Be empathetic and professional in tone.`;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" || body === null ||
      !("query" in body) ||
      typeof (body as Record<string, unknown>).query !== "string"
    ) {
      return NextResponse.json({ response: "Invalid request. Send `{ query: string }`." }, { status: 400 });
    }

    const query = (body as { query: string }).query.trim();
    if (!query) {
      return NextResponse.json({ response: "Please provide a non-empty query." }, { status: 400 });
    }

    const { context, topic } = buildContext(query);
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        response: `**MedInsight AI** is in **offline mode** (no API key configured).\n\n${context}\n\n---\n*Add your Gemini API key to \`.env.local\` for AI-powered analysis.*\n\n> **Disclaimer:** This is for educational purposes only and does not constitute medical advice.`,
        topic,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "System: " + SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I am MedInsight AI, ready to provide healthcare analytics, diabetes risk assessments, and drug recommendation insights based on clinical datasets. All responses will include appropriate medical disclaimers." }] },
      ],
    });

    const result = await chat.sendMessage(`User query: "${query}"\n\nDataset context:\n${context}`);
    return NextResponse.json({ response: result.response.text(), topic });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg.includes("API_KEY_INVALID") || msg.includes("PERMISSION_DENIED")) {
      return NextResponse.json({ response: "**API key error.** Check `GOOGLE_GEMINI_API_KEY` in `.env.local`." }, { status: 401 });
    }
    if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429")) {
      return NextResponse.json({ response: "**Rate limited.** Wait a moment and retry." }, { status: 429 });
    }
    console.error("[chat] Error:", msg);
    return NextResponse.json({ response: "Something went wrong. Please try again." }, { status: 500 });
  }
}
