import { authServerService } from "@/services/server/auth-server-service";
import { errorResponse, jsonResponse } from "@/lib/api/cookies";

/** POST /api/auth/activate-resource — BFF bridge for resource review activation (type=review). */
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email: string = body?.email ?? "";
    const code: string = body?.code ?? "";
    const operate: string = body?.operate ?? "";
    if (!email || !code || !operate) {
      return jsonResponse(
        { code: "400", message: "Email, code and operate are required" },
        400,
      );
    }
    const res = await authServerService.activateResource(email, code, operate);
    return jsonResponse(res);
  } catch (err) {
    return errorResponse(err);
  }
}
