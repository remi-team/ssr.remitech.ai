import { authServerService } from "@/services/server/auth-server-service";
import { errorResponse, jsonResponse } from "@/lib/api/cookies";

/** POST /api/auth/activate — BFF bridge for email activation (type=reg). */
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email: string = body?.email ?? "";
    const code: string = body?.code ?? "";
    if (!email || !code) {
      return jsonResponse({ code: "400", message: "Email and code are required" }, 400);
    }
    const res = await authServerService.activateUser(email, code);
    return jsonResponse(res);
  } catch (err) {
    return errorResponse(err);
  }
}
