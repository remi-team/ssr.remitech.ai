import type Hls from "hls.js";

/**
 * HLS.js configuration factory — produces a tuned config for resilient
 * m3u8 playback. Extracted from the component so it can be unit-tested and
 * reused across player instances.
 *
 * Design choices:
 *  • Generous retry budgets on manifest / level / fragment loading (the
 *    legacy values, proven in production).
 *  • `backBufferLength: 90` — keep 90s behind the playhead so seeking back
 *    doesn't refetch.
 *  • `lowLatencyMode: true` — enables LL-HLS part loading when the manifest
 *    supports it; harmless otherwise.
 *  • `capLevelToPlayerSize: true` — don't fetch 1080p on a 360p player.
 *  • Worker + software AES for performant TS demuxing.
 */
export function createHlsConfig(): Partial<Hls["config"]> {
  return {
    // Buffering strategy
    maxBufferLength: 30,
    maxMaxBufferLength: 60,
    maxBufferSize: 60 * 1000 * 1000,
    maxBufferHole: 0.5,
    backBufferLength: 90,
    lowLatencyMode: true,

    // ABR
    startLevel: -1, // auto-select best quality
    capLevelToPlayerSize: true,

    // TS demuxing performance
    enableWorker: true,
    enableSoftwareAES: true,
    forceKeyFrameOnDiscontinuity: true,
    progressive: false,

    // Resilience — retry budgets for each loading stage
    manifestLoadingTimeOut: 10_000,
    manifestLoadingMaxRetry: 6,
    manifestLoadingRetryDelay: 1_000,
    levelLoadingTimeOut: 10_000,
    levelLoadingMaxRetry: 6,
    levelLoadingRetryDelay: 1_000,
    fragLoadingTimeOut: 20_000,
    fragLoadingMaxRetry: 6,
    fragLoadingRetryDelay: 1_000,

    debug: false,
  };
}

/** Pretty-print a quality level, e.g. 1920×1080 → "1080p". */
export function levelLabel(level: { height?: number; width?: number }): string {
  if (level.height) return `${level.height}p`;
  if (level.width) return `${level.width}w`;
  return "auto";
}
