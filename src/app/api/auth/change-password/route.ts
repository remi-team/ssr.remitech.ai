import { authServerService } from "@/services/server/auth-server-service";
import { errorResponse, jsonResponse, getAccessToken } from "@/lib/api/cookies";
import type { ChangePasswordPayload } from "@/lib/api/types";

/** PUT /api/auth/change-password — BFF bridge for changing password. */
export const revalidate = 0;

export async function PUT(request: Request) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return jsonResponse({ code: "401", message: "Not authenticated" }, 401);
    }
    const body = (await request.json().catch(() => ({}))) as ChangePasswordPayload;
    if (!body?.newPassword) {
      return jsonResponse({ code: "400", message: "New password is required" }, 400);
    }
    const res = await authServerService.changePassword(body, accessToken);
    return jsonResponse(res);
  } catch (err) {
    return errorResponse(err);
  }
}
