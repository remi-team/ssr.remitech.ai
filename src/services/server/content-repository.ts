import type {
  BusinessSector,
  ClientLogo,
  NewsItem,
  SiteContent,
  StatItem,
} from "./types";

/**
 * In-memory content repository for the Remi corporate site.
 *
 * In a real system this would be a CMS / database / upstream API call.
 * Keeping it isolated here means the Service layer can swap the source
 * (CMS, GraphQL, REST) without touching any component.
 *
 * i18n-aware fields store *message keys*, never raw translated strings —
 * this keeps the data layer locale-independent (Open/Closed Principle).
 */
const newsSeed: NewsItem[] = [
  {
    id: "news-1",
    titleKey: "News.items.0.title",
    summaryKey: "News.items.0.summary",
    date: "2025-03-18",
    tagKey: "News.items.0.tag",
    href: "/#news",
  },
  {
    id: "news-2",
    titleKey: "News.items.1.title",
    summaryKey: "News.items.1.summary",
    date: "2025-02-26",
    tagKey: "News.items.1.tag",
    href: "/#news",
  },
  {
    id: "news-3",
    titleKey: "News.items.2.title",
    summaryKey: "News.items.2.summary",
    date: "2025-01-15",
    tagKey: "News.items.2.tag",
    href: "/#news",
  },
];

const statsSeed: StatItem[] = [
  { id: "stat-volume", value: "$10B+", labelKey: "Stats.volume" },
  { id: "stat-institutions", value: "200+", labelKey: "Stats.institutions" },
  { id: "stat-countries", value: "60+", labelKey: "Stats.countries" },
  { id: "stat-uptime", value: "99.99%", labelKey: "Stats.uptime" },
];

const businessSeed: BusinessSector[] = [
  {
    id: "crossBorder",
    titleKey: "Solutions.crossBorder.title",
    descKey: "Solutions.crossBorder.desc",
    icon: "creditCard",
  },
  {
    id: "fx",
    titleKey: "Solutions.fx.title",
    descKey: "Solutions.fx.desc",
    icon: "landmark",
  },
  {
    id: "stablecoin",
    titleKey: "Solutions.stablecoin.title",
    descKey: "Solutions.stablecoin.desc",
    icon: "coins",
  },
  {
    id: "regtech",
    titleKey: "Solutions.regtech.title",
    descKey: "Solutions.regtech.desc",
    icon: "shield",
  },
  {
    id: "lc",
    titleKey: "Solutions.lc.title",
    descKey: "Solutions.lc.desc",
    icon: "file",
  },
  {
    id: "cheque",
    titleKey: "Solutions.cheque.title",
    descKey: "Solutions.cheque.desc",
    icon: "scroll",
  },
];

const clientsSeed: ClientLogo[] = [
  { id: "c1", name: "Standard Bank" },
  { id: "c2", name: "DBS" },
  { id: "c3", name: "HSBC" },
  { id: "c4", name: "Ant Group" },
  { id: "c5", name: "SIA" },
  { id: "c6", name: "Mastercard" },
  { id: "c7", name: "Visa" },
  { id: "c8", name: "SWIFT" },
];

async function delay<T>(value: T, ms = 0): Promise<T> {
  if (ms > 0) await new Promise((r) => setTimeout(r, ms));
  return value;
}

export const contentRepository = {
  async getNews(): Promise<NewsItem[]> {
    return delay(structuredClone(newsSeed), 60);
  },
  async getStats(): Promise<StatItem[]> {
    return delay(structuredClone(statsSeed), 40);
  },
  async getBusiness(): Promise<BusinessSector[]> {
    return delay(structuredClone(businessSeed), 40);
  },
  async getClients(): Promise<ClientLogo[]> {
    return delay(structuredClone(clientsSeed), 40);
  },
  async getAll(): Promise<SiteContent> {
    const [news, stats, business, clients] = await Promise.all([
      this.getNews(),
      this.getStats(),
      this.getBusiness(),
      this.getClients(),
    ]);
    return { news, stats, business, clients };
  },
};
