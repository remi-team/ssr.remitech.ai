"use client";

import * as React from "react";
import { IMAGES } from "./images";

/**
 * ProductSuite — 6 product cards (migrated from "Our Product Suite").
 * Hover swaps between the default icon and the hover variant (both canonical
 * `/images/*` paths). onError hides a missing icon gracefully.
 */
const products = [
  { ...IMAGES.productSuite.crossBorder, title: "Cross-Border Settlement", desc: "Real-time atomic settlement", href: "/solutions/cross-border-payment" },
  { ...IMAGES.productSuite.fx, title: "FX & Treasury", desc: "Capture the full FX spread", href: "/solutions/fx" },
  { ...IMAGES.productSuite.stablecoin, title: "Stablecoin Issuance", desc: "MiCA-authorized EMT issuance", href: "/solutions/stablecoin" },
  { ...IMAGES.productSuite.regtech, title: "RegTech", desc: "Real-time regulatory reporting", href: "/solutions/regtech" },
  { ...IMAGES.productSuite.lc, title: "Tokenized L/C", desc: "Smart contract letter of credit", href: "/solutions/lc" },
  { ...IMAGES.productSuite.cheque, title: "E-Cheque", desc: "Smart digital checks", href: "/solutions/cheque" },
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

export function ProductSuite() {
  return (
    <section data-scroll="suite" className="pb-[80px] pt-5 lg:pb-[133px] lg:pt-[100px]">
      <div className="relative mx-auto max-w-[1536px] bg-white px-6 lg:px-[123px]">
        <div className="text-left md:text-center">
          <h2 className="text-[32px] font-medium text-[#29221D]">Our Product Suite</h2>
          <p className="mx-auto py-3 text-[18px] text-[#86909C]">Explore our products</p>
        </div>
        <div className="mx-auto mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-[30px] lg:mt-12 lg:w-[960px] lg:grid-cols-3">
          {products.map((p) => (
            <a
              key={p.title}
              href={p.href}
              className="group flex flex-col rounded bg-[#F7F5F3] p-5 md:min-h-[220px] md:p-8 transition-all duration-300 hover:bg-[#FF6900] hover:shadow-lg hover:shadow-[#F1E3DA]"
            >
              <div className="relative h-[60px] w-[60px]">
                <SmartImg
                  src={p.icon}
                  alt="Product icon"
                  className="absolute inset-0 h-[60px] w-[60px] object-contain transition-opacity duration-300 group-hover:opacity-0"
                />
                <SmartImg
                  src={p.iconHover}
                  alt="Product icon hover"
                  className="absolute inset-0 h-[60px] w-[60px] object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
              <h3 className="mb-3 py-3 text-[18px] text-[#29221D] transition-colors duration-300 group-hover:text-white">
                {p.title}
              </h3>
              <p className="flex-1 text-[16px] leading-relaxed text-[#86909C] transition-colors duration-300 group-hover:text-white/90">
                {p.desc}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
