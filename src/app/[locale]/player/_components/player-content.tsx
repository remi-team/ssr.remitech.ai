"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { M3u8Player } from "@/components/player/m3u8-player";
import type { M3u8PlayerHandle } from "@/components/player/types";
import type { FileItem } from "@/lib/api/types";
import { filesService } from "@/services/client/client-files-service";
import { useAuthStore } from "@/stores/auth-store";
import { useModalStore } from "@/stores/modal-store";
import { cn } from "@/lib/utils";

/**
 * PlayerContent — migrated from the legacy Vue `player/index.vue` +
 * `player/components/player.vue`.
 *
 * Flow (parity with legacy):
 *  1. Login-gated — unauthenticated visitors see a lock panel with a login
 *     trigger (legacy redirected to home; the modal flow is the Next.js
 *     equivalent).
 *  2. Fetch the authenticated file list and keep the `mp4` entries.
 *  3. Select the video by the `?id=` query (or the first one).
 *  4. Fetch video info (stream url + chapters) and render M3u8Player with a
 *     chapter sidebar.
 */

/** Lenient shape of a video document coming from the website API file list. */
type VideoDoc = FileItem & {
  title?: string;
  description?: string;
  desc?: string;
  coverUrl?: string;
  cover?: string;
  duration?: string;
  format?: string;
};

interface Chapter {
  start: number;
  end: number;
  title: string;
}

function docTitle(doc: VideoDoc): string {
  return doc.title || doc.name || "";
}
function docDescription(doc: VideoDoc): string {
  return doc.description || doc.desc || "";
}
function docCover(doc: VideoDoc): string {
  return doc.coverUrl || doc.cover || "";
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

export function PlayerContent({ initialId }: { initialId?: string }) {
  const t = useTranslations("Player");
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const hydrate = useAuthStore((s) => s.hydrate);
  const showLogin = useModalStore((s) => s.showLogin);

  const [videoList, setVideoList] = React.useState<VideoDoc[]>([]);
  const [currentId, setCurrentId] = React.useState<string | undefined>(initialId);
  const [videoUrl, setVideoUrl] = React.useState("");
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [infoLoading, setInfoLoading] = React.useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0);

  const playerRef = React.useRef<M3u8PlayerHandle | null>(null);

  // Hydrate the session mirror on mount (legacy route-guard equivalent).
  React.useEffect(() => {
    void hydrate();
  }, [hydrate]);

  // Load the video list once logged in.
  React.useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await filesService.getFileList();
        if (cancelled) return;
        const docs = (res.data ?? []) as VideoDoc[];
        const videos = docs.filter(
          (doc) => doc.type === "mp4" || doc.format === "mp4",
        );
        setVideoList(videos);
        if (!currentId && videos.length > 0) {
          setCurrentId(String(videos[0].id));
        }
      } catch (err) {
        console.error("Video list fetch failed:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const currentVideo = React.useMemo(() => {
    if (currentId) {
      const found = videoList.find((v) => String(v.id) === String(currentId));
      if (found) return found;
    }
    return videoList[0];
  }, [currentId, videoList]);

  // Load video stream url + chapters whenever the selected video changes.
  React.useEffect(() => {
    if (!isLoggedIn || !currentVideo) return;
    let cancelled = false;
    setInfoLoading(true);
    setVideoUrl("");
    setChapters([]);
    setCurrentChapterIndex(0);
    (async () => {
      try {
        const res = await filesService.getVideoChapter(String(currentVideo.id));
        if (cancelled) return;
        if (res.code === "200" && res.data) {
          const data = res.data as { url?: string; chapters?: Array<{ start: number; end: number; title: string }> };
          setVideoUrl(data.url ?? "");
          const list = data.chapters ?? [];
          setChapters(
            list.map((chapter, index) => ({
              start: chapter.start,
              end:
                chapter.end === -1 || index === list.length - 1
                  ? Number.POSITIVE_INFINITY
                  : chapter.end,
              title: chapter.title,
            })),
          );
        }
      } catch (err) {
        console.error("Video info fetch failed:", err);
      } finally {
        if (!cancelled) setInfoLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, currentVideo]);

  // Keep the `?id=` query in sync when the visitor picks another video.
  const selectVideo = (doc: VideoDoc) => {
    setCurrentId(String(doc.id));
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `?id=${encodeURIComponent(String(doc.id))}`);
    }
  };

  const jumpToChapter = (chapter: Chapter, index: number) => {
    playerRef.current?.seek(chapter.start);
    setCurrentChapterIndex(index);
  };

  const onTimeUpdate = (info: { currentTime: number }) => {
    if (chapters.length === 0) return;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (info.currentTime >= chapters[i].start) {
        setCurrentChapterIndex((prev) => (prev === i ? prev : i));
        break;
      }
    }
  };

  // ------------------------------------------------------------------
  // Login gate
  // ------------------------------------------------------------------
  if (!isHydrating && !isLoggedIn) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[1200px] items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff5f0] text-[#FF6900]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="mb-6 text-[16px] text-[#666]">{t("loginRequired")}</p>
          <button
            type="button"
            onClick={showLogin}
            className="cursor-pointer border border-[#FF6900] bg-[#FF6900] px-[24px] py-[10px] text-[14px] font-medium text-white transition-colors hover:bg-[#ff6b35]"
          >
            {t("login")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-[24px] px-6 pb-[48px] pt-[110px] lg:px-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-[24px] border-b border-[#e9ecef] pb-[16px]">
        <div className="min-w-0 flex-1">
          <h1 className="mb-[6px] text-[24px] font-semibold leading-[1.2] text-[#333]">
            {(currentVideo && docTitle(currentVideo)) || t("unknownVideo")}
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#666]">
            {currentVideo ? docDescription(currentVideo) : ""}
          </p>
        </div>
        <Link
          href="/resources"
          className="flex h-fit shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-[#e9ecef] bg-white px-[18px] py-[9px] text-[14px] text-[#666] transition-all hover:border-[#ff6b35] hover:text-[#ff6b35]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 12H5M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t("back")}
        </Link>
      </div>

      {/* Player + chapters */}
      <div className="flex min-h-[500px] flex-col gap-[20px] lg:h-[500px] lg:flex-row">
        <div className="relative flex h-[250px] flex-1 items-center justify-center overflow-hidden rounded-xl bg-black min-[769px]:h-full">
          {videoUrl ? (
            <M3u8Player
              ref={playerRef}
              src={videoUrl}
              className="h-full w-full"
              onTimeUpdate={onTimeUpdate}
            />
          ) : (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
              <div className="max-w-[400px] p-10 text-center text-white">
                <div className="mb-6 opacity-90">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mx-auto"
                    aria-hidden="true"
                  >
                    <path
                      d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-[24px] font-semibold">
                  {infoLoading ? t("loading") : t("loadFailed")}
                </h3>
                <p className="leading-[1.5] text-[#ccc]">
                  {infoLoading ? t("loadingDesc") : t("loadFailedDesc")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chapter sidebar */}
        <div className="flex h-[300px] flex-col overflow-hidden rounded-xl border border-[#e9ecef] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] lg:h-full lg:w-[320px]">
          <div className="flex min-h-[48px] items-center justify-between border-b border-[#e9ecef] bg-[#f8f9fa] px-[20px]">
            <h3 className="text-[15px] font-semibold leading-[48px] text-[#374151]">
              {t("chapters")}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto py-[8px]">
            {infoLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="mx-[8px] flex items-center rounded-md p-[12px]">
                  <div className="mr-[12px] h-[12px] w-[40px] animate-pulse rounded bg-[#f0f0f0]" />
                  <div className="h-[14px] flex-1 animate-pulse rounded bg-[#f0f0f0]" />
                </div>
              ))
            ) : chapters.length === 0 ? (
              <div className="p-[40px_20px] text-center text-[14px] text-[#999]">
                {t("noChapters")}
              </div>
            ) : (
              chapters.map((chapter, index) => (
                <button
                  key={`${chapter.start}-${index}`}
                  type="button"
                  onClick={() => jumpToChapter(chapter, index)}
                  className={cn(
                    "mx-[8px] flex w-[calc(100%-16px)] cursor-pointer items-center rounded-md p-[12px_20px] text-left transition-all hover:bg-[#fff5f0]",
                    currentChapterIndex === index && "bg-[#fff5f0]",
                  )}
                >
                  <span
                    className={cn(
                      "mr-[12px] shrink-0 text-[11px] font-medium text-[#9ca3af]",
                      currentChapterIndex === index && "font-semibold text-[#FF6900]",
                    )}
                  >
                    {formatTime(chapter.start)}
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-[13px] font-medium leading-[1.4] text-[#374151]",
                      currentChapterIndex === index && "font-semibold text-[#FF6900]",
                    )}
                  >
                    {chapter.title}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Video list */}
      <div>
        <div className="mb-[12px] flex items-center justify-between border-b border-[#e9ecef] pb-[12px]">
          <h3 className="text-[18px] font-semibold text-[#333]">{t("videoListTitle")}</h3>
        </div>
        <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 xl:grid-cols-3">
          {videoList.map((video) => (
            <button
              key={String(video.id)}
              type="button"
              onClick={() => selectVideo(video)}
              className={cn(
                "flex min-h-[96px] cursor-pointer items-center rounded-[14px] border bg-white p-[16px] text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:border-[#ff6b35] hover:bg-[#fff7f0] hover:shadow-[0_4px_16px_rgba(255,105,0,0.10)]",
                String(video.id) === String(currentVideo?.id)
                  ? "border-[#ff6b35]"
                  : "border-[#f0f0f0]",
              )}
            >
              {docCover(video) && (
                <div className="mr-[20px] h-[72px] w-[108px] shrink-0 overflow-hidden rounded-[10px] bg-[#f6f6f6]">
                  <img
                    src={docCover(video)}
                    alt={docTitle(video)}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="mb-[4px] text-[14px] font-semibold text-[#333]">
                  {docTitle(video) || t("unknownVideo")}
                </div>
                <div className="truncate text-[12px] leading-[1.4] text-[#666]">
                  {docDescription(video)}
                </div>
              </div>
              {video.duration && (
                <div className="ml-[12px] shrink-0 text-right text-[12px] font-medium text-[#ff6b35]">
                  {video.duration}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
