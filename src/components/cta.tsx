import * as React from "react";
import { cn } from "@/lib/utils";
import { AppLink } from "@/components/layout/app-link";

/**
 * Cta — shared call-to-action component.
 *
 * Migrated from the legacy Vue `cta.vue`. Renders a section with a
 * customizable background wrapper and inner panel, title, optional
 * description, and a call-to-action button.
 *
 * Usage:
 *   <Cta title="Ready to start?" description="Join the network." />
 *   <Cta
 *     wrapperBg="bg-[#f2efec]"
 *     innerBg="bg-[#FF8733]"
 *   >
 *     <h2>Custom slot content</h2>
 *   </Cta>
 */

export interface CtaProps {
  /** Wrapper section background class. Default: "bg-[#F7F5F3]" */
  wrapperBg?: string;
  /** Inner panel background class. Default: "bg-[#FF8733]" */
  innerBg?: string;
  /** H2 title (ignored when children are provided). */
  title?: string;
  /** Optional description paragraph below the title. */
  description?: string;
  /** Button label. Default: "Contact Us" */
  btnText?: string;
  /** Button href. Default: "/contactUs" */
  btnHref?: string;
  /** Optional className for the wrapper section. */
  className?: string;
  /** Anchor target on the wrapper (e.g. "contact" for /#contact nav links). */
  id?: string;
  /** Accessible-name reference for the wrapper section. */
  "aria-labelledby"?: string;
  /** Slot: when provided, replaces title + description. */
  children?: React.ReactNode;
}

export function Cta({
  wrapperBg = "bg-[#F7F5F3]",
  innerBg = "bg-[#FF8733]",
  title,
  description,
  btnText = "Contact Us",
  btnHref = "/contactUs",
  className,
  id,
  "aria-labelledby": ariaLabelledBy,
  children,
}: CtaProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      data-scroll="cta"
      className={cn("px-[24px] py-[68px] lg:px-0", wrapperBg, className)}
    >
      <div
        className={cn(
          "mx-auto rounded-[8px] px-[24px] py-[55px] text-center lg:max-w-[1280px] lg:py-[80px] xl:py-[100px]",
          innerBg,
        )}
      >
        {children ?? (
          <>
            {title && (
              <h2 className="mx-auto mb-[36px] max-w-[860px] text-[24px] inter-light leading-[1.3] text-white md:text-[28px] lg:text-[32px]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mx-auto mb-[36px] max-w-[860px] text-[16px] inter-light text-white">
                {description}
              </p>
            )}
          </>
        )}

        <AppLink
          href={btnHref}
          className="inline-block rounded-[4px] border border-white px-[36px] py-[14px] text-[16px] inter-light text-white transition-colors duration-300 hover:bg-white hover:text-[#2d2722]"
        >
          {btnText}
        </AppLink>
      </div>
    </section>
  );
}
