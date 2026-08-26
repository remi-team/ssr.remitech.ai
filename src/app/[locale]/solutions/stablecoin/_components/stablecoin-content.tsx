"use client";

import * as React from "react";

// ── Static data (migrated from Vue StableCoin.vue) ──

const lifecycleItems = [
  {
    title: "Issuance",
    description:
      "Bison Bank — our strategic partner and a MiCA-licensed EMT issuer — mints stablecoins backed by fiat reserves held under ECB and Banco de Portugal supervision. Each token represents a 1:1 claim on underlying assets held in segregated reserve accounts.",
  },
  {
    title: "Transfer & Settlement",
    description:
      "Stablecoins move between regulated institutions on the Remi network. Travel Rule data, KYC/AML context, and compliance status travel with every transfer. Real-time settlement, immutable audit trail.",
  },
  {
    title: "Redemption",
    description:
      "Members redeem stablecoins for fiat at 1:1 ratio through Bison Bank. Redemption requests are processed under MiCA-mandated timelines with full reserve transparency and regulatory reporting.",
  },
];

const keyFeatures = [
  {
    title: "Bank-Grade Compliance",
    description:
      "MiCA EMT authorization with ECB + Banco de Portugal oversight. Every issuance supervised by the home regulator.",
  },
  {
    title: "Multi-Currency Support",
    description:
      "Designated currency corridors under home regulatory authorization. EUR and USD EMT issuance live 2026.",
  },
  {
    title: "Real-Time Settlement",
    description:
      "Mint and redeem in real-time on the REMI network. T+0 settlement for all token operations.",
  },
  {
    title: "Full Audit Trail",
    description:
      "Every mint, redeem, and freeze operation logged immutably on-chain. Complete transparency for regulators and members.",
  },
  {
    title: "Programmable Compliance",
    description:
      "Compliance rules embedded at the protocol level. Freeze, flag, or redirect before settlement clears.",
  },
  {
    title: "Reserve Transparency",
    description:
      "Reserve management supervised by the home regulator. Short-term, highly liquid, low-risk government bonds backing every token.",
  },
  {
    title: "MiCA Authorized",
    description:
      "Among the first batch of MiCA-licensed EMT issuers. The only non-G-SII bank with this authorization.",
  },
];

const roadmapPhases = [
  {
    phase: "PHASE 1",
    title: "Sole Issuer — Bison Bank",
    description:
      "Bison Bank as the sole Approved Stablecoin issuer per currency corridor. Full regulatory oversight. Reserve management by the home regulator.",
  },
  {
    phase: "PHASE 2",
    title: "Multi-Stablecoin",
    description:
      "Expansion to multiple currency-denominated stablecoins across corridors. Each corridor with its own Approved Stablecoin under MiCA or GENI Act framework.",
  },
  {
    phase: "PHASE 3",
    title: "Multi-Issuer",
    description:
      "Multiple Issuing Members per corridor under home regulatory authorization. Full decentralization of issuance while maintaining compliance.",
  },
];

// ── Components ──

export function StablecoinContent() {
  return (
    <>
      {/* Bison Bank Section */}
      <section className="bg-white">
        <div className="lg:max-w-[1040px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px] px-[24px] lg:px-0">
          <div className="bg-[#F7F5F3] bg-[url('/images/bison-water.png')] bg-no-repeat bg-right-top bg-[length:310px] px-[40px] py-[60px] md:rounded-[4px]">
            <h3 className="mb-[20px] text-[24px] font-light">
              Issued by Bison Bank (Lisbon)
            </h3>
            <p className="md:pr-[60px] text-[18px] leading-[32px] text-[#86909C] text-left font-light">
              A licensed Portuguese bank with 30+ years of institutional
              history. Among the first banks licensed under MiCA to issue
              Electronic Money Tokens, and the only non-G-SII issuer.
              ECB-authorized under VASP. Europe&apos;s first bank-licensed
              digital asset service provider.
            </p>
          </div>
        </div>
      </section>

      {/* Issuance Process */}
      <div className="lg:max-w-[1024px] mx-auto px-[24px] lg:px-0 pb-[48px] lg:pb-[64px] xl:pb-[72px] 2xl:pb-[88px]">
        <div className="mt-[75px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="font-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
              Issuance Process
            </h2>
            <p className="font-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
              End-to-end stablecoin lifecycle management
              <br className="md:hidden" /> under MiCA and bank supervision.
            </p>
          </div>
          <div className="space-y-[24px] lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-[36px] mt-[48px] mx-auto">
            {lifecycleItems.map((item, i) => (
              <div
                key={i}
                className="h-auto min-h-[240px] bg-[#F7F5F3] rounded-[4px] p-[24px] 2xl:py-[32px] hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-[18px] font-light text-[#29221D] mb-6">
                  {item.title}
                </h3>
                <p className="font-light text-[16px] text-[#86909C]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white px-[24px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
          <div className="text-center mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="font-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
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
      </div>

      {/* Issuance Roadmap */}
      <div className="bg-[#FAF8F7] px-[48px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="font-medium text-[32px] text-[#29221D] text-left md:text-center mb-[12px]">
              Issuance Roadmap
            </h2>
          </div>
          <div className="mt-[48px] mx-auto">
            {roadmapPhases.map((p, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row py-[30px] gap-x-[10px] md:gap-x-[48px] rounded-[4px] space-y-4"
              >
                <div className="text-[#FF6900] font-medium shrink-0">{p.phase}</div>
                <div className="flex-1">
                  <h3 className="mb-[15px] text-[16px] md:text-[18px] font-medium text-[#29221D]">
                    {p.title}
                  </h3>
                  <p className="font-light text-[18px] text-[#86909C] leading-relaxed">
                    {p.description}
                  </p>
                  {i < roadmapPhases.length - 1 && (
                    <div className="py-[20px] border-b border-b-[#EBE8E5]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
