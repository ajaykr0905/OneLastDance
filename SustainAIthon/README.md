# Sustainiathon - Wildlife & Conservation Platform

A centralized platform for wildlife, biodiversity, and conservation projects across India. Built for the **Sustain-a-thon: Tech for Earth, Tech for Each** hackathon.

## Features

- **Explore Sanctuaries** - Browse 250+ wildlife sanctuaries, national parks, and tiger reserves across 25 Indian states with linked NGOs and Wikipedia references
- **Conservation Scientists** - Discover 20 leading conservationists and researchers driving wildlife protection
- **Curated Resources** - Access data sources, open-source projects, and best practices for conservation
- **AI Chat Assistant** - Ask questions about wildlife laws, NGOs, and conservation strategies (requires backend)

## Tech Stack

- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CHAT_API_URL` | URL for the wildlife law AI chatbot backend |

## Deployment

This project is Vercel-ready. Deploy with:

```bash
npx vercel
```

Or connect your Git repository to [Vercel](https://vercel.com) for automatic deployments.

## Project Structure

```
src/
  app/           # Next.js App Router pages
  components/    # Reusable UI components
  data/          # Structured wildlife & conservation data
  lib/           # Utility functions
```
