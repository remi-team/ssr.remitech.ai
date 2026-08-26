import { authServerService } from "@/services/server/auth-server-service";
import { errorResponse, jsonResponse } from "@/lib/api/cookies";

/** POST /api/auth/forgot — BFF bridge for forgot-password. */
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email: string = body?.email ?? "";
    if (!email) {
      return jsonResponse({ code: "400", message: "Email is required" }, 400);
    }
    const res = await authServerService.forgotPassword(email);
    return jsonResponse(res);
  } catch (err) {
    return errorResponse(err);
  }
}
