import Link from "next/link";
import { Leaf, Globe, ExternalLink } from "lucide-react";

const quickLinks = [
  { href: "/explore", label: "Explore Sanctuaries" },
  { href: "/scientists", label: "Scientists" },
  { href: "/resources", label: "Resources" },
];

const externalLinks = [
  { href: "https://indiabiodiversity.org/", label: "India Biodiversity Portal" },
  { href: "https://wii.gov.in/national_wildlife_database", label: "Wildlife Institute of India" },
  { href: "https://www.moef.gov.in/", label: "MoEFCC Portal" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Leaf className="h-6 w-6 text-green-500" />
              <span>Sustainiathon</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed">
              A centralized platform for wildlife, biodiversity, and conservation
              projects across India. Built for Sustain-a-thon: Tech for Earth, Tech for Each.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-green-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">External Resources</h4>
            <ul className="flex flex-col gap-2">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm hover:text-green-400 transition-colors"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs">
            Built with Next.js, Tailwind CSS & Framer Motion
          </p>
          <a
            href="https://github.com/ajaykr2712/Sustain-a-thon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs hover:text-green-400 transition-colors"
          >
            <Globe className="h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
