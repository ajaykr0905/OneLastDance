"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  image: string;
}

export function PageHeader({ title, subtitle, image }: PageHeaderProps) {
  return (
    <div className="relative h-64 overflow-hidden bg-gray-900 sm:h-80">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover opacity-40"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 to-transparent" />
      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h1>
            <p className="mt-2 max-w-xl text-gray-300">{subtitle}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
