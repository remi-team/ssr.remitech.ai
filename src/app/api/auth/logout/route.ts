import { authServerService } from "@/services/server/auth-server-service";
import { errorResponse, jsonResponse, getAccessToken, clearTokens } from "@/lib/api/cookies";

/** DELETE /api/auth/logout — BFF bridge for logout (clears token cookies). */
export const revalidate = 0;

export async function DELETE() {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      await authServerService.logout(accessToken);
    }
    await clearTokens();
    return jsonResponse({ code: "200", message: "Logged out.", data: null });
  } catch (err) {
    // Even if the website API logout fails, clear local cookies.
    await clearTokens();
    return errorResponse(err);
  }
}
