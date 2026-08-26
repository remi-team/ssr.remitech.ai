import * as React from "react";
import { Cta } from "@/components/cta";

/**
 * CtaSection — home page call-to-action, matching the old `<CTA>` usage.
 *
 * Old: `<CTA wrapperbgClass="bg-[#f2efec]">`
 *   <h2>The corridor you open today is the client <br /> relationship you own tomorrow.</h2>
 *   <p>30 minutes to walk through...</p>
 * </CTA>
 */
export function CtaSection() {
  return (
    <Cta wrapperBg="bg-[#f2efec]" id="contact" aria-labelledby="cta-title">
      <h2
        id="cta-title"
        className="mx-auto mb-[36px] max-w-[860px] text-[24px] leading-[1.3] text-white md:text-[28px] lg:text-[32px]"
      >
        The corridor you open today is the client{" "}
        <br className="hidden lg:flex" /> relationship you own tomorrow.
      </h2>
      <p className="mx-auto mb-[36px] max-w-[860px] text-[16px] text-white md:text-[18px]">
        30 minutes to walk through what emerging market access looks like for
        your institution — and what products open up from there.
      </p>
    </Cta>
  );
}
