import { authServerService } from "@/services/server/auth-server-service";
import { errorResponse, jsonResponse, getAccessToken } from "@/lib/api/cookies";

/** GET /api/auth/user — BFF bridge for fetching the current user's profile. */
export const revalidate = 0;

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return jsonResponse({ code: "401", message: "Not authenticated" }, 401);
    }
    const res = await authServerService.getUserInfo(accessToken);
    return jsonResponse(res);
  } catch (err) {
    return errorResponse(err);
  }
}
