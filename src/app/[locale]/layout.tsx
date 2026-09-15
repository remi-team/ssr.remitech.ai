import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import "../globals.css";

import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GlobalModals } from "@/components/modals/global-modals";
import { CookieConsent } from "@/components/cookie-consent";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as LegacyToaster } from "@/components/ui/toaster";

// ── Inter font (self-hosted, independent font-family per weight) ─────────
//
// Aligns with the legacy Vue site's strategy: each weight is an independent
// font-family (Inter_Bold, Inter_Light, …) whose @font-face declares
// font-weight: normal. The visual weight is baked into the font file itself,
// so the browser never applies synthetic bolding/lightening.
//
// Each weight gets its own CSS variable (--font-inter-*) so the .inter-*
// classes in globals.css set font-family directly (never font-weight).
//
// Other settings:
//  • preload:false — avoids pushing ~600 KB into the critical path; each
//    weight loads on demand via its @font-face rule (display:swap).
//  • No adjustFontFallback — the legacy site uses plain @font-face rules
//    without size-adjust / ascent-override metric overrides; keeping the
//    SSR version identical avoids metric-induced visual drift.
//  • CJK falls back to system fonts (PingFang / Hiragino / Microsoft YaHei).

const interLight = localFont({
  src: "../../../public/fonts/Inter-Light.woff2",
  variable: "--font-inter-light",
  display: "swap",
  preload: false,
  fallback: [
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "Noto Sans CJK SC",
    "system-ui",
    "sans-serif",
  ],
});

const interRegular = localFont({
  src: "../../../public/fonts/Inter-Regular.woff2",
  variable: "--font-inter-regular",
  display: "swap",
  preload: false,
  fallback: [
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "Noto Sans CJK SC",
    "system-ui",
    "sans-serif",
  ],
});

const interMedium = localFont({
  src: "../../../public/fonts/Inter-Medium.woff2",
  variable: "--font-inter-medium",
  display: "swap",
  preload: false,
  fallback: [
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "Noto Sans CJK SC",
    "system-ui",
    "sans-serif",
  ],
});

const interSemiBold = localFont({
  src: "../../../public/fonts/Inter-SemiBold.woff2",
  variable: "--font-inter-semibold",
  display: "swap",
  preload: false,
  fallback: [
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "Noto Sans CJK SC",
    "system-ui",
    "sans-serif",
  ],
});

const interBold = localFont({
  src: "../../../public/fonts/Inter-Bold.woff2",
  variable: "--font-inter-bold",
  display: "swap",
  preload: false,
  fallback: [
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "Noto Sans CJK SC",
    "system-ui",
    "sans-serif",
  ],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Prerender every *routed* locale. Locales that exist in `messages/` but are
 * disabled in `routing.locales` must NOT be emitted — the page body 404s them
 * (see `LocaleLayout`), so prerendering would bake out error pages.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale);
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Hard guard: only *routed* locales render. Anything else is a real 404.
  //
  // This is what stops paths carrying a dot — `/sitemap.xml.gz`, `/foo.png`,
  // `/icon.svg` — from matching the `[locale]` segment (a dynamic segment
  // accepts any non-`/` character, dots included) and silently serving the home
  // page with HTTP 200. The locale middleware excludes such paths from its
  // matcher, so the layout is the last line of defence (QA BUG-05).
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for the active locale.
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Brand favicon — same asset as the legacy site's index.html. */}
        <link rel="icon" type="image/png" href="/images/logo-icon.png" />
        {/* Font preloads removed — localFont with preload:false + display:swap
            handles loading via @font-face rules. Manual <link rel=preload> caused
            duplicate requests (QA: 2026-09-04). */}
      </head>
      <body
        className={`${interLight.variable} ${interRegular.variable} ${interMedium.variable} ${interSemiBold.variable} ${interBold.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* Entity structured data — Organization + WebSite on every route
            (QA BUG-02). Rendered as a plain server `<script>` so it survives
            into the raw HTML; `next/script` never does. Per-page
            BreadcrumbList / Service / NewsArticle blocks are emitted by the
            pages themselves. */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            forcedTheme="light"
            enableColorScheme={false}
            disableTransitionOnChange
          >
            <QueryProvider>
              {/* Root flex column → guarantees sticky-to-bottom footer. */}
              <div className="flex min-h-screen flex-col">
                {/* Keyboard skip link — first focusable element on every route
                    (QA BUG-13: 83 focusable nodes used to precede `<main>` on
                    /news). Visible only while focused. */}
                <a href="#main-content" className="skip-link">
                  Skip to main content
                </a>
                {/* `overlay` enables the frosted-dark transparent header
                    on pages whose hero sits underneath it (e.g. home). */}
                <SiteHeader overlay />
                <main id="main-content" className="flex-1" tabIndex={-1}>
                  {children}
                </main>
                <SiteFooter />
              </div>
              {/* Global auth modals (login/register/forgot/callback) —
                  renders the PC or Mobile variant based on viewport. */}
              <GlobalModals />
              {/* Cookie consent banner (legacy `CookieConsent.vue` parity). */}
              <CookieConsent />
              <Toaster richColors closeButton />
              <LegacyToaster />
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
