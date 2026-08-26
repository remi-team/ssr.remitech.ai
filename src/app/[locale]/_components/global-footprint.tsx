"use client";

import * as React from "react";
import { GlobalMap } from "@/components/global-map";

/**
 * GlobalFootprint — wrapper section for the interactive world map.
 *
 * The map itself (GlobalMap) is a full migration of the legacy Vue
 * `GlobalMap.vue` component: progressive hex reveal, region stagger
 * animation, and country labels with flag icons.
 */
export function GlobalFootprint() {
  return (
    <section
      data-scroll="footprint"
      className="bg-[#FAFAFA] py-[60px] lg:py-[100px]"
    >
      <div className="mx-auto max-w-[1536px] px-6">
        <div className="text-left md:text-center">
          <h2 className="text-[32px] font-medium text-[#29221D]">
            Remi Global Footprint
          </h2>
          <p className="mx-auto py-3 text-[18px] text-[#86909C]">
            A Rapidly Expanding Network of Banks and Licensed Financial
            Institutions Worldwide
          </p>
        </div>

        <GlobalMap
          mapRenderDuration={500}
          delay={100}
          regionStaggerDelay={150}
        />
      </div>
    </section>
  );
}
