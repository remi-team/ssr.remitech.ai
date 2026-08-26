"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { useModalStore } from "@/stores/modal-store";
import { authService } from "@/lib/auth/auth-service";
import { validateEmail } from "@/lib/auth/validation";
import { ModalShell, WelcomePanel } from "@/components/modals/modal-shell";
import { cn } from "@/lib/utils";

/**
 * PC Forgot-password modal — migrated from the legacy Vue `forgotModal.vue`.
 *
 * Split-panel layout identical to Login, but with a single email field and a
 * "Reset Password" submit that triggers `showRegCallback(email, 'reset')`.
 */
export function PcForgotModal({ show }: { show: boolean }) {
  const t = useTranslations("Auth");
  const closeAll = useModalStore((s) => s.closeAll);
  const showLogin = useModalStore((s) => s.showLogin);
  const showRegister = useModalStore((s) => s.showRegister);
  const showRegCallback = useModalStore((s) => s.showRegCallback);

  const [email, setEmail] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!show) {
      setEmail("");
      setTouched(false);
    }
  }, [show]);

  const emailError = touched ? validateEmail(email) : "";
  const isFormValid = validateEmail(email) === "";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isFormValid || submitting) return;
    try {
      setSubmitting(true);
      const res = await authService.forgotPassword(email);
      if (res.code === "200") {
        showRegCallback(email, "reset");
      }
    } catch (err) {
      console.error("Reset password failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      show={show}
      onClose={closeAll}
      aria-label={t("forgot.title")}
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
          <h2 className="mb-8 text-left text-[28px] font-medium leading-tight text-[#29221D] max-md:mb-6 max-md:text-[28px]">
            {t("forgot.title")}
          </h2>

          <div className="space-y-0">
            <label className="block text-[14px] font-medium text-[#4E5969]">
              {t("forgot.emailLabel")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder={t("forgot.emailPlaceholder")}
              className={cn(
                "h-12 w-full border-0 border-b border-gray-300 bg-transparent px-0 pb-2 text-[14px] transition-colors placeholder:text-[#86909C] focus:border-orange-500 focus:outline-none",
                emailError && "border-red-500 focus:border-red-500"
              )}
            />
            {emailError && (
              <div className="text-[12px] text-red-500">{emailError}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className="mt-6 h-[42px] w-full rounded-[24px] bg-orange-500 text-base text-white transition-colors duration-200 hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting ? t("forgot.submitting") : t("forgot.submit")}
          </button>

          <div className="relative -top-[10px] text-right">
            <button
              type="button"
              onClick={() => showLogin()}
              className="text-sm text-[#29221D] underline transition-colors duration-200 hover:text-gray-700"
            >
              {t("forgot.backToLogin")}
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
}
