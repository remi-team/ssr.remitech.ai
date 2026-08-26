"use client";

import * as React from "react";

// ── Static data (migrated from Vue LC.vue) ──

const keyFeatures = [
  {
    title: "Issuing for Regulated Institutions",
    description:
      "Bank-grade control measures for digital issuance and management of Letters of Credit. Every LC issued under full regulatory compliance with embedded KYC/AML verification.",
  },
  {
    title: "One Submission, One Workspace",
    description:
      "Single submission, shared workspace for document management. All four parties — importer, exporter, issuing FI, nominated FI — work from the same state.",
  },
  {
    title: "Automated Clearance",
    description:
      "Built-in validation and policy rules for automated clearance. Smart contract execution eliminates manual queueing and bilateral messaging chains.",
  },
  {
    title: "Liquidity on Demand",
    description:
      "Access to RWA financing markets for competitive funding. Tokenised LC receivables tradeable in RWA marketplace — freeing working capital for SMEs.",
  },
  {
    title: "Single Source of Truth",
    description:
      "Centralised management, searchable, permission-controlled, tamper-proof. All four parties see the same state simultaneously — no document version conflicts.",
  },
  {
    title: "Faster Acceptance & Settlement",
    description:
      "Compressed acceptance cycles, reduced total cost. T+0 settlement replaces T+7 or longer traditional LC cycles.",
  },
];

const riskFeatures = [
  {
    title: "Live Transaction Monitoring",
    description:
      "Real-time visibility into every LC in the network. Status, collateral, counterparty risk — all in one view.",
  },
  {
    title: "Automated Amendment Triggers",
    description:
      "Shipment delayed? Strait closed? LC expiring? Amendment request triggers automatically — all four parties notified simultaneously.",
  },
  {
    title: "Collateral Adjustment",
    description:
      "Collateral adjusts in real time as risk conditions change. No manual re-verification. No bilateral messaging.",
  },
  {
    title: "Decision Intelligence",
    description:
      "A corporate that has priced risk in real time will not go back to a bank that prices it on Tuesday morning with a spreadsheet.",
  },
];

// ── Components ──

export function LcContent() {
  return (
    <>
      {/* Market Opportunity */}
      <section className="bg-white px-[24px] lg:px-[0]">
        <div className="lg:max-w-[1040px] mx-auto py-[48px] md:py-[64px] lg:py-[72px] xl:py-[96px] overflow-hidden">
          <div className="text-center mb-[48px]">
            <h2 className="font-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] text-left md:text-center mb-[12px]">
              Market Opportunity
            </h2>
          </div>
          <div className="space-y-[24px] lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-[36px] xl:gap-[48px] mx-auto">
            <div className="bg-[#F7F5F3] p-[30px] lg:p-[40px] rounded-[4px] space-y-4">
              <h3 className="font-medium text-[48px] xl:text-[60px] text-center text-[#FF6900]">
                $9.7T
              </h3>
              <p className="font-light text-[18px] text-[#86909C] text-center">
                Trade Finance Market (GM Insights 2024)
              </p>
            </div>
            <div className="bg-[#F7F5F3] p-[30px] lg:p-[40px] rounded-[4px] space-y-4">
              <h3 className="font-medium text-[48px] xl:text-[60px] text-center text-[#FF6900]">
                $2.5T
              </h3>
              <p className="font-light text-[18px] text-[#86909C] text-center">
                Unserved Demand — The Trade Finance Gap (ADB 2022)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <div className="lg:max-w-[1024px] mx-auto px-[24px] lg:px-[0] py-[48px] md:py-[64px] lg:py-[72px] xl:py-[96px] overflow-hidden">
        <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
          <h2 className="font-medium text-[32px] text-[#29221D] mb-[12px] text-left md:text-center">
            Key Features
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[35px]">
          {keyFeatures.map((f, i) => (
            <div key={i} className="h-auto p-[24px] 2xl:py-[32px]">
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

      {/* Real-Time Risk Visibility */}
      <section className="bg-white px-[24px] lg:px-[0]">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] md:py-[64px] lg:py-[72px] xl:py-[96px] overflow-hidden">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="font-medium text-[32px] text-[#29221D] mb-[12px] text-left md:text-center">
              Real-Time Risk Visibility
            </h2>
          </div>
          <div className="bg-[#F7F5F3] px-[40px] py-[60px] md:rounded-[4px]">
            <h3 className="mb-[20px] text-[24px] font-light">
              Corridor Data Meets Geopolitical Risk Pricing
            </h3>
            <p className="md:pr-[60px] text-[18px] leading-[32px] text-[#86909C] text-left font-light">
              REMI&apos;s corridor transaction data, combined with real-time risk
              signals, gives corporate treasurers a live view of whether to
              extend, hedge, or cancel — before the crisis bites. The
              infrastructure generates the signal.
            </p>
          </div>
          <div className="mt-[40px] grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
            {riskFeatures.map((item, i) => (
              <div
                key={i}
                className="h-auto min-h-[240px] bg-[#F7F5F3] rounded-[4px] p-[24px] 2xl:py-[32px] hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-[18px] font-light text-[#29221D] mb-6">
                  {item.title}
                </h3>
                <p className="font-light text-[16px] text-[#86909C] text-left">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenised LC Receivables */}
      <section className="bg-white px-[24px] lg:px-[0] pb-[60px] lg:pb-[80px] xl:pb-[100px]">
        <div className="mx-auto max-w-[1024px]">
          <div className="bg-[#FFF0E5] p-[30px] lg:p-[40px] rounded-[4px]">
            <h3 className="text-[18px] font-light text-[#29221D] mb-[12px]">
              Tokenised LC Receivables in RWA Marketplace
            </h3>
            <p className="font-light text-[16px] text-[#86909C]">
              LC receivables tokenised and tradeable in the RWA marketplace —
              freeing working capital for SMEs. Programmable cash flows,
              auto-execute coupons and rollovers. Fixed income as a dynamic,
              liquid asset.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
