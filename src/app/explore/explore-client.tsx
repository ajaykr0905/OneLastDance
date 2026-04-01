"use client";

import { useState, useMemo, useId } from "react";
import { Search, MapPin, ExternalLink, ChevronDown, ChevronUp, TreePine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { statesData, type StateData } from "@/data/sanctuaries";

function StateCard({ state, index }: { state: StateData; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:shadow-md"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-5 py-4 text-left cursor-pointer"
        aria-expanded={expanded}
        aria-controls={panelId}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-sm">
            <TreePine className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{state.state}</h3>
            <p className="text-xs text-muted">
              {state.sanctuaries.length} protected area{state.sanctuaries.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/10 text-green-700">{state.sanctuaries.length}</Badge>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted" aria-hidden="true" /> : <ChevronDown className="h-4 w-4 text-muted" aria-hidden="true" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            id={panelId}
            role="region"
            aria-label={`Sanctuaries in ${state.state}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-50 to-emerald-50 text-left text-xs text-green-800 uppercase tracking-wider">
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 font-medium">NGO</th>
                      <th className="px-5 py-3 font-medium w-24">Links</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {state.sanctuaries.map((sanctuary) => (
                      <tr key={`${state.state}-${sanctuary.name}`} className="hover:bg-green-50/50 transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-900">{sanctuary.name}</td>
                        <td className="px-5 py-3"><Badge variant="outline">{sanctuary.type}</Badge></td>
                        <td className="px-5 py-3 text-muted">
                          {sanctuary.ngo ? (
                            sanctuary.ngoUrl ? (
                              <a href={sanctuary.ngoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {sanctuary.ngo}
                                <span className="sr-only"> (opens in new tab)</span>
                              </a>
                            ) : sanctuary.ngo
                          ) : <span className="text-gray-300" aria-label="Not available">&mdash;</span>}
                        </td>
                        <td className="px-5 py-3">
                          {sanctuary.wikipediaUrl ? (
                            <a href={sanctuary.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-xs">
                              Wiki <ExternalLink className="h-3 w-3" aria-hidden="true" />
                              <span className="sr-only"> (opens in new tab)</span>
                            </a>
                          ) : <span className="text-gray-300 text-xs" aria-label="Not available">&mdash;</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ExploreClient() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return statesData;
    return statesData
      .map((state) => ({
        ...state,
        sanctuaries: state.sanctuaries.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            state.state.toLowerCase().includes(q) ||
            (s.ngo && s.ngo.toLowerCase().includes(q)),
        ),
      }))
      .filter((state) => state.sanctuaries.length > 0);
  }, [search]);

  const totalResults = filtered.reduce((sum, s) => sum + s.sanctuaries.length, 0);

  return (
    <div>
      <PageHeader
        title="Explore Sanctuaries"
        subtitle="Browse wildlife sanctuaries, national parks, and tiger reserves across India."
        image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80"
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by state, sanctuary, or NGO..."
              className="pl-10"
              aria-label="Search sanctuaries"
            />
          </div>
          <p className="text-sm text-muted" aria-live="polite">
            <span className="font-semibold text-gray-900">{totalResults}</span> sanctuaries across{" "}
            <span className="font-semibold text-gray-900">{filtered.length}</span> states
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {filtered.map((state, i) => (
            <StateCard key={state.state} state={state} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-border bg-surface-alt py-16 text-center" role="status">
              <MapPin className="mx-auto h-10 w-10 text-gray-300 mb-3" aria-hidden="true" />
              <p className="text-muted">No sanctuaries found matching &ldquo;{search}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
