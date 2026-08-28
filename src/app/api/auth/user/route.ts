import { authServerService } from "@/services/server/auth-server-service";
import { errorResponse, jsonResponse, getAccessToken, businessCodeStatus } from "@/lib/api/cookies";
import { BUSINESS_CODE } from "@/lib/api/config";

/** GET /api/auth/user — BFF bridge for fetching the current user's profile. */
export const revalidate = 0;

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return jsonResponse({ code: "401", message: "Not authenticated" }, 401);
    }
    const res = await authServerService.getUserInfo(accessToken);
    // A rejected token is an auth failure at the HTTP level, not a 200.
    const status =
      res.code === BUSINESS_CODE.SUCCESS || res.code === BUSINESS_CODE.SUCCESS_ALT
        ? 200
        : 401;
    return jsonResponse(res, status);
  } catch (err) {
    return errorResponse(err);
  }
}
