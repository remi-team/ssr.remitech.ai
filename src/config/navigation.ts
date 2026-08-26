import type { LucideIcon } from "lucide-react";
import {
  Home,
  Layers,
  CreditCard,
  Landmark,
  Coins,
  ShieldCheck,
  FileText,
  ScrollText,
  Award,
  Info,
  Newspaper,
  BookOpen,
  Scale,
  Phone,
} from "lucide-react";

/**
 * Primary navigation model for Remi (Dependency Inversion — components depend
 * on this abstraction, not on concrete literals). Labels are ABSOLUTE i18n
 * message paths resolved via the root translator (`useTranslations()`).
 *
 * The public site is a single page (only `/` is exposed), so every `href`
 * is a hash anchor on that page. The Solutions mega-menu exposes six sub-items
 * that anchor the Solutions grid.
 */
export type NavChild = {
  /** Absolute i18n key (e.g. "Nav.solutions.crossBorder"). */
  labelKey: string;
  /** Absolute i18n key for the child description (shown in the desktop mega-menu). */
  descriptionKey: string;
  href: string;
  icon: LucideIcon;
};

export type NavItem = {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  /** When present, the item renders a mega-menu dropdown. */
  children?: NavChild[];
};

/** Solution sub-items — the six product lines of Remi. */
export const solutionItems: NavChild[] = [
  {
    labelKey: "Nav.solutions.crossBorder",
    descriptionKey: "Solutions.crossBorder.desc",
    href: "/solutions/cross-border-payment",
    icon: CreditCard,
  },
  {
    labelKey: "Nav.solutions.fx",
    descriptionKey: "Solutions.fx.desc",
    href: "/solutions/fx",
    icon: Landmark,
  },
  {
    labelKey: "Nav.solutions.stablecoin",
    descriptionKey: "Solutions.stablecoin.desc",
    href: "/solutions/stablecoin",
    icon: Coins,
  },
  {
    labelKey: "Nav.solutions.regtech",
    descriptionKey: "Solutions.regtech.desc",
    href: "/solutions/regtech",
    icon: ShieldCheck,
  },
  {
    labelKey: "Nav.solutions.lc",
    descriptionKey: "Solutions.lc.desc",
    href: "/solutions/lc",
    icon: FileText,
  },
  {
    labelKey: "Nav.solutions.cheque",
    descriptionKey: "Solutions.cheque.desc",
    href: "/solutions/cheque",
    icon: ScrollText,
  },
];

export const mainNav: NavItem[] = [
  { labelKey: "Nav.home", href: "/#top", icon: Home },
  {
    labelKey: "Nav.solutions.label",
    href: "/solutions",
    icon: Layers,
    children: solutionItems,
  },
  { labelKey: "Nav.membership", href: "/membership", icon: Award },
  { labelKey: "Nav.about", href: "/about", icon: Info },
  { labelKey: "Nav.news", href: "/news", icon: Newspaper },
  { labelKey: "Nav.resources", href: "/resources", icon: BookOpen },
  { labelKey: "Nav.compliance", href: "/compliance", icon: Scale },
];

/** Footer link groups. */
export const footerNav: { titleKey: string; links: NavChild[] }[] = [
  {
    titleKey: "Footer.col.navigation",
    links: mainNav
      .map((i) => ({
        // Legacy parity: the Vue footer renders "About Us" while the main
        // nav shows "About us".
        labelKey: i.labelKey === "Nav.about" ? "Nav.aboutFooter" : i.labelKey,
        descriptionKey: "",
        href: i.href,
        icon: i.icon,
      })),
  },
];

/** Solution descriptions keyed by id (used by the data layer + menu). */
export const solutionMeta = [
  { id: "crossBorder", titleKey: "Solutions.crossBorder.title", descKey: "Solutions.crossBorder.desc", icon: "creditCard" as const, href: "/solutions/cross-border-payment" },
  { id: "fx", titleKey: "Solutions.fx.title", descKey: "Solutions.fx.desc", icon: "landmark" as const, href: "/solutions/fx" },
  { id: "stablecoin", titleKey: "Solutions.stablecoin.title", descKey: "Solutions.stablecoin.desc", icon: "coins" as const, href: "/solutions/stablecoin" },
  { id: "regtech", titleKey: "Solutions.regtech.title", descKey: "Solutions.regtech.desc", icon: "shield" as const, href: "/solutions/regtech" },
  { id: "lc", titleKey: "Solutions.lc.title", descKey: "Solutions.lc.desc", icon: "file" as const, href: "/solutions/lc" },
  { id: "cheque", titleKey: "Solutions.cheque.title", descKey: "Solutions.cheque.desc", icon: "scroll" as const, href: "/solutions/cheque" },
];
