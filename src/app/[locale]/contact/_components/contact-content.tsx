"use client";

import { useState, useCallback, type FormEvent, type ChangeEvent } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface FormData {
  firstname: string;
  lastname: string;
  contactNumber: string;
  companyEmail: string;
  companyName: string;
  companyType: string;
  country: string;
  isRegulated: boolean | null;
  relevantAuthorities: string;
  message: string;
}

const initialFormData: FormData = {
  firstname: "",
  lastname: "",
  contactNumber: "",
  companyEmail: "",
  companyName: "",
  companyType: "",
  country: "",
  isRegulated: null,
  relevantAuthorities: "",
  message: "",
};

interface ValidationErrors {
  firstname: string;
  lastname: string;
  contactNumber: string;
  companyEmail: string;
  companyName: string;
  companyType: string;
  country: string;
  relevantAuthorities: string;
  message: string;
}

const initialErrors: ValidationErrors = {
  firstname: "",
  lastname: "",
  contactNumber: "",
  companyEmail: "",
  companyName: "",
  companyType: "",
  country: "",
  relevantAuthorities: "",
  message: "",
};

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                 */
/* ------------------------------------------------------------------ */

function validateEmail(email: string): string {
  if (!email) return "Company email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return "";
}

function validateRequired(value: string, fieldName: string): string {
  if (!value || value.trim() === "") return `${fieldName} is required`;
  return "";
}

function validateContactNumber(contactNumber: string): string {
  if (contactNumber && contactNumber.trim() !== "") {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(contactNumber.replace(/[\s\-\(\)]/g, ""))) {
      return "Please enter a valid contact number";
    }
  }
  return "";
}

function validateMessage(message: string): string {
  if (message && message.length > 2000) return "Message cannot exceed 2000 characters";
  return "";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ContactContent() {
  const [form, setForm] = useState<FormData>({ ...initialFormData });
  const [errors, setErrors] = useState<ValidationErrors>({ ...initialErrors });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ---- form validity ---- */

  const isFormValid = ((): boolean => {
    const requiredFields: (keyof FormData)[] = [
      "firstname",
      "lastname",
      "companyEmail",
      "companyName",
    ];
    for (const field of requiredFields) {
      if (!form[field] || (typeof form[field] === "string" && (form[field] as string).trim() === "")) {
        return false;
      }
    }
    if (form.isRegulated === true && (!form.relevantAuthorities || form.relevantAuthorities.trim() === "")) {
      return false;
    }
    for (const key of Object.keys(errors) as (keyof ValidationErrors)[]) {
      if (errors[key] !== "") return false;
    }
    return true;
  })();

  /* ---- field validation ---- */

  const validateField = useCallback(
    (field: keyof ValidationErrors, currentForm: FormData) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      let msg = "";
      switch (field) {
        case "firstname":
          msg = validateRequired(currentForm.firstname, "First name");
          break;
        case "lastname":
          msg = validateRequired(currentForm.lastname, "Last name");
          break;
        case "contactNumber":
          msg = validateContactNumber(currentForm.contactNumber);
          break;
        case "companyEmail":
          msg = validateEmail(currentForm.companyEmail);
          break;
        case "companyName":
          msg = validateRequired(currentForm.companyName, "Company name");
          break;
        case "companyType":
          msg = validateRequired(currentForm.companyType, "Company type");
          break;
        case "country":
          msg = validateRequired(currentForm.country, "Country");
          break;
        case "relevantAuthorities":
          if (currentForm.isRegulated === true && (!currentForm.relevantAuthorities || currentForm.relevantAuthorities.trim() === "")) {
            msg = "Relevant authorities is required when business is regulated";
          }
          break;
        case "message":
          msg = validateMessage(currentForm.message);
          break;
      }
      setErrors((prev) => ({ ...prev, [field]: msg }));
    },
    [],
  );

  function hasError(field: string): boolean {
    return touched[field] && !!(errors as Record<string, string>)[field];
  }

  /* ---- input change ---- */

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { id, value, type } = e.target;
    const newForm = { ...form };

    if (id === "isRegulated") {
      // radio button
      newForm.isRegulated = value === "true" ? true : value === "false" ? false : null;
    } else {
      (newForm as Record<string, string>)[id] = value;
    }

    setForm(newForm);
    if (id in initialErrors) {
      validateField(id as keyof ValidationErrors, newForm);
    }
  }

  function handleBlur(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const field = e.target.id;
    if (field in initialErrors) {
      validateField(field as keyof ValidationErrors, form);
    }
  }

  /* ---- submit ---- */

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // touch all fields
    const allFields = Object.keys(initialErrors) as (keyof ValidationErrors)[];
    const currentForm = { ...form };
    allFields.forEach((f) => validateField(f, currentForm));
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));

    if (!isFormValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      // TODO: replace with actual API call
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
      setForm({ ...initialFormData });
      setErrors({ ...initialErrors });
      setTouched({});
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ---- render ---- */

  const inputBase =
    "w-full h-12 px-4 border rounded-lg text-base bg-white placeholder:text-[#86909C] transition-colors focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";

  const inputCls = (field: string) =>
    `${inputBase} ${hasError(field) ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-transparent"}`;

  return (
    <div className="pt-[110px] pb-16 lg:pb-24">
      <div className="container mx-auto px-[24px] lg:max-w-[752px]">
        {/* Page Header */}
        <div className="text-left mb-12 lg:mb-16">
          <h1 className="text-[32px] inter-medium text-[#29221D] mb-4 leading-tight">
            CONTACT US
          </h1>
          <p className="text-base lg:text-lg text-[#86909C] inter-light leading-relaxed">
            If you have any questions, please leave your information, and our
            expert will contact you soon.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* Firstname */}
            <div className="space-y-2">
              <label htmlFor="firstname" className="block text-sm inter-light text-[#29221D]">
                First name*
              </label>
              <input
                id="firstname"
                type="text"
                required
                placeholder="First name"
                className={inputCls("firstname")}
                value={form.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {hasError("firstname") && (
                <div className="text-red-500 text-xs min-h-[1rem]">{errors.firstname}</div>
              )}
            </div>

            {/* Lastname */}
            <div className="space-y-2">
              <label htmlFor="lastname" className="block text-sm inter-light text-[#29221D]">
                Last name*
              </label>
              <input
                id="lastname"
                type="text"
                required
                placeholder="Last name"
                className={inputCls("lastname")}
                value={form.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {hasError("lastname") && (
                <div className="text-red-500 text-xs min-h-[1rem]">{errors.lastname}</div>
              )}
            </div>
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <label htmlFor="contactNumber" className="block text-sm inter-light text-[#29221D]">
              Contact number
            </label>
            <input
              id="contactNumber"
              type="tel"
              placeholder="Contact number"
              className={inputCls("contactNumber")}
              value={form.contactNumber}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {hasError("contactNumber") && (
              <div className="text-red-500 text-xs min-h-[1rem]">{errors.contactNumber}</div>
            )}
          </div>

          {/* Company Email */}
          <div className="space-y-2">
            <label htmlFor="companyEmail" className="block text-sm inter-light text-[#29221D]">
              Company email*
            </label>
            <input
              id="companyEmail"
              type="email"
              required
              placeholder="Company email"
              className={inputCls("companyEmail")}
              value={form.companyEmail}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {hasError("companyEmail") && (
              <div className="text-red-500 text-xs min-h-[1rem]">{errors.companyEmail}</div>
            )}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <label htmlFor="companyName" className="block text-sm inter-light text-[#29221D]">
              Company Name (Legal Entity Name)*
            </label>
            <input
              id="companyName"
              type="text"
              required
              placeholder="Company name"
              className={inputCls("companyName")}
              value={form.companyName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {hasError("companyName") && (
              <div className="text-red-500 text-xs min-h-[1rem]">{errors.companyName}</div>
            )}
          </div>

          {/* Company Type */}
          <div className="space-y-2">
            <label htmlFor="companyType" className="block text-sm inter-light text-[#29221D]">
              Company type
            </label>
            <div className="relative">
              <select
                id="companyType"
                className={`${inputCls("companyType")} appearance-none cursor-pointer ${!form.companyType ? "text-[#D4CEC9]" : ""}`}
                value={form.companyType}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="" disabled>
                  Company type
                </option>
                <option value="Licensed Bank">Licensed Bank</option>
                <option value="Regulated traditional non-bank financial institution">
                  Regulated traditional non-bank financial institution
                </option>
                <option value="Regulated Non-Bank Financial Institutions Engaged in Blockchain Business">
                  Regulated Non-Bank Financial Institutions Engaged in Blockchain Business
                </option>
                <option value="Others">Others</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-[#D4CEC9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {hasError("companyType") && (
              <div className="text-red-500 text-xs min-h-[1rem]">{errors.companyType}</div>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label htmlFor="country" className="block text-sm inter-light text-[#29221D]">
              Your Primary Place of Business (Country)
            </label>
            <input
              id="country"
              type="text"
              placeholder="Your country"
              className={inputCls("country")}
              value={form.country}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {hasError("country") && (
              <div className="text-red-500 text-xs min-h-[1rem]">{errors.country}</div>
            )}
          </div>

          {/* Business Regulation Question */}
          <div className="space-y-3">
            <label className="block text-sm inter-light text-[#29221D]">
              Is your business regulated by relevant authorities?
            </label>
            <div className="flex items-center space-x-6">
              <input
                id="relevantAuthorities"
                type="text"
                placeholder="Enter name of relevant authorities or skip"
                className={inputCls("relevantAuthorities")}
                value={form.relevantAuthorities}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {hasError("relevantAuthorities") && (
              <div className="text-red-500 text-xs min-h-[1rem]">{errors.relevantAuthorities}</div>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm inter-light text-[#29221D]">
              Message*
            </label>
            <div className="relative">
              <textarea
                id="message"
                rows={6}
                placeholder="Leave us message"
                maxLength={2000}
                className={`${inputCls("message")} px-4 py-3 resize-none`}
                value={form.message}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <div
                className={`absolute bottom-3 right-3 text-xs ${form.message.length > 2000 ? "text-red-500" : "text-[#86909C]"}`}
              >
                {form.message.length}/2000
              </div>
            </div>
            {hasError("message") && (
              <div className="text-red-500 text-xs min-h-[1rem]">{errors.message}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500 disabled:cursor-not-allowed text-white rounded-full text-lg inter-light transition-colors duration-200"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        {/* Success Message */}
        {submitted && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="text-green-900 font-semibold leading-tight">
                  Message sent successfully!
                </h4>
                <p className="text-green-700 text-sm mt-1 leading-tight">
                  Thank you for contacting us. We&apos;ll get back to you within 24
                  hours.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
