import * as React from "react";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { footerNav } from "@/config/navigation";
import { Logo } from "@/components/layout/logo";
import { Link } from "@/i18n/navigation";

/**
 * Site footer — migrated from the legacy Vue `footer.vue`.
 *
 * Layout preserved:
 *  • Desktop (md+): 3-column grid — brand+tagline+socials | Navigation | Contact Us
 *  • Mobile: single column — Contact Us + socials
 *  • Bottom copyright bar
 *
 * Server Component: no interactivity, fully cacheable, great for SEO.
 * The social icons use inline SVG (X logo) + Lucide (LinkedIn) so we don't
 * need binary assets in /public.
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
              <p className="max-w-[280px] text-[15px] leading-[1.6] text-[#6B7280]">
                {t("Footer.tagline")}
              </p>
            </div>
            <SocialLinks />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-[16px]" aria-label="Site navigation">
            <h3 className="border-b border-[#E5E7EB] pb-[12px] text-[18px] font-[500] text-[#4E5969]">
              {t("Footer.col.navigation")}
            </h3>
            {footerNav[0].links.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                className="text-[15px] text-[#6B7280] no-underline transition-colors duration-200 hover:text-[#FF6900]"
              >
                {t(link.labelKey as never)}
              </a>
            ))}
          </nav>

          {/* Contact Us */}
          <div className="flex flex-col gap-[16px]">
            <h3 className="border-b border-[#E5E7EB] pb-[12px] text-[18px] font-[500] text-[#4E5969]">
              {t("Footer.col.contact")}
            </h3>
            {siteConfig.contacts.map((contact) => (
              <a
                key={contact.email}
                href={`mailto:${contact.email}`}
                className="flex w-fit items-start gap-[12px] text-[15px] no-underline transition-colors duration-200 hover:text-[#FF6900]"
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
                  <span className="text-[15px] font-[500] text-[#4E5969]">
                    {t(contact.titleKey as never)}
                  </span>
                  <span className="text-[#6B7280]">{contact.email}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile: single column */}
        <div className="flex flex-col gap-[32px] pb-[32px] pt-[40px] md:hidden">
          <div className="flex flex-col gap-[16px]">
            <Logo variant="dark" />
            <p className="max-w-[280px] text-[15px] leading-[1.6] text-[#6B7280]">
              {t("Footer.tagline")}
            </p>
            <h3 className="border-b border-[#E5E7EB] pb-[12px] text-[16px] font-[500] text-[#4E5969]">
              {t("Footer.col.contact")}
            </h3>
            {siteConfig.contacts.map((contact) => (
              <a
                key={contact.email}
                href={`mailto:${contact.email}`}
                className="flex w-fit items-start gap-[12px] text-[14px] no-underline text-[#6B7280]"
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
                  <span className="text-[14px] font-[500] text-[#4E5969]">
                    {t(contact.titleKey as never)}
                  </span>
                  <span className="text-[#6B7280]">{contact.email}</span>
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
              className="text-[12px] font-[400] tracking-[0.02em] text-[#9CA3AF] transition-colors hover:text-[#FF6900] md:text-[13px]"
            >
              {t("Footer.privacy")}
            </Link>
            <span className="text-[12px] text-[#9CA3AF] md:text-[13px]">|</span>
            <Link
              href="/cookie-policy"
              className="text-[12px] font-[400] tracking-[0.02em] text-[#9CA3AF] transition-colors hover:text-[#FF6900] md:text-[13px]"
            >
              {t("Footer.cookie")}
            </Link>
          </div>
          <p className="text-[12px] font-[400] tracking-[0.02em] text-[#9CA3AF] md:text-[13px]">
            {t("Footer.rights", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Social icon row — X (Twitter) + LinkedIn. */
function SocialLinks() {
  return (
    <div className="flex items-center gap-[12px]">
      <a
        href={siteConfig.social.x}
        aria-label="X (Twitter)"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-[30px] w-auto items-center justify-center"
      >
        <img
          src="/images/icon-sns-X.png"
          alt="X (Twitter)"
          className="h-[24px] w-auto object-contain"
        />
      </a>
      <a
        href={siteConfig.social.linkedin}
        aria-label="LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-[30px] w-auto items-center justify-center"
      >
        <img
          src="/images/icon-sns-LinkedIn.png"
          alt="LinkedIn"
          className="h-[24px] w-auto object-contain"
        />
      </a>
    </div>
  );
}
