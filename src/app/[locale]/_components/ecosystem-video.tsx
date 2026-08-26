"use client";

import * as React from "react";
import { M3u8Player, type M3u8PlayerHandle } from "@/components/player/m3u8-player";

/**
 * EcosystemVideo — migrated from "See Our Ecosystem In Action".
 *
 * Uses the M3u8Player in banner mode (hideControls, muted) and auto-plays
 * when scrolled into view via IntersectionObserver (matching the legacy
 * `initVideoViewportObserver`).
 */
const VIDEO_SRC = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export function EcosystemVideo() {
  const playerRef = React.useRef<M3u8PlayerHandle>(null);
  const wrapperRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!wrapperRef.current || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          playerRef.current?.play();
        } else {
          playerRef.current?.pause();
        }
      },
      { threshold: 0.35 },
    );
    obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={wrapperRef}
      data-scroll="ecosystem"
      className="bg-white py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24"
    >
      <div className="mx-auto max-w-[1024px] px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="mb-8 text-center sm:mb-10 md:mb-12 lg:mb-14">
          <h2 className="mb-3 mt-3 text-left text-[32px] font-medium text-[#29221D] md:mt-4 lg:mt-6 md:text-center">
            See Our Ecosystem In Action
          </h2>
          <p className="mb-6 text-left text-[16px] text-[#86909C] lg:mb-9 lg:text-[18px] md:text-center">
            "Rewrite the Game" — How REMI is orchestrating the future of digital finance.
          </p>
        </div>
        <div className="ecosystem-video-card relative overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <div className="ecosystem-video-shell h-[240px] bg-black sm:h-[320px] md:h-[450px] lg:h-[500px]">
            <M3u8Player
              ref={playerRef}
              src={VIDEO_SRC}
              muted
              hideControls
              autoplay={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
