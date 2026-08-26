/**
 * Central API configuration — migrated from the legacy Vue `config.js`.
 *
 * Single source of truth for: API version, base path, endpoint map, HTTP /
 * business status codes, request defaults, file-download config, error
 * messages, and token storage keys.
 *
 * Architecture note: in the BFF design the `WEBSITE_API_ENDPOINTS` map points
 * at the website API service (not the BFF itself). The BFF routes live under
 * `/api/*` and proxy to these endpoints via the server-side website API
 * client (`website-api-client.ts`).
 *
 * Naming convention: every external API service uses a `<SERVICE>_API_`
 * prefix for env vars and constants (this service: `WEBSITE_API_*`), so
 * additional services can be added without ambiguity (e.g. `CRM_API_*`).
 */

// ---------------------------------------------------------------------------
// Website API service (`remi-website-backend`) — versioning & base path
// ---------------------------------------------------------------------------

/** Website API version segment (env-overridable per deployment). */
export const WEBSITE_API_VERSION = process.env.WEBSITE_API_VERSION ?? "v1";

/** Versioned API base path on the service, e.g. `/api/v1`. */
export const WEBSITE_API_BASE_PATH = `/api/${WEBSITE_API_VERSION}`;

/**
 * Default origin of the website API service — the dev/SIT environment (same
 * host the legacy Vue app proxied `/api` to via `VITE_APP_SERVER_URL`). Baked
 * in as the CICD default so a deployment without overrides talks to SIT; ops
 * point each environment at its own service by injecting
 * `WEBSITE_API_SERVER_URL` (K8s ConfigMap `remi-frontend-ssr-configmap`).
 */
export const DEFAULT_WEBSITE_API_SERVER_URL =
  "http://remi-website-backend-sit.remitech.ai";

/**
 * Website API service origin. Env override wins over the built-in default.
 */
export const WEBSITE_API_SERVER_URL =
  process.env.WEBSITE_API_SERVER_URL ?? DEFAULT_WEBSITE_API_SERVER_URL;

/** Full website API base URL (origin + versioned path). */
export const WEBSITE_API_BASE_URL = `${WEBSITE_API_SERVER_URL}${WEBSITE_API_BASE_PATH}`;

// ---------------------------------------------------------------------------
// Website API endpoint map (the real routes the BFF proxies to)
// ---------------------------------------------------------------------------

export const WEBSITE_API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${WEBSITE_API_BASE_URL}/auth/login`,
    REFRESH: `${WEBSITE_API_BASE_URL}/auth/refresh`,
    LOGOUT: `${WEBSITE_API_BASE_URL}/auth/logout`,
    USER_INFO: `${WEBSITE_API_BASE_URL}/auth/user`,
  },

  USER: {
    REGISTER: `${WEBSITE_API_BASE_URL}/user/regis`,
    ACTIVATE: `${WEBSITE_API_BASE_URL}/user/active`,
    ACTIVATE_RESOURCE: `${WEBSITE_API_BASE_URL}/user/review`,
    FORGET_PASSWORD: `${WEBSITE_API_BASE_URL}/user/forget`,
    RESET_PASSWORD: `${WEBSITE_API_BASE_URL}/user/password-reset`,
    CHANGE_PASSWORD: `${WEBSITE_API_BASE_URL}/user/password`,
    CONTACT: `${WEBSITE_API_BASE_URL}/user/contact-us`,
  },

  CONTENT: {
    NEWS_HOMEPAGE: `${WEBSITE_API_BASE_URL}/content/news/homepage/page`,
    NEWS_EVENTS: `${WEBSITE_API_BASE_URL}/content/news/events/page`,
    LINKEDIN: `${WEBSITE_API_BASE_URL}/content/linkedin/page`,
    NEWS_DETAIL: (id: string) => `${WEBSITE_API_BASE_URL}/content/news/detail/${id}`,
  },

  FILES: {
    LIST: `${WEBSITE_API_BASE_URL}/files/list`,
    DOWNLOAD: `${WEBSITE_API_BASE_URL}/files/download`,
    VIDEO_CHAPTER: `${WEBSITE_API_BASE_URL}/files/video-info`,
    VIDEO_DOWNLOAD: `${WEBSITE_API_BASE_URL}/files/video`,
  },
} as const;

// ---------------------------------------------------------------------------
// HTTP status codes
// ---------------------------------------------------------------------------

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  GATEWAY_TIMEOUT: 504,
} as const;

/** Business-level codes returned inside the `{ code, data, message }` envelope. */
export const BUSINESS_CODE = {
  SUCCESS: "200",
  SUCCESS_ALT: "0",
  FAILED: "-1",
  UNAUTHORIZED: "401",
  FORBIDDEN: "403",
  NOT_FOUND: "404",
  VALIDATION_ERROR: "422",
} as const;

// ---------------------------------------------------------------------------
// Request defaults
// ---------------------------------------------------------------------------

export const REQUEST_CONFIG = {
  /** General request timeout (ms). */
  TIMEOUT: 15000,
  /** Retry count for transient failures. */
  RETRY_TIMES: 3,
  /** Delay between retries (ms). */
  RETRY_DELAY: 1000,

  DOWNLOAD: {
    CHUNK_SIZE: 1024 * 1024, // 1 MB
    MAX_CONCURRENT_CHUNKS: 3,
    RETRY_TIMES: 3,
    SUPPORTED_RANGES: true,

    /** File-extension → Content-Type mapping (matches legacy config). */
    FILE_TYPE_MAPPING: {
      pdf: "application/pdf",
      mp4: "application/octet-stream",
      avi: "application/octet-stream",
      mov: "application/octet-stream",
      wmv: "application/octet-stream",
      flv: "application/octet-stream",
      webm: "application/octet-stream",
    } as Record<string, string>,

    ACCEPTED_CONTENT_TYPES: [
      "application/pdf",
      "application/octet-stream",
      "video/mp4",
      "image/jpeg",
      "image/png",
      "text/plain",
      "application/json",
    ],
  },
} as const;

// ---------------------------------------------------------------------------
// Error messages (locale-neutral; UI strings live in messages/*.json)
// ---------------------------------------------------------------------------

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error, please check your connection",
  TIMEOUT_ERROR: "Request timeout, please try again",
  SERVER_ERROR: "Server error, please try again later",
  UNAUTHORIZED: "Please log in first",
  FORBIDDEN: "Access denied",
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Validation failed",
  TOO_MANY_REQUESTS: "Too many requests, please try again later",
} as const;

// ---------------------------------------------------------------------------
// Token configuration
// ---------------------------------------------------------------------------

/**
 * Cookie names used by the BFF to store tokens server-side.
 *
 * Tokens are kept in **httpOnly** cookies so client-side JavaScript can never
 * read them directly — a security improvement over the legacy localStorage
 * approach. The client only knows whether it is authenticated via the
 * `useAuthStore` mirror (username / isLoggedIn), never the raw token.
 */
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: "remi_access_token",
  REFRESH_TOKEN_KEY: "remi_refresh_token",
  /** Authorization header prefix. */
  TOKEN_PREFIX: "Bearer ",
  /** Refresh the access token this many ms before it expires. */
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  /** Cookie max-age in seconds (7 days, matching the legacy app). */
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60,
} as const;

/** BFF route paths (used by client services — keeps paths DRY). */
export const BFF_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    CONTACT: "/api/auth/contact",
    ACTIVATE: "/api/auth/activate",
    ACTIVATE_RESOURCE: "/api/auth/activate-resource",
    FORGOT: "/api/auth/forgot",
    RESET_PASSWORD: "/api/auth/reset-password",
    REFRESH: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",
    USER: "/api/auth/user",
    CHANGE_PASSWORD: "/api/auth/change-password",
  },
  NEWS: {
    HOMEPAGE: "/api/news/homepage",
    EVENTS: "/api/news/events",
    LINKEDIN: "/api/news/linkedin",
    DETAIL: (id: string) => `/api/content/news/${id}`,
  },
  FILES: {
    LIST: "/api/files/list",
    DOWNLOAD: "/api/files/download",
    VIDEO_INFO: "/api/files/video-info",
    VIDEO: "/api/files/video",
  },
} as const;

const apiConfig = {
  WEBSITE_API_VERSION,
  WEBSITE_API_BASE_PATH,
  WEBSITE_API_BASE_URL,
  WEBSITE_API_SERVER_URL,
  WEBSITE_API_ENDPOINTS,
  HTTP_STATUS,
  BUSINESS_CODE,
  REQUEST_CONFIG,
  ERROR_MESSAGES,
  TOKEN_CONFIG,
  BFF_ROUTES,
};

export default apiConfig;
