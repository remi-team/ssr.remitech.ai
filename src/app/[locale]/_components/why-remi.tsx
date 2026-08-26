"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGES } from "./images";

/**
 * WhyRemi — 5 expandable cards in a 3+2 layout (migrated from "Why Remi").
 *
 * Cards expand/collapse with a CSS-transition height animation (measured via
 * scrollHeight, same technique as the legacy GSAP impl but dependency-free).
 * Only one card expands at a time; clicking outside collapses it.
 */
const whyCards = [
  {
    title: "Global E-Money Token (EMT) Network",
    desc: "Remi has established a regulated E-Money Token (EMT) network with active corridors across Vietnam, Philippines, Indonesia, Bangladesh, the UAE and key Latin American markets. More than 15 member institutions have been secured. Notably, in the United States, as a Singapore-based technology company — Remi leads BAFT's working group on providing comment letter to OCC's GENIUS Act.",
  },
  {
    title: "Regulated Digital Asset Trading Platform",
    desc: "Remi provides stablecoin FX trading with real-time quotes and deep liquidity, built on a regulated clearing infrastructure. Treasury solutions with T+0 settlement finality and automated reconciliation across the network.",
  },
  {
    title: "Regulatory Dashboard for AML",
    desc: "Remi provides a regulatory dashboard for anti-money laundering, equipping regulators with advanced tools to monitor real-time changes in digital asset transfers — enabling pre-event early warning, in-event inspection, post-event tracing, freezing, and data sharing — and has published a whitepaper mapping Remi's capabilities to all 40 FATF anti-money laundering recommendations.",
  },
  {
    title: "Monetary Policy Dashboard",
    desc: "Remi provides a stablecoin monetary policy dashboard for national currency management authorities, providing advanced tools to incorporate stablecoins into real-time monetary management, with AI-driven automated management of exchange rates, interest rates, and other monetary policy instruments.",
  },
  {
    title: "Competitive Moat",
    desc: "Multiple revolutionary technology innovations and over a dozen patents worldwide give Remi a strong competitive moat.",
  },
];

const COLLAPSED_HEIGHT = 280;
const DESC_SHORT_MAX = 170; // chars

export function WhyRemi() {
  const [expanded, setExpanded] = React.useState(-1);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = React.useRef<HTMLElement | null>(null);

  // Truncate descriptions for the collapsed state.
  const cards = React.useMemo(
    () =>
      whyCards.map((c) => {
        const isShowMore = c.desc.length > DESC_SHORT_MAX;
        return {
          ...c,
          descShort: isShowMore ? c.desc.slice(0, DESC_SHORT_MAX) + "..." : c.desc,
          isShowMore,
        };
      }),
    [],
  );

  const collapse = React.useCallback((index: number) => {
    const el = cardRefs.current[index];
    if (!el) return;
    el.style.height = `${COLLAPSED_HEIGHT}px`;
    setExpanded((prev) => (prev === index ? -1 : prev));
  }, []);

  const toggle = React.useCallback(
    (index: number) => {
      // Collapse the currently-expanded card first.
      if (expanded !== -1 && expanded !== index) {
        collapse(expanded);
      }
      if (expanded === index) {
        collapse(index);
        return;
      }
      // Expand.
      setExpanded(index);
      // Animate to full height on the next frame.
      requestAnimationFrame(() => {
        const el = cardRefs.current[index];
        if (!el) return;
        el.style.height = "auto";
        const target = el.scrollHeight;
        el.style.height = `${COLLAPSED_HEIGHT}px`;
        // Force reflow then transition.
        void el.offsetHeight;
        el.style.transition = "height 0.45s ease-out";
        el.style.height = `${target}px`;
      });
    },
    [expanded, collapse],
  );

  // Click outside to collapse.
  React.useEffect(() => {
    if (expanded === -1) return;
    const onDown = (e: MouseEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      const expandedEl = section.querySelector(".why-card-expanded");
      if (expandedEl && !expandedEl.contains(e.target as Node)) {
        collapse(expanded);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [expanded, collapse]);

  const renderCard = (card: (typeof cards)[number], globalIndex: number) => (
    <div
      key={globalIndex}
      className={cn(
        "relative w-full md:flex-1 md:max-w-[368px]",
        expanded === globalIndex ? "z-[5]" : "z-0",
      )}
      style={{ height: COLLAPSED_HEIGHT }}
    >
      <div
        ref={(el) => {
          cardRefs.current[globalIndex] = el;
        }}
        className={cn(
          "absolute left-0 top-0 flex w-full flex-col rounded bg-[#F7F5F3] p-3 md:p-4",
          expanded === globalIndex
            ? "why-card-expanded z-30 shadow-2xl shadow-[#F1E3DA]"
            : "z-10 hover:shadow-lg hover:shadow-[#F1E3DA]",
        )}
        style={{ height: COLLAPSED_HEIGHT, overflow: "hidden" }}
      >
        <div className="p-3 md:p-4">
          <h3 className="mb-3 h-[44px] flex-shrink-0 text-[18px] text-[#29221D]">{card.title}</h3>
          <div className={expanded === globalIndex ? "flex-1 min-h-0" : "h-[110px] overflow-hidden"}>
            <p className="text-[16px] leading-relaxed text-[#86909C]">
              {expanded === globalIndex ? card.desc : card.descShort}
            </p>
          </div>
        </div>
        {card.isShowMore && (
          <button
            type="button"
            onClick={() => toggle(globalIndex)}
            className="mx-3 mb-4 flex flex-shrink-0 items-center gap-1 px-3 text-[13px] font-semibold text-[#ff7a1a] md:mx-4 md:text-[16px]"
          >
            <span>{expanded === globalIndex ? "Show less" : "Learn more"}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-[#FF6900] transition-transform duration-300",
                expanded === globalIndex && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      data-scroll="why"
      className="relative bg-white pb-[80px] pt-5 lg:pb-[133px] lg:pt-[100px]"
    >
      {/* Background image (canonical /images/* path, mix-blend-multiply like the legacy site) */}
      <img
        src={IMAGES.whyRemi.bg}
        alt="Why Remi background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center mix-blend-multiply"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="relative z-[1] mx-auto max-w-[1536px] px-6 lg:px-[123px]">
        <div className="text-left md:text-center">
          <h2 className="text-[32px] font-medium text-[#29221D]">Why Remi</h2>
          <p className="mx-auto py-3 text-[16px] text-[#86909C] lg:text-[18px]">
            Remi is answering the challenges of our time with leading solutions.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center gap-4 md:gap-6 lg:mt-12 lg:gap-[30px]">
          {/* Row 1: 3 cards */}
          <div className="flex w-full flex-col justify-center gap-4 md:flex-row md:gap-6 lg:gap-[30px]">
            {cards.slice(0, 3).map((c, i) => renderCard(c, i))}
          </div>
          {/* Row 2: 2 cards */}
          <div className="flex w-full flex-col justify-center gap-4 md:max-w-[66%] md:flex-row md:gap-6 lg:gap-[30px]">
            {cards.slice(3).map((c, i) => renderCard(c, i + 3))}
          </div>
        </div>
      </div>
    </section>
  );
}
