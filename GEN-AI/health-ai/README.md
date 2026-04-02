# MedInsight AI - Healthcare Analytics Agent

AI-powered healthcare analytics platform for diabetes risk assessment and personalized drug recommendations. Built for the **GEN-AI Hackathon**.

## Features

- **Diabetes Risk Assessment** - Input glucose, BMI, age, blood pressure to get instant risk evaluation
- **Drug Recommendation** - Data-driven drug suggestions based on patient profile (Na-to-K ratio, BP, age)
- **Clinical Dashboard** - Interactive visualizations of 968 patient records across two datasets
- **AI Chat Agent** - Gemini 2.0 Flash powered conversational interface with RAG over clinical data

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **Google Gemini 2.0 Flash** via `@google/generative-ai`
- **Tailwind CSS v4** + Framer Motion
- **Vitest** + React Testing Library

## Getting Started

```bash
npm install
echo "GOOGLE_GEMINI_API_KEY=your_key" > .env.local
npm run dev
```

Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

The app works in offline mode without an API key -- returning raw dataset analytics.

## Datasets

- **Pima Indians Diabetes** (768 records) - UCI ML Repository
- **Drug Classification** (200 records) - 5 drug types based on patient vitals

## Disclaimer

This is an educational tool for a hackathon. It does not provide medical diagnoses or treatment plans.
