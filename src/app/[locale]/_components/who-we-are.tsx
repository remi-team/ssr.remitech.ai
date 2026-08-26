"use client";

import * as React from "react";
import { IMAGES } from "./images";

/**
 * WhoWeAre — image + text split (migrated from "Who We Are").
 * Three-engine architecture narrative (Bank + Network + Treasury).
 * The image side uses the canonical `/images/home-multi_1536x.webp` path;
 * a grid fallback shows when the file is not yet in /public/images/.
 */
export function WhoWeAre() {
  return (
    <section data-scroll="who-we-are" className="pb-[80px] pt-5 lg:pb-[133px] lg:pt-[100px]">
      <div className="relative mx-auto max-w-[1536px] bg-white px-6 lg:px-[123px]">
        <div className="pb-10 text-left md:pb-20 md:text-center">
          <h2 className="text-[32px] font-medium text-[#29221D]">Who We Are</h2>
          <p className="mx-auto py-3 text-[18px] text-[#86909C]">
            One Group. Three Engines. Full Value Chain.
          </p>
        </div>
        <div className="flex flex-col gap-0 overflow-hidden rounded-xl shadow-[0_0_8px_1px_#F1E3DA] lg:h-[580px] lg:flex-row lg:gap-10">
          {/* Image side — canonical image path with grid fallback */}
          <div className="relative h-[180px] w-full overflow-hidden bg-[#0E0B09] md:h-[200px] lg:h-full lg:w-[454px] lg:flex-shrink-0">
            {/* Grid fallback layer (always rendered beneath the image) */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
              aria-hidden="true"
            />
            <div
              className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6900]/30 blur-[80px]"
              aria-hidden="true"
            />
            <img
              src={IMAGES.whoWeAre.image}
              alt="Remi three-engine architecture"
              className="relative h-full w-full object-cover"
              onError={(e) => {
                // Image not yet in /public/images/ — hide it so the grid
                // fallback shows cleanly.
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          {/* Text side */}
          <div className="flex flex-1 flex-col gap-5 px-6 pb-6 pt-6 md:gap-6 md:pb-10 md:pt-10 lg:gap-10 lg:px-0 lg:pb-0 lg:pt-20 lg:pr-[69px]">
            <p className="text-[16px] leading-[1.8] text-[#4E5969] lg:text-[18px]">
              <span className="mr-1 inline-block text-[20px] leading-[1] align-bottom lg:text-[24px]">Remi</span>
              is a Singapore-based technology company under Bison FinTech Ecosystem. We work in strategic
              partnership with Bison Bank — a licensed Portuguese institution with 30+ years of history —
              to deliver regulated stablecoin infrastructure to financial institutions worldwide.
            </p>
            <p className="text-[16px] leading-[1.8] text-[#4E5969] lg:text-[18px]">
              <span className="mr-1 inline-block text-[20px] leading-[1] align-bottom lg:text-[24px]">Bison Bank</span>
              serves as our strategic partner, providing the licensed foundation for stablecoin issuance,
              custody, and settlement under ECB and MiCA authorization. Remi Technology operates the clearing
              network, compliance framework, and product innovation.
            </p>
            <p className="text-[16px] leading-[1.8] text-[#4E5969] lg:text-[18px]">
              <span className="mr-1 inline-block text-[20px] leading-[1] align-bottom lg:text-[24px]">
                Bison FX & Treasury
              </span>
              captures the FX spread and treasury margin on every transaction.
            </p>
            <p className="text-[16px] leading-[1.8] text-[#4E5969] lg:text-[18px]">
              This three-engine architecture — Bank + Network + Treasury — gives Remi a structural advantage
              no competitor can replicate: a licensed bank as strategic partner, a real-time clearing network,
              and a regulated markets division capturing the full value chain.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
