"use client";

import * as React from "react";
import { Cta } from "@/components/cta";

// ── Static data (migrated from Vue FX.vue) ──

const metrics = [
  {
    value: "24X7",
    title: "Settlement",
    subtitle: "Never closes",
    emphasis: true,
  },
  {
    value: "Zero",
    title: "FX fluctuation risk",
    subtitle: "Atomic rate lock",
    emphasis: false,
  },
  {
    value: "Direct",
    title: "Minor currency pairs",
    subtitle: "No bridging",
    emphasis: false,
  },
  {
    value: "Atomic",
    title: "Rate locked at execution",
    subtitle: "At execution",
    emphasis: false,
  },
];

const components = [
  {
    icon: "/images/icon-oscbp.png",
    title: "One-Stop <br/> Cross-Border Payment",
    description:
      "FX Trading Platform enables seamless cross-border payment experiences by combining real-time FX and payment capabilities, allowing for a single integrated transaction that streamlines the process.",
  },
  {
    icon: "/images/icon-dfbmc.png",
    title: "Direct FX between <br/>  Minor Currencies",
    description:
      "Eliminating the need for multi-step conversions through major currencies, thereby reducing transaction costs and settlement times.",
  },
  {
    icon: "/images/icon-fee.png",
    title: "Faster Execution  <br/> & Efficiency",
    description:
      "By leveraging stablecoins and blockchain technology, FX Trading Platform reduces foreign exchange processing times from days to seconds, enabling 24/7 instant settlements.",
  },
  {
    icon: "/images/icon-fee2.png",
    title: "Proprietary Corridor <br/>  Intelligence",
    description:
      "As corridor volume scales, every transaction contributes to a proprietary dataset on minor currency flows that no incumbent can replicate. The infrastructure generates the intelligence.",
  },
];

const capitalMarkets = [
  {
    label: "Interbank Overnight Lending",
    orderClass: "order-1 md:order-1",
  },
  {
    label: "RWA Tokenization",
    orderClass: "order-3 md:order-2",
  },
  {
    label: "Money Market Fund (MMF)",
    orderClass: "order-2 md:order-3",
  },
  {
    label: "Long-term Bond & Short-term Debt",
    orderClass: "order-4 md:order-4",
  },
];

const TCMData = [
  {
    icon: "",
    title: "Interbank Overnight Lending",
    content:
      "T+0 settlement. 24/7 liquidity. Small banks access interbank markets previously closed to them. Real-time collateralisation — pledge or unpledge on-chain instantly.",
    extContent:
      "A new liquidity tool. A new fee category for every bank on the network.",
  },
  {
    icon: "",
    title: "Money Market Fund (RWA Tokenisation)",
    content:
      "Tokenised MMF units with instant redemption. No daily NAV cutoff. 24/7 access to yield and principal. Programmable liquidity triggers via smart contract.",
    extContent: "Real-world assets tokenised for instant liquidity.",
  },
  {
    icon: "",
    title: "Bond & Short-Term Debt (RWA)",
    content:
      "T+0 bond lifecycle — issue, trade, settle, pay interest, redeem — all in seconds. Fixed income as dynamic, yield-generating digital assets. Embedded KYC/AML enables compliant global trading.",
    extContent:
      "The batch model locked smaller institutions out for fifty years. REMI puts T+0 settlement on every bank that joins.",
  },
];

const exchangeExpress = [
  {
    title: "Same-name, lower risk",
    desc: "Payer name matches exchange account name",
  },
  {
    title: "Compliance in the flow",
    desc: "KYC/AML tags and payment purpose travel end-to-end",
  },
  {
    title: "VA-free go-live",
    desc: "No sponsor-bank VA pre-opening required",
  },
  {
    title: "Auto-match & safe credit",
    desc: "Payment reference maps directly to user account",
  },
  {
    title: "Privacy & protection",
    desc: "Only attested fields shared; verified matching reduces errors",
  },
  {
    title: "Predictable, low cost",
    desc: "Flat low fees; fewer intermediaries and manual reviews",
  },
  {
    title: "Audit-ready",
    desc: "End-to-end traceability; state and delivery proof retained",
  },
  {
    title: "End-to-end traceability",
    desc: "Full chain visibility for compliance and reporting",
  },
];

// ── Components ──

export function FxContent() {
  return (
    <>
      {/* ===== Metrics Section ===== */}
      <section
        data-scroll="metric"
        className="overflow-hidden bg-white py-[40px] md:py-0 lg:py-0"
      >
        <div className="mx-auto max-w-[1024px] overflow-hidden">
          {/* Mobile: 2x2 card grid */}
          <div className="grid grid-cols-2 gap-[12px] px-[24px] md:hidden">
            {metrics.map((metric) => (
              <div
                key={metric.title}
                className="rounded-[4px] bg-[#f4f2f0] px-[16px] py-[20px]"
              >
                <div className="mb-[8px] flex items-center gap-[8px]">
                  <span className="h-[6px] w-[6px] shrink-0 bg-[#FF6900]" />
                  <span className="text-[22px] font-[500] leading-none text-[#2f2823]">
                    {metric.value}
                  </span>
                </div>
                <div className="text-[12px] uppercase leading-snug text-[#86909C]">
                  {metric.title}
                </div>
                <div className="mt-[2px] text-[12px] uppercase leading-snug text-[#86909C]">
                  {metric.subtitle}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: horizontal flex */}
          <div className="hidden gap-[54px] px-[32px] py-[28px] md:flex lg:min-w-0 lg:justify-between lg:px-[48px] lg:py-[112px] xl:gap-[72px]">
            {metrics.map((metric) => (
              <div key={metric.title} className="shrink-0">
                <div className="mb-[12px] flex items-center gap-[10px] text-left text-[36px] font-[500] text-[#2f2823]">
                  <span className="h-[8px] w-[8px] shrink-0 bg-[#FF6900]" />{" "}
                  {metric.value}
                </div>
                <div className="mt-[2px] text-left text-[18px] uppercase text-[#86909C]">
                  {metric.title}
                </div>
                <div className="mt-[4px] text-left text-[18px] uppercase text-[#86909C]">
                  {metric.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Key Technical Components Section ===== */}
      <section
        data-scroll="components"
        className="bg-[#f2efec] md:bg-white"
      >
        <div className="mx-auto max-w-[1536px] px-[24px] sm:px-[32px] md:px-[32px] lg:px-[40px] xl:px-[48px]">
          <div className="flex flex-col lg:flex-row">
            {/* Side image (desktop) */}
            <div className="hidden h-[638px] w-[625px] md:flex">
              <img
                src="/images/home-stablefx_1536x.png"
                alt="StableFX"
                className="object-contain"
              />
            </div>

            <div className="relative">
              <div className="pb-[32px] pt-[48px] sm:pb-[40px] sm:pt-[60px] lg:p-0 lg:mx-0 lg:pt-[83px]">
                <h2 className="text-left text-[32px] text-[#2d2722] md:text-center lg:pl-[30px]">
                  Key Technical Components
                </h2>
              </div>

              <div className="pb-[6px] md:overflow-x-auto md:px-[24px] md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden lg:absolute lg:left-[-400px] lg:pt-[37px]">
                <div className="flex flex-wrap justify-between gap-[10px] md:w-max md:justify-start md:gap-[12px]">
                  {components.map((item) => (
                    <article
                      key={item.title}
                      className="flex w-[calc(50%-5px)] min-h-[260px] flex-col rounded-[4px] bg-[#f4f2f0] px-[16px] py-[24px] md:h-[360px] md:w-[280px] md:py-[32px]"
                    >
                      <div className="flex h-[44px] w-[44px] items-center justify-center md:h-[60px] md:w-[60px]">
                        <img
                          src={item.icon}
                          alt={item.title}
                          className="h-[28px] w-[28px] object-contain md:h-auto md:w-auto"
                        />
                      </div>
                      <h3
                        className="mt-[10px] text-[14px] font-[500] leading-[1.2] text-[#2d2722] md:mt-[12px] md:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      />
                      <p className="mt-[6px] flex-1 text-[12px] leading-[1.45] text-[#86909C] md:mt-[20px] md:text-[18px]">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== One Group. Two Streams. Zero Leakage. ===== */}
      <section
        data-scroll="features"
        className="bg-[#f2efec] px-[24px] sm:px-[32px] lg:px-0"
      >
        <div className="mx-auto max-w-[1024px] overflow-hidden py-[48px] sm:py-[56px] md:py-[64px] lg:py-[64px] xl:py-[72px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="mb-[12px] text-left text-[32px] text-[#29221D] md:text-center">
              One Group. Two Streams. Zero Leakage.
            </h2>
          </div>
          <div className="mx-auto space-y-[24px] lg:grid lg:grid-cols-2 lg:gap-[36px] lg:space-y-0 xl:gap-[48px]">
            {/* Legacy Model */}
            <div className="space-y-4 pl-[20px]">
              <div>
                <h3 className="flex items-center gap-[10px] pb-[12px] text-[18px] text-[#29221D] lg:mb-0">
                  <span className="ml-[-20px] h-[8px] w-[8px] bg-[#FF6900]" />
                  Legacy Model
                </h3>
                <div className="my-[12px] h-[1px] w-full bg-[#EBE8E5]" />
              </div>
              <p className="text-[16px] leading-relaxed text-[#86909C]">
                The rail and the margin are owned by different parties. The
                institution moving the money captures neither fully.
              </p>
              <p className="text-[16px] leading-relaxed text-[#86909C]">
                Correspondent banks take the FX spread. Intermediaries take fees
                at every hop. The originating bank gets none of it.
              </p>
            </div>

            {/* The REMI Model */}
            <div className="space-y-4 pl-[20px]">
              <div>
                <h3 className="flex items-center gap-[10px] pb-[12px] text-[18px] text-[#29221D] lg:mb-0">
                  <span className="ml-[-20px] h-[8px] w-[8px] bg-[#FF6900]" />
                  The REMI Model
                </h3>
                <div className="my-[12px] h-[1px] w-full bg-[#EBE8E5]" />
              </div>
              <p className="text-[16px] leading-relaxed text-[#86909C]">
                REMI settles on stablecoin rails. Bison FX & Treasury — a
                strategic partner&apos;s SFC-licensed markets division — handles
                the conversion.
              </p>
              <p className="text-[16px] leading-relaxed text-[#86909C]">
                Two revenue streams per transaction: the settlement fee to REMI,
                the FX spread to Bison FX & Treasury. Same group. No
                intermediary taking a cut in between.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Treasury & Capital Markets ===== */}
      <section
        data-scroll="tcm"
        className="bg-white px-[24px] sm:px-[32px] lg:px-0"
      >
        <div className="mx-auto max-w-[1024px] overflow-hidden py-[48px] sm:py-[56px] md:py-[64px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="mb-[12px] text-left text-[32px] text-[#29221D] md:text-center">
              Treasury & Capital Markets
            </h2>
            <p className="mb-[24px] text-left text-[16px] leading-relaxed text-[#86909C] md:text-center md:text-[18px] lg:mb-[36px]">
              The settlement infrastructure is the entry point — but the real
              margin in cross-border{" "}
              <br className="hidden lg:flex" />
              business has always been embedded in the conversion and the
              capital that sits behind it.
            </p>
          </div>
          <div className="relative my-8">
            <div className="w-full">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {TCMData.map((item) => (
                  <div
                    key={item.title}
                    className="h-auto min-h-[300px] rounded-xl bg-[#F7F5F3] p-[24px] shadow-[#F1E3DA] transition-shadow duration-300 hover:shadow-lg 2xl:py-[32px]"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="mb-4 text-left text-[18px] text-[#29221D] lg:mb-0">
                        {item.title}
                      </h2>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-left text-[16px] leading-relaxed text-[#86909C]">
                          {item.content}
                        </p>
                      </div>
                      <div>
                        <p className="text-left text-[16px] leading-relaxed text-[#86909C]">
                          {item.extContent}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Exchange Express ===== */}
      <section
        data-scroll="exchange-express"
        className="bg-[#FAF8F7] px-[24px] py-[48px] sm:px-[32px] sm:py-[56px] md:py-[64px] lg:px-0 lg:py-[80px] xl:py-[100px]"
      >
        <div className="mx-auto max-w-[1024px]">
          <div className="mb-[28px] sm:mb-[36px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="mb-[12px] text-left text-[32px] text-[#29221D] md:text-center">
              Exchange Express
            </h2>
          </div>

          {/* Same-Name Fiat On/Off-Ramps in Minutes */}
          <div className="mb-[32px] sm:mb-[40px] lg:mb-[64px]">
            <div className="mb-[16px] sm:mb-[20px] lg:mb-[36px]">
              <h3 className="mb-[12px] flex items-center gap-[10px] text-[20px] font-[700] text-[#29221D] md:text-[24px] lg:text-[28px]">
                <span className="h-[20px] w-[4px] bg-[#FF6900]" /> Same-Name
                Fiat On/Off-Ramps in Minutes
              </h3>
              <p className="text-[16px] leading-relaxed text-[#86909C] md:text-[18px]">
                Remi provides the infrastructure for member institutions to
                offer robust OTC On/Off Ramp and settlement services. Verified
                settlement infrastructure — enabling global corridors and
                underbanked markets from day one.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-[16px] gap-y-[10px] sm:gap-x-[20px] md:grid-cols-2 lg:gap-x-[36px]">
              {exchangeExpress.map((item) => (
                <div key={item.title} className="h-auto p-[16px] md:p-[24px]">
                  <div className="flex items-center justify-between border-b border-b-[#EBE8E5]">
                    <h2 className="flex items-center gap-[10px] pb-[10px] text-[16px] text-[#29221D] sm:text-[18px] lg:mb-0">
                      <span className="ml-[-20px] h-[8px] w-[8px] bg-[#FF6900]" />{" "}
                      {item.title}
                    </h2>
                  </div>
                  <div className="pt-[10px] sm:pt-[12px]">
                    <p className="text-[14px] leading-relaxed text-[#86909C] sm:text-[16px]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <Cta>
        <h2 className="mx-auto mb-[36px] max-w-[860px] text-[24px] leading-[1.3] text-white md:text-[28px] lg:text-[32px]">
          &ldquo;Most infrastructure plays capture the rail. REMI captures the
          rail and the spread.&rdquo;
        </h2>
      </Cta>
    </>
  );
}
