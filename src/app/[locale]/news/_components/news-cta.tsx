import * as React from "react";
import { Cta } from "@/components/cta";

/**
 * NewsCta — final call-to-action for the News page.
 * Copy: "Want to meet us at an upcoming event?"
 */
export function NewsCta() {
  return (
    <Cta>
      <h2 className="mx-auto mb-[36px] max-w-[860px] text-[24px] leading-[1.3] text-white md:text-[28px] lg:text-[32px]">
        Want to meet us at an upcoming event?
      </h2>
    </Cta>
  );
}
