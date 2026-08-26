import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
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
  const title = validLocale === "zh" ? "视频播放 — Remi" : "Video Player — Remi";
  const description =
    validLocale === "zh"
      ? "观看 Remi 会员视频资源：产品演示与培训材料。"
      : "Watch Remi member video resources: product demonstrations and training material.";
  // Legacy parity: the player route was marked `noindex`.
  return { title, description, robots: "noindex" };
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
