import { authServerService } from "@/services/server/auth-server-service";
import { errorResponse, jsonResponse } from "@/lib/api/cookies";
import type { ContactPayload } from "@/lib/api/types";

/** POST /api/auth/contact — BFF bridge for the contact-us form. */
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<ContactPayload>;
    if (!body?.companyEmail || !body?.message) {
      return jsonResponse({ code: "400", message: "Email and message are required" }, 400);
    }
    const res = await authServerService.contact(body as ContactPayload);
    return jsonResponse(res);
  } catch (err) {
    return errorResponse(err);
  }
}
