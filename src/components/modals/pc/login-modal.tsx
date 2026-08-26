"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useModalStore } from "@/stores/modal-store";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/lib/auth/auth-service";
import {
  validateEmail,
  validatePassword,
} from "@/lib/auth/validation";
import { ModalShell, WelcomePanel } from "@/components/modals/modal-shell";
import { cn } from "@/lib/utils";

/**
 * PC Login modal — migrated from the legacy Vue `loginModal.vue`.
 *
 * Split-panel layout: form on the left, "Welcome to REMI" on the right.
 * Preserves the original interactions: real-time field validation, forgot
 * password link, register CTA, success toast + auth-store setAuth.
 */
export function PcLoginModal({ show }: { show: boolean }) {
  const t = useTranslations("Auth");
  const closeAll = useModalStore((s) => s.closeAll);
  const showForgot = useModalStore((s) => s.showForgot);
  const showRegister = useModalStore((s) => s.showRegister);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [touched, setTouched] = React.useState({ email: false, password: false });
  const [submitting, setSubmitting] = React.useState(false);

  const emailError = touched.email ? validateEmail(email) : "";
  const passwordError = touched.password ? validatePassword(password) : "";
  const isFormValid =
    validateEmail(email) === "" && validatePassword(password) === "";

  // Reset the form whenever the modal closes.
  React.useEffect(() => {
    if (!show) {
      setEmail("");
      setPassword("");
      setTouched({ email: false, password: false });
    }
  }, [show]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isFormValid || submitting) return;

    try {
      setSubmitting(true);
      const res = await authService.login(email, password);
      if (res.code === "200" && res.data) {
        const d = res.data;
        // BFF stores tokens in httpOnly cookies; we only mirror the profile.
        setAuth({
          username: d.username ?? "",
          email: d.email ?? email,
          status: d.status ?? 1,
        });
        toast.success(t("login.success"));
        closeAll();
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      show={show}
      onClose={closeAll}
      aria-label={t("login.title")}
      welcomePanel={
        <WelcomePanel
          onRegister={() => showRegister()}
          notMemberLabel={t("login.welcomeNotMember")}
          registerLabel={t("login.welcomeRegister")}
        />
      }
    >
      <div className="flex h-full items-center justify-center bg-white p-12 max-md:p-8 max-md:px-6">
        <form className="w-full max-w-[320px] space-y-[24px]" onSubmit={onSubmit}>
          <h2 className="mb-8 text-left text-[28px] font-medium text-[#29221D] max-md:mb-6 max-md:text-[28px]">
            {t("login.title")}
          </h2>

          {/* Email */}
          <div className="space-y-0">
            <label className="block text-[14px] font-medium text-[#4E5969]">
              {t("login.emailLabel")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              placeholder={t("login.emailPlaceholder")}
              className={cn(
                "h-12 w-full border-0 border-b border-gray-300 bg-transparent px-0 pb-2 text-[14px] transition-colors placeholder:text-[#86909C] focus:border-orange-500 focus:outline-none",
                emailError && "border-red-500 focus:border-red-500"
              )}
            />
            {emailError && (
              <div className="text-[12px] text-red-500">{emailError}</div>
            )}
          </div>

          {/* Password */}
          <div className="space-y-0">
            <label className="block text-[14px] font-medium text-[#4E5969]">
              {t("login.passwordLabel")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, password: true }))}
              placeholder={t("login.passwordPlaceholder")}
              className={cn(
                "h-12 w-full border-0 border-b border-gray-300 bg-transparent px-0 pb-2 text-[14px] transition-colors placeholder:text-[#86909C] focus:border-orange-500 focus:outline-none",
                passwordError && "border-red-500 focus:border-red-500"
              )}
            />
            {passwordError && (
              <div className="text-[12px] text-red-500">{passwordError}</div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className="mt-6 h-[42px] w-full rounded-[24px] bg-orange-500 text-base text-white transition-colors duration-200 hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting ? t("login.submitting") : t("login.submit")}
          </button>

          {/* Forgot */}
          <div className="relative -top-[10px] text-right">
            <button
              type="button"
              onClick={() => showForgot()}
              className="text-sm text-[#29221D] underline transition-colors duration-200 hover:text-gray-700"
            >
              {t("login.forgot")}
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
}
