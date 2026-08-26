"use client";

import { useState } from "react";
import { Cta } from "@/components/cta";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const patents = [
  {
    title:
      "A monitoring and auditing tool of blockchain-based financial payment and clearing",
    status: "Provisional Protection — Accepted",
  },
  {
    title: "An Inter-bank cross-border clearing and settlement system",
    status: "Provisional Protection — Accepted",
  },
  {
    title:
      "A Private Key Security Management Method of a cold wallet and a cold wallet server thereof",
    status: "Provisional Protection — Accepted",
  },
  {
    title:
      "A risk monitoring method and system for stable coin transactions",
    status: "Provisional Protection — Accepted",
  },
  {
    title: "A stable coin trading system",
    status: "Provisional Protection — Accepted",
  },
  {
    title:
      "A multi-layered custody wallet system for financial institutions and its fund management method",
    status: "Patent Filed",
  },
];

const fatfItems = [
  {
    title: "A – AML/CFT Policies & Coordination (R1–R2)",
    remiCapability: "Risk Whitelist & Blacklist; Real-time Screening Mechanism",
    items: [
      {
        recommendation: "R1: Assessing risks & applying risk-based approach",
        capability: "",
      },
      {
        recommendation: "R2: National cooperation and coordination",
        capability: "",
      },
    ],
  },
  {
    title: "B – Money Laundering & Confiscation (R3–R4)",
    remiCapability:
      "Real-time Screening Dashboard; Remi AML Dashboard; Remi Operation Monitoring; Real-time Regulatory Intervention",
    items: [
      { recommendation: "R3: Money laundering offence", capability: "" },
      {
        recommendation: "R4: Confiscation and provisional measures",
        capability: "Post-event Recovery of Risk Assets",
      },
    ],
  },
  {
    title: "C – Terrorist Financing & Proliferation (R5–R8)",
    remiCapability:
      "Risk Whitelist & Blacklist; Real-time Screening Mechanism; AI-driven KYCC; Real-time Regulatory Intervention",
    items: [
      {
        recommendation:
          "R5: Terrorist financing, targeted financial sanctions",
        capability: "",
      },
      {
        recommendation:
          "R6: Targeted financial sanctions related to terrorism and terrorist financing",
        capability:
          "Risk Whitelist & Blacklist; Real-time Screening Mechanism; AI-driven KYCC; Real-time Regulatory Intervention",
      },
      {
        recommendation:
          "R7: Targeted financial sanctions related to proliferation",
        capability: "Real-time Regulatory Intervention",
      },
      {
        recommendation: "R8: Non-profit organisations",
        capability: "",
      },
    ],
  },
  {
    title: "D – Preventive Measures (R9–R20)",
    remiCapability: "",
    items: [
      {
        recommendation: "R9: Financial institution secrecy laws",
        capability: "",
      },
      {
        recommendation: "R10: Customer due diligence",
        capability:
          "Asset Owner Identification; Certificate Authority; Verification Center; Real-time Screening; AI-driven KYCC",
      },
      {
        recommendation: "R11: Record keeping",
        capability: "Automatically Generated Audit Data",
      },
      {
        recommendation: "R12: Politically exposed persons",
        capability: "AI-driven KYCC",
      },
      {
        recommendation: "R13: Correspondent banking",
        capability: "",
      },
      {
        recommendation: "R14: Money or value transfer services",
        capability: "",
      },
      {
        recommendation: "R15: New technologies",
        capability: "Risk Whitelist & Blacklist; AI-driven KYCC",
      },
      {
        recommendation: "R16: Payment transparency",
        capability: "Pre-event Travel Rule",
      },
      {
        recommendation: "R17: Reliance on third parties",
        capability: "",
      },
      {
        recommendation:
          "R18: Internal controls and foreign branches and subsidiaries",
        capability: "",
      },
      {
        recommendation: "R19: Higher-risk countries",
        capability: "Real-time Update Mechanism; AI-driven KYCC",
      },
      {
        recommendation: "R20: Reporting of suspicious transactions",
        capability:
          "During-event AI-Driven Risk Prevention; Post-event Real-time Alerting and Reporting",
      },
    ],
  },
  {
    title: "E – Transparency & Beneficial Ownership (R24–R25)",
    remiCapability: "AI-Driven KYCC",
    items: [
      {
        recommendation:
          "R24: Transparency and beneficial ownership of legal persons",
        capability: "",
      },
      {
        recommendation:
          "R25: Transparency and beneficial ownership of legal arrangements",
        capability: "",
      },
    ],
  },
  {
    title: "F – Powers & Responsibilities (R26–R35)",
    remiCapability:
      "Realtime Screening Dashboard; Remi AML Dashboard; Remi Operation Monitoring; Real-time Regulatory Intervention",
    items: [
      {
        recommendation:
          "R26: Regulation and supervision of financial institutions",
        capability: "",
      },
      {
        recommendation: "R27: Powers of supervisors",
        capability: "",
      },
      {
        recommendation: "R28: Regulation and supervision of DNFBPs",
        capability: "",
      },
      {
        recommendation: "R29: Financial intelligence units",
        capability:
          "Post-event Real-time Alerting and Reporting; Real-time Screening Dashboard",
      },
      {
        recommendation:
          "R30: Responsibilities of law enforcement and investigative authorities",
        capability: "",
      },
      {
        recommendation:
          "R31: Powers of law enforcement and investigative authorities",
        capability: "",
      },
      { recommendation: "R32: Cash couriers", capability: "" },
      {
        recommendation: "R33: Statistics",
        capability: "Real-time Screening Dashboard",
      },
      {
        recommendation: "R34: Guidance and feedback",
        capability: "",
      },
      { recommendation: "R35: Sanctions", capability: "" },
    ],
  },
  {
    title: "G – International Cooperation (R36–R40)",
    remiCapability: "",
    items: [
      {
        recommendation: "R36: International instruments",
        capability: "",
      },
      {
        recommendation: "R37: Mutual legal assistance",
        capability: "",
      },
      {
        recommendation: "R38: Extradition",
        capability: "Post-event Recovery of Risk Assets",
      },
      { recommendation: "R39: Extradition", capability: "" },
      {
        recommendation: "R40: Other forms of international cooperation",
        capability: "",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function CheckIcon() {
  return (
    <svg
      className="w-[14px] h-[14px]"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`w-5 h-5 text-[#86909C] transition-transform duration-300 flex-shrink-0 ml-4 ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function AppInProgressIcon() {
  return (
    <svg
      className="w-[14px] h-[14px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
      <path d="M12 12v4" strokeWidth="2.5" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="19" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="13" cy="19" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Hero                                                      */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section
      data-scroll="hero"
      className="relative w-full min-h-[480px] sm:min-h-[540px] md:h-[560px] lg:h-[610px] overflow-hidden"
    >
      <div className="absolute inset-0">
        <picture>
          <source
            media="(min-width:1536px)"
            srcSet="/images/compliance_1536@2x_compressed.jpg"
          />
          <source
            media="(min-width:1280px)"
            srcSet="/images/compliance_1280@2x_compressed.jpg"
          />
          <source
            media="(min-width:768px)"
            srcSet="/images/compliance_768@2x_compressed.jpg"
          />
          <img
            src="/images/compliance_640@2x_compressed.jpg"
            alt="Remi Network"
            className="w-full h-full object-cover"
          />
        </picture>
      </div>

      <div className="relative z-10 h-full flex pt-[140px] sm:pt-[160px] md:pt-[180px] lg:pt-[219px] pb-[48px]">
        <div className="max-w-[1536px] mx-auto px-[24px] sm:px-[48px] lg:px-[120px] w-full">
          <h1 className="inter-light text-white text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] uppercase leading-[1.08] tracking-[-0.03em] mb-[16px] sm:mb-[20px] md:mb-[24px]">
            Built for Regulators. <br />
            Trusted by Banks.
          </h1>
          <div className="max-w-[830px] space-y-[12px] sm:space-y-[14px] md:space-y-[16px]">
            <p className="text-white/80 text-[15px] sm:text-[16px] lg:text-[20px] inter-light leading-relaxed">
              We don&apos;t bolt compliance on top of our infrastructure. We
              built the infrastructure inside it. Every transaction, every
              counterparty, every decision — credentialed, regulated, and
              visible in real time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Framework (Where We Are Regulated)                        */
/* ------------------------------------------------------------------ */

const frameworkCards = [
  {
    region: "EU",
    title: "MiCA — European Union",
    description: (
      <>
        <span className="inter-medium">
          Markets in Crypto-Assets Regulation.{" "}
        </span>
        The EU&apos;s comprehensive framework for crypto-asset service
        providers. Bison Bank is among the first banks licensed under MiCA to
        issue Electronic Money Tokens (EMT), and the{" "}
        <span className="inter-medium">only non-G-SII issuer</span> in Europe.
      </>
    ),
    badge: "LICENSED — EMT ISSUER",
    badgeVariant: "green" as const,
  },
  {
    region: "ECB",
    title: "ECB — European Central Bank",
    description: (
      <>
        <span className="inter-medium">Authorized under VASP. </span>
        Bison Bank obtained ECB + Banco de Portugal approval in 2024 to issue
        stablecoin (E-Money Token) under MiCA. Europe&apos;s first
        bank-licensed digital asset service provider.
      </>
    ),
    badge: "AUTHORIZED",
    badgeVariant: "green" as const,
  },
  {
    region: "US",
    title: "GENIUS Act — United States",
    description: (
      <>
        <span className="inter-medium">
          Guiding Uniform Standards for Innovation and National Security.{" "}
        </span>
        Landmark US legislation governing payment stablecoins. Remi operates as
        a protocol developer under Section 6(d). Day-one compliance positioned.
      </>
    ),
    badge: "DAY-ONE COMPLIANCE",
    badgeVariant: "green" as const,
  },
  {
    region: "FATF",
    title: "FATF Recommendation 16",
    description: (
      <>
        <span className="inter-medium">Travel Rule. </span>
        Requires originator and beneficiary data to travel with every
        transaction. REMI embeds Travel Rule data at the transaction level —
        not as a message attached to a payment, but as an immutable part of the
        settlement itself.
      </>
    ),
    badge: "EMBEDDED AT PROTOCOL",
    badgeVariant: "green" as const,
  },
  {
    region: "HK",
    title: "SFC — Hong Kong",
    description: (
      <>
        <span className="inter-medium">
          Securities and Futures Commission.{" "}
        </span>
        Bison FX & Treasury holds SFC license for digital markets operations
        in Hong Kong. Application for stablecoin licensing under Hong
        Kong&apos;s new framework in progress.
      </>
    ),
    badge: "APPLICATION IN PROGRESS",
    badgeVariant: "orange" as const,
  },
  {
    region: "PT",
    title: "Banco de Portugal",
    description:
      "Portugal's central bank and member of the Eurosystem. Supervises Bison Bank's stablecoin issuance, reserve management, and CASP operations under the ECB framework.",
    badge: "SUPERVISED",
    badgeVariant: "green" as const,
  },
];

function FrameworkSection() {
  return (
    <section data-scroll="framework" className="bg-white px-[24px] lg:px-0">
      <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
        <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
          <h2 className="inter-medium text-[32px] text-[#2d2722] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
            Where We Are Regulated
          </h2>
          <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
            Multi-jurisdiction licensed and authorized. Day-one compliance
            positioned for the regulations that matter.
          </p>
        </div>

        <div className="space-y-[24px] lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-[36px] mt-[48px] mx-auto">
          {frameworkCards.map((card) => (
            <div
              key={card.title}
              className="h-auto min-h-[210px] bg-[#F7F5F3] rounded-[4px] p-[24px] 2xl:py-[32px] hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300"
            >
              <div className="flex flex-col items-start mb-6 gap-[12px]">
                <span className="text-[16px] text-[#FF781A]">
                  {card.region}
                </span>
                <h3 className="text-[18px] inter-light text-[#2d2722]">
                  {card.title}
                </h3>
              </div>
              <div className="space-y-6">
                <p className="inter-light text-[16px] text-[#86909C]">
                  {card.description}
                </p>
              </div>
              <div className="mt-[16px]">
                <span
                  className={`inline-flex items-center gap-[6px] px-[12px] py-[8px] rounded-[4px] text-[13px] font-[500] inter-light ${
                    card.badgeVariant === "orange"
                      ? "bg-[#f9e7d4] text-[#FF6900]"
                      : "bg-[#E8F5E9] text-[#2E7D32]"
                  }`}
                >
                  {card.badgeVariant === "green" ? (
                    <CheckIcon />
                  ) : (
                    <AppInProgressIcon />
                  )}
                  {card.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: BAFT                                                      */
/* ------------------------------------------------------------------ */

function BAFTSection() {
  return (
    <section data-scroll="baft" className="bg-[#FAF8F7] px-[24px] lg:px-0">
      <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
        <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
          <h2 className="inter-medium text-[32px] text-[#2d2722] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
            We Write the Rules <br className="hidden md:flex" /> Competitors
            Follow
          </h2>
        </div>

        <div className="mb-[48px] lg:mb-[64px]">
          <div className="mb-[24px] lg:mb-[36px]">
            <h3 className="text-[18px] md:text-[24px] inter-light text-[#2d2722] mb-[30px]">
              BAFT — Bankers Association for Finance and Trade
            </h3>
            <p className="mb-[15px] inter-light text-[16px] text-[#86909C]">
              Remi US is a formal member of BAFT and is{" "}
              <span className="inter-medium">
                co-leading BAFT&apos;s formal OCC response on the GENIUS Act
              </span>{" "}
              — the regulation that will govern every US bank stablecoin.
            </p>
            <p className="inter-light text-[16px] text-[#86909C]">
              We do not lobby for outcomes. We contribute the operating
              experience the rules require. When the OCC publishes its final
              framework, the network we are building will already be compliant
              by design.
            </p>
            <blockquote
              className="my-[30px] border-l-4 border-[#FFC78B] pl-4 py-3 inter-light italic 
                 text-[#86909C] bg-[#F3ECE8]"
            >
              &quot;The compliance standard competitors will follow is being
              co-authored by the team building the rails.&quot;
            </blockquote>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] lg:gap-[36px]">
            <div className="bg-[#F7F5F3] p-[24px] 2xl:py-[32px] rounded-[4px] hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300">
              <h4 className="text-[18px] inter-light text-[#2d2722] mb-[12px]">
                GENIUS Act Response
              </h4>
              <p className="inter-light text-[16px] text-[#86909C]">
                Co-authoring the industry response to the OCC on the most
                significant stablecoin legislation in US history.
              </p>
            </div>
            <div className="bg-[#F7F5F3] p-[24px] 2xl:py-[32px] rounded-[4px] hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300">
              <h4 className="text-[18px] inter-light text-[#2d2722] mb-[12px]">
                UN Global Compact
              </h4>
              <p className="inter-light text-[16px] text-[#86909C]">
                Committed to delivering on UN SDG 10.c — reducing remittance
                costs and improving cross-border payment efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Security                                                  */
/* ------------------------------------------------------------------ */

const securityItems = [
  { title: "ISO 27001", description: "Information Security Management" },
  { title: "SOC 2 Type II", description: "Service Organization Control" },
  { title: "ISAE 3000", description: "Assurance Engagements" },
  {
    title: "Multi-Party Computation (MPC) Wallet",
    description:
      "Distributed signing, no single point of failure and institutional governance",
  },
  {
    title: "Quarterly PenTests",
    description: "Independent Security Audits",
  },
  {
    title: "AI-Powered Real-Time Monitoring",
    description: "24/7 Network Surveillance",
  },
];

function SecuritySection() {
  return (
    <section data-scroll="security" className="bg-white px-[24px] lg:px-0">
      <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
        <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
          <h2 className="inter-medium text-[32px] text-[#2d2722] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
            Enterprise-Grade Security
          </h2>
        </div>

        <div className="space-y-[24px] lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-[36px] mt-[48px] mx-auto">
          {securityItems.map((item) => (
            <div
              key={item.title}
              className="h-auto min-h-[120px] bg-[#F7F5F3] rounded-[4px] p-[24px] 2xl:py-[32px] hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300"
            >
              <div className="flex flex-col items-start mb-[12px] gap-[12px]">
                <h3 className="text-[18px] inter-light text-[#2d2722]">
                  {item.title}
                </h3>
              </div>
              <div className="space-y-6">
                <p className="inter-light text-[16px] text-[#86909C]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: FATF                                                      */
/* ------------------------------------------------------------------ */

function FATFSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section data-scroll="fatf" className="bg-[#FAF8F7] px-[24px] lg:px-0">
      <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
        <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
          <h2 className="inter-medium text-[32px] text-[#29221D] mb-[12px] text-left md:text-center">
            FATF 40 Recommendations Mapping
          </h2>
          <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
            Every Remi capability maps directly to specific FATF
            Recommendations,{" "}
            <br className="hidden md:flex" />
            ensuring comprehensive compliance coverage across all 40 standards.
          </p>
        </div>

        <div className="space-y-0">
          {fatfItems.map((card, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={card.title}
                className="border-b border-[#EBE8E5] last:border-b-0"
              >
                <button
                  className="w-full flex items-center justify-between py-[20px] md:py-[24px] text-left cursor-pointer focus:outline-none group"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <h3 className="flex items-center gap-[10px] text-[16px] md:text-[18px] inter-medium text-[#29221D]">
                    <span className="h-[8px] w-[8px] rounded-full bg-[#FF6900] flex-shrink-0" />
                    {card.title}
                  </h3>
                  <ChevronDownIcon className={isOpen ? "rotate-180" : ""} />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-[24px] pl-[18px]">
                      {/* Remi Capability banner (desktop + mobile) */}
                      {card.remiCapability ? (
                        <div className="hidden md:flex p-[12px] mb-[12px] bg-[#f9e7d4] text-[#FF6900] text-[16px] inter-light">
                          {card.remiCapability}
                        </div>
                      ) : null}

                      {/* Desktop: table */}
                      <table className="hidden md:table w-full border-collapse">
                        <thead>
                          <tr className="border-b border-[#EBE8E5]">
                            <th className="text-left text-[16px] inter-light text-[#29221D] pb-[10px] pr-[16px] w-[60%]">
                              Recommendation
                            </th>
                            <th className="text-left text-[16px] inter-light text-[#86909C] pb-[10px]" />
                          </tr>
                        </thead>
                        <tbody>
                          {card.items.map((item, i) => (
                            <tr
                              key={i}
                              className="border-b border-[#F0EBE7] last:border-b-0"
                            >
                              <td className="py-[12px] pr-[16px] text-[16px] inter-light text-[#29221D] align-top">
                                {item.recommendation}
                              </td>
                              <td className="py-[12px] text-[16px] inter-light text-[#86909C] leading-relaxed align-top">
                                {item.capability}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Mobile: card layout */}
                      <div className="md:hidden space-y-[12px]">
                        {card.remiCapability ? (
                          <div className="p-[12px] bg-[#f9e7d4] rounded-[4px]">
                            <p className="text-[16px] inter-light text-[#FF6900] leading-relaxed">
                              {card.remiCapability}
                            </p>
                          </div>
                        ) : null}

                        {card.items.map((item, i) => (
                          <div
                            key={i}
                            className="border border-[#F0EBE7] rounded-[4px] overflow-hidden"
                          >
                            <div className="bg-[#FAF5F0] px-[12px] py-[8px]">
                              <p className="text-[18px] inter-light text-[#29221D] mb-[8px]">
                                Recommendation
                              </p>
                              <p className="text-[16px] inter-light text-[#29221D]">
                                {item.recommendation}
                              </p>
                            </div>
                            {item.capability ? (
                              <div className="px-[14px] py-[10px]">
                                <p className="text-[16px] inter-light text-[#86909C] leading-relaxed">
                                  {item.capability}
                                </p>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Patents                                                   */
/* ------------------------------------------------------------------ */

function PatentsSection() {
  return (
    <section data-scroll="patents" className="bg-white px-[24px] lg:px-0">
      <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
        <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
          <h2 className="inter-medium text-[32px] text-[#2d2722] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
            Patent Portfolio
          </h2>
          <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
            Coverage: US · EU · Singapore · Hong Kong
          </p>
        </div>

        <div className="space-y-0">
          {patents.map((patent, index) => (
            <div
              key={index}
              className="border-b border-[#EBE8E5] last:border-b-0 py-[20px] md:py-[24px]"
            >
              <h3 className="text-[18px] inter-light text-[#2d2722] mb-[12px]">
                {patent.title}
              </h3>
              <p className="text-[16px] inter-light text-[#86909C]">
                {patent.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Export                                                              */
/* ------------------------------------------------------------------ */

export default function ComplianceContent() {
  return (
    <>
      <HeroSection />
      <FrameworkSection />
      <BAFTSection />
      <SecuritySection />
      <FATFSection />
      <PatentsSection />
      <Cta wrapperBg="bg-[#f2efec]">
        <p className="inter-light text-[16px] md:text-[18px] text-white mb-[24px] md:mb-[36px] mx-auto">
          &ldquo;The regulatory moat is not a filing. It is a licensed,
          operating bank with 30 years of institutional history behind every
          transaction.&rdquo;
        </p>
      </Cta>
    </>
  );
}
