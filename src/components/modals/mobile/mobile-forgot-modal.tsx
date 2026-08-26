"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { useModalStore } from "@/stores/modal-store";
import { authService } from "@/lib/auth/auth-service";
import { validateEmail } from "@/lib/auth/validation";
import { Drawer } from "@/components/ui/drawer-panel";
import { cn } from "@/lib/utils";

/**
 * Mobile forgot-password drawer — migrated from `MobileforgotModal.vue`.
 * Simple full-screen top drawer with a single email field.
 */
export function MobileForgotModal({ show }: { show: boolean }) {
  const t = useTranslations("Auth");
  const closeAll = useModalStore((s) => s.closeAll);
  const showLogin = useModalStore((s) => s.showLogin);
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
    <Drawer
      visible={show}
      direction="top"
      height="100vh"
      zIndex={1000}
      aria-label={t("forgot.title")}
      onClose={closeAll}
    >
      <div className="relative z-[5] mt-5 bg-white px-6 pb-[34px] pt-8">
        <div className="mx-auto max-w-md">
          <h2 className="mb-8 text-[28px] font-medium leading-tight text-[#29221D]">
            {t("forgot.title")}
          </h2>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
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
              className="mb-2 h-12 w-full rounded-[24px] bg-orange-500 text-base text-white transition-colors duration-200 hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {submitting ? t("forgot.submitting") : t("forgot.submit")}
            </button>

            <div className="relative -top-[20px] text-right">
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
      </div>
    </Drawer>
  );
}
