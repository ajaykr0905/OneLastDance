"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, ExternalLink, ChevronDown, ChevronUp, TreePine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { statesData, type StateData } from "@/data/sanctuaries";

const stateImages: Record<string, string> = {
  "Andhra Pradesh": "https://images.unsplash.com/photo-1590608897129-79da98d15969?w=400&q=80",
  "Arunachal Pradesh": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  "Karnataka": "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400&q=80",
  "Kerala": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80",
  "Rajasthan": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80",
  "Maharashtra": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80",
};

function StateCard({ state, index }: { state: StateData; index: number }) {
  const [expanded, setExpanded] = useState(false);

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
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-sm">
            <TreePine className="h-5 w-5" />
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
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
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
                    {state.sanctuaries.map((sanctuary, i) => (
                      <tr key={i} className="hover:bg-green-50/50 transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-900">{sanctuary.name}</td>
                        <td className="px-5 py-3">
                          <Badge variant="outline">{sanctuary.type}</Badge>
                        </td>
                        <td className="px-5 py-3 text-muted">
                          {sanctuary.ngo ? (
                            sanctuary.ngoUrl ? (
                              <a href={sanctuary.ngoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {sanctuary.ngo}
                              </a>
                            ) : (
                              sanctuary.ngo
                            )
                          ) : (
                            <span className="text-gray-300">&mdash;</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          {sanctuary.wikipediaUrl ? (
                            <a href={sanctuary.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-xs">
                              Wiki <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-gray-300 text-xs">&mdash;</span>
                          )}
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

export default function ExplorePage() {
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
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by state, sanctuary, or NGO..."
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted">
            <span className="font-semibold text-gray-900">{totalResults}</span> sanctuaries across{" "}
            <span className="font-semibold text-gray-900">{filtered.length}</span> states
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {filtered.map((state, i) => (
            <StateCard key={state.state} state={state} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-border bg-surface-alt py-16 text-center">
              <MapPin className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-muted">No sanctuaries found matching &ldquo;{search}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
