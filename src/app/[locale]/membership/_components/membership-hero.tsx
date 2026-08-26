"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

/**
 * MembershipHero — placeholder hero for the Membership page.
 *
 * TODO: Replace with fully migrated section.
 */
export function MembershipHero() {
  const t = useTranslations("Nav");

  return (
    <section className="relative isolate min-h-[320px] overflow-hidden bg-[#141110] pt-[140px] sm:pt-[155px] md:pt-[100px]">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6900]/15 blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1536px] px-6 pb-[60px] sm:px-8 lg:px-10 xl:px-12">
        <div className="max-w-[840px] pt-[42px] lg:pt-[56px]">
          <h1 className="text-[32px] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-[36px] md:text-[42px] lg:text-[48px]">
            {t("membership")}
          </h1>
          <p className="mt-6 max-w-[747px] text-[15px] leading-[1.6] text-white/72 sm:text-[16px] md:text-[18px]">
            {t("membership")}
          </p>
        </div>
      </div>
    </section>
  );
}
