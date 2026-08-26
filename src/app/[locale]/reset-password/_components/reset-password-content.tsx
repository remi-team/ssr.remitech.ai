"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/lib/auth/auth-service";
import { checkPassword } from "@/lib/auth/validation";

/**
 * ResetPassword content — migrated from legacy Vue `resetPassword.vue`.
 *
 * Features:
 *  • Reads email + code from URL query params
 *  • Password / confirm-password fields with toggle-visibility
 *  • Client-side validation (password strength + match)
 *  • Submits via BFF `/api/auth/reset-password`
 *
 * Note: hide-header + hide-footer handled by a root layout variant.
 */

export function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Guard: missing params → toast then redirect
  React.useEffect(() => {
    if (!email || !code) {
      toast.error("Invalid reset link. Please request a new password reset.");
      router.push("/");
    }
  }, [email, code, router]);

  // Validation derivations
  const passwordValid = password ? checkPassword(password) : false;
  const confirmValid = confirmPassword ? password === confirmPassword : false;

  const passwordMessage =
    password && !passwordValid
      ? "Password must be 8-20 characters, including uppercase, lowercase letters and numbers"
      : "";

  const confirmMessage =
    confirmPassword && !confirmValid ? "Passwords do not match" : "";

  const formValid = passwordValid && confirmValid;

  const handleSubmit = async () => {
    if (!formValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await authService.resetPassword({
        email,
        password,
        passwordConfirm: confirmPassword,
        code,
      });
      toast.success("Password reset successfully!");
      router.push("/");
    } catch {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F7] flex flex-col">
      <div className="relative flex-1 flex justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm mx-auto sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <a
              href="/"
              className="inline-flex items-center justify-center h-[60px] mb-4 cursor-pointer transition-transform hover:scale-105"
            >
              <img src="/images/logo-remi.svg" alt="Remi" />
            </a>
          </div>

          {/* Form Card */}
          <div className="lg:bg-white lg:rounded-2xl lg:shadow-xl lg:border lg:border-gray-100 lg:p-[48px]">
            <h1 className="text-left text-[32px] font-bold text-gray-900 leading-tight">
              Choose a new password
            </h1>

            {/* Email display */}
            <div className="mt-[48px] mb-6 sm:mb-8">
              <label className="block text-sm font-medium text-[#9C9086] mb-2 sm:text-base lg:text-lg">
                Email
              </label>
              <div className="px-4 py-3 border-0 border-b border-[#F5F3F2] rounded-lg text-gray-800 sm:px-6 sm:py-4 lg:text-lg">
                {email}
              </div>
            </div>

            {/* Password field */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-medium text-[#9C9086] mb-3 sm:text-base lg:text-lg">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-12 px-4 pr-12 border-0 border-b bg-transparent text-base transition-all duration-300 focus:outline-none placeholder:text-[#D4CEC9] sm:h-14 sm:text-lg lg:h-16 lg:text-xl ${
                    password && !passwordValid
                      ? "border-red-500 focus:border-red-500"
                      : password && passwordValid
                      ? "border-green-500 focus:border-green-500"
                      : "border-[#F5F3F2] focus:border-orange-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#D4CEC9] hover:text-gray-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      /* eye-off */
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    ) : (
                      /* eye */
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>

              {/* Validation / hint */}
              {password && passwordMessage ? (
                <div className="mt-2 text-sm sm:text-base text-red-600">
                  {passwordMessage}
                </div>
              ) : !password ? (
                <div className="mt-2 text-xs text-gray-500 sm:text-sm lg:text-base">
                  Password must be 8-20 characters, including uppercase,
                  lowercase letters and numbers
                </div>
              ) : null}
            </div>

            {/* Confirm password field */}
            <div className="mb-8 sm:mb-10">
              <label className="block text-sm font-medium text-[#9C9086] mb-3 sm:text-base lg:text-lg">
                Password Confirmation*
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full h-12 px-4 pr-12 border-0 border-b bg-transparent text-base transition-all duration-300 focus:outline-none placeholder:text-gray-400 sm:h-14 sm:text-lg lg:h-16 lg:text-xl ${
                    confirmPassword && !confirmValid
                      ? "border-red-500 focus:border-red-500"
                      : confirmPassword && confirmValid
                      ? "border-green-500 focus:border-green-500"
                      : "border-[#F5F3F2] focus:border-orange-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showConfirm ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {confirmMessage && (
                <div className="mt-2 text-sm sm:text-base text-red-600">
                  {confirmMessage}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!formValid || isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-full text-base font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500/50 sm:h-14 sm:text-lg lg:h-16 lg:text-xl"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
