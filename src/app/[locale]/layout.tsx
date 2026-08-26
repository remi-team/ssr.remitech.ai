import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import "../globals.css";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GlobalModals } from "@/components/modals/global-modals";
import { CookieConsent } from "@/components/cookie-consent";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as LegacyToaster } from "@/components/ui/toaster";

// ── Inter font (self-hosted) ──────────────────────────────────────────────
//
// Performance strategy per Next.js best practices:
//  1. All 5 weights declared in one `localFont` call → single font-family
//     stack so the browser can match any `font-weight: 300–700` correctly.
//  2. `preload: true` adds <link rel="preload"> for each .woff2 file.
//     Inter Latin woff2 files are typically 10–20 KB each. With HTTP/2
//     multiplexing across the same origin, all 5 preloads resolve in one
//     round-trip — the cost is ~75 KB total, comparable to a single JPEG.
//  3. `adjustFontFallback: "Arial"` tells Next.js to measure Arial metrics
//     at build time and inject `size-adjust` + `ascent-override` CSS so
//     fallback text occupies the same bounding box as Inter, eliminating
//     CLS during the swap period.
//  4. CJK runs on system fonts (PingFang / Hiragino / Microsoft YaHei);
//     Inter only covers Latin, keeping each file small.
//
// Further optimisation (manual step):
//  • Subset to Latin-only with fonttools `pyftsubset` if the current
//    .woff2 files include unused ranges (Greek, Cyrillic, Vietnamese).

const inter = localFont({
  src: [
    {
      path: "../../../public/fonts/Inter-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
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

/** Statically render both supported locales for best performance. */
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

  // Guard: unsupported locales fall back to the default locale's home.
  // (The middleware normally prevents this, but we stay defensive.)
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;

  // Enable static rendering for the active locale.
  setRequestLocale(validLocale);

  const messages = await getMessages({ locale: validLocale });

  return (
    <html lang={validLocale} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Organization structured data — boosts rich-result eligibility. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: new URL("/icon.svg", siteConfig.url).toString(),
              sameAs: [siteConfig.social.x, siteConfig.social.linkedin],
              contactPoint: siteConfig.contacts.map((c) => ({
                "@type": "ContactPoint",
                contactType: "customer service",
                email: c.email,
              })),
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider locale={validLocale} messages={messages}>
          <ThemeProvider
            attribute="class"
            forcedTheme="light"
            enableColorScheme={false}
            disableTransitionOnChange
          >
            <QueryProvider>
              {/* Root flex column → guarantees sticky-to-bottom footer. */}
              <div className="flex min-h-screen flex-col">
                {/* `overlay` enables the frosted-dark transparent header
                    on pages whose hero sits underneath it (e.g. home). */}
                <SiteHeader overlay />
                <main className="flex-1">{children}</main>
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
