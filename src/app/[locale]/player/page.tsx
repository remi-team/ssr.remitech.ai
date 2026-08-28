import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import { PlayerContent } from "./_components/player-content";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
};

/**
 * Video player page — migrated from the legacy Vue `views/player/index.vue`.
 * Login-gated: videos stream via the files BFF (`/api/files/video-info`,
 * `/api/files/video`). The `?id=` query selects the current video.
 */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  return buildPageMetadata(validLocale, "player");
}

export default async function PlayerPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { id } = await searchParams;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <div className="min-h-screen bg-[#FAF8F7] text-[#2c2520]">
      <PlayerContent initialId={id} />
    </div>
  );
}
