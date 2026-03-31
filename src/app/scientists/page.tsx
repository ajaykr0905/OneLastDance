"use client";

import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { scientists } from "@/data/scientists";

const colors = [
  "from-green-500 to-emerald-600",
  "from-teal-500 to-cyan-600",
  "from-emerald-500 to-green-600",
  "from-cyan-500 to-teal-600",
  "from-green-600 to-teal-600",
];

export default function ScientistsPage() {
  return (
    <div>
      <PageHeader
        title="Conservation Scientists"
        subtitle="The researchers and conservationists driving wildlife protection across India."
        image="https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=1920&q=80"
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {scientists.map((scientist, i) => (
            <motion.a
              key={scientist.name}
              href={scientist.wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`h-20 bg-gradient-to-r ${colors[i % colors.length]}`} />
              <div className="px-5 pb-5">
                <div className="-mt-8 mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-bold text-green-700 shadow-lg border-4 border-white">
                  {scientist.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {scientist.name}
                </h3>
                <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{scientist.state}</span>
                </div>
                <div className="mt-3">
                  <Badge variant="outline" className="gap-1">
                    View Profile <ExternalLink className="h-3 w-3" />
                  </Badge>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
