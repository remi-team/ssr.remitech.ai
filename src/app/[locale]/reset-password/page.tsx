import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import { Suspense } from "react";

import { routing } from "@/i18n/routing";
import { ResetPasswordContent } from "./_components/reset-password-content";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Reset Password page — migrated from legacy Vue `resetPassword.vue`.
 *
 * Features:
 *  • Reads email + code from URL query params
 *  • Password / confirm-password fields with client-side validation
 *  • Submits via BFF `/api/auth/reset-password`
 *
 * Note: hide-header + hide-footer layout variant applied via the locale layout.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const title =
    validLocale === "zh" ? "重置密码 — Remi" : "Reset Password — Remi";
  return { title, robots: "noindex" };
}

export default async function ResetPasswordPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
