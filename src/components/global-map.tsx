"use client";

import * as React from "react";

// ── Region data (migrated from Vue mapRegions, coordinates unchanged) ──

interface MapRegion {
  slug: string;
  name: string;
  flag: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
}

function buildRegions(isMobile: boolean): MapRegion[] {
  return [
    { slug: "portugal", name: "Portugal", flag: "pt", x: 44.5, y: 34, labelX: 43.8, labelY: 32.5 },
    { slug: "united-kingdom", name: "United Kingdom", flag: "gb", x: 50.5, y: 21, labelX: isMobile ? 45 : 40.8, labelY: 22.5 },
    { slug: "united-states", name: "United States", flag: "us", x: 17, y: 40, labelX: isMobile ? 14 : 12, labelY: 35 },
    { slug: "brazil", name: "Brazil", flag: "br", x: 37.8, y: 52.2, labelX: isMobile ? 27.5 : 26.6, labelY: 68.2 },
    { slug: "uae-dubai", name: "UAE (Dubai)", flag: "ae", x: 54.3, y: 43.5, labelX: 59.5, labelY: 43.7 },
    { slug: "vietnam", name: "Vietnam", flag: "vn", x: 68.2, y: 36.3, labelX: 76.8, labelY: 51.6 },
    { slug: "hong-kong", name: "Hong Kong", flag: "hk", x: 74.8, y: 43, labelX: 75.8, labelY: 46.2 },
    { slug: "philippines", name: "Philippines", flag: "ph", x: 82.8, y: 52.2, labelX: 83.3, labelY: 56 },
    { slug: "bangladesh", name: "Bangladesh", flag: "bd", x: 63.8, y: 57, labelX: 69.7, labelY: 46.7 },
    { slug: "indonesia", name: "Indonesia", flag: "id", x: 72.8, y: 65, labelX: 77.5, labelY: 61.8 },
  ];
}

// ── SVG helper ──

function getCenterFromPath(path: SVGPathElement) {
  try {
    const box = path.getBBox();
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  } catch {
    return null;
  }
}

// ── Props (matching Vue component API) ──

export interface GlobalMapProps {
  mapRenderDuration?: number;
  regionStaggerDelay?: number;
  delay?: number;
  autoPlay?: boolean;
  triggerOnVisible?: boolean;
}

/**
 * GlobalMap — full migration of the legacy Vue `GlobalMap.vue`.
 *
 * Renders an SVG hex world map loaded from `/images/global_map_mini.svg`
 * with progressive reveal animations and animated country labels identical
 * to the original component.
 */
export function GlobalMap({
  mapRenderDuration = 2200,
  regionStaggerDelay = 320,
  delay = 0,
  autoPlay = true,
  triggerOnVisible = true,
}: GlobalMapProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const svgContainer = React.useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = React.useState<"idle" | "map-rendering" | "regions-lighting" | "all-complete">("idle");
  const [visibleRegions, setVisibleRegions] = React.useState<string[]>([]);
  const [isMobile, setIsMobile] = React.useState(false);

  // Refs to hold timers across renders
  const phaseTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const regionTimers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const observer = React.useRef<IntersectionObserver | null>(null);

  const regions = React.useMemo(() => buildRegions(isMobile), [isMobile]);

  // ── Device detection ──
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Decorate loaded SVG paths ──
  const decorateSvgPaths = React.useCallback(() => {
    const svgEl = svgContainer.current?.querySelector("svg");
    if (!svgEl) return;

    svgEl.removeAttribute("width");
    svgEl.removeAttribute("height");
    svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");

    const viewBox = svgEl.viewBox.baseVal;
    const width = viewBox?.width || 887;
    const height = viewBox?.height || 507;

    // Default hexes (gray #CCC5C0) — progressive left-to-right wave
    const defaultPaths = Array.from(svgEl.querySelectorAll<SVGPathElement>('path[fill="#CCC5C0"]'));
    defaultPaths.forEach((path, index) => {
      const center = getCenterFromPath(path);
      if (!center) return;
      const progressX = center.x / width;
      const progressY = (center.y / height) * 0.15;
      const baseDelay = (progressX + progressY) * mapRenderDuration;
      const jitter = ((index * 23) % 80) - 40;
      const finalDelay = Math.max(0, baseDelay + jitter);
      path.classList.add("map-hex", "map-hex--default");
      path.style.setProperty("--hex-delay", `${finalDelay}ms`);
      path.style.setProperty("--hex-dur", `${Math.min(680, 400 + finalDelay * 0.08)}ms`);
    });

    // Region hexes (orange #FF964D / deep orange #FF6900)
    const regionPaths = Array.from(svgEl.querySelectorAll<SVGPathElement>('path[fill="#FF964D"], path[fill="#FF6900"]'));
    regionPaths.forEach((path) => {
      const center = getCenterFromPath(path);
      if (!center) return;

      let closestRegion: MapRegion | null = null;
      let closestDist = Infinity;
      regions.forEach((region) => {
        const rx = (region.x / 100) * width;
        const ry = (region.y / 100) * height;
        const dist = Math.hypot(center.x - rx, center.y - ry);
        if (dist < closestDist) {
          closestDist = dist;
          closestRegion = region;
        }
      });

      const fill = path.getAttribute("fill");
      path.dataset.originalFill = fill ?? undefined;
      path.classList.add("map-hex", "map-hex--region");
      if (fill === "#FF6900") path.classList.add("map-hex--region-deep");
      if (closestRegion) path.classList.add(`map-hex--${closestRegion.slug}`);

      const regionIndex = closestRegion ? regions.indexOf(closestRegion) : 0;
      const regionBaseDelay = mapRenderDuration + 400 + regionIndex * regionStaggerDelay;
      path.style.setProperty("--region-delay", `${regionBaseDelay}ms`);
    });
  }, [mapRenderDuration, regionStaggerDelay, regions]);

  // ── Load SVG ──
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/images/global_map_mini.svg");
        const svgText = await res.text();
        if (cancelled || !svgContainer.current) return;
        svgContainer.current.innerHTML = svgText;
        // Wait for the SVG to be in the DOM
        requestAnimationFrame(() => {
          if (!cancelled) decorateSvgPaths();
        });
      } catch (e) {
        console.error("Failed to load global_map_mini.svg:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [decorateSvgPaths]);

  // ── Cleanup timers ──
  const clearRegionTimers = React.useCallback(() => {
    regionTimers.current.forEach((t) => clearTimeout(t));
    regionTimers.current = [];
  }, []);

  // ── Start animation ──
  const startAnimation = React.useCallback(() => {
    if (phase !== "idle") return;
    setPhase("map-rendering");

    phaseTimer.current = setTimeout(() => {
      setPhase("regions-lighting");
      // Light regions sequentially
      clearRegionTimers();
      setVisibleRegions([]);

      regions.forEach((region, index) => {
        const timer = setTimeout(() => {
          setVisibleRegions((prev) => [...prev, region.slug]);
          // Add lit class to matching hexes
          const svgEl = svgContainer.current?.querySelector("svg");
          if (svgEl) {
            svgEl.querySelectorAll(`.map-hex--${region.slug}`).forEach((p) => p.classList.add("map-hex--lit"));
          }
        }, index * regionStaggerDelay);
        regionTimers.current.push(timer);
      });

      const completeTimer = setTimeout(() => {
        setPhase("all-complete");
      }, regions.length * regionStaggerDelay + 600);
      regionTimers.current.push(completeTimer);
    }, delay + mapRenderDuration + 400);
  }, [phase, delay, mapRenderDuration, regionStaggerDelay, regions, clearRegionTimers]);

  // ── IntersectionObserver ──
  React.useEffect(() => {
    if (!triggerOnVisible || !rootRef.current) return;
    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && autoPlay && phase === "idle") {
          startAnimation();
          observer.current?.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.current.observe(rootRef.current);
    return () => observer.current?.disconnect();
  }, [triggerOnVisible, autoPlay, phase, startAnimation]);

  // ── Auto-play without observer ──
  React.useEffect(() => {
    if (autoPlay && !triggerOnVisible && phase === "idle") {
      startAnimation();
    }
  }, [autoPlay, triggerOnVisible, phase, startAnimation]);

  // ── Cleanup ──
  React.useEffect(() => {
    return () => {
      if (phaseTimer.current) clearTimeout(phaseTimer.current);
      clearRegionTimers();
      observer.current?.disconnect();
    };
  }, [clearRegionTimers]);

  // ── Flag emoji mapping ──
  const flagEmoji: Record<string, string> = {
    pt: "🇵🇹", gb: "🇬🇧", us: "🇺🇸", br: "🇧🇷", ae: "🇦🇪",
    vn: "🇻🇳", hk: "🇭🇰", ph: "🇵🇭", bd: "🇧🇩", id: "🇮🇩",
  };

  return (
    <div ref={rootRef} className="gf w-full max-w-[980px] mx-auto text-center text-[#29221d]">
      <div className="gf__map relative mx-auto mt-[clamp(26px,4vw,38px)] aspect-[887/507] w-[min(100%,760px)] overflow-visible isolate max-md:w-[min(100%,680px)] max-md:mt-6 max-[520px]:w-[118%] max-[520px]:-ml-[9%]">
        {/* SVG container */}
        <div
          ref={svgContainer}
          className={`gf__svg z-[1] transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            phase !== "idle"
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-3 scale-[0.98]"
          }`}
          aria-hidden="true"
        />

        {/* Shared gradient (same as Vue version) */}
        <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
          <defs>
            <linearGradient id="gf-bubble-grad" x1="0" y1="0.5" x2="1" y2="0.5">
              <stop offset="0%" stopColor="rgb(235,221,207)" stopOpacity="0.92" />
              <stop offset="100%" stopColor="rgb(197,174,154)" stopOpacity="0.78" />
            </linearGradient>
          </defs>
        </svg>

        {/* Labels */}
        <div className="gf__labels pointer-events-none z-[2]">
          {regions.map((region) => (
            <div
              key={region.slug}
              className={`gf__label ${
                visibleRegions.includes(region.slug) ? "gf__label--visible" : ""
              }`}
              style={{ left: `${region.labelX}%`, top: `${region.labelY}%` }}
            >
              <svg className="gf__bubble" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M3,0.5 H97 Q99.5,0.5 99.5,3 V25 Q99.5,27.5 97,27.5 H56 L50,35.5 L44,27.5 H3 Q0.5,27.5 0.5,25 V3 Q0.5,0.5 3,0.5 Z"
                  fill="url(#gf-bubble-grad)"
                  stroke="rgba(175,147,126,0.28)"
                  strokeWidth="0.6"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="gf__flag">{flagEmoji[region.flag]}</span>
              <span className="gf__name">{region.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inline styles: keyframes + Vue-scoped CSS ported to plain selectors */}
      <style>{`
        .gf__svg svg {
          width: 100%; height: 100%; display: block; overflow: visible;
        }
        .gf__svg .map-hex { opacity: 0; transition: none; will-change: opacity, fill, filter; }
        .gf__svg:not([class*="opacity-0"]) .map-hex--default {
          animation: hexWake var(--hex-dur, 500ms) cubic-bezier(0.22,1,0.36,1) var(--hex-delay,0ms) both;
        }
        .gf__svg:not([class*="opacity-0"]) .map-hex--region {
          animation: regionWake 600ms cubic-bezier(0.22,1,0.36,1) var(--region-delay,0ms) both;
        }
        .gf__svg .map-hex--region.map-hex--lit {
          opacity: 1;
          animation: regionBreath 2600ms ease-in-out 480ms infinite;
        }
        .gf__svg .map-hex--region-deep.map-hex--lit {
          opacity: 1;
          filter: drop-shadow(0 0 8px rgba(255,105,0,0.7));
        }
        .gf__label {
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          min-height: clamp(16px,2vw,22px);
          padding: 3px 9px 3px 5px;
          color: #29221d;
          font-size: clamp(8px,1.15vw,10px);
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
          filter: drop-shadow(0 8px 14px rgba(63,45,35,0.18)) drop-shadow(0 2px 6px rgba(255,105,0,0.08));
          opacity: 0;
          transform: translate(-12%,-50%) translateY(8px) scale(0.94);
          transition: opacity 420ms cubic-bezier(0.22,1,0.36,1), transform 420ms cubic-bezier(0.22,1,0.36,1);
        }
        .gf__label--visible {
          opacity: 1;
          transform: translate(-12%,-50%) translateY(0) scale(1);
        }
        .gf__bubble {
          position: absolute;
          inset: 0;
          width: 100%;
          height: calc(100% + 7px);
          z-index: 0;
          pointer-events: none;
          overflow: visible;
        }
        .gf__flag, .gf__name { position: relative; z-index: 1; }
        .gf__flag {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(10px,1.7vw,14px);
          line-height: 1;
        }
        .gf__name { transform: translateY(0.5px); }

        @keyframes hexWake {
          0% { opacity:0; fill:#e8e2dc; filter:brightness(1.05); }
          40% { opacity:0.75; filter:brightness(1.15) drop-shadow(0 0 1px rgba(204,197,192,0.4)); }
          100% { opacity:1; fill:#ccc5c0; filter:none; }
        }
        @keyframes regionWake {
          0% { opacity:0; filter:brightness(0.3); }
          35% { opacity:1; filter:brightness(2.2) drop-shadow(0 0 6px rgba(255,150,50,0.8)); }
          100% { opacity:1; filter:drop-shadow(0 0 2px rgba(255,105,0,0.25)); }
        }
        @keyframes regionBreath {
          0%,100% { opacity:1; fill:#ff964d; filter:drop-shadow(0 0 3px rgba(255,105,0,0.32)); }
          50% { opacity:1; fill:#ff6900; filter:brightness(1.16) drop-shadow(0 0 8px rgba(255,105,0,0.66)); }
        }

        @media (max-width:768px) {
          .gf__label {
            padding: 2px 6px 2px 4px;
            transform: translate(-20%,-50%) translateY(6px) scale(0.9);
          }
          .gf__label--visible {
            transform: translate(-20%,-50%) translateY(0) scale(1);
          }
        }
        @media (max-width:520px) {
          .gf__name { display: none; }
          .gf__label { padding: 2px; }
        }
      `}</style>
    </div>
  );
}
