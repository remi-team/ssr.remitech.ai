/**
 * Shared API types — used by the website API client, server services, BFF routes,
 * and client services. Keeping them in one place guarantees the `{ code, data,
 * message }` envelope is consistent end-to-end.
 */

/** Standard website API response envelope. */
export interface ApiResponse<T = unknown> {
  code: string;
  message?: string;
  data?: T;
}

/** Paginated response (news lists, file lists, etc.). */
export interface PageResponse<T = unknown> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages?: number;
}

/** Pagination request params. */
export interface PageParams {
  current?: number;
  size?: number;
}

// ---------------------------------------------------------------------------
// Auth types
// ---------------------------------------------------------------------------

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken?: string;
  refreshToken?: string;
  /** Legacy snake_case fields (the website API may return these). */
  access_token?: string;
  refresh_token?: string;
  username?: string;
  email?: string;
  status?: number;
  user?: { name?: string; email?: string };
}

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  companyEmail: string;
  contactNumber: string;
  password: string;
  passwordConfirm: string;
  companyName: string;
  companyType: string;
  relevantAuthorities: string;
  country: string;
}

export interface ContactPayload extends Omit<RegisterPayload, "password" | "passwordConfirm"> {
  message: string;
}

export interface ResetPasswordPayload {
  email: string;
  password: string;
  passwordConfirm: string;
  code: string;
}

export interface ChangePasswordPayload {
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  [key: string]: unknown;
}

export interface UserInfo {
  username: string;
  email: string;
  status: number;
}

// ---------------------------------------------------------------------------
// News types
// ---------------------------------------------------------------------------

export interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  cover?: string;
  date?: string;
  tag?: string;
  link?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Files types
// ---------------------------------------------------------------------------

export interface FileItem {
  id: string;
  name: string;
  type?: string;
  size?: number;
  url?: string;
  [key: string]: unknown;
}

export interface VideoChapter {
  id: string;
  title?: string;
  duration?: number;
  chapters?: Array<{ start: number; end: number; title: string }>;
  [key: string]: unknown;
}

/** Range request for chunked / resumable downloads. */
export interface RangeOptions {
  start: number;
  end?: number;
}

/** Normalized error thrown by the website API client. */
export class WebsiteApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly errorBody?: unknown,
  ) {
    super(message);
    this.name = "WebsiteApiError";
  }
}
