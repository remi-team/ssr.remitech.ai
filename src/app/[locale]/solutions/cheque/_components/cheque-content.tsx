"use client";

import * as React from "react";

// ── Static data (migrated from Vue `const features` + `swiperData`) ──

const features = [
  {
    title: "Regulated & Bank-Grade",
    description:
      "Each e-cheque embeds KYC/AML verification and issuer license validation for bank-grade legal standing. Every check is a credentialed, regulated instrument.",
  },
  {
    title: "Tamper-Evident Security",
    description:
      "Structured digital signatures plus a unique hash prevents forgery and double redemption. Every e-cheque is cryptographically secured.",
  },
  {
    title: "Instant Settlement",
    description:
      "Funds settle instantly with a complete audit trail from issuance to redemption. No clearing delays. No batch processing.",
  },
  {
    title: "Endorse, Transfer, Finance",
    description:
      "E-cheques can be endorsed and transferred along the supply chain. Unlock working capital financing — each endorsement is a financial instrument.",
  },
  {
    title: "Streamlined Flow",
    description:
      "Fewer intermediaries, lower operational friction. Direct point-to-point transfer reduces costs and delays at every hop.",
  },
  {
    title: "Programmable Conditions",
    description:
      "Maturity dates, delivery milestones, identity checks — funds release automatically when conditions are met. Smart contract logic embedded in every check.",
  },
  {
    title: "Address Certainty",
    description:
      "REMI ID eliminates address error risk. Every recipient is verified, credentialed, and continuously monitored.",
  },
  {
    title: "Built for Enterprise Payments",
    description:
      "Designed for contract payments, payroll, and trade finance. Enterprise-grade volume and compliance from day one.",
  },
];

const useCases = [
  {
    title: "Contract Payments",
    content:
      "Programmable release conditions tied to delivery milestones and verification checks. Escrow-like security with instant settlement.",
  },
  {
    title: "Payroll",
    content:
      "Mass disbursement with individual e-cheques, each cryptographically secured and instantly settleable. Complete audit trail for compliance.",
  },
  {
    title: "Trade Finance",
    content:
      "Endorsable instruments that flow through the supply chain. Each endorsement unlocks working capital. Tokenised receivables in the RWA marketplace.",
  },
];

// ── Components ──

/**
 * ECheque content sections — Description, Features, Use Cases.
 * Static data inline; scroll reveal via IntersectionObserver.
 */
export function ChequeContent() {
  const sectionRefs = React.useRef<Map<string, HTMLElement | null>>(new Map());

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add("animate-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    // Observe children inside sections too
    const allReveal = document.querySelectorAll<HTMLElement>("[data-cheque-reveal]");
    allReveal.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Description Section */}
      <section className="bg-white px-[24px] lg:px-0">
        <div
          ref={(el) => { sectionRefs.current.set("desc", el); }}
          className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px] reveal-item"
        >
          <div className="bg-[#FFF0E5] px-[40px] py-[60px] md:rounded-[4px]">
            <p className="md:pr-[60px] text-[18px] leading-[32px] text-[#86909C] text-left font-light">
              Each e-cheque embeds KYC/AML context and issuer license verification
              for bank-grade legal standing. Structured digital signatures plus a
              unique hash prevents forgery and double redemption. Funds settle
              instantly with a complete audit trail from issuance to redemption.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#FAF8F7] px-[24px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="font-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
              Features
            </h2>
            <p className="font-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
              Smart, Regulated Digital Checks
            </p>
          </div>

          <div className="md:px-0 grid grid-cols-1 md:grid-cols-2 gap-x-[35px]">
            {features.map((f, i) => (
              <div
                key={i}
                data-cheque-reveal
                className="h-auto p-[24px] 2xl:py-[32px] reveal-item"
              >
                <div className="flex justify-between items-center border-b border-b-[#EBE8E5]">
                  <h3 className="flex gap-[10px] items-center text-[18px] font-medium text-[#29221D] pb-[12px] lg:mb-0">
                    <span className="ml-[-20px] h-[8px] w-[8px] bg-[#FF6900]" />
                    {f.title}
                  </h3>
                </div>
                <div className="pt-[12px]">
                  <p className="font-light text-[16px] text-[#86909C]">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-white px-[24px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] md:py-[64px] overflow-hidden">
          <h2 className="font-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
            Use Cases
          </h2>
          <p className="font-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
            Built for Real-World Payments
          </p>

          <div className="relative my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {useCases.map((item, i) => (
                <div
                  key={i}
                  data-cheque-reveal
                  className="h-auto min-h-[240px] bg-[#F7F5F3] rounded-[4px] p-[24px] 2xl:py-[32px] hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300 reveal-item"
                >
                  <h3 className="text-[18px] font-light text-[#29221D] mb-6">
                    {item.title}
                  </h3>
                  <p className="font-light text-[16px] text-[#86909C] text-left">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
