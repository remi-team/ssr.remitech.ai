"use client";

import * as React from "react";
import { Cta } from "@/components/cta";

/* ── Data (migrated from Vue ref/reactive → const) ── */

const whyRemiData = [
  {
    title: "Global E-Money Token(EMT) Network",
    content:
      "Remi has established a regulated E-Money Token(EMT) network with active corridors across Vietnam, Philippines, Indonesia, Bangladesh, the UAE and key Latin American markets. More than 15 member institutions have been secured. Notably, in the United States, as a Singapore-based technology company — Remi leads BAFT's working group on providing comment letter to OCC's GENIUS Act",
  },
  {
    title: "Regulated Digital Asset Trading Platform",
    content:
      "Remi has built the world's first regulated interbank digital asset trading platform, encompassing stablecoin FX, interbank overnight lending, and short-term RWA products including US and European government bonds.",
  },
  {
    title: "Regulatory Dashboard for AML",
    content:
      "Remi has developed the world's first regulatory dashboard for anti-money laundering, equipping regulators with advanced tools to monitor real-time changes in digital asset transfers — enabling pre-event early warning, in-event inspection, post-event tracing, freezing, and data sharing — and has published a whitepaper mapping Remi's capabilities to all 40 FATF anti-money laundering recommendations.",
  },
  {
    title: "Monetary Policy Dashboard",
    content:
      "Remi has created the world's first stablecoin monetary policy dashboard for national currency management authorities, providing advanced tools to incorporate stablecoins into real-time monetary management, with AI-driven automated management of exchange rates, interest rates, and other monetary policy instruments.",
  },
  {
    title: "Competitive Moat",
    content:
      "Multiple revolutionary technology innovations and over a dozen patents worldwide give Remi a strong competitive moat.",
  },
];

const membershipCategories = [
  {
    title: "Issuing Member",
    functions: "F0 + F1 + F2 + F3",
    desc: "Mints and redeems the Approved Stablecoin for a designated currency corridor under its home regulatory authorization. One Issuing Member is contemplated per currency corridor.",
  },
  {
    title: "Custodian Member",
    functions: "F0 + F2 + F3",
    desc: "Holds tokens on own books or on behalf of customers, performed directly or through a qualified custodian. Custody implies transaction capability.",
  },
  {
    title: "Transaction Member",
    functions: "F0 + F3",
    desc: "Submits and receives on-chain transactions. Custody arrangement is the Member's sole decision under applicable law.",
  },
  {
    title: "Messaging Member",
    functions: "F0 only",
    desc: "Uses the Network for structured payment instructions, compliance data tooling and audit trails. Executes fiat last-mile through existing infrastructure, with no digital asset exposure.",
  },
];

const functionComparisonData = [
  {
    function: "F0 Messaging",
    definition:
      "Off-chain structured messaging, FATF Travel Rule tooling, sanctions screening, Compliance Token generation and audit logging. Required for all Members.",
    issuing: "✓",
    custodian: "✓",
    transaction: "✓",
    messaging: "✓",
  },
  {
    function: "F1 Issuance",
    definition:
      "Mint and redeem Approved Stablecoins under home regulator authorization (GENIUS Act / MiCA EMT).",
    issuing: "✓",
    custodian: "—",
    transaction: "—",
    messaging: "—",
  },
  {
    function: "F2 Custody",
    definition:
      "Hold tokens on own books or for customers, in compliance with OCC IL 1170 / MiCA Service 1.",
    issuing: "✓",
    custodian: "✓",
    transaction: "Optional",
    messaging: "—",
  },
  {
    function: "F3 Transaction",
    definition:
      "Submit and receive on-chain transactions, including FX, transfers and settlement.",
    issuing: "✓",
    custodian: "✓",
    transaction: "✓",
    messaging: "—",
  },
];

const benefitsData = [
  {
    text: "Full access to the global Remi Network of licensed banks and financial institutions",
  },
  {
    text: "Participation in Member Advisory Council and Regional Member Councils",
  },
  {
    text: "Multi-signature deployment authorization for Core Protocol changes",
  },
  {
    text: "Dedicated technical support and operational account management",
  },
  {
    text: "Priority access to new currency corridors and feature pilots",
  },
  {
    text: "Exclusive access to the Member Directory and compliance tooling suite",
  },
];

const governanceEntities = [
  {
    name: "Remi US LLC (Delaware)",
    desc: "Serves US Members and regulators (OCC, FRB, FDIC)",
  },
  {
    name: "Remi Europe (Portugal)",
    desc: "Serves EU Members and regulators (Banco de Portugal, CMVM, MiCA)",
  },
  {
    name: "Remi Asia (Singapore)",
    desc: "Serves APAC Members and regulators (MAS)",
  },
];

const joinSteps = [
  {
    title: "Submit Application",
    desc: "Complete the membership inquiry form with your institution details and regulatory status",
  },
  {
    title: "Regulatory & Operational Review",
    desc: "Remi regional team verifies your licensing, eligibility and operational readiness",
  },
  {
    title: "Execute Agreements",
    desc: "Sign the Remi Network Membership Agreement (RNMA) and applicable bilateral service agreements",
  },
  {
    title: "Technical Integration",
    desc: "Deploy client nodes and complete compliance, connectivity and transaction testing",
  },
  {
    title: "Go Live",
    desc: "Activate your selected functions and start transacting on the production network",
  },
];

/* ── Components ── */

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
            srcSet="/images/membership_1536@2x_compressed.jpg"
          />
          <source
            media="(min-width:1280px)"
            srcSet="/images/membership_1280@2x_compressed.jpg"
          />
          <source
            media="(min-width:768px)"
            srcSet="/images/membership_768@2x_compressed.jpg"
          />
          <img
            src="/images/membership_640@2x_compressed.jpg"
            alt="Remi Network"
            className="w-full h-full object-cover"
          />
        </picture>
      </div>
      <div className="relative z-10 h-full flex pt-[140px] sm:pt-[160px] md:pt-[180px] lg:pt-[219px] pb-[48px]">
        <div className="max-w-[1536px] mx-auto px-[24px] sm:px-[48px] lg:px-[120px] w-full">
          <h1 className="font-light text-white text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] uppercase mb-[16px] sm:mb-[20px] md:mb-[24px]">
            REMI NETWORK MEMBERSHIP
          </h1>
          <div className="max-w-[810px] space-y-[12px] sm:space-y-[14px] md:space-y-[16px]">
            <p className="text-white/80 text-[15px] sm:text-[16px] lg:text-[20px] font-light leading-relaxed">
              Join the bank-consortium-governed blockchain settlement
              infrastructure, enabling real-time interbank settlement using
              regulated payment stablecoins.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyRemiSection() {
  return (
    <section data-scroll="why-remi" className="bg-white px-[24px] lg:px-[0]">
      <div className="max-w-[1024px] mx-auto pt-[48px] overflow-hidden">
        <div className="text-center lg:text-left mb-12 lg:mb-16">
          <h2 className="font-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
            Why Remi
          </h2>
          <p className="font-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
            Remi is answering the challenges of our time with leading solutions.
          </p>
        </div>
        <div className="relative pb-[60px] lg:pb-[80px] xl:pb-[100px]">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {whyRemiData.map((item, index) => {
                const isLastOdd =
                  whyRemiData.length % 2 !== 0 &&
                  index === whyRemiData.length - 1;
                return (
                  <div
                    key={item.title}
                    className={`h-auto min-h-[200px] bg-[#f4f2f0] rounded-[4px] p-[24px] 2xl:py-[32px] hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300 ${
                      isLastOdd ? "lg:col-span-2" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[18px] font-light text-[#29221D] mb-[12px]">
                        {item.title}
                      </h3>
                    </div>
                    <div className="space-y-6">
                      <p className="font-light text-[16px] text-[#86909C]">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MembershipCategoriesSection() {
  return (
    <section
      data-scroll="membership-categories"
      className="bg-[#f2efec] px-[24px] lg:px-[0] py-[60px] lg:py-[80px] xl:py-[100px]"
    >
      <div className="mx-auto max-w-[1024px]">
        <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px] text-center">
          <h2 className="font-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
            Membership Categories &amp; Function Matrix
          </h2>
          <p className="font-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
            The Network operates on a{" "}
            <strong className="font-[500]">function-driven model</strong>. Each
            Member activates
            <br className="hidden md:flex" />a defined combination of the four
            core functions, tailored to{" "}
            <br className="hidden md:flex" /> its regulatory authorization and
            business needs.
          </p>
        </div>

        {/* Four Membership Categories — grid (all visible) */}
        <div className="mb-[48px] lg:mb-[64px]">
          <h3 className="flex gap-[10px] items-center text-[20px] md:text-[24px] lg:text-[28px] font-[700] text-[#29221D] mb-[12px]">
            <span className="h-[20px] w-[4px] bg-[#FF6900]" />
            Four Membership Categories
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mt-[24px]">
            {membershipCategories.map((cat) => (
              <div
                key={cat.title}
                className="bg-[#F7F5F3] rounded-[4px] p-[24px] border border-[#f4f2f0] hover:shadow-lg transition-shadow duration-300"
              >
                <h4 className="flex gap-[10px] items-center text-[18px] font-medium text-[#29221D] pb-[12px] border-b border-b-[#EBE8E5] mb-[12px]">
                  <span className="h-[8px] w-[8px] bg-[#FF6900] shrink-0" />
                  {cat.title}
                </h4>
                <p className="font-light text-[16px] text-[#86909C] mb-[8px]">
                  <strong className="font-[500] text-[#2d2722]">Functions:</strong>{" "}
                  {cat.functions}
                </p>
                <p className="font-light text-[16px] text-[#86909C]">
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Function Comparison Table */}
        <div className="py-[30px]">
          <h3 className="flex gap-[10px] items-center text-[20px] md:text-[24px] lg:text-[28px] font-[700] text-[#29221D] mb-[12px]">
            <span className="h-[20px] w-[4px] bg-[#FF6900]" />
            Core Function Comparison
          </h3>
          <div className="mt-[48px] max-w-[1024px] mx-auto">
            <div className="table-container bg-white border border-[#EBE8E5] overflow-hidden rounded-[0.75rem]">
              {/* Desktop table */}
              <table className="hidden md:table w-full border-collapse border-separate">
                <thead>
                  <tr className="bg-[#69584E] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                    <th className="p-[8px] border-r border-b border-[#EBE8E5]">
                      <span className="text-white tracking-[0.025em] [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
                        Core Function
                      </span>
                    </th>
                    <th className="p-[8px] border-r border-b border-[#EBE8E5]">
                      <span className="text-white tracking-[0.025em] [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
                        Official Definition
                      </span>
                    </th>
                    <th className="p-[8px] border-r border-b border-[#EBE8E5]">
                      <span className="text-white tracking-[0.025em] [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
                        Issuing
                      </span>
                    </th>
                    <th className="p-[8px] border-r border-b border-[#EBE8E5]">
                      <span className="text-white tracking-[0.025em] [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
                        Custodian
                      </span>
                    </th>
                    <th className="p-[8px] border-r border-b border-[#EBE8E5]">
                      <span className="text-white tracking-[0.025em] [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
                        Transaction
                      </span>
                    </th>
                    <th className="p-[8px] border-b border-[#EBE8E5]">
                      <span className="text-white tracking-[0.025em] [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
                        Messaging
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {functionComparisonData.map((row) => (
                    <tr
                      key={row.function}
                      className="border-b border-[#EBE8E5]"
                    >
                      <td className="p-[8px] text-center text-sm text-white bg-[#FF8C2E] border-r border-b border-[#EBE8E5]">
                        {row.function}
                      </td>
                      <td className="p-[8px] text-sm text-[#69584e] border-r border-b border-[#EBE8E5]">
                        {row.definition}
                      </td>
                      <td className="p-[8px] text-center text-sm text-[#69584e] border-r border-b border-[#EBE8E5]">
                        {row.issuing}
                      </td>
                      <td className="p-[8px] text-center text-sm text-[#69584e] border-r border-b border-[#EBE8E5]">
                        {row.custodian}
                      </td>
                      <td className="p-[8px] text-center text-sm text-[#69584e] border-r border-b border-[#EBE8E5]">
                        {row.transaction}
                      </td>
                      <td className="p-[8px] text-center text-sm text-[#69584e] border-b border-[#EBE8E5]">
                        {row.messaging}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile stacked cards */}
              <div className="md:hidden">
                <div className="divide-y divide-[#EBE8E5]">
                  {functionComparisonData.map((row) => (
                    <div
                      key={row.function}
                      className="px-[16px] py-[16px]"
                    >
                      <p className="text-[14px] font-semibold text-[#2d2722] mb-[12px]">
                        {row.function}
                      </p>
                      <p className="text-[13px] text-[#86909C] mb-[12px]">
                        {row.definition}
                      </p>
                      <div className="grid grid-cols-4 gap-[8px]">
                        <div className="bg-[#f4f2f0] rounded-[4px] px-[8px] py-[10px] text-center">
                          <p className="text-[10px] text-[#86909C] mb-[4px]">
                            Issuing
                          </p>
                          <p className="text-[14px] text-[#69584e]">
                            {row.issuing}
                          </p>
                        </div>
                        <div className="bg-[#f4f2f0] rounded-[4px] px-[8px] py-[10px] text-center">
                          <p className="text-[10px] text-[#86909C] mb-[4px]">
                            Custodian
                          </p>
                          <p className="text-[14px] text-[#69584e]">
                            {row.custodian}
                          </p>
                        </div>
                        <div className="bg-[#f4f2f0] rounded-[4px] px-[8px] py-[10px] text-center">
                          <p className="text-[10px] text-[#86909C] mb-[4px]">
                            Transaction
                          </p>
                          <p className="text-[14px] text-[#69584e]">
                            {row.transaction}
                          </p>
                        </div>
                        <div className="bg-[#f4f2f0] rounded-[4px] px-[8px] py-[10px] text-center">
                          <p className="text-[10px] text-[#86909C] mb-[4px]">
                            Messaging
                          </p>
                          <p className="text-[14px] text-[#69584e]">
                            {row.messaging}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section
      data-scroll="benefits"
      className="bg-white py-[60px] lg:py-[80px] xl:py-[100px] px-[24px] lg:px-[0]"
    >
      <div className="mx-auto max-w-[1024px]">
        <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
          <h2 className="font-medium text-[32px] text-[#29221D] mb-[12px] text-left md:text-center">
            Member Exclusive Benefits
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] lg:gap-[36px]">
          {benefitsData.map((item) => (
            <div
              key={item.text}
              className="h-auto min-h-[120px] border border-[#FF6900] bg-[#F7F5F3] rounded-[4px] p-[24px] 2xl:py-[32px] hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300"
            >
              <div className="space-y-6">
                <p className="font-light text-[16px] text-[#86909C]">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GovernanceSection() {
  return (
    <section
      data-scroll="governance"
      className="bg-[#f2efec] px-[24px] lg:px-[0] py-[60px] lg:py-[80px] xl:py-[100px]"
    >
      <div className="mx-auto max-w-[1024px]">
        <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
          <h2 className="font-medium text-[32px] text-[#29221D] mb-[12px] text-left md:text-center">
            Transparent Governance Framework
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-[40px]">
          {/* Governance Structure Image */}
          <div>
            <div className="h-auto flex items-center justify-center font-bold text-[#86909C]">
              <picture>
                <source
                  media="(min-width:768px)"
                  srcSet="/images/Governance_Structure_compressed.png"
                />
                <img
                  src="/images/Governance_Structure_640@2x_compressed.jpg"
                  alt="Governance Structure"
                  className="w-full h-auto md:h-full object-contain md:object-cover"
                />
              </picture>
            </div>
          </div>

          {/* Governance Content */}
          <div>
            <p className="font-light text-[16px] md:text-[18px] text-[#86909C] mb-[24px] lg:mb-[36px]">
              Remi operates under a{" "}
              <strong className="text-[#2d2722]">
                tri-regional corporate governance structure
              </strong>{" "}
              designed to align with global regulatory requirements:
            </p>

            {/* Regional Operating Entities */}
            <div className="mb-[32px]">
              <h4 className="flex gap-[10px] items-center text-[18px] text-[#2d2722] pb-[12px] border-b border-b-[#EBE8E5] px-[24px] lg:px-[0]">
                <span className="ml-[-20px] h-[8px] w-[8px] bg-[#FF6900] font-light" />
                Regional Operating Entities
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mt-[16px]">
                {governanceEntities.map((entity) => (
                  <div
                    key={entity.name}
                    className="bg-white p-[16px] rounded-[4px]"
                  >
                    <p
                      className="font-light text-[18px] text-[#2d2722] mb-[8px]"
                      dangerouslySetInnerHTML={{ __html: entity.name }}
                    />
                    <p className="font-light text-[16px] text-[#86909C]">
                      {entity.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tri-Regional Board */}
            <div className="mb-[32px]">
              <h4 className="flex gap-[10px] items-center text-[18px] text-[#2d2722] pb-[12px] border-b border-b-[#EBE8E5] px-[24px] lg:px-[0]">
                <span className="ml-[-20px] h-[8px] w-[8px] bg-[#FF6900]" />
                Tri-Regional Board
              </h4>
              <p className="font-light text-[16px] text-[#86909C] mt-[16px]">
                Composed of 9 directors (3 per region), including at least 1
                independent director per region. Meets annually for substantial
                network-level operational and structural decisions.
              </p>
            </div>

            {/* Member Consultation Channels */}
            <div className="mb-[32px]">
              <h4 className="flex gap-[10px] items-center text-[18px] text-[#2d2722] pb-[12px] border-b border-b-[#EBE8E5] px-[24px] lg:px-[0]">
                <span className="ml-[-20px] h-[8px] w-[8px] bg-[#FF6900]" />
                Member Consultation Channels
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mt-[16px]">
                <div className="bg-white p-[16px] rounded-[4px]">
                  <p className="font-light text-[16px] text-[#86909C] mb-[8px]">
                    Normal Pipeline Operational and product feedback
                  </p>
                </div>
                <div className="bg-white p-[16px] rounded-[4px]">
                  <p className="font-light text-[16px] text-[#86909C] mb-[8px]">
                    24/7 Urgent Escalation Security, compliance and regulatory
                    matters
                  </p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="border-l-4 border-[#FF6900] pl-[20px] mt-[30px]">
              <p className="font-light text-[16px] text-[#86909C] italic">
                Member input is consultative and considered in good faith for
                all network decisions. Material changes to the Core Protocol
                require cryptographic authorization from a threshold of
                Member-controlled keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowToJoinSection() {
  return (
    <section
      data-scroll="how-to-join"
      className="bg-white py-[60px] lg:py-[80px] xl:py-[100px] px-[24px] lg:px-[0]"
    >
      <div className="mx-auto max-w-[1024px]">
        <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
          <h2 className="font-medium text-[32px] text-[#29221D] mb-[12px] text-left md:text-center">
            How to Join Remi Network
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-[800px] mx-auto">
          {/* Vertical center line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#EBE8E5] z-0 -translate-x-px" />
          {/* Mobile line */}
          <div className="md:hidden absolute left-[16px] top-0 bottom-0 w-[2px] bg-[#EBE8E5] z-0" />

          {joinSteps.map((step, index) => {
            const isRight = index % 2 !== 0;
            return (
              <div
                key={step.title}
                className={`relative w-full md:w-1/2 pb-[40px] md:pb-[48px] last:pb-0 ${
                  isRight
                    ? "md:ml-[50%] md:pl-[40px] md:pr-0"
                    : "md:pr-[40px] md:pl-0"
                } pl-[48px] md:pl-0`}
              >
                {/* Dot */}
                <div
                  className={`absolute top-[20px] w-[18px] h-[18px] bg-white border-[3px] border-[#FF6900] rounded-full z-[2] ${
                    isRight
                      ? "left-[-9px] md:left-[-9px]"
                      : "left-[8px] md:left-auto md:right-[-9px]"
                  }`}
                />

                {/* Card */}
                <div className="relative bg-[#f4f2f0] border border-[#EBE8E5] rounded-[4px] p-[20px] sm:p-[24px] transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(241,227,218,0.8)]">
                  {/* Arrow (desktop) */}
                  {!isRight && (
                    <div className="hidden md:block absolute right-[-8px] top-[22px] w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-[#f4f2f0]" />
                  )}
                  {isRight && (
                    <div className="hidden md:block absolute left-[-8px] top-[22px] w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-[#f4f2f0]" />
                  )}

                  <div className="text-[18px] tracking-[0.05em] uppercase mb-[12px] text-[#FF6900]">
                    Step {index + 1}
                  </div>
                  <h4 className="font-light text-[18px] text-[#2d2722] mb-[12px]">
                    {step.title}
                  </h4>
                  <p className="font-light text-[16px] text-[#86909C]">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Main Export ── */

export function MembershipContent() {
  return (
    <div className="min-h-screen bg-[#f2efec] text-[#2c2520]">
      <HeroSection />
      <WhyRemiSection />
      <MembershipCategoriesSection />
      <BenefitsSection />
      <GovernanceSection />
      <HowToJoinSection />

      {/* CTA */}
      <Cta wrapperBg="bg-[#f2efec]">
        <h2 className="font-light text-[24px] md:text-[28px] lg:text-[32px] text-white leading-[1.3] mb-[36px] max-w-[860px] mx-auto">
          Ready to join the next generation of cross-border settlement infrastructure?
        </h2>
      </Cta>
    </div>
  );
}
