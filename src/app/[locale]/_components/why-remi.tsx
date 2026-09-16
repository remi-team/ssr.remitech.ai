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
    title: "Global E-Money Token(EMT) Network",
    desc: "Remi has established a regulated E-Money Token(EMT) network with active corridors across Vietnam, Philippines, Indonesia, Bangladesh, the UAE and key Latin American markets. More than 15 member institutions have been secured. Notably, in the United States, as a Singapore-based technology company — Remi leads BAFT’s working group on providing comment letter to OCC’s GENIUS Act.",
  },
  {
    title: "Regulated Digital Asset Trading Platform",
    desc: "Remi provides stablecoin FX trading with real-time quotes and deep liquidity, built on a regulated clearing infrastructure. Treasury solutions with T+0 settlement finality and automated reconciliation across the network.",
  },
  {
    title: "Regulatory Dashboard for AML",
    desc: "Remi provides a regulatory dashboard for anti-money laundering, equipping regulators with advanced tools to monitor real-time changes in digital asset transfers — enabling pre-event early warning, in-event inspection, post-event tracing, freezing, and data sharing — and has published a whitepaper mapping Remi’s capabilities to all 40 FATF anti-money laundering recommendations.",
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
          <h3 className="mb-3 h-[44px] flex-shrink-0 text-[18px] inter-light text-[#29221D]">{card.title}</h3>
          <div className={expanded === globalIndex ? "flex-1 min-h-0" : "h-[110px] overflow-hidden"}>
            <p className="text-[16px] inter-light leading-relaxed text-[#86909C]">
              {expanded === globalIndex ? card.desc : card.descShort}
            </p>
          </div>
        </div>
        {card.isShowMore && (
          <button
            type="button"
            onClick={() => toggle(globalIndex)}
            className="mx-3 mb-4 flex flex-shrink-0 items-center gap-1 px-3 text-[13px] inter-semibold text-[#ff7a1a] md:mx-4 md:text-[16px]"
          >
            <span className="inter-light">{expanded === globalIndex ? "Show less" : "Learn more"}</span>
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
        // Intrinsic 3072×1956; `object-cover` in an absolutely positioned layer
        // means the attributes only satisfy the aspect-ratio placeholder and
        // stop the decorative layer from being fetched as a 0×0 box
        // (2026-09-15 re-test, 技术SEO-6).
        width={3072}
        height={1956}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center mix-blend-multiply"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="relative z-[1] mx-auto max-w-[1536px] px-6 lg:px-[123px]">
        <div className="text-left md:text-center">
          <h2 className="text-[32px] inter-medium text-[#29221D]">Why Remi</h2>
          <p className="mx-auto py-3 text-[16px] inter-light text-[#86909C] lg:text-[18px]">
            Remi is answering the challenges of our time with leading solutions.
          </p>
          <div className="inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M20 5C19.2333 5 18.45 5.06667 17.6666 5.23333C13.0666 6.11667 9.39996 9.83333 8.53329 14.4333C7.73329 18.7833 9.33329 22.7833 12.2333 25.3667C12.95 26 13.3333 26.8833 13.3333 27.8167V31.6667C13.3333 33.5 14.8333 35 16.6666 35H17.1333C17.7166 36 18.7666 36.6667 20 36.6667C21.2333 36.6667 22.3 36 22.8666 35H23.3333C25.1666 35 26.6666 33.5 26.6666 31.6667V27.8167C26.6666 26.9 27.0333 26 27.7333 25.3833C30.15 23.25 31.6666 20.1333 31.6666 16.6667C31.6666 10.2167 26.45 5 20 5ZM20.8333 23.3333H19.1666V19.0167L16.1166 15.9833L17.3 14.8L20 17.5L22.7 14.8L23.8833 15.9833L20.8333 19.0333V23.3333ZM22.5 31.6667C22.4833 31.6667 22.4666 31.65 22.45 31.65V31.6667H17.55V31.65C17.5333 31.65 17.5166 31.6667 17.5 31.6667C17.0333 31.6667 16.6666 31.3 16.6666 30.8333C16.6666 30.3667 17.0333 30 17.5 30C17.5166 30 17.5333 30.0167 17.55 30.0167V30H22.45V30.0167C22.4666 30.0167 22.4833 30 22.5 30C22.9666 30 23.3333 30.3667 23.3333 30.8333C23.3333 31.3 22.9666 31.6667 22.5 31.6667ZM22.5 28.3333H17.5C17.0333 28.3333 16.6666 27.9667 16.6666 27.5C16.6666 27.0333 17.0333 26.6667 17.5 26.6667H22.5C22.9666 26.6667 23.3333 27.0333 23.3333 27.5C23.3333 27.9667 22.9666 28.3333 22.5 28.3333Z"
                fill="#4E5969"
              />
            </svg>
          </div>
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
