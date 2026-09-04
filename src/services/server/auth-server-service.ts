import "server-only";

import { WEBSITE_API_ENDPOINTS } from "@/lib/api/config";
import { websiteApiClient } from "@/lib/api/website-api-client";
import { encryptPassword } from "@/lib/auth/rsa-crypto";
import type {
  ApiResponse,
  ChangePasswordPayload,
  ContactPayload,
  LoginPayload,
  LoginResult,
  RegisterPayload,
  ResetPasswordPayload,
  UserInfo,
} from "@/lib/api/types";

/**
 * Server-side auth service — the "final destination" for auth data.
 *
 * Used by the BFF route handlers under `/api/auth/*`. Calls the website API
 * service via `websiteApiClient` and normalises the response envelope. Token
 * persistence (cookies) is handled by the BFF route, not here — this service
 * is purely about the service round-trip.
 */

export const authServerService = {
  /** Login — the website API expects multipart/form-data (per legacy postman config).
   *  The password is RSA-encrypted server-side before forwarding (mirrors the
   *  legacy client-side `encryptPassword()` from `crypto.ts`). */
  async login(payload: LoginPayload): Promise<ApiResponse<LoginResult>> {
    const formData = new FormData();
    formData.append("username", payload.email);
    formData.append("password", encryptPassword(payload.password));
    return websiteApiClient.post<LoginResult>(WEBSITE_API_ENDPOINTS.AUTH.LOGIN, { formData });
  },

  /** Register a new institutional user. Password fields are RSA-encrypted
   *  server-side before forwarding (mirrors the legacy client-side flow). */
  async register(payload: RegisterPayload): Promise<ApiResponse<{ email: string }>> {
    const encryptedPassword = encryptPassword(payload.password);
    return websiteApiClient.post<{ email: string }>(WEBSITE_API_ENDPOINTS.USER.REGISTER, {
      body: { ...payload, password: encryptedPassword, passwordConfirm: encryptedPassword },
    });
  },

  /** Contact-us form submission. */
  async contact(payload: ContactPayload): Promise<ApiResponse<null>> {
    return websiteApiClient.post<null>(WEBSITE_API_ENDPOINTS.USER.CONTACT, { body: payload });
  },

  /** Email activation (type=reg callback). */
  async activateUser(email: string, code: string): Promise<ApiResponse<boolean>> {
    // Legacy website API uses path params: /user/active/{email}/{code}
    return websiteApiClient.get<boolean>(`${WEBSITE_API_ENDPOINTS.USER.ACTIVATE}/${email}/${code}`);
  },

  /** Resource review activation (type=review callback). */
  async activateResource(
    email: string,
    code: string,
    operate: string,
  ): Promise<ApiResponse<boolean>> {
    return websiteApiClient.get<boolean>(
      `${WEBSITE_API_ENDPOINTS.USER.ACTIVATE_RESOURCE}/${email}/${code}/${operate}`,
    );
  },

  /** Forgot-password request (legacy uses GET with path param). */
  async forgotPassword(email: string): Promise<ApiResponse<{ email: string }>> {
    return websiteApiClient.get<{ email: string }>(
      `${WEBSITE_API_ENDPOINTS.USER.FORGET_PASSWORD}/${email}`,
    );
  },

  /** Reset password (POST with email + code + new password). Password fields
   *  are RSA-encrypted server-side before forwarding. */
  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<null>> {
    const encryptedPassword = encryptPassword(payload.password);
    return websiteApiClient.post<null>(WEBSITE_API_ENDPOINTS.USER.RESET_PASSWORD, {
      body: { ...payload, password: encryptedPassword, passwordConfirm: encryptedPassword },
    });
  },

  /** Refresh the access token. */
  async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResult>> {
    return websiteApiClient.post<LoginResult>(WEBSITE_API_ENDPOINTS.AUTH.REFRESH, {
      body: { refresh_token: refreshToken },
    });
  },

  /** Logout — invalidate the session on the website API. */
  async logout(accessToken: string): Promise<ApiResponse<null>> {
    return websiteApiClient.delete<null>(WEBSITE_API_ENDPOINTS.AUTH.LOGOUT, { accessToken });
  },

  /** Get the current user's profile. */
  async getUserInfo(accessToken: string): Promise<ApiResponse<UserInfo>> {
    return websiteApiClient.get<UserInfo>(WEBSITE_API_ENDPOINTS.AUTH.USER_INFO, { accessToken });
  },

  /** Change password (authenticated). */
  async changePassword(
    payload: ChangePasswordPayload,
    accessToken: string,
  ): Promise<ApiResponse<null>> {
    return websiteApiClient.put<null>(WEBSITE_API_ENDPOINTS.USER.CHANGE_PASSWORD, {
      body: payload,
      accessToken,
    });
  },
};
