import { authServerService } from "@/services/server/auth-server-service";
import { errorResponse, jsonResponse } from "@/lib/api/cookies";
import type { ResetPasswordPayload } from "@/lib/api/types";

/** POST /api/auth/reset-password — BFF bridge for password reset. */
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<ResetPasswordPayload>;
    if (!body?.email || !body?.code || !body?.password) {
      return jsonResponse({ code: "400", message: "Email, code and password are required" }, 400);
    }
    const res = await authServerService.resetPassword(body as ResetPasswordPayload);
    return jsonResponse(res);
  } catch (err) {
    return errorResponse(err);
  }
}
