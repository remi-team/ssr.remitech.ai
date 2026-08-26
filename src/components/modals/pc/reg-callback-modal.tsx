"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { useModalStore } from "@/stores/modal-store";
import { ModalShell, WelcomePanel } from "@/components/modals/modal-shell";

/**
 * PC Reg-callback modal — migrated from the legacy Vue `regCallbackModal.vue`.
 *
 * Shown after successful registration or password-reset request. Reads
 * `callbackEmail` + `callbackType` from the modal store to render the right
 * confirmation copy. A single "Back to Log in" link returns to the login modal.
 */
export function PcRegCallbackModal({ show }: { show: boolean }) {
  const t = useTranslations("Auth");
  const closeAll = useModalStore((s) => s.closeAll);
  const showLogin = useModalStore((s) => s.showLogin);
  const showRegister = useModalStore((s) => s.showRegister);
  const email = useModalStore((s) => s.callbackEmail);
  const type = useModalStore((s) => s.callbackType);

  const isReg = type === "reg";

  return (
    <ModalShell
      show={show}
      onClose={closeAll}
      aria-label={isReg ? t("callback.regTitle") : t("callback.resetTitle")}
      welcomePanel={
        <WelcomePanel
          onRegister={() => showRegister()}
          notMemberLabel={t("login.welcomeNotMember")}
          registerLabel={t("login.welcomeRegister")}
        />
      }
    >
      <div className="flex h-full items-center bg-white p-12 max-md:p-8 max-md:px-6">
        <div className="w-full max-w-[320px] text-left">
          <h2 className="mb-8 mt-[24px] text-left text-[28px] font-light text-[#29221D] max-md:mb-6 max-md:text-[28px]">
            {isReg ? t("callback.regTitle") : t("callback.resetTitle")}
          </h2>

          <div className="space-y-6">
            <p className="text-[14px] leading-relaxed text-[#9C9086]">
              {isReg ? t("callback.regMessage") : t("callback.resetMessage")}{" "}
              <span className="text-orange-500">{email}</span>.{" "}
              {t("callback.spamNote")}
            </p>

            <button
              type="button"
              onClick={() => showLogin()}
              className="mt-8 h-[42px] w-full rounded-[24px] text-[16px] text-[#69584E] transition-colors duration-200"
            >
              {t("callback.backToLogin")}
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
