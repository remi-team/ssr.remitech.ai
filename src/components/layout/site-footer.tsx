import * as React from "react";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { footerNav } from "@/config/navigation";
import { Logo } from "@/components/layout/logo";
import { Link } from "@/i18n/navigation";
import { AppLink } from "@/components/layout/app-link";

/**
 * Site footer — migrated from the legacy Vue `footer.vue`.
 *
 * Layout preserved:
 *  • Desktop (md+): 3-column grid — brand+tagline+socials | Navigation | Contact Us
 *  • Mobile: single column — Contact Us + socials
 *  • Bottom copyright bar
 *
 * Server Component: no interactivity, fully cacheable, great for SEO.
 * The social icons are the legacy PNG wordmarks (see `SocialLinks` below for
 * the exact box the Vue build renders).
 */
export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-[1536px] px-[24px] lg:px-[123px]">
        {/* Desktop: three-column grid */}
        <div className="hidden grid-cols-[1fr_auto_auto] gap-[80px] pb-[60px] pt-[80px] md:grid">
          {/* Brand + tagline + socials */}
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col items-start gap-[30px]">
              <Logo variant="dark" />
              <p className="inter-light max-w-[280px] text-[15px] leading-[1.6] text-[#6B7280]">
                {t("Footer.tagline")}
              </p>
            </div>
            <SocialLinks />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-[16px]" aria-label="Site navigation">
            {/*
              Column headings are `h2`, not `h3`: on /contactUs the footer is the
              first headed section after the page `h1`, so an `h3` here skipped a
              level (QA BUG-14 residual, 2026-09-16 sweep). Heading level is a
              document-outline concern — the visual size comes from the utilities
              below, which are unchanged.
            */}
            <h2 className="inter-light border-b border-[#E5E7EB] pb-[12px] text-[18px] font-[500] text-[#4E5969]">
              {t("Footer.col.navigation")}
            </h2>
            {footerNav[0].links.map((link) => (
              <AppLink
                key={link.labelKey}
                href={link.href}
                className="inter-light text-[15px] text-[#6B7280] no-underline transition-colors duration-200 hover:text-[#FF6900]"
              >
                {t(link.labelKey as never)}
              </AppLink>
            ))}
          </nav>

          {/* Contact Us */}
          <div className="flex flex-col gap-[16px]">
            <h2 className="inter-light border-b border-[#E5E7EB] pb-[12px] text-[18px] font-[500] text-[#4E5969]">
              {t("Footer.col.contact")}
            </h2>
            {siteConfig.contacts.map((contact) => (
              <a
                key={contact.email}
                href={`mailto:${contact.email}`}
                className="inter-light flex w-fit items-start gap-[12px] text-[15px] no-underline transition-colors duration-200 hover:text-[#FF6900]"
              >
                <svg
                  className="h-[18px] w-[18px] flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="flex flex-col gap-[8px]">
                  <span className="inter-light text-[15px] font-[500] text-[#4E5969]">
                    {t(contact.titleKey as never)}
                  </span>
                  <span className="inter-light text-[#6B7280]">{contact.email}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile: single column */}
        <div className="flex flex-col gap-[32px] pb-[32px] pt-[40px] md:hidden">
          <div className="flex flex-col gap-[16px]">
            <Logo variant="dark" />
            <p className="inter-light max-w-[280px] text-[15px] leading-[1.6] text-[#6B7280]">
              {t("Footer.tagline")}
            </p>
            <h2 className="inter-light border-b border-[#E5E7EB] pb-[12px] text-[16px] font-[500] text-[#4E5969]">
              {t("Footer.col.contact")}
            </h2>
            {siteConfig.contacts.map((contact) => (
              <a
                key={contact.email}
                href={`mailto:${contact.email}`}
                className="inter-light flex w-fit items-start gap-[12px] text-[14px] no-underline text-[#6B7280]"
              >
                <svg
                  className="h-[18px] w-[18px] flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="flex flex-col gap-[4px]">
                  <span className="inter-light text-[14px] font-[500] text-[#4E5969]">
                    {t(contact.titleKey as never)}
                  </span>
                  <span className="inter-light text-[#6B7280]">{contact.email}</span>
                </div>
              </a>
            ))}
            <div className="mt-[8px]">
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-[#E5E7EB]">
        <div className="mx-auto flex max-w-[1536px] flex-col items-center gap-[8px] px-[24px] py-[20px] text-center lg:px-[123px] lg:py-[24px]">
          {/* Legal links — legacy footer.vue parity. */}
          <div className="flex items-center gap-[16px]">
            <Link
              href="/privacy-policy"
              className="inter-light text-[12px] font-[400] tracking-[0.02em] text-[#9CA3AF] transition-colors hover:text-[#FF6900] md:text-[13px]"
            >
              {t("Footer.privacy")}
            </Link>
            <span className="text-[12px] text-[#9CA3AF] md:text-[13px]">|</span>
            <Link
              href="/cookie-policy"
              className="inter-light text-[12px] font-[400] tracking-[0.02em] text-[#9CA3AF] transition-colors hover:text-[#FF6900] md:text-[13px]"
            >
              {t("Footer.cookie")}
            </Link>
          </div>
          <p className="inter-light text-[12px] font-[400] tracking-[0.02em] text-[#9CA3AF] md:text-[13px]">
            {t("Footer.rights", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Social icon row — X (Twitter) + LinkedIn.
 *
 * Sized to the legacy `footer.vue` box, measured on the live Vue site at
 * 1920px: anchor `h-[30px] w-auto rounded-[6px] bg-white`, icon drawn at half
 * its intrinsic pixels — X 42×30, LinkedIn 80×30, 12px gap. The React port had
 * a 44×44 anchor with a 24px-tall icon, which shrank both marks and pushed the
 * row off the legacy baseline (2026-09-16 pixel diff).
 *
 * Height is pinned on the `<img>` (`h-[30px] w-auto`) rather than inherited via
 * `h-full w-full` like the legacy CSS: a percentage width inside an auto-width
 * flex container is a cyclic size that each engine resolves differently, while
 * `h-[30px] w-auto` derives the same 42/80px from the intrinsic ratio. The
 * `width`/`height` attributes stay at the PNG's natural pixels so the box is
 * reserved before load (no CLS).
 *
 * Legacy also carries `hover:border-[#FF6900]` on these anchors; with no
 * `border-width` utility it only sets a colour on a 0px border, so it paints
 * nothing — not ported.
 */
function SocialLinks() {
  return (
    <div className="flex items-center gap-[12px]">
      <a
        href={siteConfig.social.x}
        aria-label="X (Twitter)"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-[30px] w-auto items-center justify-center rounded-[6px] bg-white"
      >
        <img
          src="/images/icon-sns-X.png"
          alt="X (Twitter)"
          width={84}
          height={60}
          loading="lazy"
          decoding="async"
          className="h-[30px] w-auto object-contain"
        />
      </a>
      <a
        href={siteConfig.social.linkedin}
        aria-label="LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-[30px] w-auto items-center justify-center rounded-[6px] bg-white"
      >
        <img
          src="/images/icon-sns-LinkedIn.png"
          alt="LinkedIn"
          width={160}
          height={60}
          loading="lazy"
          decoding="async"
          className="h-[30px] w-auto object-contain"
        />
      </a>
    </div>
  );
}
