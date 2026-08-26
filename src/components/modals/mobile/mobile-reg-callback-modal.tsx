"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { useModalStore } from "@/stores/modal-store";
import { Drawer } from "@/components/ui/drawer-panel";

/**
 * Mobile reg-callback drawer — migrated from `MobileRegCallbackModal.vue`.
 *
 * Full-screen top drawer showing the registration/reset confirmation message
 * and a "Back to Log in" button.
 */
export function MobileRegCallbackModal({ show }: { show: boolean }) {
  const t = useTranslations("Auth");
  const closeAll = useModalStore((s) => s.closeAll);
  const showLogin = useModalStore((s) => s.showLogin);
  const email = useModalStore((s) => s.callbackEmail);
  const type = useModalStore((s) => s.callbackType);

  const isReg = type === "reg";

  return (
    <Drawer
      visible={show}
      direction="top"
      height="100vh"
      zIndex={1000}
      aria-label={isReg ? t("callback.regTitle") : t("callback.resetTitle")}
      onClose={closeAll}
    >
      <div className="bg-white px-6 py-12">
        <div className="mx-auto max-w-md">
          <h2 className="mb-8 text-left text-[28px] font-light leading-tight text-gray-800">
            {isReg ? t("callback.regTitle") : t("callback.resetTitle")}
          </h2>
          <div className="space-y-6 text-left">
            <p className="text-[16px] leading-relaxed text-gray-700">
              {isReg ? t("callback.regMessage") : t("callback.resetMessage")}{" "}
              <span className="text-orange-500">{email}</span>.{" "}
              {t("callback.spamNote")}
            </p>
            <button
              type="button"
              onClick={() => showLogin()}
              className="mt-8 h-12 w-full rounded-[24px] text-base text-[#69584E] transition-colors duration-200"
            >
              {t("callback.backToLogin")}
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
