import { authServerService } from "@/services/server/auth-server-service";
import { errorResponse, jsonResponse } from "@/lib/api/cookies";
import type { RegisterPayload } from "@/lib/api/types";

/** POST /api/auth/register — BFF bridge for registration. */
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<RegisterPayload>;
    if (!body?.companyEmail) {
      return jsonResponse({ code: "400", message: "Email is required" }, 400);
    }
    const res = await authServerService.register(body as RegisterPayload);
    return jsonResponse(res);
  } catch (err) {
    return errorResponse(err);
  }
}
