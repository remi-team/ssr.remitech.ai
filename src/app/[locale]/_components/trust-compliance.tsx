"use client";

import * as React from "react";
import { IMAGES } from "./images";

/**
 * TrustCompliance — 4 compliance cards (migrated from "Trust & Compliance").
 * Each card has a faded background icon (right-aligned) using canonical
 * `/images/*` paths. onError hides a missing icon gracefully.
 */
const cards = [
  { icon: IMAGES.trust.certifications, w: 424, h: 424, title: "Certifications", desc: "ISO 27001 · SOC 2 Type II · ISAE 3000" },
  { icon: IMAGES.trust.global, w: 424, h: 424, title: "Global Patent Coverage", desc: "US – EU – Singapore – Hong Kong" },
  { icon: IMAGES.trust.stablecoin, w: 424, h: 424, title: "Regulatory Alignment", desc: "Fully aligned with MiCA, GENIUS Act, FATF Recommendation 16" },
  { icon: IMAGES.trust.bison, w: 430, h: 386, title: "Bison Bank Foundation", desc: "A licensed Portuguese bank with 30+ years of institutional history. Among the first banks licensed under MiCA to issue Electronic Money Tokens." },
];

function SmartImg({
  src,
  alt,
  className,
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Intrinsic pixel size — reserves the layout box (技术SEO-6). */
  width: number;
  height: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
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
          <h2 className="text-[32px] inter-medium text-[#29221D]">Trust & Compliance</h2>
          <p className="mx-auto py-3 text-[18px] inter-light text-[#86909C]">
            Remi is a blockchain-powered system that enables fast, low-cost, and transparent cross-border
          </p>
          <div className="inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M32.4115 10.0847C32.0463 9.7555 31.5684 9.59093 31.0926 9.59093C31.0362 9.59093 31.008 9.59093 30.9524 9.59093C30.9242 9.59093 30.6154 9.61848 30.1382 9.61848C29.324 9.61848 27.7811 9.56338 26.2945 9.2074C24.3856 8.7695 22.1688 6.7134 21.5231 6.3016C21.2151 6.10948 20.8217 6 20.4566 6C20.0922 6 19.7278 6.10948 19.3908 6.3016C19.307 6.3567 17.0062 8.68613 14.7612 9.2074C13.2739 9.56338 11.6745 9.61848 10.8893 9.61848C10.3839 9.61848 10.0758 9.59093 10.0476 9.59093C10.0194 9.59093 9.96304 9.59093 9.93558 9.59093C9.43016 9.59093 8.98115 9.7555 8.61674 10.0847C8.22414 10.4138 8 10.9068 8 11.4005V15.9499C8 32.7257 19.6439 34.8898 20.1211 34.9725C20.2332 35 20.346 35 20.4573 35C20.5694 35 20.6829 35 20.795 34.9725C21.2997 34.8898 33 32.725 33 15.9499V11.4005C33 10.9068 32.7744 10.4138 32.4115 10.0847ZM28.0898 16.5814L20.0365 24.2004C19.9801 24.2831 19.9244 24.3657 19.8398 24.4208C19.615 24.6398 19.307 24.7492 18.9982 24.7492C18.6887 24.7492 18.3807 24.6398 18.1284 24.4208C18.072 24.3657 17.9889 24.2838 17.9599 24.2004L13.639 20.1165C13.19 19.6779 13.19 18.9935 13.639 18.5548C14.0873 18.1155 14.845 18.1155 15.294 18.5548L18.9982 22.0356L26.434 15.019C26.912 14.5804 27.64 14.5804 28.0891 15.019C28.5663 15.4301 28.5663 16.1428 28.0898 16.5814Z"
                fill="#4E5969"
              />
            </svg>
          </div>
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
                  width={c.w}
                  height={c.h}
                  className="h-full w-full object-contain object-right opacity-40 transition-opacity duration-300 group-hover:opacity-60"
                />
              </div>
              <h3 className="relative py-3 text-[18px] inter-light text-[#29221D]">{c.title}</h3>
              <p className="relative flex-1 text-[16px] inter-light leading-relaxed text-[#86909C]">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
