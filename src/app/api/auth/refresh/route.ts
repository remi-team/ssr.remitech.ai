import { authServerService } from "@/services/server/auth-server-service";
import {
  errorResponse,
  jsonResponse,
  getRefreshToken,
  setTokenPair,
  businessCodeStatus,
} from "@/lib/api/cookies";

/** POST /api/auth/refresh — BFF bridge for token refresh. */
export const revalidate = 0;

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return jsonResponse({ code: "401", message: "No refresh token" }, 401);
    }
    const res = await authServerService.refreshToken(refreshToken);
    if (res.data) {
      // Persist new tokens in httpOnly cookies; don't leak them to the client.
      await setTokenPair(
        res.data.accessToken ?? res.data.access_token,
        res.data.refreshToken ?? res.data.refresh_token,
      );
    }
    // Return only success status — tokens stay in cookies. A rejected
    // refresh token surfaces as 401, never 200.
    return jsonResponse(
      { code: res.code, message: res.message, data: null },
      businessCodeStatus(res.code),
    );
  } catch (err) {
    return errorResponse(err);
  }
}
