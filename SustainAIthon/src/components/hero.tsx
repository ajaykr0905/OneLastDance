"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, TreePine, Users, Bot, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { totalSanctuaries, totalStates } from "@/data/sanctuaries";
import { scientists } from "@/data/scientists";

const heroImages = [
  { src: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1920&q=80", alt: "Bengal Tiger in Indian wilderness" },
  { src: "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=1920&q=80", alt: "Majestic tiger walking through forest" },
  { src: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1920&q=80", alt: "Wildlife in natural habitat" },
];

const stats = [
  { label: "States Covered", value: totalStates, suffix: "+" },
  { label: "Sanctuaries Mapped", value: totalSanctuaries, suffix: "+" },
  { label: "Scientists Profiled", value: scientists.length, suffix: "" },
];

const features = [
  {
    icon: TreePine,
    title: "Explore Sanctuaries",
    description: "Browse wildlife sanctuaries, national parks, and tiger reserves across every Indian state.",
    href: "/explore",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
  },
  {
    icon: Users,
    title: "Meet Scientists",
    description: "Discover the conservationists and researchers driving wildlife protection in India.",
    href: "/scientists",
    image: "https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=600&q=80",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Ask questions about wildlife laws, NGOs, and conservation strategies powered by AI.",
    href: "/resources",
    image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=600&q=80",
  },
];

const PARTICLE_SEEDS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: (i * 8.3 + 5) % 100,
  size: 4 + (i % 4) * 2,
  delay: i * 1.8,
  drift: ((i % 5) - 2) * 20,
  duration: 16 + (i % 3) * 4,
}));

function FloatingParticle({ x, size, delay, drift, duration }: { x: number; size: number; delay: number; drift: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/20 pointer-events-none"
      style={{ left: `${x}%`, width: size, height: size }}
      aria-hidden="true"
      animate={{ y: [800, -100], x: [0, drift], rotate: [0, 360], opacity: [0, 0.6, 0.6, 0] }}
      transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
    />
  );
}

export function Hero() {
  const particles = useMemo(() => PARTICLE_SEEDS, []);

  return (
    <section aria-label="Hero">
      <div className="relative min-h-screen overflow-hidden bg-gray-900">
        {heroImages.map((img, i) => (
          <div key={img.src} className="hero-slide absolute inset-0" style={{ opacity: i === 0 ? 1 : 0, zIndex: 1 }}>
            <Image src={img.src} alt={img.alt} fill className="object-cover" priority={i === 0} sizes="100vw" />
          </div>
        ))}

        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-emerald-950/30 to-transparent" />

        <div aria-hidden="true" className="z-[3]">
          {particles.map((p) => (
            <FloatingParticle key={p.id} x={p.x} size={p.size} delay={p.delay} drift={p.drift} duration={p.duration} />
          ))}
        </div>

        <div className="relative z-10 flex min-h-screen items-center">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Leaf className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-green-300">Sustain-a-thon: Tech for Earth, Tech for Each</span>
              </motion.div>

              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
                Protecting India&rsquo;s{" "}
                <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">Wildlife Heritage</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
                A centralized platform connecting wildlife sanctuaries, conservation scientists, and environmental resources across India.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/explore">
                  <Button size="lg" className="bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/25">
                    Explore Sanctuaries <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/scientists">
                  <Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                    Meet Scientists
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-16 grid max-w-lg grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.15 }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center backdrop-blur-sm"
                >
                  <p className="text-3xl font-bold text-green-400 sm:text-4xl">{stat.value}{stat.suffix}</p>
                  <p className="mt-1 text-xs text-gray-400 sm:text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            What We <span className="text-gradient">Offer</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">Everything you need to explore and support wildlife conservation in India.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}>
              <Link href={feature.href} className="group relative block overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <Image src={feature.image} alt={feature.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 inline-flex rounded-lg bg-white/90 p-2.5 text-primary shadow-sm backdrop-blur-sm">
                    <feature.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
