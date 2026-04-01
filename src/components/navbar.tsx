"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/scientists", label: "Scientists" },
  { href: "/resources", label: "Resources" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeMenu]);

  useEffect(() => { setOpen(false); }, [pathname]);

  const transparent = isHome && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        transparent ? "bg-transparent border-transparent" : "bg-white/90 border-b border-border backdrop-blur-xl shadow-sm",
      )}
      role="banner"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main navigation">
        <Link href="/" className={cn("flex items-center gap-2 font-bold text-lg transition-colors", transparent ? "text-white" : "text-primary")}>
          <Leaf className="h-6 w-6" aria-hidden="true" />
          <span>Sustainiathon</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? transparent ? "bg-white/15 text-white" : "bg-primary/10 text-primary-dark"
                    : transparent ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-gray-600 hover:bg-surface-alt hover:text-gray-900",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          ref={toggleRef}
          onClick={() => setOpen(!open)}
          className={cn("rounded-lg p-2 md:hidden transition-colors", transparent ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-surface-alt")}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className={cn("px-4 pb-4 md:hidden", transparent ? "bg-gray-900/95 backdrop-blur-xl" : "border-t border-border bg-white")}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? transparent ? "bg-white/15 text-white" : "bg-primary/10 text-primary-dark"
                      : transparent ? "text-white/80 hover:bg-white/10" : "text-gray-600 hover:bg-surface-alt hover:text-gray-900",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
