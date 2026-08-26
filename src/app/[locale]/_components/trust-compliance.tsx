"use client";

import * as React from "react";
import { IMAGES } from "./images";

/**
 * TrustCompliance — 4 compliance cards (migrated from "Trust & Compliance").
 * Each card has a faded background icon (right-aligned) using canonical
 * `/images/*` paths. onError hides a missing icon gracefully.
 */
const cards = [
  { icon: IMAGES.trust.certifications, title: "Certifications", desc: "ISO 27001 · SOC 2 Type II · ISAE 3000" },
  { icon: IMAGES.trust.global, title: "Global Patent Coverage", desc: "US – EU – Singapore – Hong Kong" },
  { icon: IMAGES.trust.stablecoin, title: "Regulatory Alignment", desc: "Fully aligned with MiCA, GENIUS Act, FATF Recommendation 16" },
  { icon: IMAGES.trust.bison, title: "Bison Bank Foundation", desc: "A licensed Portuguese bank with 30+ years of institutional history. Among the first banks licensed under MiCA to issue Electronic Money Tokens." },
];

function SmartImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
      }}
    />
  );
}

export function TrustCompliance() {
  return (
    <section data-scroll="trust" className="pb-[80px] pt-[60px] lg:pb-[133px] lg:pt-[100px]">
      <div className="relative mx-auto max-w-[1536px] bg-white px-6 lg:px-[123px]">
        <div className="text-left md:text-center">
          <h2 className="text-[32px] font-medium text-[#29221D]">Trust & Compliance</h2>
          <p className="mx-auto py-3 text-[18px] text-[#86909C]">
            Remi is a blockchain-powered system that enables fast, low-cost, and transparent cross-border
          </p>
        </div>
        <div className="mx-auto grid grid-cols-1 gap-5 pt-8 md:grid-cols-2 md:gap-[30px] md:pt-[50px] lg:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.title}
              className="group relative flex h-[160px] flex-col overflow-hidden rounded bg-[#F7F5F3] p-5 md:h-[196px] md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-[#F1E3DA]"
            >
              {/* Background icon (right-aligned, faded) */}
              <div className="pointer-events-none absolute right-0 top-0 h-full w-full">
                <SmartImg
                  src={c.icon}
                  alt={`${c.title} icon`}
                  className="h-full w-full object-contain object-right opacity-40 transition-opacity duration-300 group-hover:opacity-60"
                />
              </div>
              <h3 className="relative py-3 text-[18px] text-[#29221D]">{c.title}</h3>
              <p className="relative flex-1 text-[16px] leading-relaxed text-[#86909C]">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
