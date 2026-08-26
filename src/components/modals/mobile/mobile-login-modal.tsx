"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useModalStore } from "@/stores/modal-store";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/lib/auth/auth-service";
import { validateEmail, validatePassword } from "@/lib/auth/validation";
import { Drawer } from "@/components/ui/drawer-panel";
import { cn } from "@/lib/utils";

/**
 * Mobile login drawer — migrated from the legacy Vue `MobileloginModal.vue`.
 *
 * Full-screen top drawer: Welcome REMI header (image-backed) on top, white
 * form sheet (with -mt-5 overlap) below. Preserves forgot-password + register
 * cross-modal navigation.
 */
export function MobileLoginModal({ show }: { show: boolean }) {
  const t = useTranslations("Auth");
  const closeAll = useModalStore((s) => s.closeAll);
  const showForgot = useModalStore((s) => s.showForgot);
  const showRegister = useModalStore((s) => s.showRegister);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [touched, setTouched] = React.useState({ email: false, password: false });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!show) {
      setEmail("");
      setPassword("");
      setTouched({ email: false, password: false });
    }
  }, [show]);

  const emailError = touched.email ? validateEmail(email) : "";
  const passwordError = touched.password ? validatePassword(password) : "";
  const isFormValid =
    validateEmail(email) === "" && validatePassword(password) === "";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isFormValid || submitting) return;
    try {
      setSubmitting(true);
      const res = await authService.login(email, password);
      if (res.code === "200" && res.data) {
        const d = res.data;
        // Show success toast, then set auth + close (mirrors legacy ElMessage flow).
        toast.success(t("login.success"), { duration: 1000 });
        // BFF stores tokens in httpOnly cookies; we only mirror the profile.
        setAuth({
          username: d.username ?? "",
          email: d.email ?? email,
          status: d.status ?? 1,
        });
        closeAll();
      }
    } catch (err) {
      console.error("Login failed:", err);
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
      closeButtonColor="#fff"
      aria-label={t("login.title")}
      onClose={closeAll}
    >
      {/* Welcome background header */}
      <div className="welcome-bg relative flex flex-1 flex-col justify-center p-10 text-center text-white">
        <div className="absolute inset-0 bg-linear-to-b from-black/25 to-black/35" />
        <div className="relative z-10 text-left">
          <h1 className="mb-6 text-[28px] font-light tracking-tight">
            {t("login.welcomeTitle")}
          </h1>
          <div className="text-base text-left">
            <span>{t("login.welcomeNotMember")} </span>
            <button
              type="button"
              onClick={() => showRegister()}
              className="text-white underline transition-opacity hover:opacity-80"
            >
              {t("login.welcomeRegister")}
            </button>
          </div>
        </div>
      </div>

      {/* Login form sheet (overlaps the header) */}
      <div className="relative z-[5] -mt-5 bg-white px-6 pb-20 pt-8"
           style={{ paddingBottom: "max(env(safe-area-inset-bottom, 20px), 80px)" }}>
        <div className="mx-auto max-w-md">
          <h2 className="mb-8 text-[28px] font-medium text-[#29221D]">
            {t("login.title")}
          </h2>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
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

            <div className="space-y-2">
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

            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className="mb-2 h-12 w-full rounded-[24px] bg-orange-500 text-base text-white transition-colors duration-200 hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {submitting ? t("login.submitting") : t("login.submit")}
            </button>

            <div className="relative -top-[20px] text-right">
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
      </div>
    </Drawer>
  );
}
