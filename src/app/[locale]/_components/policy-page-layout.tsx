import * as React from "react";

import { Cta } from "@/components/cta";

/**
 * PolicyPageLayout — shared shell for the Privacy Policy / Cookie Policy pages.
 * Migrated from the legacy Vue `privacyPolicy` / `cookiePolicy` views.
 */

export type PolicyBlock =
  | { type: "p"; node: React.ReactNode }
  | { type: "ul"; items: React.ReactNode[] }
  | { type: "h3"; text: string };

export interface PolicySection {
  heading: string;
  blocks: PolicyBlock[];
}

export function PolicyPageLayout({
  title,
  updated,
  intro,
  sections,
  ctaTitle,
}: {
  title: string;
  updated: string;
  intro: React.ReactNode[];
  sections: PolicySection[];
  ctaTitle: string;
}) {
  return (
    <div className="overflow-hidden bg-[#f2efec] text-[#2c2520]">
      {/* Content */}
      <section className="mx-auto max-w-[1200px] bg-[#f2efec] px-[24px] pt-[72px] py-[48px] sm:py-[56px] md:py-[64px] lg:px-0 lg:py-[80px] xl:py-[96px]">
        <div className="text-left md:text-center">
          <h1 className="mb-[8px] text-[32px] font-medium uppercase leading-[1.08] tracking-[-0.03em] text-[#2d2722] sm:text-[36px] md:text-[42px] lg:text-[48px]">
            {title}
          </h1>
          <p className="mb-[32px] text-[15px] font-light leading-[1.8] text-[#86909C]">
            {updated}
          </p>
        </div>
        <div className="py-[32px]">
          {intro.map((node, i) => (
            <p
              key={i}
              className="mb-[16px] text-[15px] font-light leading-[1.8] text-[#86909C] last:mb-[32px]"
            >
              {node}
            </p>
          ))}

          {sections.map((section) => (
            <React.Fragment key={section.heading}>
              <h2 className="mb-4 mt-2 text-[20px] font-medium text-[#2d2722]">
                {section.heading}
              </h2>
              {section.blocks.map((block, i) => {
                const last = i === section.blocks.length - 1;
                if (block.type === "p") {
                  return (
                    <p
                      key={i}
                      className={`text-[15px] font-light leading-[1.8] text-[#86909C] ${
                        last ? "mb-[32px]" : "mb-[16px]"
                      }`}
                    >
                      {block.node}
                    </p>
                  );
                }
                if (block.type === "ul") {
                  return (
                    <ul
                      key={i}
                      className={`ml-6 list-disc text-[15px] font-light leading-[1.8] text-[#86909C] ${
                        last ? "mb-[32px]" : "mb-4"
                      }`}
                    >
                      {block.items.map((item, j) => (
                        <li key={j} className="mb-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <h3 key={i} className="mb-3 mt-5 text-[17px] font-medium text-[#2d2722]">
                    {block.text}
                  </h3>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Cta>
        <h2 className="mx-auto mb-[36px] max-w-[860px] text-[24px] font-light leading-[1.3] text-white md:text-[28px] lg:text-[32px]">
          {ctaTitle}
        </h2>
      </Cta>
    </div>
  );
}
