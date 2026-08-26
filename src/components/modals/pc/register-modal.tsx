"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useModalStore } from "@/stores/modal-store";
import { authService } from "@/lib/auth/auth-service";
import {
  validateEmail,
  validatePassword,
  validateRepeatPassword,
  validateRequired,
} from "@/lib/auth/validation";
import { ModalShell } from "@/components/modals/modal-shell";
import { cn } from "@/lib/utils";

interface RegForm {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  repeatPassword: string;
  contactNumber: string;
  companyName: string;
  companyType: string;
  country: string;
  relevantAuthorities: string;
}

const EMPTY: RegForm = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  repeatPassword: "",
  contactNumber: "",
  companyName: "",
  companyType: "",
  country: "",
  relevantAuthorities: "",
};

/**
 * PC Register modal — migrated from the legacy Vue `regModal.vue`.
 *
 * Single full-width card (size="lg"), 10-field form, real-time validation,
 * "Become a member" submit → success shows the RegCallback modal.
 */
export function PcRegisterModal({ show }: { show: boolean }) {
  const t = useTranslations("Auth");
  const closeAll = useModalStore((s) => s.closeAll);
  const showLogin = useModalStore((s) => s.showLogin);
  const showRegCallback = useModalStore((s) => s.showRegCallback);

  const [form, setForm] = React.useState<RegForm>(EMPTY);
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!show) {
      setForm(EMPTY);
      setTouched({});
    }
  }, [show]);

  const errors: Record<string, string> = {
    firstname: touched.firstname ? validateRequired(form.firstname, "First name") : "",
    lastname: touched.lastname ? validateRequired(form.lastname, "Last name") : "",
    email: touched.email ? validateEmail(form.email) : "",
    password: touched.password ? validatePassword(form.password) : "",
    repeatPassword: touched.repeatPassword ? validateRepeatPassword(form.repeatPassword, form.password) : "",
    companyName: touched.companyName ? validateRequired(form.companyName, "Company name") : "",
  };

  const isFormValid =
    validateRequired(form.firstname, "") === "" &&
    validateRequired(form.lastname, "") === "" &&
    validateEmail(form.email) === "" &&
    validatePassword(form.password) === "" &&
    validateRepeatPassword(form.repeatPassword, form.password) === "" &&
    validateRequired(form.companyName, "") === "";

  const set = (field: keyof RegForm, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setTouched((p) => ({ ...p, [field]: true }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      firstname: true,
      lastname: true,
      email: true,
      password: true,
      repeatPassword: true,
      companyName: true,
    });
    if (!isFormValid || submitting) return;

    try {
      setSubmitting(true);
      const res = await authService.register({
        firstname: form.firstname,
        lastname: form.lastname,
        companyEmail: form.email,
        password: form.password,
        passwordConfirm: form.repeatPassword,
        contactNumber: form.contactNumber,
        companyName: form.companyName,
        companyType: form.companyType,
        country: form.country,
        relevantAuthorities: form.relevantAuthorities,
      });
      if (res.code === "200") {
        showRegCallback(form.email, "reg");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Company type options: value === label (matches legacy API contract where
  // the full label text is submitted as the companyType field value).
  const companyTypeOptions = [
    { value: t("register.companyTypes.bank"), label: t("register.companyTypes.bank") },
    { value: t("register.companyTypes.nonBank"), label: t("register.companyTypes.nonBank") },
    { value: t("register.companyTypes.blockchain"), label: t("register.companyTypes.blockchain") },
    { value: t("register.companyTypes.others"), label: t("register.companyTypes.others") },
  ];

  const fieldClass = (err: string) =>
    cn(
      "h-10 w-full border-0 border-b border-gray-300 bg-transparent px-0 pb-1 text-sm transition-colors placeholder:text-[#86909C] focus:border-orange-500 focus:outline-none",
      err && "border-red-500 focus:border-red-500"
    );

  const ErrorMsg = ({ msg }: { msg: string }) =>
    msg ? (
      <div className="min-h-[1rem] text-xs text-red-500">{msg}</div>
    ) : (
      <div className="min-h-[1rem]" />
    );

  return (
    <ModalShell show={show} onClose={closeAll} size="lg" aria-label={t("register.title")}>
      <div className="max-h-[90vh] overflow-y-auto p-8 lg:p-12">
        <form className="mx-auto w-full max-w-3xl space-y-4" onSubmit={onSubmit}>
          <h2 className="mb-6 text-left text-2xl font-medium text-[#29221D] lg:text-3xl">
            {t("register.title")}
          </h2>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* First + Last name */}
            <div className="space-y-1">
              <label className="block text-sm text-[#4E5969]">{t("register.firstname")}</label>
              <input
                type="text"
                value={form.firstname}
                onChange={(e) => set("firstname", e.target.value)}
                placeholder={t("register.firstnamePlaceholder")}
                className={fieldClass(errors.firstname)}
              />
              <ErrorMsg msg={errors.firstname} />
            </div>
            <div className="space-y-1">
              <label className="block text-sm text-[#4E5969]">{t("register.lastname")}</label>
              <input
                type="text"
                value={form.lastname}
                onChange={(e) => set("lastname", e.target.value)}
                placeholder={t("register.lastnamePlaceholder")}
                className={fieldClass(errors.lastname)}
              />
              <ErrorMsg msg={errors.lastname} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm text-[#4E5969]">{t("register.email")}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder={t("register.emailPlaceholder")}
                className={fieldClass(errors.email)}
              />
              <ErrorMsg msg={errors.email} />
            </div>
            <div className="space-y-1">
              <label className="block text-sm text-[#4E5969]">{t("register.contact")}</label>
              <input
                type="tel"
                value={form.contactNumber}
                onChange={(e) => set("contactNumber", e.target.value)}
                placeholder={t("register.contactPlaceholder")}
                className={fieldClass("")}
              />
              <ErrorMsg msg="" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm text-[#4E5969]">{t("register.password")}</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder={t("register.passwordPlaceholder")}
                className={fieldClass(errors.password)}
              />
              <ErrorMsg msg={errors.password} />
            </div>
            <div className="space-y-1">
              <label className="block text-sm text-[#4E5969]">{t("register.repeatPassword")}</label>
              <input
                type="password"
                value={form.repeatPassword}
                onChange={(e) => set("repeatPassword", e.target.value)}
                placeholder={t("register.repeatPasswordPlaceholder")}
                className={fieldClass(errors.repeatPassword)}
              />
              <ErrorMsg msg={errors.repeatPassword} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm text-[#4E5969]">{t("register.companyName")}</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => set("companyName", e.target.value)}
                placeholder={t("register.companyNamePlaceholder")}
                className={fieldClass(errors.companyName)}
              />
              <ErrorMsg msg={errors.companyName} />
            </div>
            <div className="space-y-1">
              <label className="block text-sm text-[#4E5969]">{t("register.companyType")}</label>
              <div className="relative">
                <select
                  value={form.companyType}
                  onChange={(e) => set("companyType", e.target.value)}
                  className="h-10 w-full cursor-pointer appearance-none border-0 border-b border-gray-300 bg-transparent px-0 pb-1 text-sm transition-colors focus:border-orange-500 focus:outline-none"
                >
                  <option value="" disabled>
                    {t("register.companyTypePlaceholder")}
                  </option>
                  {companyTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#69584E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <ErrorMsg msg="" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm text-[#4E5969]">{t("register.country")}</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                placeholder={t("register.countryPlaceholder")}
                className={fieldClass("")}
              />
              <ErrorMsg msg="" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm text-[#4E5969]">{t("register.authorities")}</label>
              <input
                type="text"
                value={form.relevantAuthorities}
                onChange={(e) => set("relevantAuthorities", e.target.value)}
                placeholder={t("register.authoritiesPlaceholder")}
                className={fieldClass("")}
              />
              <ErrorMsg msg="" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 items-center gap-4 lg:grid-cols-2">
            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className="h-12 w-full rounded-full bg-[#FF6900] text-base text-white transition-colors duration-200 hover:bg-[#FF6900]/90 disabled:cursor-not-allowed disabled:bg-[#FF6900]/50"
            >
              {submitting ? t("register.submitting") : t("register.submit")}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => showLogin()}
                className="text-sm text-[#4E5969] transition-colors duration-200 hover:text-gray-800"
              >
                {t("register.backToLogin")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </ModalShell>
  );
}
