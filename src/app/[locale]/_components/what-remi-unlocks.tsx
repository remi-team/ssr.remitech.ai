"use client";

import * as React from "react";
import { IMAGES } from "./images";

/**
 * WhatRemiUnlocks — 4 feature cards (migrated from index.vue "What Remi Unlocks").
 * Icons use canonical `/images/*` paths (resolve when files land in /public/images/).
 * Each <img> has an onError fallback so a missing icon degrades to a hidden
 * slot instead of a broken-image glyph.
 */
const features = [
  { icon: IMAGES.whatRemi.access, title: "Access the corridor", desc: "Bank-to-bank, no intermediary hops, no gatekeeper markup." },
  { icon: IMAGES.whatRemi.own, title: "Own the client", desc: "Corporates and fintechs follow the corridor. First bank in wins the relationship." },
  { icon: IMAGES.whatRemi.expand, title: "Expand the product", desc: "Settlement becomes FX, trade finance, treasury, and embedded finance — each corridor is a platform." },
  { icon: IMAGES.whatRemi.reduce, title: "Reduce compliance burden", desc: "KYC embedded. Travel Rule end-to-end. Audit trail automatic. No compliance build required." },
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

export function WhatRemiUnlocks() {
  return (
    <section id="solutions" data-scroll="system" className="scroll-mt-[80px] bg-white pb-[80px] pt-[60px] lg:pb-[133px] lg:pt-[100px]">
      <div className="mx-auto max-w-[1536px] px-6 lg:px-[123px]">
        <div className="text-left md:text-center">
          <h2 className="mb-3 text-[32px] font-medium text-[#29221D]">What Remi Unlocks</h2>
          <p className="mx-auto mt-4 max-w-[1536px] text-[18px] text-[#86909C]">
            Why financial institutions choose Remi
          </p>
        </div>
        <div className="mt-10 mx-0 grid grid-cols-1 gap-5 sm:mx-[30px] md:mx-[60px] md:grid-cols-2 md:gap-[30px] lg:mt-12 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col rounded bg-[#F7F5F3] p-5 md:min-h-[300px] md:p-8 transition-shadow duration-300 hover:shadow-lg hover:shadow-[#F1E3DA]"
            >
              <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center">
                <SmartImg src={f.icon} alt={f.title} className="h-[60px] w-[60px] object-contain" />
              </div>
              <h3 className="mb-3 text-[18px] text-[#29221D]">{f.title}</h3>
              <p className="mt-2 flex-1 text-[16px] leading-relaxed text-[#86909C]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
