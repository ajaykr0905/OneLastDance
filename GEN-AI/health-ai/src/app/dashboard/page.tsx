"use client";

import { motion } from "framer-motion";
import { Activity, Users, Pill, TrendingUp, AlertTriangle, Heart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { diabetesStats } from "@/data/diabetes";
import { drugStats } from "@/data/drugs";

const riskColors = { high: "text-red-600 bg-red-50", medium: "text-amber-600 bg-amber-50", low: "text-green-600 bg-green-50", critical: "text-red-700 bg-red-50" };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Clinical Dashboard</h1>
        <p className="mt-2 text-gray-600">Dataset statistics, risk factors, and drug distribution insights.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: "Total Patients", value: diabetesStats.totalRecords + drugStats.totalRecords, icon: Users, color: "text-blue-600" },
          { label: "Diabetes Rate", value: `${diabetesStats.prevalenceRate}%`, icon: Activity, color: "text-red-600" },
          { label: "Drug Types", value: drugStats.drugs.length, icon: Pill, color: "text-violet-600" },
          { label: "Avg Age", value: diabetesStats.features[7].mean, icon: Heart, color: "text-emerald-600" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted font-medium uppercase tracking-wider">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </div>
                <s.icon className={`h-8 w-8 ${s.color} opacity-20`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-500" /> Age vs Diabetes Rate</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {diabetesStats.ageDistribution.map((a) => (
                  <div key={a.range}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{a.range} years</span>
                      <span className="text-gray-500">{a.diabetic}/{a.count} ({a.rate}%)</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${a.rate}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Pill className="h-5 w-5 text-violet-500" /> Drug Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drugStats.drugs.map((d) => (
                  <div key={d.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{d.name}</span>
                      <span className="text-gray-500">{d.count} ({d.percentage}%)</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${d.percentage}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Diabetes Risk Factors</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {diabetesStats.riskFactors.map((r) => (
                  <div key={r.factor} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${riskColors[r.impact]}`}>{r.impact}</span>
                    <div><p className="text-sm font-medium text-gray-900">{r.factor}</p><p className="text-xs text-gray-500 mt-0.5">{r.description}</p></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-emerald-500" /> Clinical Features</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted uppercase">
                      <th className="pb-2 font-medium">Feature</th>
                      <th className="pb-2 font-medium">Mean</th>
                      <th className="pb-2 font-medium">Std</th>
                      <th className="pb-2 font-medium">Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {diabetesStats.features.map((f) => (
                      <tr key={f.name} className="hover:bg-gray-50">
                        <td className="py-2 font-medium text-gray-900">{f.name}</td>
                        <td className="py-2 text-gray-600">{f.mean}</td>
                        <td className="py-2 text-gray-600">{f.std}</td>
                        <td className="py-2 text-gray-600">{f.min}–{f.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
