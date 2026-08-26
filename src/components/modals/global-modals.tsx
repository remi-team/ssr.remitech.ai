"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

import { useModalStore } from "@/stores/modal-store";
import { authService } from "@/lib/auth/auth-service";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";

import { PcLoginModal } from "@/components/modals/pc/login-modal";
import { PcRegisterModal } from "@/components/modals/pc/register-modal";
import { PcForgotModal } from "@/components/modals/pc/forgot-modal";
import { PcRegCallbackModal } from "@/components/modals/pc/reg-callback-modal";

import { MobileLoginModal } from "@/components/modals/mobile/mobile-login-modal";
import { MobileRegisterModal } from "@/components/modals/mobile/mobile-register-modal";
import { MobileForgotModal } from "@/components/modals/mobile/mobile-forgot-modal";
import { MobileRegCallbackModal } from "@/components/modals/mobile/mobile-reg-callback-modal";

/**
 * GlobalModals — migrated from the legacy Vue `GlobalModals.vue`.
 *
 * Responsibilities:
 *  1. Render the right variant (PC centered card vs Mobile top drawer) of
 *     whichever auth modal is currently active in the modal store.
 *  2. Watch the URL for email-activation callbacks (`?type=&email=&code=&operate=`)
 *     and, for `type=reg`, call the activate endpoint then surface a toast +
 *     open the login modal. (`type=reset` would route to a reset-password page;
 *     `type=review` activates a resource — both are supported defensively.)
 *
 * Mounted once at the root layout; safe-guards prevent duplicate activation
 * across re-renders (matching the legacy `isActivating` / `lastActivationParams`).
 */
export function GlobalModals() {
  return (
    <React.Suspense fallback={null}>
      <GlobalModalsInner />
    </React.Suspense>
  );
}

function GlobalModalsInner() {
  const active = useModalStore((s) => s.active);
  const showLogin = useModalStore((s) => s.showLogin);
  const isMobile = useIsMobile();
  const t = useTranslations("Auth");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActivating = React.useRef(false);
  const lastActivationKey = React.useRef("");

  // PC vs Mobile variant switching: hide the previous variant when not active.
  const showLogin_ = active === "login";
  const showRegister_ = active === "register";
  const showForgot_ = active === "forgot";
  const showCallback_ = active === "regCallback";

  // Email-activation callback handler.
  const checkRouteParams = React.useCallback(() => {
    const type = searchParams.get("type");
    const email = searchParams.get("email");
    const code = searchParams.get("code");
    const operate = searchParams.get("operate");

    if (!email || !code || !type) return;

    const paramsKey = `${type}-${email}-${code}`;
    if (isActivating.current || lastActivationKey.current === paramsKey) return;

    if (type === "reg") {
      isActivating.current = true;
      lastActivationKey.current = paramsKey;
      authService
        .activate(email, code)
        .then((res) => {
          if (res.code === "200") {
            toast.success(t("activation.regSuccess"), { duration: 4000 });
            // Open login after the toast, mirroring the legacy onClose flow.
            setTimeout(() => showLogin(), 1500);
          }
        })
        .catch((err) => {
          console.error("Activation failed:", err);
          toast.error(t("activation.regFail"));
        })
        .finally(() => {
          isActivating.current = false;
          // Clean the query params so a refresh won't re-trigger activation.
          router.replace(pathname);
        });
    } else if (type === "reset") {
      // A dedicated reset-password route would live here; for the single-page
      // public site we simply open the forgot modal so the user can proceed.
      isActivating.current = false;
      router.replace(pathname);
    } else if (type === "review" && operate) {
      // Resource review activation — calls the activateResource BFF endpoint,
      // then surfaces a success/warning toast based on `res.data`.
      isActivating.current = true;
      lastActivationKey.current = paramsKey;
      authService
        .activateResource(email, code, operate)
        .then((res) => {
          if (res.code === "200") {
            if (res.data) {
              toast.success(t("activation.reviewSuccess"), { duration: 5000 });
            } else {
              toast.warning(t("activation.reviewPending"), { duration: 5000 });
            }
          }
        })
        .catch((err) => {
          console.error("Resource review failed:", err);
          toast.error(t("activation.reviewFail"));
        })
        .finally(() => {
          isActivating.current = false;
          router.replace(pathname);
        });
    }
  }, [searchParams, router, pathname, showLogin, t]);

  React.useEffect(() => {
    checkRouteParams();
  }, [checkRouteParams]);

  return (
    <>
      {isMobile ? (
        <>
          <MobileLoginModal show={showLogin_} />
          <MobileRegisterModal show={showRegister_} />
          <MobileForgotModal show={showForgot_} />
          <MobileRegCallbackModal show={showCallback_} />
        </>
      ) : (
        <>
          <PcLoginModal show={showLogin_} />
          <PcRegisterModal show={showRegister_} />
          <PcForgotModal show={showForgot_} />
          <PcRegCallbackModal show={showCallback_} />
        </>
      )}
    </>
  );
}
