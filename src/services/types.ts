/**
 * Domain types for the Remi corporate site (locale-agnostic shapes).
 * These are the contracts every Service implementation must satisfy,
 * regardless of where the data ultimately comes from.
 */

export type NewsItem = {
  id: string;
  /** i18n key path under `News.items` in the message catalogue. */
  titleKey: string;
  summaryKey: string;
  date: string;
  tagKey: string;
  href: string;
};

export type StatItem = {
  id: string;
  value: string;
  /** i18n key under `Stats` */
  labelKey: string;
};

export type BusinessSector = {
  id: string;
  /** i18n key under `Solutions` */
  titleKey: string;
  descKey: string;
  /** Icon discriminator resolved by the view layer. */
  icon: "creditCard" | "landmark" | "coins" | "shield" | "file" | "scroll";
};

export type ClientLogo = {
  id: string;
  name: string;
};

export type SiteContent = {
  news: NewsItem[];
  stats: StatItem[];
  business: BusinessSector[];
  clients: ClientLogo[];
};
