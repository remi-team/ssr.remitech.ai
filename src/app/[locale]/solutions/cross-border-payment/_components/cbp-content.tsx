"use client";

import * as React from "react";
import { Cta } from "@/components/cta";

// ── Static data (migrated from Vue CrossBorderPayment.vue) ──

const whyBanksData = [
  {
    title: "Reduced Cost",
    content:
      "Eliminate intermediary banks and reduce transaction costs significantly. Point-to-point direct remittance means no correspondent deductions and no hidden fee leakage.",
  },
  {
    title: "Fast Processing",
    content:
      "Transactions typically complete within minutes on active corridors. Real-time settlement on a 24/7 network, as opposed to the days required by traditional methods.",
  },
  {
    title: "Enhanced Security",
    content:
      "By reducing intermediaries, each transaction is completed accurately, on time, every time. Leave no money on the way that nobody knows its whereabouts.",
  },
  {
    title: "SWIFT Compatibility",
    content:
      "Seamless integration with existing SWIFT-based infrastructures. Banks can route transactions via Remi or traditional networks with zero disruption. Your stack, your choice.",
  },
];

interface ComparisonRow {
  feature: string;
  current: string;
  remi: string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "Transferred Amount",
    current: "$ 100K",
    remi: "$ 100K",
  },
  {
    feature: "Time Used",
    current: "2–3 days",
    remi: "Minutes on active corridors",
  },
  {
    feature: "Fee per Transaction",
    current: "$30–100",
    remi: "Low flat fees",
  },
  {
    feature: "Complexity",
    current: "Through intermediary banks",
    remi: "Point-to-point",
  },
  {
    feature: "Real-time Monitoring Dashboard",
    current: "No",
    remi: "Yes",
  },
  {
    feature: "KYC/AML",
    current: "Yes",
    remi: "Yes — Embedded at protocol level",
  },
];

const bankFeatures = [
  {
    title: "Real-Time Settlement",
    desc: "24/7 network settlement. Active corridors process in moments, not days.",
  },
  {
    title: "Flat, Transparent Pricing",
    desc: "Monthly flat-fee structure with transparent FX. No correspondent deductions, no hidden cost leakage.",
  },
  {
    title: "Compliance That Travels",
    desc: "Embedded KYC/AML and POBO. Identity and purpose data move with the fund transfer.",
  },
  {
    title: "Go Live Fast",
    desc: "SWIFT-compatible, light-touch integration — live in weeks, not months. Your existing stack, enhanced.",
  },
  {
    title: "One Network, All Segments",
    desc: "Serve retail and corporate flows with predictable speed, transparent pricing, and proof of delivery end-to-end.",
  },
  {
    title: "Audit-Ready by Design",
    desc: "Full traceability for reconciliation and compliance. Every transaction, every counterparty, permanent record.",
  },
];

const fintechFeatures = [
  {
    title: "Real-Payer & Receiver Visibility",
    desc: "Verified parties and stated purpose travel end-to-end, enabling faster posting with fewer errors.",
  },
  {
    title: "VA-Free Setup",
    desc: "Go live without sponsor-bank VA pre-opening or omnibus accounts. Light-touch integration.",
  },
  {
    title: "Data Control",
    desc: "Keep customer files in-house; share only attested fields required for screening.",
  },
  {
    title: "Direct Crediting",
    desc: "Credit client balances on your books and auto-reconcile via payment references.",
  },
  {
    title: "Fast Funding",
    desc: "Active corridors post quickly with delivery confirmation and live status tracking.",
  },
  {
    title: "Audit-Ready",
    desc: "End-to-end traceability for compliance and reporting. Full chain visibility.",
  },
];

const exchangeFeatures = [
  {
    title: "Same-Name Matching",
    desc: "Payer name matches exchange account",
  },
  {
    title: "Compliance In-Flow",
    desc: "KYC/AML tags travel end-to-end",
  },
  {
    title: "Auto-Match & Credit",
    desc: "Payment reference → user account",
  },
  {
    title: "Low, Predictable Cost",
    desc: "Fewer intermediaries, less review",
  },
];

// ── Sub-component: Feature list (orange dot + title + description) ──

function FeatureList({
  items,
}: {
  items: { title: string; desc: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-x-[35px] md:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="h-auto p-[24px] 2xl:py-[32px]">
          <div className="flex items-center justify-between border-b border-b-[#EBE8E5]">
            <h2 className="flex items-center gap-[10px] pb-[12px] text-[18px] text-[#29221D] lg:mb-0">
              <span className="ml-[-20px] h-[8px] w-[8px] bg-[#FF6900]" />{" "}
              {item.title}
            </h2>
          </div>
          <div className="pt-[12px]">
            <p className="text-[16px] leading-relaxed text-[#86909C]">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main export ──

export function CbpContent() {
  return (
    <>
      {/* ===== Why Banks Choose Remi ===== */}
      <section
        data-scroll="why-banks"
        className="mx-auto max-w-[1024px] overflow-hidden px-[24px] pt-[48px] lg:px-[0]"
      >
        {/* Heading */}
        <div className="mb-12 lg:mb-16">
          <h2 className="mx-auto mb-[12px] mt-[12px] text-left text-[32px] text-[#29221D] md:text-center lg:mt-[16px] 2xl:mt-[24px]">
            Why Banks Choose Remi
          </h2>
          <p className="mb-[24px] text-left text-[16px] text-[#86909C] md:text-center md:text-[18px] lg:mb-[36px]">
            The regulated settlement rail built exclusively for financial
            institutions.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="relative pb-[60px] lg:pb-[80px] xl:pb-[100px]">
          <div className="w-full">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {whyBanksData.map((item) => (
                <div
                  key={item.title}
                  className="h-auto min-h-[240px] rounded-[4px] bg-[#F7F5F3] p-[24px] shadow-[#F1E3DA] transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="mb-[12px] text-[18px] text-[#29221D]">
                      {item.title}
                    </h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[16px] text-[#86909C]">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Comparison Table ===== */}
      <section
        data-scroll="comparison"
        className="bg-[#FAF8F7] px-[24px] py-[60px] lg:px-[0] lg:py-[80px] xl:py-[100px]"
      >
        <div className="mx-auto max-w-[1024px]">
          <div className="py-[30px]">
            <h2 className="mx-auto text-left text-[32px] text-[#29221D] md:text-center">
              A comparison for cross-border remittances
            </h2>

            <div className="mx-auto mt-[48px] max-w-[1024px]">
              <div className="table-container overflow-hidden rounded-[0.75rem] border border-[#EBE8E5] bg-white">
                {/* Desktop table */}
                <table className="hidden w-full border-collapse md:table">
                  <thead>
                    <tr className="bg-[#69584E]">
                      <th className="border-r border-b border-[#EBE8E5] p-[8px] text-center text-sm text-white">
                        Features
                      </th>
                      <th className="border-r border-b border-[#EBE8E5] p-[8px] text-center text-sm text-white">
                        Current
                      </th>
                      <th className="border-b border-[#EBE8E5] p-[8px] text-center text-sm text-white">
                        Remi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row) => (
                      <tr
                        key={row.feature}
                        className="border-b border-[#EBE8E5]"
                      >
                        <td className="border-r border-b border-[#EBE8E5] bg-[#FF8C2E] p-[8px] text-center text-sm text-white">
                          {row.feature}
                        </td>
                        <td className="border-r border-b border-[#EBE8E5] p-[8px] text-center text-sm text-[#69584e]">
                          {row.current}
                        </td>
                        <td className="border-b border-[#EBE8E5] p-[8px] text-center text-sm text-[#69584e]">
                          {row.feature === "Time Used" ||
                          row.feature === "Fee per Transaction" ||
                          row.feature === "Complexity" ||
                          row.feature === "Real-time Monitoring Dashboard" ? (
                            <span className="text-[#FF6900]">{row.remi}</span>
                          ) : row.feature === "KYC/AML" ? (
                            <span>{row.remi}</span>
                          ) : (
                            row.remi
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile stacked cards */}
                <div className="divide-y divide-[#EBE8E5] md:hidden">
                  {comparisonData.map((row) => (
                    <div key={row.feature} className="px-[16px] py-[16px]">
                      <p className="mb-[12px] text-[14px] text-[#29221D]">
                        {row.feature}
                      </p>
                      <div className="grid grid-cols-2 gap-[12px]">
                        <div className="rounded-[4px] bg-[#F7F5F3] px-[12px] py-[10px]">
                          <p className="mb-[4px] text-[11px] text-[#86909C]">
                            Current
                          </p>
                          <p className="text-[14px] text-[#69584e]">
                            {row.current}
                          </p>
                        </div>
                        <div className="rounded-[4px] border border-[#FFE0C2] bg-[#FFF7F0] px-[12px] py-[10px]">
                          <p className="mb-[4px] text-[11px] text-[#FF6900]">
                            Remi
                          </p>
                          <p className="text-[14px] text-[#29221D]">
                            {row.remi}
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
      </section>

      {/* ===== How Institutions Use Remi ===== */}
      <section
        data-scroll="how-institutions"
        className="bg-white px-[24px] py-[60px] lg:px-[0] lg:py-[80px] xl:py-[100px]"
      >
        <div className="mx-auto max-w-[1024px]">
          <div className="mb-[48px] text-left md:mb-[64px] md:text-center lg:mb-[72px] xl:mb-[96px]">
            <h2 className="mb-[12px] text-[32px] text-[#29221D]">
              How Institutions Use Remi
            </h2>
          </div>

          {/* For Banks */}
          <div className="mb-[48px] lg:mb-[64px]">
            <div className="mb-[24px] lg:mb-[36px]">
              <h3 className="mb-[12px] flex items-center gap-[10px] text-[20px] font-bold text-[#29221D] md:text-[24px] lg:text-[28px]">
                <span className="h-[20px] w-[4px] bg-[#FF6900]" /> For Banks
              </h3>
              <p className="text-[16px] text-[#86909C] md:text-[18px]">
                Bank Direct — Real-time cross-border payments with embedded
                compliance, flat pricing, and SWIFT-compatible integration.
              </p>
            </div>
            <FeatureList items={bankFeatures} />
          </div>

          {/* For Fintechs */}
          <div className="mb-[48px] lg:mb-[64px]">
            <div className="mb-[24px] lg:mb-[36px]">
              <h3 className="mb-[12px] flex items-center gap-[10px] text-[20px] font-bold text-[#29221D] md:text-[24px] lg:text-[28px]">
                <span className="h-[20px] w-[4px] bg-[#FF6900]" /> For
                Fintechs
              </h3>
              <p className="text-[16px] text-[#86909C] md:text-[18px]">
                POBO Direct — Cross-border payments on behalf of clients, with
                full compliance, direct crediting, and operational simplicity.
              </p>
            </div>
            <FeatureList items={fintechFeatures} />
          </div>
        </div>
      </section>

      {/* ===== Exchange Express ===== */}
      <section
        data-scroll="exchange-express"
        className="bg-[#FAF8F7] px-[24px] py-[60px] lg:px-[0] lg:py-[80px] xl:py-[100px]"
      >
        <div className="mx-auto max-w-[1024px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="mb-[12px] text-left text-[32px] text-[#29221D] md:text-center">
              Exchange Express
            </h2>
          </div>

          {/* For licensed web3 institutions */}
          <div className="mb-[48px] lg:mb-[64px]">
            <div className="mb-[24px] lg:mb-[36px]">
              <h3 className="mb-[12px] flex items-center gap-[10px] text-[20px] font-bold text-[#29221D] md:text-[24px] lg:text-[28px]">
                <span className="h-[20px] w-[4px] bg-[#FF6900]" /> For
                licensed web3 institutions
              </h3>
              <p className="text-[16px] text-[#86909C] md:text-[18px]">
                Same-name fiat on/off-ramps in minutes. Built for crypto
                exchanges and digital asset platforms.
              </p>
            </div>
            <FeatureList items={exchangeFeatures} />
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <Cta>
        <h2 className="mx-auto mb-[36px] max-w-[860px] text-[24px] leading-[1.3] text-white md:text-[28px] lg:text-[32px]">
          Ready to modernize your cross-border infrastructure?
        </h2>
      </Cta>
    </>
  );
}
