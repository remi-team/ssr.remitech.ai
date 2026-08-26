"use client";

import { create } from "zustand";

/**
 * Modal orchestration store — migrated from the legacy Vue `useModalStore`
 * (Pinia). Single source of truth for which auth modal is currently visible.
 *
 * Only one auth modal is shown at a time; cross-modal navigation (login →
 * register → callback) is expressed as a sequence of `show*` calls that
 * implicitly close the previous modal.
 *
 * `callbackEmail` + `callbackType` carry context into the RegCallback modal
 * (registration vs. password-reset feedback).
 */
export type ModalKind = "login" | "register" | "forgot" | "regCallback" | null;

export type RegCallbackType = "reg" | "reset";

interface ModalState {
  /** Currently visible modal kind (null = none). */
  active: ModalKind;
  /** Email used in the success/callback message. */
  callbackEmail: string;
  /** Whether the callback is a registration confirmation or a reset feedback. */
  callbackType: RegCallbackType;

  showLogin: () => void;
  showRegister: () => void;
  showForgot: () => void;
  showRegCallback: (email: string, type: RegCallbackType) => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  active: null,
  callbackEmail: "",
  callbackType: "reg",

  showLogin: () => set({ active: "login" }),
  showRegister: () => set({ active: "register" }),
  showForgot: () => set({ active: "forgot" }),
  showRegCallback: (email, type) =>
    set({ active: "regCallback", callbackEmail: email, callbackType: type }),
  closeAll: () => set({ active: null }),
}));

/** Convenience selector hooks. */
export const useActiveModal = () => useModalStore((s) => s.active);
