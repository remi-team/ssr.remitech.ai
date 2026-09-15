"use client";

import * as React from "react";
import { M3u8Player } from "@/components/player/m3u8-player";
import type { M3u8PlayerHandle } from "@/components/player/types";

/**
 * Ecosystem video stream — same source as the legacy Vue homepage
 * (`videoSrc` in `views/home/index.vue`).
 */
const VIDEO_SRC = "https://s.remitech.ai/static/video/m3u8/xc/master.m3u8";

/**
 * EcosystemVideo — migrated from "See Our Ecosystem In Action".
 *
 * Uses the M3u8Player in banner mode (hideControls, muted) and auto-plays
 * when scrolled into view via IntersectionObserver (matching the legacy
 * `initVideoViewportObserver`). The player is always mounted — no
 * click-to-load poster — exactly like the original Vue version.
 */
export function EcosystemVideo() {
  const playerRef = React.useRef<M3u8PlayerHandle>(null);
  const wrapperRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!wrapperRef.current || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          const playPromise = playerRef.current?.play();
          if (playPromise && typeof (playPromise as Promise<void>).catch === "function") {
            (playPromise as Promise<void>).catch(() => {});
          }
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
      className="bg-white py-[48px] sm:py-[56px] md:py-[64px] lg:py-[80px] xl:py-[96px]"
    >
      <div className="mx-auto max-w-[1024px] px-[24px] sm:px-[32px] md:px-[48px] lg:px-[64px]">
        <div className="mb-[32px] text-center sm:mb-[40px] md:mb-[48px] lg:mb-[56px]">
          <h2 className="mx-auto mb-[12px] mt-[12px] text-left text-[32px] inter-medium text-[#29221D] lg:mt-[16px] 2xl:mt-6 md:text-center">
            See Our Ecosystem In Action
          </h2>
          <p className="mb-[24px] text-left inter-light text-[16px] text-[#86909C] md:text-[18px] md:text-center lg:mb-[36px]">
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
