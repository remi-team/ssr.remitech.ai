import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";

/**
 * Centralized SEO metadata factory.
 *
 * Every page gets its OWN canonical / hreflang / og:url (never the home
 * page's). Per-page titles & descriptions live in `PAGE_META` below — the
 * single source of truth consumed by each route's `generateMetadata`.
 *
 * Indexing policy: non-production deployments (`SITE_ENV` !== "production")
 * emit `noindex, nofollow` so staging/SIT domains are never crawled into
 * search results. Production CI/CD must inject `SITE_ENV=production`.
 */

/** Deployment stage — defaults to "sit" so an unset env can never be indexed. */
export const SITE_ENV = process.env.SITE_ENV ?? "sit";
export const isIndexable = SITE_ENV === "production";

type PageKey =
  | "home"
  | "about"
  | "membership"
  | "news"
  | "resources"
  | "compliance"
  | "contact"
  | "privacyPolicy"
  | "cookiePolicy"
  | "solutions"
  | "solutionsCrossBorder"
  | "solutionsFx"
  | "solutionsStablecoin"
  | "solutionsRegtech"
  | "solutionsCheque"
  | "solutionsLc"
  | "player";

interface PageMeta {
  /** Route path without locale prefix (home = "/"). */
  path: string;
  /** Whether crawlers should ever index this page (login-gated = false). */
  indexable: boolean;
  en: { title: string; description: string };
  zh: { title: string; description: string };
}

/** Titles intentionally carry the brand suffix ("… — Remi") once. */
export const PAGE_META: Record<PageKey, PageMeta> = {
  home: {
    path: "/",
    indexable: true,
    en: {
      title: "Remi — Regulated Stablecoin Infrastructure for Financial Institutions",
      description:
        "Remi provides regulated stablecoin infrastructure for financial institutions — orchestrating cross-border payment, FX & treasury, RegTech and tokenized trade finance.",
    },
    zh: {
      title: "Remi — 面向金融机构的受监管稳定币基础设施",
      description:
        "Remi 为金融机构提供受监管的稳定币基础设施，编排跨境支付、外汇与司库、监管科技与代币化贸易融资。",
    },
  },
  about: {
    path: "/about",
    indexable: true,
    en: {
      title: "About Us — Remi",
      description:
        "Remi is regulated stablecoin infrastructure built for financial institutions. Learn about our mission, values, and team.",
    },
    zh: {
      title: "关于我们 — Remi",
      description: "Remi 是面向金融机构的受监管稳定币基础设施。了解我们的使命、理念与团队。",
    },
  },
  membership: {
    path: "/membership",
    indexable: true,
    en: {
      title: "Membership — Remi",
      description:
        "Join the Remi network. Explore membership tiers, partner benefits and how institutions onboard onto regulated stablecoin rails.",
    },
    zh: {
      title: "会员计划 — Remi",
      description: "加入 Remi 网络。了解会员体系、合作伙伴权益，以及机构如何接入受监管的稳定币清算网络。",
    },
  },
  news: {
    path: "/news",
    indexable: true,
    en: {
      title: "News & Events — Remi",
      description:
        "Press releases, industry insights, and global events. Follow our journey as we build the regulated clearing infrastructure for digital finance.",
    },
    zh: {
      title: "新闻与活动 — Remi",
      description: "新闻稿、行业洞察与全球活动。跟随我们构建受监管的数字金融清算基础设施的旅程。",
    },
  },
  resources: {
    path: "/resources",
    indexable: true,
    en: {
      title: "Resource Center — Remi",
      description:
        "Whitepapers, compliance documentation, media kits and product guides for integrating with Remi's regulated stablecoin infrastructure.",
    },
    zh: {
      title: "资源中心 — Remi",
      description: "白皮书、合规文档、媒体资料包与产品指南，助您接入 Remi 受监管稳定币基础设施。",
    },
  },
  compliance: {
    path: "/compliance",
    indexable: true,
    en: {
      title: "Compliance — Remi",
      description:
        "Remi's regulatory posture: licensing, AML/CFT controls, audit reports and the governance behind our regulated stablecoin services.",
    },
    zh: {
      title: "合规 — Remi",
      description: "Remi 的监管框架：牌照、反洗钱与反恐融资管控、审计报告，以及受监管稳定币服务背后的治理体系。",
    },
  },
  contact: {
    path: "/contact",
    indexable: true,
    en: {
      title: "Contact Us — Remi",
      description:
        "Get in touch with Remi for partnership, integration and media enquiries. Our team responds within one business day.",
    },
    zh: {
      title: "联系我们 — Remi",
      description: "联系 Remi 咨询合作、集成与媒体事宜。我们的团队将在一个工作日内回复。",
    },
  },
  privacyPolicy: {
    path: "/privacy-policy",
    indexable: true,
    en: {
      title: "Privacy Policy — Remi",
      description: "How Remi collects, uses and protects personal data across our regulated financial services.",
    },
    zh: {
      title: "隐私政策 — Remi",
      description: "Remi 如何在受监管金融服务中收集、使用与保护个人数据。",
    },
  },
  cookiePolicy: {
    path: "/cookie-policy",
    indexable: true,
    en: {
      title: "Cookie Policy — Remi",
      description: "How Remi uses cookies and similar technologies, and how you can manage your preferences.",
    },
    zh: {
      title: "Cookie 政策 — Remi",
      description: "Remi 如何使用 Cookie 及同类技术，以及您如何管理偏好设置。",
    },
  },
  solutions: {
    path: "/solutions",
    indexable: true,
    en: {
      title: "Solutions — Remi",
      description:
        "From cross-border clearing to tokenized trade finance, Remi weaves settlement, compliance and treasury into every regulated transaction journey.",
    },
    zh: {
      title: "解决方案 — Remi",
      description: "从跨境清算到代币化贸易融资，Remi 将结算、合规与国库编织进每一条受监管的交易链路。",
    },
  },
  solutionsCrossBorder: {
    path: "/solutions/cross-border-payment",
    indexable: true,
    en: {
      title: "Cross-Border Payment — Remi",
      description:
        "Real-time cross-border payment and clearing on regulated stablecoin rails — faster settlement, lower cost, full compliance.",
    },
    zh: {
      title: "跨境支付 — Remi",
      description: "基于受监管稳定币的实时跨境支付与清算——更快结算、更低成本、全程合规。",
    },
  },
  solutionsFx: {
    path: "/solutions/fx",
    indexable: true,
    en: {
      title: "FX & Treasury — Remi",
      description:
        "Institutional FX and treasury services powered by regulated stablecoins: 7*24 conversion, transparent pricing, instant settlement.",
    },
    zh: {
      title: "外汇与司库 — Remi",
      description: "由受监管稳定币驱动的机构外汇与司库服务：7*24 兑换、透明定价、即时结算。",
    },
  },
  solutionsStablecoin: {
    path: "/solutions/stablecoin",
    indexable: true,
    en: {
      title: "Stablecoin Exchange Platform — Remi",
      description:
        "A 7*24 instant stablecoin exchange platform for regulated institutions — issuance, redemption and settlement in one rail.",
    },
    zh: {
      title: "稳定币兑换平台 — Remi",
      description: "面向受监管机构的 7*24 即时稳定币兑换平台——发行、赎回与结算一体化。",
    },
  },
  solutionsRegtech: {
    path: "/solutions/regtech",
    indexable: true,
    en: {
      title: "RegTech — Remi",
      description:
        "Compliance automation for digital finance: KYC/AML screening, transaction monitoring and regulatory reporting built into the payment flow.",
    },
    zh: {
      title: "监管科技 — Remi",
      description: "数字金融合规自动化：KYC/AML 筛查、交易监控与监管报送，内建于支付流程。",
    },
  },
  solutionsCheque: {
    path: "/solutions/cheque",
    indexable: true,
    en: {
      title: "Digital Cheque — Remi",
      description:
        "Digitised cheque clearing on regulated stablecoin rails — reducing float, accelerating settlement and preserving audit trails.",
    },
    zh: {
      title: "数字支票 — Remi",
      description: "基于受监管稳定币的数字化支票清算——减少在途资金、加速结算并保留完整审计轨迹。",
    },
  },
  solutionsLc: {
    path: "/solutions/lc",
    indexable: true,
    en: {
      title: "Tokenized Trade Finance — Remi",
      description:
        "Tokenized letters of credit and trade finance workflows — document verification, settlement and compliance on one regulated rail.",
    },
    zh: {
      title: "代币化贸易融资 — Remi",
      description: "代币化信用证与贸易融资流程——单据核验、结算与合规统一于一条受监管清算轨道。",
    },
  },
  player: {
    path: "/player",
    indexable: false,
    en: { title: "Video Player — Remi", description: "Remi video player." },
    zh: { title: "视频播放 — Remi", description: "Remi 视频播放器。" },
  },
};

/** Default robots directive — respects the deployment indexing policy. */
function robotsDirective() {
  return {
    index: isIndexable,
    follow: isIndexable,
    googleBot: {
      index: isIndexable,
      follow: isIndexable,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  };
}

/**
 * Build full page metadata (canonical + hreflang + OG + robots) for a page.
 * Every route's `generateMetadata` MUST go through here so each page owns its
 * canonical URL instead of inheriting the home page's.
 */
export async function buildPageMetadata(
  locale: string,
  page: PageKey,
  overrides?: {
    title?: string;
    description?: string;
    /** Absolute path override (e.g. `/news/123`). */
    path?: string;
  },
): Promise<Metadata> {
  const meta = PAGE_META[page];
  const local = locale === "zh" ? meta.zh : meta.en;
  const title = overrides?.title ?? local.title;
  const description = overrides?.description ?? local.description;
  const path = overrides?.path ?? meta.path;

  const canonical = new URL(path, siteConfig.url);

  // hreflang alternates — include x-default pointing at the default locale.
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    const prefix = l === routing.defaultLocale ? "" : `/${l}`;
    languages[l] = new URL(`${prefix}${path}`, siteConfig.url).toString();
  }
  languages["x-default"] = canonical.toString();

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: { canonical: canonical.toString(), languages },
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: canonical.toString(),
      siteName: siteConfig.name,
      title,
      description,
      images: [
        { url: "/opengraph-image", width: 1200, height: 630, alt: title },
      ],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
    robots: meta.indexable ? robotsDirective() : { index: false, follow: false },
  };
}

/**
 * Root layout metadata — home page titles plus the global title template and
 * shared identity fields. Child pages override via `buildPageMetadata`.
 */
export async function buildMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Meta" });
  const base = await buildPageMetadata(locale, "home");

  return {
    ...base,
    title: {
      default: t("title"),
      // Pages already carry the brand suffix — never append it again.
      template: "%s",
    },
    keywords: t("keywords") ? t("keywords").split(",").map((k) => k.trim()) : undefined,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    applicationName: siteConfig.name,
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/apple-touch-icon.png",
    },
  };
}
