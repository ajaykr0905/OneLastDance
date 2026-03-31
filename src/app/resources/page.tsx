"use client";

import { motion } from "framer-motion";
import { ExternalLink, Database, Code, BookOpen, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { resourceCategories } from "@/data/resources";

const categoryConfig: Record<string, { icon: typeof Database; gradient: string }> = {
  "Data Sources": { icon: Database, gradient: "from-blue-500 to-cyan-500" },
  "Open-Source Projects": { icon: Code, gradient: "from-green-500 to-emerald-500" },
  "Best Practices & Strategies": { icon: BookOpen, gradient: "from-amber-500 to-orange-500" },
};

export default function ResourcesPage() {
  return (
    <div>
      <PageHeader
        title="Resources"
        subtitle="Curated data sources, open-source tools, and conservation best practices."
        image="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1920&q=80"
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-14">
          {resourceCategories.map((cat, ci) => {
            const config = categoryConfig[cat.category] ?? { icon: Database, gradient: "from-gray-500 to-gray-600" };
            const Icon = config.icon;

            return (
              <section key={cat.category}>
                <div className="mb-6 flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{cat.category}</h2>
                    <p className="text-xs text-muted">{cat.resources.length} resources</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.resources.map((res, ri) => (
                    <motion.a
                      key={res.title}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: Math.min(ci * 0.05 + ri * 0.05, 0.3) }}
                      className="group flex flex-col rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {res.title}
                        </h3>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">
                        {res.description}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        Visit Resource <ExternalLink className="h-3 w-3" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
