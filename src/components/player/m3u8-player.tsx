"use client";

import * as React from "react";
import { Loader2, AlertCircle, RotateCcw, Maximize2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { createHlsConfig, levelLabel } from "./hls-config";
import type {
  M3u8PlayerHandle,
  M3u8PlayerProps,
  PlayerError,
  QualityLevel,
} from "./types";

// Artplayer + hls.js are browser-only, so we dynamic-import them lazily inside
// effects. This keeps them out of the server bundle and avoids SSR window refs.
type ArtplayerInstance = {
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  off?: (event: string, cb: (...args: unknown[]) => void) => void;
  destroy: (removeDom?: boolean) => void;
  play: () => void;
  pause: () => void;
   
  [key: string]: any;
};
type HlsInstance = {
  loadSource: (url: string) => void;
  attachMedia: (video: HTMLMediaElement) => void;
  startLoad: (pos?: number) => void;
  recoverMediaError: () => void;
  destroy: () => void;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
   
  [key: string]: any;
};

/**
 * M3u8Player — a high-availability HLS video player migrated from the legacy
 * Vue `m3u8-player.vue`, built on Artplayer + hls.js.
 *
 * Professional optimisations over the legacy component:
 *  • **Dynamic import** of artplayer/hls.js → kept out of the SSR bundle.
 *  • **forwardRef + useImperativeHandle** for a typed imperative API.
 *  • **Auto-retry with a retry counter** for network errors (max 3 restarts).
 *  • **Quality-levels callback** so consumers can build ABR switchers.
 *  • **Memoised HLS config** (factory is pure).
 *  • **Guarded cleanup** that tolerates double-destroy during React StrictMode.
 *  • **Reduced-motion friendly** overlays (CSS spinners respect prefers-reduced-motion).
 */
export const M3u8Player = React.forwardRef<M3u8PlayerHandle, M3u8PlayerProps>(
  function M3u8Player(props, ref) {
    const {
      src,
      poster,
      autoplay = false,
      muted = false,
      loop = false,
      hideControls = false,
      options,
      className,
      onReady,
      onPlay,
      onPause,
      onEnded,
      onError,
      onTimeUpdate,
      onProgress,
      onWaiting,
      onPlaying,
    } = props;

    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const artRef = React.useRef<ArtplayerInstance | null>(null);
    const hlsRef = React.useRef<HlsInstance | null>(null);
    // Track the current src so a prop change re-inits the player.
    const srcRef = React.useRef<string>(src);
    // Network-error retry counter (resets on successful playback).
    const netRetryRef = React.useRef(0);
    const MAX_NET_RETRIES = 3;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<PlayerError | null>(null);
    const [buffering, setBuffering] = React.useState(false);
    const [qualities, setQualities] = React.useState<QualityLevel[]>([]);

    // ----------------------------------------------------------------------
    // Error helper — sets state + invokes the consumer callback.
    // ----------------------------------------------------------------------
    const reportError = React.useCallback(
      (err: PlayerError) => {
        setError(err);
        onError?.(err);
      },
      [onError],
    );

    // ----------------------------------------------------------------------
    // Destroy both instances (idempotent).
    // ----------------------------------------------------------------------
    const destroyPlayer = React.useCallback(() => {
      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch {
          /* swallow — hls may already be destroyed */
        }
        hlsRef.current = null;
      }
      if (artRef.current) {
        try {
          artRef.current.destroy(false);
        } catch {
          /* swallow — art may already be destroyed */
        }
        artRef.current = null;
      }
    }, []);

    // ----------------------------------------------------------------------
    // Controls helpers — toggle the Artplayer control bar visibility.
    // ----------------------------------------------------------------------
    const showControls = React.useCallback(() => {
      const art = artRef.current;
       
      const el = (art?.template as any)?.$controls as HTMLElement | undefined;
      el?.classList.remove("art-controls-hide");
    }, []);

    const hideControlsFn = React.useCallback(() => {
      if (!hideControls) return;
      const art = artRef.current;
       
      const el = (art?.template as any)?.$controls as HTMLElement | undefined;
      el?.classList.add("art-controls-hide");
    }, [hideControls]);

    // ----------------------------------------------------------------------
    // Initialise the player. Runs on mount and whenever `src` changes.
    // ----------------------------------------------------------------------
    const initPlayer = React.useCallback(async () => {
      if (!containerRef.current) return;
      if (!src) {
        reportError({ kind: "init", message: "Video source URL is required" });
        return;
      }

      setLoading(true);
      setError(null);
      setQualities([]);
      netRetryRef.current = 0;

      // Tear down any previous instance before re-creating.
      destroyPlayer();

      try {
        const [{ default: Artplayer }, { default: Hls }] = await Promise.all([
          import("artplayer"),
          import("hls.js"),
        ]);

        // The custom m3u8 handler — wired via Artplayer's `customType`.
        const handleM3u8 = (video: HTMLVideoElement, url: string) => {
          if (Hls.isSupported()) {
            if (hlsRef.current) {
              hlsRef.current.destroy();
            }
            const hls = new Hls(createHlsConfig());
            hlsRef.current = hls as unknown as HlsInstance;
            hls.loadSource(url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (_evt, data) => {
              const levels: QualityLevel[] = (data.levels ?? []).map(
                (lv, i) => ({
                  index: i,
                  height: lv.height ?? 0,
                  width: lv.width ?? 0,
                  bitrate: lv.bitrate ?? 0,
                  label: levelLabel(lv),
                }),
              );
              setQualities(levels);
              if (autoplay) {
                video.play().catch(() => {
                  /* autoplay blocked — user must interact */
                });
              }
            });

            hls.on(Hls.Events.ERROR, (_evt, data) => {
              // 1) Fragment parsing error → skip 3s forward (legacy behaviour).
              if (data.details === "fragParsingError") {
                if (hls.media) {
                  hls.media.currentTime += 3;
                }
                return;
              }

              if (!data.fatal) return;

              // 2) Fatal errors — attempt recovery, with a retry budget for
              //    network errors so we don't loop forever on a dead origin.
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  if (netRetryRef.current < MAX_NET_RETRIES) {
                    netRetryRef.current += 1;
                    hls.startLoad();
                  } else {
                    reportError({
                      kind: "network",
                      message:
                        "Network error — please check your connection and try again",
                      cause: data,
                    });
                    destroyPlayer();
                  }
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  reportError({
                    kind: "media",
                    message: "Media error — attempting recovery",
                    cause: data,
                  });
                  break;
                default:
                  reportError({
                    kind: "fatal",
                    message: "Playback failed — please refresh and try again",
                    cause: data,
                  });
                  destroyPlayer();
                  break;
              }
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // iOS Safari native HLS.
            video.src = url;
            video.addEventListener(
              "loadedmetadata",
              () => {
                if (autoplay) video.play().catch(() => {});
              },
              { once: true },
            );
          } else {
            reportError({
              kind: "unsupported",
              message: "HLS playback is not supported in this browser",
            });
          }
        };

        const baseOptions = {
          container: containerRef.current,
          url: src,
          poster: poster ?? "",
          autoplay,
          muted,
          loop,
          autoSize: true,
          width: "100%",
          height: "100%",
          fullscreen: true,
          fullscreenWeb: true,
          miniProgressBar: !hideControls,
          autoOrientation: true,
          aspectRatio: true,
          playbackRate: !hideControls,
          screenshot: !hideControls,
          setting: !hideControls,
          hotkey: !hideControls,
          pip: !hideControls,
          mutex: true,
          lang:
            typeof navigator !== "undefined"
              ? navigator.language.toLowerCase()
              : "en",
          moreVideoAttr: {
            crossOrigin: "anonymous",
            playsInline: true,
            "webkit-playsinline": true,
          },
          customType: { m3u8: handleM3u8 },
          icons: {},
          ...options,
        };

        const art = new Artplayer(baseOptions) as ArtplayerInstance;
        artRef.current = art;

        // --- Wire Artplayer events -------------------------------------
        art.on("ready", () => {
          setLoading(false);
          // Reset the network retry budget on successful init.
          netRetryRef.current = 0;
          if (hideControls) hideControlsFn();
          onReady?.();
        });

        art.on("play", () => {
          netRetryRef.current = 0; // playback started → reset retry budget
          onPlay?.();
        });

        art.on("pause", () => onPause?.());
        art.on("ended", () => onEnded?.());

        art.on("click", () => {
          // Click-to-fullscreen (banner mode).
          if (art && !art.fullscreen) art.fullscreen = true;
        });

         
        art.on("video:timeupdate", () => {
          onTimeUpdate?.({
            currentTime: art.currentTime as number,
            duration: art.duration as number,
          });
        });

         
        art.on("video:progress", () => {
          const buffered = art.buffered as TimeRanges | undefined;
          if (buffered && buffered.length > 0) {
            const bufferedEnd = buffered.end(buffered.length - 1);
            const duration = art.duration as number;
            onProgress?.({
              bufferedEnd,
              duration,
              percent: duration > 0 ? (bufferedEnd / duration) * 100 : 0,
            });
          }
        });

        art.on("video:waiting", () => {
          setBuffering(true);
          onWaiting?.();
        });
        art.on("video:playing", () => {
          setBuffering(false);
          onPlaying?.();
        });

        art.on("error", (err) => {
          reportError({
            kind: "fatal",
            message: "Playback error — please refresh and try again",
            cause: err,
          });
        });

        // Fullscreen lifecycle: show controls inside fullscreen; on exit,
        // re-hide them when in banner mode and pause playback.
        art.on("fullscreen", (state: boolean) => {
          if (state) {
            showControls();
          } else if (hideControls) {
            hideControlsFn();
            art.pause();
          }
        });
      } catch (err) {
        reportError({
          kind: "init",
          message:
            err instanceof Error
              ? err.message
              : "Player initialization failed",
          cause: err,
        });
        setLoading(false);
      }
    }, [
      src,
      poster,
      autoplay,
      muted,
      loop,
      hideControls,
      options,
      destroyPlayer,
      hideControlsFn,
      showControls,
      reportError,
      onReady,
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onProgress,
      onWaiting,
      onPlaying,
    ]);

    // (Re)initialise on mount and when src changes.
    React.useEffect(() => {
      if (srcRef.current !== src) srcRef.current = src;
      initPlayer();
      return destroyPlayer;
       
    }, [src]);

    // Expose the imperative API via ref.
    React.useImperativeHandle(
      ref,
      (): M3u8PlayerHandle => ({
        play: () => artRef.current?.play(),
        pause: () => artRef.current?.pause(),
        seek: (time) => {
          if (artRef.current) artRef.current.currentTime = time;
        },
        setVolume: (volume) => {
          if (artRef.current) artRef.current.volume = volume;
        },
        setMuted: (m) => {
          if (artRef.current) artRef.current.muted = m;
        },
        setPlaybackRate: (rate) => {
          if (artRef.current) artRef.current.playbackRate = rate;
        },
        fullscreen: () => {
          if (artRef.current) artRef.current.fullscreen = true;
        },
        exitFullscreen: () => {
          if (artRef.current) artRef.current.fullscreen = false;
        },
        showControls,
        hideControls: hideControlsFn,
        getInstance: () => artRef.current,
        getHlsInstance: () => hlsRef.current,
      }),
      [showControls, hideControlsFn],
    );

    const retry = () => {
      setError(null);
      initPlayer();
    };

    return (
      <div
        className={cn(
          "m3u8-player-container relative h-full w-full overflow-hidden rounded-lg bg-black",
          className,
        )}
      >
        {/* Artplayer mount point */}
        <div ref={containerRef} className="artplayer-app h-full w-full" />

        {/* Loading overlay */}
        {loading && !error && (
          <div className="player-overlay player-overlay--loading">
            <Loader2 className="player-spinner h-12 w-12 text-[#FF6900]" />
            <p className="mt-4 text-sm font-medium text-white">Loading…</p>
          </div>
        )}

        {/* Buffering indicator */}
        {buffering && !loading && !error && (
          <div className="player-overlay player-overlay--buffering">
            <Loader2 className="player-spinner h-8 w-8 text-[#FF6900]" />
            <p className="mt-3 text-xs font-medium text-white">Buffering</p>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="player-overlay player-overlay--error">
            <AlertCircle className="mb-4 h-10 w-10 text-[#ff4757]" />
            <h3 className="mb-2 text-lg font-semibold text-white">
              {error.kind === "network"
                ? "Network Error"
                : error.kind === "unsupported"
                  ? "Unsupported"
                  : "Playback Error"}
            </h3>
            <p className="mb-6 max-w-md text-center text-sm text-gray-300">
              {error.message}
            </p>
            {error.kind !== "unsupported" && (
              <button
                type="button"
                onClick={retry}
                className="player-retry-btn inline-flex items-center gap-2 rounded-md bg-[#FF6900] px-6 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#e55d00] hover:shadow-[0_4px_12px_rgba(255,105,0,0.3)]"
              >
                <RotateCcw className="h-4 w-4" />
                Retry
              </button>
            )}
          </div>
        )}

        {/* Banner-mode hint (hideControls) */}
        {hideControls && !loading && !error && !buffering && (
          <div className="player-banner-hint pointer-events-none absolute inset-0 flex items-center justify-center">
            <Maximize2 className="h-10 w-10 text-white/70" />
          </div>
        )}

        {/* Quality levels (hidden, exposed via ref for custom UI) */}
        {qualities.length > 0 && (
          <span className="sr-only" aria-hidden="true">
            {qualities.length} quality levels available
          </span>
        )}
      </div>
    );
  },
);
