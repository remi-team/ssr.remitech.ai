/**
 * M3U8 player types — shared between the component, its ref handle, and the
 * event callbacks. Keeping them in one place makes the imperative API
 * discoverable and type-safe.
 */

/** Quality level exposed by the HLS manifest. */
export interface QualityLevel {
  index: number;
  height: number;
  width: number;
  bitrate: number;
  /** Pretty label, e.g. "1080p". */
  label: string;
}

/** Buffered-range payload emitted on `progress`. */
export interface ProgressInfo {
  bufferedEnd: number;
  duration: number;
  percent: number;
}

/** Time payload emitted on `timeupdate`. */
export interface TimeInfo {
  currentTime: number;
  duration: number;
}

/** Error categories the player surfaces to consumers. */
export type PlayerErrorKind =
  | "network"
  | "media"
  | "frag-parsing"
  | "fatal"
  | "init"
  | "unsupported";

export interface PlayerError {
  kind: PlayerErrorKind;
  message: string;
  /** The raw HLS / Artplayer error payload, if any. */
  cause?: unknown;
}

/**
 * Imperative handle exposed via `ref`. Mirrors the legacy `defineExpose` API
 * so consumers can drive the player programmatically.
 */
export interface M3u8PlayerHandle {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  fullscreen: () => void;
  exitFullscreen: () => void;
  showControls: () => void;
  hideControls: () => void;
  /** The underlying Artplayer instance (advanced use). */
  getInstance: () => unknown;
  /** The underlying Hls.js instance (advanced use). */
  getHlsInstance: () => unknown;
}

export interface M3u8PlayerProps {
  /** Video source URL (m3u8 or any format Artplayer supports). */
  src: string;
  /** Poster image shown before playback. */
  poster?: string;
  /** Autoplay on mount (may be blocked by browser policy — use `muted`). */
  autoplay?: boolean;
  /** Start muted (helps autoplay policies). */
  muted?: boolean;
  /** Loop playback. */
  loop?: boolean;
  /** Hide the control bar (click-to-fullscreen banner mode). */
  hideControls?: boolean;
  /** Override / extend Artplayer options. */
  options?: Record<string, unknown>;
  /** ClassName passthrough. */
  className?: string;
  /** Called when the player is ready. */
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (err: PlayerError) => void;
  onTimeUpdate?: (info: TimeInfo) => void;
  onProgress?: (info: ProgressInfo) => void;
  onWaiting?: () => void;
  onPlaying?: () => void;
}
