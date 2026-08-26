import "server-only";

import { API_ENDPOINTS, BUSINESS_CODE } from "@/lib/api/config";
import { upstreamClient } from "@/lib/api/upstream";
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
 * Used by the BFF route handlers under `/api/auth/*`. Calls the upstream
 * backend via `upstreamClient` and normalises the response envelope. Token
 * persistence (cookies) is handled by the BFF route, not here — this service
 * is purely about the upstream round-trip.
 *
 * When the upstream is unavailable, a placeholder implementation kicks in so
 * the UI is fully functional in development / preview. Swap the placeholder
 * block for the real `upstreamClient` call to go live.
 */

/** Whether to use the placeholder (mock) implementation. */
const USE_PLACEHOLDER = !process.env.UPSTREAM_API_HOST && !process.env.UPSTREAM_SERVER_URL;

export const authServerService = {
  /** Login — upstream expects multipart/form-data (per legacy postman config). */
  async login(payload: LoginPayload): Promise<ApiResponse<LoginResult>> {
    if (USE_PLACEHOLDER) {
      return placeholderLogin(payload);
    }
    const formData = new FormData();
    formData.append("username", payload.email);
    formData.append("password", payload.password);
    return upstreamClient.post<LoginResult>(API_ENDPOINTS.AUTH.LOGIN, { formData });
  },

  /** Register a new institutional user. */
  async register(payload: RegisterPayload): Promise<ApiResponse<{ email: string }>> {
    if (USE_PLACEHOLDER) {
      return {
        code: BUSINESS_CODE.SUCCESS,
        message: "Registration received. Please check your email to activate.",
        data: { email: payload.companyEmail },
      };
    }
    return upstreamClient.post<{ email: string }>(API_ENDPOINTS.USER.REGISTER, { body: payload });
  },

  /** Contact-us form submission. */
  async contact(payload: ContactPayload): Promise<ApiResponse<null>> {
    if (USE_PLACEHOLDER) {
      return { code: BUSINESS_CODE.SUCCESS, message: "Message received.", data: null };
    }
    return upstreamClient.post<null>(API_ENDPOINTS.USER.CONTACT, { body: payload });
  },

  /** Email activation (type=reg callback). */
  async activateUser(email: string, code: string): Promise<ApiResponse<boolean>> {
    if (USE_PLACEHOLDER) {
      return {
        code: BUSINESS_CODE.SUCCESS,
        message: "Account activated successfully. You can now log in.",
        data: true,
      };
    }
    // Legacy upstream uses path params: /user/active/{email}/{code}
    return upstreamClient.get<boolean>(`${API_ENDPOINTS.USER.ACTIVATE}/${email}/${code}`);
  },

  /** Resource review activation (type=review callback). */
  async activateResource(
    email: string,
    code: string,
    operate: string,
  ): Promise<ApiResponse<boolean>> {
    if (USE_PLACEHOLDER) {
      return { code: BUSINESS_CODE.SUCCESS, message: "Resource review processed.", data: true };
    }
    return upstreamClient.get<boolean>(
      `${API_ENDPOINTS.USER.ACTIVATE_RESOURCE}/${email}/${code}/${operate}`,
    );
  },

  /** Forgot-password request (legacy uses GET with path param). */
  async forgotPassword(email: string): Promise<ApiResponse<{ email: string }>> {
    if (USE_PLACEHOLDER) {
      return { code: BUSINESS_CODE.SUCCESS, message: "Reset email sent.", data: { email } };
    }
    return upstreamClient.get<{ email: string }>(
      `${API_ENDPOINTS.USER.FORGET_PASSWORD}/${email}`,
    );
  },

  /** Reset password (POST with email + code + new password). */
  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<null>> {
    if (USE_PLACEHOLDER) {
      return { code: BUSINESS_CODE.SUCCESS, message: "Password reset successful.", data: null };
    }
    return upstreamClient.post<null>(API_ENDPOINTS.USER.RESET_PASSWORD, { body: payload });
  },

  /** Refresh the access token. */
  async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResult>> {
    if (USE_PLACEHOLDER) {
      return {
        code: BUSINESS_CODE.SUCCESS,
        data: {
          accessToken: "placeholder-access-token-refreshed",
          refreshToken,
          username: "User",
          status: 1,
        },
      };
    }
    return upstreamClient.post<LoginResult>(API_ENDPOINTS.AUTH.REFRESH, {
      body: { refresh_token: refreshToken },
    });
  },

  /** Logout — invalidate the session upstream. */
  async logout(accessToken: string): Promise<ApiResponse<null>> {
    if (USE_PLACEHOLDER) {
      return { code: BUSINESS_CODE.SUCCESS, message: "Logged out.", data: null };
    }
    return upstreamClient.delete<null>(API_ENDPOINTS.AUTH.LOGOUT, { accessToken });
  },

  /** Get the current user's profile. */
  async getUserInfo(accessToken: string): Promise<ApiResponse<UserInfo>> {
    if (USE_PLACEHOLDER) {
      return {
        code: BUSINESS_CODE.SUCCESS,
        data: { username: "User", email: "user@remi.tech", status: 1 },
      };
    }
    return upstreamClient.get<UserInfo>(API_ENDPOINTS.AUTH.USER_INFO, { accessToken });
  },

  /** Change password (authenticated). */
  async changePassword(
    payload: ChangePasswordPayload,
    accessToken: string,
  ): Promise<ApiResponse<null>> {
    if (USE_PLACEHOLDER) {
      return { code: BUSINESS_CODE.SUCCESS, message: "Password changed.", data: null };
    }
    return upstreamClient.put<null>(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
      body: payload,
      accessToken,
    });
  },
};

// ---------------------------------------------------------------------------
// Placeholder implementations (development / preview without a real backend)
// ---------------------------------------------------------------------------

function placeholderLogin(payload: LoginPayload): ApiResponse<LoginResult> {
  if (!payload.email || !payload.password) {
    return { code: "400", message: "Email and password are required" };
  }
  return {
    code: BUSINESS_CODE.SUCCESS,
    message: "ok",
    data: {
      accessToken: "placeholder-access-token",
      refreshToken: "placeholder-refresh-token",
      username: payload.email.split("@")[0] || "User",
      email: payload.email,
      status: 1,
    },
  };
}
