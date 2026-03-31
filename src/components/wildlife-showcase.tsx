"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const species = [
  {
    name: "Bengal Tiger",
    scientific: "Panthera tigris tigris",
    status: "Endangered",
    image: "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=600&q=80",
    fact: "India is home to over 70% of the world's wild tiger population.",
  },
  {
    name: "Indian Elephant",
    scientific: "Elephas maximus indicus",
    status: "Endangered",
    image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&q=80",
    fact: "India has the largest population of Asian elephants in the world.",
  },
  {
    name: "Indian Peacock",
    scientific: "Pavo cristatus",
    status: "Least Concern",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=600&q=80",
    fact: "The national bird of India, known for its iridescent blue-green plumage.",
  },
  {
    name: "Snow Leopard",
    scientific: "Panthera uncia",
    status: "Vulnerable",
    image: "https://images.unsplash.com/photo-1607431205907-13ba885ce880?w=600&q=80",
    fact: "Found in the Himalayas, India protects about 700 snow leopards.",
  },
  {
    name: "Indian Rhinoceros",
    scientific: "Rhinoceros unicornis",
    status: "Vulnerable",
    image: "https://images.unsplash.com/photo-1598894000396-bc30e0996899?w=600&q=80",
    fact: "Kaziranga National Park hosts two-thirds of the world's one-horned rhinos.",
  },
  {
    name: "Asiatic Lion",
    scientific: "Panthera leo persica",
    status: "Endangered",
    image: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600&q=80",
    fact: "The only wild population lives in Gujarat's Gir Forest.",
  },
];

const statusColors: Record<string, string> = {
  "Endangered": "bg-red-500/10 text-red-700 border-red-200",
  "Vulnerable": "bg-amber-500/10 text-amber-700 border-amber-200",
  "Least Concern": "bg-green-500/10 text-green-700 border-green-200",
};

export function WildlifeShowcase() {
  return (
    <section className="relative overflow-hidden bg-gray-950 py-24">
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-green-500/5 blur-3xl animate-glow-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl animate-glow-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="inline-block rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-xs font-semibold text-green-400 uppercase tracking-wider mb-4">
            Iconic Species
          </span>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Species We Protect
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400 leading-relaxed">
            India is one of the world&rsquo;s 17 megadiverse countries, home to extraordinary wildlife found nowhere else.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {species.map((animal, i) => (
            <motion.div
              key={animal.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-green-500/30 hover:bg-white/8"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={animal.image}
                  alt={animal.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm ${statusColors[animal.status] ?? "bg-gray-500/10 text-gray-400"}`}>
                    {animal.status}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white">{animal.name}</h3>
                <p className="text-xs italic text-gray-500">{animal.scientific}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {animal.fact}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
