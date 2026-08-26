import { authServerService } from "@/services/server/auth-server-service";
import { errorResponse, jsonResponse, setTokenPair } from "@/lib/api/cookies";
import { BUSINESS_CODE } from "@/lib/api/config";
import type { LoginPayload } from "@/lib/api/types";

/**
 * POST /api/auth/login — BFF bridge for login.
 *
 * Calls the upstream auth service, then stores the returned token pair in
 * httpOnly cookies. The client only receives the user profile (never the raw
 * tokens) in the response body.
 */
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<LoginPayload>;
    const email = body?.email ?? "";
    const password = body?.password ?? "";

    if (!email || !password) {
      return jsonResponse(
        { code: "400", message: "Email and password are required" },
        400,
      );
    }

    const res = await authServerService.login({ email, password });

    if (res.code === BUSINESS_CODE.SUCCESS && res.data) {
      const d = res.data;
      // Persist tokens server-side.
      await setTokenPair(
        d.accessToken ?? d.access_token,
        d.refreshToken ?? d.refresh_token,
      );
      // Return only the user profile to the client.
      return jsonResponse({
        code: res.code,
        message: res.message,
        data: {
          username: d.username ?? d.user?.name ?? "",
          email: d.email ?? d.user?.email ?? email,
          status: d.status ?? 1,
        },
      });
    }

    return jsonResponse(res, 200);
  } catch (err) {
    return errorResponse(err);
  }
}
