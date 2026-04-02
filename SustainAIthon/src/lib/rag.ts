import { statesData, type Sanctuary, type StateData } from "@/data/sanctuaries";
import { scientists, type Scientist } from "@/data/scientists";
import { resourceCategories, type Resource } from "@/data/resources";

interface SanctuaryMatch {
  sanctuary: Sanctuary;
  state: string;
  score: number;
}

interface ScientistMatch {
  scientist: Scientist;
  score: number;
}

interface ResourceMatch {
  resource: Resource;
  category: string;
  score: number;
}

export interface RetrievalResult {
  sanctuaries: SanctuaryMatch[];
  scientists: ScientistMatch[];
  resources: ResourceMatch[];
  stateMatches: StateData[];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function scoreMatch(tokens: string[], target: string): number {
  const lower = target.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (lower.includes(token)) {
      score += token.length >= 5 ? 3 : token.length >= 4 ? 2 : 1;
    }
  }
  return score;
}

const TYPE_KEYWORDS: Record<string, string[]> = {
  NP: ["national park", "national parks"],
  WLS: ["wildlife sanctuary", "wildlife sanctuaries", "sanctuary", "sanctuaries"],
  TR: ["tiger reserve", "tiger reserves", "tiger"],
  BS: ["bird sanctuary", "bird sanctuaries", "bird"],
  CR: ["conservation reserve"],
};

export function retrieve(query: string, topN = 10): RetrievalResult {
  const tokens = tokenize(query);
  const queryLower = query.toLowerCase();

  const typeFilter = Object.entries(TYPE_KEYWORDS).find(([, keywords]) =>
    keywords.some((kw) => queryLower.includes(kw)),
  )?.[0] as Sanctuary["type"] | undefined;

  const sanctuaryMatches: SanctuaryMatch[] = [];
  const stateMatchSet = new Set<string>();

  for (const state of statesData) {
    const stateScore = scoreMatch(tokens, state.state);
    if (stateScore > 0) stateMatchSet.add(state.state);

    for (const sanctuary of state.sanctuaries) {
      if (typeFilter && sanctuary.type !== typeFilter) {
        const stateBoost = stateScore > 0 ? stateScore : 0;
        if (stateBoost === 0) continue;
      }

      let score = scoreMatch(tokens, sanctuary.name);
      score += stateScore;
      if (sanctuary.ngo) score += scoreMatch(tokens, sanctuary.ngo);
      if (typeFilter && sanctuary.type === typeFilter) score += 3;

      if (score > 0) {
        sanctuaryMatches.push({ sanctuary, state: state.state, score });
      }
    }
  }

  const scientistMatches: ScientistMatch[] = [];
  for (const scientist of scientists) {
    let score = scoreMatch(tokens, scientist.name);
    score += scoreMatch(tokens, scientist.state);
    if (queryLower.includes("scientist") || queryLower.includes("researcher") || queryLower.includes("conservationist")) {
      score += 2;
    }
    if (score > 0) {
      scientistMatches.push({ scientist, score });
    }
  }

  const resourceMatches: ResourceMatch[] = [];
  for (const cat of resourceCategories) {
    for (const resource of cat.resources) {
      let score = scoreMatch(tokens, resource.title);
      score += scoreMatch(tokens, resource.description);
      if (queryLower.includes("resource") || queryLower.includes("data") || queryLower.includes("tool")) {
        score += 1;
      }
      if (score > 0) {
        resourceMatches.push({ resource, category: cat.category, score });
      }
    }
  }

  sanctuaryMatches.sort((a, b) => b.score - a.score);
  scientistMatches.sort((a, b) => b.score - a.score);
  resourceMatches.sort((a, b) => b.score - a.score);

  const stateMatches = statesData.filter((s) => stateMatchSet.has(s.state));

  return {
    sanctuaries: sanctuaryMatches.slice(0, topN),
    scientists: scientistMatches.slice(0, 5),
    resources: resourceMatches.slice(0, 5),
    stateMatches,
  };
}

export function formatContext(result: RetrievalResult): string {
  const parts: string[] = [];

  if (result.stateMatches.length > 0) {
    for (const state of result.stateMatches) {
      parts.push(`## ${state.state} (${state.sanctuaries.length} protected areas)`);
      for (const s of state.sanctuaries) {
        let line = `- ${s.name} [${s.type}]`;
        if (s.ngo) line += ` | NGO: ${s.ngo}`;
        if (s.wikipediaUrl) line += ` | Wiki: ${s.wikipediaUrl}`;
        parts.push(line);
      }
    }
  }

  if (result.sanctuaries.length > 0 && result.stateMatches.length === 0) {
    parts.push("## Matching Sanctuaries");
    for (const { sanctuary, state } of result.sanctuaries) {
      let line = `- ${sanctuary.name} [${sanctuary.type}] in ${state}`;
      if (sanctuary.ngo) line += ` | NGO: ${sanctuary.ngo}`;
      if (sanctuary.ngoUrl) line += ` (${sanctuary.ngoUrl})`;
      if (sanctuary.wikipediaUrl) line += ` | Wiki: ${sanctuary.wikipediaUrl}`;
      parts.push(line);
    }
  }

  if (result.scientists.length > 0) {
    parts.push("## Relevant Scientists");
    for (const { scientist } of result.scientists) {
      parts.push(`- ${scientist.name} (${scientist.state}) | Wiki: ${scientist.wikipediaUrl}`);
    }
  }

  if (result.resources.length > 0) {
    parts.push("## Relevant Resources");
    for (const { resource, category } of result.resources) {
      parts.push(`- [${category}] ${resource.title}: ${resource.description} | URL: ${resource.url}`);
    }
  }

  if (parts.length === 0) {
    parts.push("## Database Summary");
    parts.push(`Total: ${statesData.length} states, ${statesData.reduce((s, st) => s + st.sanctuaries.length, 0)} protected areas, ${scientists.length} scientists, ${resourceCategories.reduce((s, c) => s + c.resources.length, 0)} resources.`);
    const stateList = statesData.map((s) => s.state).join(", ");
    parts.push(`States covered: ${stateList}`);
  }

  return parts.join("\n");
}
