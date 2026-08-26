"use client";

import * as React from "react";
import { Cta } from "@/components/cta";

// ── Type definitions ──

interface StageItem {
  label: string;
  title: string;
  description: string;
  emphasis: string;
}

interface KYCFeature {
  title: string;
  description: string;
}

interface RiskControlFeature {
  title: string;
  description: string;
}

interface DashboardCard {
  title: string;
  description: string;
  listItems: string[];
}

interface InterventionSubItem {
  title: string;
  description: string;
  listItems?: string[];
}

interface InterventionCard {
  title: string;
  items: InterventionSubItem[];
}

interface RegulatoryAlignmentCard {
  title: string;
  content: string;
}

interface IntegrationCard {
  title: string;
  content: string;
}

interface FinancialMarketCard {
  title: string;
  description: string;
  listItems: string[];
}

interface FATFItemRow {
  recommendation: string;
  capability: string;
}

interface FATFItem {
  title: string;
  remiCapability?: string;
  items: FATFItemRow[];
}

// ── Static data (migrated from Vue Regtech.vue) ──

const complianceStages: StageItem[] = [
  {
    label: "STAGE 1",
    title: "Pre-Clearance",
    description:
      "AML screening, Travel Rule verification, and counterparty checks completed before the transaction is admitted.",
    emphasis:
      "Non-compliant transactions are rejected at the gate — they never enter settlement.",
  },
  {
    label: "STAGE 2",
    title: "In-Settlement",
    description:
      "Real-time risk scoring against known parameters as the transaction moves.",
    emphasis:
      "Flagged transactions held for review before clearing. No bad transaction completes without review.",
  },
  {
    label: "STAGE 3",
    title: "Post-Settlement",
    description:
      "Immutable on-chain audit trail. Automated compliance reporting to regulators on demand.",
    emphasis:
      "Full chain visibility — every transaction, every counterparty, every decision. Permanent.",
  },
];

const kycFeatures: KYCFeature[] = [
  {
    title: "Asset Owner Identification Authentication",
    description:
      "Transactions subject to risk-based controls based on transaction value and frequency. Unhosted wallets classified as potential risk events.",
  },
  {
    title: "Trusted PKI Architecture",
    description:
      "REMI establishes a federation of certification authorities through a Trusted Public Key Infrastructure. Participating CAs include regulated banks and payment companies.",
  },
  {
    title: "Risk Whitelist & Blacklist",
    description:
      "Dynamically calibrated quantitative model assigns risk score to each on-chain address: Whitelist (0–30), Greylist (30–80), Blacklist (80–100).",
  },
  {
    title: "Real-Time Update Mechanism",
    description:
      "Subscribes to Dow Jones Sanctions List, FATF Black and Grey Lists, and Government Risk Lists. Updates in real time.",
  },
  {
    title: "AI-Driven KYCC",
    description:
      "Leverages AI knowledge graphs to model users' supply chain relationships, mapping transactional connections and tracing full transaction histories.",
  },
  {
    title: "Global Regulatory Adaptation",
    description:
      "AI analyzes regulatory requirements across different jurisdictions, automatically matches counterparty attributes, and generates compliance alerts.",
  },
];

const riskControlFeatures: RiskControlFeature[] = [
  {
    title: 'Pre-event Travel <br class="hidden lg:flex"/> Rule',
    description:
      "The travel rule of the transaction submitted by the Remi partner will be recorded on the blockchain in the form of a transaction memo.",
  },
  {
    title: 'During-event <br class="hidden lg:flex"/>  Risk Model',
    description:
      "Multi-model risk assessment: AML model, Transaction habit model, Anti-fraud model, Account theft model, Hacker attack model.",
  },
  {
    title:
      'During-event AI-Driven <br class="hidden lg:flex"/>  Risk Prevention',
    description:
      "AI agents analyze transactional behaviors between addresses, detect potential risks, develop whitelist models, and trigger early interventions.",
  },
  {
    title: 'Post-event Real-time <br class="hidden lg:flex"/>  Alerting',
    description:
      "Provides real-time alerts on risk factors and automatically generates risk reports. Displays prompts to consider reporting to the regulator.",
  },
  {
    title: "Post-event Recovery of Risk Assets",
    description:
      "Supports freeze requests from authorized law enforcement agencies. AI Graph Computing traces risk funds through multiple tiers of pass-through accounts.",
  },
  {
    title: 'Automated Audit <br class="hidden lg:flex"/>  Data',
    description:
      "All original transaction data originates from the Remi blockchain, which is transparent and immutable. One-click generation of compliance reports.",
  },
];

const dashboardSystemCards: DashboardCard[] = [
  {
    title: "Stablecoin Asset Regulation",
    description:
      "Real-time monitoring of stablecoin issuance and circulation across the entire network.",
    listItems: [
      "Minted and redeemed value tracking (daily and historical)",
      "Current circulation and frozen asset statistics",
      "Reserve balance and reserve ratio monitoring",
      "15-day digital asset trend visualization",
      "Top holding and redeeming institutions ranking",
    ],
  },
  {
    title: "Customer Risk Monitoring",
    description:
      "Comprehensive monitoring of transaction and customer risks.",
    listItems: [
      "Large transaction and suspicious transaction tracking",
      "Trading customer risk rating distribution",
      "Multi-dimensional customer risk assessment factors",
      "High-risk address monitoring and alerting",
      "Suspicious transaction analysis by type",
    ],
  },
  {
    title: "Global Transaction Monitoring",
    description:
      "Tracking transaction activity across global markets.",
    listItems: [
      "Real-time active institutions and transaction volume",
      "Global transaction heat map with geographic distribution",
      "Top banks ranking by monthly transactions",
      "Transaction value breakdown by country/region",
      "Risk alerts distribution by jurisdiction",
    ],
  },
];

const regulatoryInterventionCards: InterventionCard[] = [
  {
    title: "Regulatory Dashboards",
    items: [
      {
        title: "Real-Time Screening Dashboard",
        description:
          "Transaction Overview, suspicious transaction statistics, customer risk assessment, and high-risk transaction monitoring.",
      },
      {
        title: "AML Dashboard",
        description:
          "Track AML indicators, transaction statistics, usage scenarios, and risk alerts. Support comprehensive risk event management.",
      },
      {
        title: "Operation Monitoring",
        description:
          "Monitor financial health indicators: reserve ratio, liquidity, FX rates, and interest rate trends.",
        listItems: [
          "FX Rates: 24-hour exchange rate trend, currency exchange ranking, exchange heat map, and market-wide fluctuation analysis",
          "Interest Rates: Interbank lending platform for overnight to 1-year terms, arithmetic average interest rate calculation and public disclosure, interest rate transmission process monitoring",
        ],
      },
    ],
  },
  {
    title: "Regulatory Powers",
    items: [
      {
        title: "Real-Time Query",
        description:
          "Regulatory authority is able to query the risk factors, risk categories, transaction details, and risk report of any designated address.",
      },
      {
        title: "Freeze & Intervention",
        description:
          "Regulatory authority is able to freeze or request information of the addresses of any designated financial institution or single on-chain address.",
      },
      {
        title: "Automated Reporting",
        description:
          "Automatically generates Suspicious Activity Reports (SARs) and other regulatory filings. Streamlines compliance reporting processes.",
      },
    ],
  },
];

const regulatoryAlignmentCards: RegulatoryAlignmentCard[] = [
  {
    title: "FATF Recommendations",
    content:
      "Corresponds to all 40 FATF Recommendations, including Travel Rule (R16), Customer Due Diligence (R10), and Record Keeping (R11).",
  },
  {
    title: "MiCA Compliance",
    content:
      "Fully aligned with EU Markets in Crypto-Assets regulation, Transfer of Funds Regulation, and AMLD 6.",
  },
  {
    title: "GENIUS Act",
    content:
      "Designed to comply with the U.S. GENIUS Act requirements for stablecoin issuance and settlement.",
  },
  {
    title: "International Standards",
    content:
      "ISO 27001 · SOC 2 Type II · ISAE 3000 · Compatible with SWIFT and ISO 20022.",
  },
  {
    title: "Basel Committee Compliance",
    content:
      "As a MiCA-compliant Electronic Money Token issued by a regulated EU credit institution under ECB supervision, the Bison Bank Electronic Token qualifies for preferential treatment under the Basel Committee's prudential treatment of cryptoasset exposures (SCO60), effective 1 January 2026. This enables financial institutions in jurisdictions aligned with the Basel Framework to integrate the EMT into their treasury management and balance-sheet treatment with capital requirements aligned to the underlying fiat reference asset.",
  },
];

const integrationCards: IntegrationCard[] = [
  {
    title: "Integrates With",
    content:
      "Teller Systems, Clearing and Settlement Systems, Risk Control Systems, AML Systems",
  },
  {
    title: "The Responsibility of Financial Institutions",
    content:
      "FIs conduct independent KYC/KYB, store customer data separately, and ensure confidentiality. Verification status is synced to Remi as a certification marker.",
  },
  {
    title: "Remi as Information Sharing Platform",
    content:
      "Provides access to identity labels, risk whitelist and blacklist, and past risk events data to support institutional risk control.",
  },
];

const financialMarketCards: FinancialMarketCard[] = [
  {
    title: "Liquidity Monitoring",
    description:
      "Real-time tracking of stablecoin settlement volume, market depth, and monetary supply metrics across the network.",
    listItems: [
      "Stablecoin settlement volume (minting and redemption tracking)",
      "Full market stablecoin buying and selling depth across financial institutions",
      "M2 and M3 metrics derived from collateral and lending data reported by participating institutions",
      "M2: Broad money supply (on-chain cash + corporate and individual savings deposits)",
      "M3: Broadest money supply (M2 + financial bonds and commercial paper)",
      "Stablecoin usage index tracking network utilization",
    ],
  },
  {
    title: "Interest Rate Monitoring",
    description:
      "Interbank lending platform with transparent rate discovery and transmission process monitoring for the stablecoin money market.",
    listItems: [
      "Interest rate overview with key rate indicators",
      "Interbank lending platform: highly credit-rated FIs independently quote stablecoin lending rates",
      "Terms: overnight, 1-week, 2-week, 1-month, 3-month, 6-month, 9-month, and 1-year",
      "Arithmetic average interest rate calculation and public disclosure",
      "Interest rate transmission process monitoring",
      "Financial institutions report deposit and loan interest rates offered to businesses and individuals",
      "Policy and market impact analysis on rate movements",
    ],
  },
  {
    title: "Exchange Rate Monitoring",
    description:
      "24-hour exchange rate tracking with market-wide fluctuation analysis and deviation monitoring across currency pairs.",
    listItems: [
      "24-hour exchange rate trend tracking",
      "Currency exchange ranking and exchange heat map",
      "Market-wide fluctuation analysis",
      "Exchange rate deviation monitoring and fiat currency deviation tracking",
      "Stablecoin exchange rate fluctuations across the entire market",
      "Strength and weakness proportion analysis",
      "Daily average deviation spread and variance tracking",
      "Cross-currency rate analysis against USD",
    ],
  },
];

const fatfItems: FATFItem[] = [
  {
    title: "A – AML/CFT Policies & Coordination (R1–R2)",
    remiCapability: "Risk Whitelist & Blacklist; Real-time Screening Mechanism",
    items: [
      { recommendation: "R1: Assessing risks & applying risk-based approach", capability: "" },
      { recommendation: "R2: National cooperation and coordination", capability: "" },
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
    items: [
      { recommendation: "R5: Terrorist financing, targeted financial sanctions", capability: "" },
      {
        recommendation: "R6: Targeted financial sanctions related to terrorism and terrorist financing",
        capability:
          "Risk Whitelist & Blacklist; Real-time Screening Mechanism; AI-driven KYCC; Real-time Regulatory Intervention",
      },
      {
        recommendation: "R7: Targeted financial sanctions related to proliferation",
        capability: "Real-time Regulatory Intervention",
      },
      { recommendation: "R8: Non-profit organisations", capability: "" },
    ],
  },
  {
    title: "D – Preventive Measures (R9–R20)",
    items: [
      { recommendation: "R9: Financial institution secrecy laws", capability: "" },
      {
        recommendation: "R10: Customer due diligence",
        capability:
          "Asset Owner Identification; Certificate Authority; Verification Center; Real-time Screening; AI-driven KYCC",
      },
      {
        recommendation: "R11: Record keeping",
        capability: "Automatically Generated Audit Data",
      },
      { recommendation: "R12: Politically exposed persons", capability: "AI-driven KYCC" },
      { recommendation: "R13: Correspondent banking", capability: "" },
      { recommendation: "R14: Money or value transfer services", capability: "" },
      {
        recommendation: "R15: New technologies",
        capability: "Risk Whitelist & Blacklist; AI-driven KYCC",
      },
      {
        recommendation: "R16: Payment transparency",
        capability: "Pre-event Travel Rule",
      },
      { recommendation: "R17: Reliance on third parties", capability: "" },
      {
        recommendation: "R18: Internal controls and foreign branches and subsidiaries",
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
        recommendation: "R24: Transparency and beneficial ownership of legal persons",
        capability: "",
      },
      {
        recommendation: "R25: Transparency and beneficial ownership of legal arrangements",
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
        recommendation: "R26: Regulation and supervision of financial institutions",
        capability: "",
      },
      { recommendation: "R27: Powers of supervisors", capability: "" },
      { recommendation: "R28: Regulation and supervision of DNFBPs", capability: "" },
      {
        recommendation: "R29: Financial intelligence units",
        capability: "Post-event Real-time Alerting and Reporting; Real-time Screening Dashboard",
      },
      {
        recommendation: "R30: Responsibilities of law enforcement and investigative authorities",
        capability: "",
      },
      {
        recommendation: "R31: Powers of law enforcement and investigative authorities",
        capability: "",
      },
      { recommendation: "R32: Cash couriers", capability: "" },
      { recommendation: "R33: Statistics", capability: "Real-time Screening Dashboard" },
      { recommendation: "R34: Guidance and feedback", capability: "" },
      { recommendation: "R35: Sanctions", capability: "" },
    ],
  },
  {
    title: "G – International Cooperation (R36–R40)",
    items: [
      { recommendation: "R36: International instruments", capability: "" },
      { recommendation: "R37: Mutual legal assistance", capability: "" },
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

// ── Helper sub-component: Bullet list with orange custom marker ──

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside text-[#86909C] text-[16px]">
      {items.map((li, idx) => (
        <li
          key={idx}
          className={`[&::marker]:content-['•'] [&::marker]:text-[#FF8733] [&::marker]:text-[1.2em] ${
            idx < items.length - 1 ? "mb-[10px]" : ""
          }`}
        >
          {li}
        </li>
      ))}
    </ul>
  );
}

// ── FATF Chevron icon ──

function ChevronDown({ className }: { className?: string }) {
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

// ── Main component ──

export function RegtechContent() {
  const [activeFatfIndex, setActiveFatfIndex] = React.useState<number | null>(null);

  const toggleFatfAccordion = (index: number) => {
    setActiveFatfIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-[#FAF8F7] overflow-hidden">
      {/* Hero Banner Section */}
      <section className="relative w-full min-h-[480px] sm:min-h-[540px] md:h-[560px] lg:h-[610px] overflow-hidden">
        <div className="absolute inset-0">
          <picture>
            <source media="(min-width:1536px)" srcSet="/images/solution-bg2_1536x.jpg" />
            <source media="(min-width:1280px)" srcSet="/images/solution-bg2_1280x.jpg" />
            <source media="(min-width:768px)" srcSet="/images/solution-bg2_768x.jpg" />
            <img
              src="/images/solution-bg2_640x.jpg"
              alt="Remi Network"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>
        <div className="relative z-10 h-full flex pt-[140px] sm:pt-[160px] md:pt-[180px] lg:pt-[219px] pb-[48px]">
          <div className="max-w-[1536px] mx-auto px-[24px] sm:px-[48px] lg:px-[120px] w-full">
            <h1 className="inter-light text-white text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] uppercase mb-[16px] sm:mb-[20px] md:mb-[24px]">
              REGTECH
            </h1>
            <div className="max-w-[830px] space-y-[12px] sm:space-y-[14px] md:space-y-[16px]">
              <p className="text-white/80 text-[15px] sm:text-[16px] lg:text-[20px] inter-light leading-relaxed">
                Remi – Innovating FinTech, Powering RegTech. Regulatory tech
                for stablecoin payments. We provide banks and regulators with
                blockchain and AI tools to streamline KYC/AML and ensure
                compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Stage Compliance Framework */}
      <section data-scroll="compliance" className="bg-white px-[24px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="inter-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
              Three-Stage Compliance Framework
            </h2>
            <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
              Every transaction is monitored before, during, and after settlement.
            </p>
          </div>
          <div className="space-y-[24px] lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-[36px] mt-[48px] mx-auto">
            {complianceStages.map((stage) => (
              <div
                key={stage.label}
                className="h-auto min-h-[210px] bg-[#F7F5F3] rounded-[4px] p-[24px] 2xl:py-[32px] hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300"
              >
                <div className="flex flex-col items-start mb-6 gap-[12px]">
                  <span className="text-[16px] text-[#FF781A]">{stage.label}</span>
                  <h2 className="text-[18px] inter-light text-[#29221D]">{stage.title}</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="inter-light text-[16px] text-[#86909C]">{stage.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <blockquote className="my-[30px] border-l-4 border-[#FFC78B] pl-4 py-3 inter-light italic text-[#86909C] bg-[#F3ECE8]">
            &quot;REMI turns the regulator into a real-time participant. Not a post-event auditor.&quot;
          </blockquote>
        </div>
      </section>

      {/* Comprehensive KYC Infrastructure */}
      <div data-scroll="kyc" className="bg-[#FAF8F7] px-[24px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="inter-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
              Comprehensive KYC Infrastructure
            </h2>
            <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
              Built on a federated certification authority model, enabling cross-jurisdictional
              <br className="hidden md:flex" /> identity verification without redundant checks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[35px]">
            {kycFeatures.map((feature) => (
              <div key={feature.title} className="h-auto p-[24px] 2xl:py-[32px]">
                <div className="flex justify-between items-center border-b border-b-[#EBE8E5]">
                  <h2 className="flex gap-[10px] items-center text-[18px] inter-medium text-[#29221D] pb-[12px] lg:mb-0">
                    <span className="ml-[-20px] h-[8px] w-[8px] bg-[#FF6900]" /> {feature.title}
                  </h2>
                </div>
                <div className="pt-[12px]">
                  <p className="inter-light text-[16px] text-[#86909C]">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* End-to-End AML Risk Control */}
      <div data-scroll="aml" className="bg-white px-[24px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="inter-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
              End-to-End AML Risk Control
            </h2>
            <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
              Pre-event, during-event, and post-event risk control strategies and recovery of risk assets.
            </p>
          </div>
          <div className="space-y-[24px] lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-[36px] mt-[48px] mx-auto">
            {riskControlFeatures.map((item) => (
              <div
                key={item.title}
                className="h-auto min-h-[240px] bg-[#F7F5F3] rounded-[4px] p-[24px] 2xl:py-[32px] hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-[18px] inter-light text-[#29221D] mb-4 lg:mb-0"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  />
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="inter-light text-[16px] text-[#86909C]">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Regulatory Intervention */}
      <div data-scroll="regulatory-intervention" className="bg-[#FAF8F7] px-[24px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="inter-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
              Real-Time Regulatory Intervention
            </h2>
            <p className="inter-light text-[18px] text-[#86909C] leading-relaxed text-left md:text-center">
              Designed from the ground up to give regulators full visibility and control over the network.
            </p>
          </div>
          <div className="space-y-[24px] lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-[36px] mt-[48px] mx-auto">
            {regulatoryInterventionCards.map((card) => (
              <div
                key={card.title}
                className="bg-[#FFF0E5] p-[30px] rounded-[4px] space-y-8 hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300"
              >
                <h3 className="text-[18px] md:text-[24px] inter-medium text-[#29221D]">
                  {card.title}
                </h3>
                <div className="flex flex-col gap-[20px]">
                  {card.items.map((item) => (
                    <div key={item.title} className="space-y-[10px]">
                      <h4 className="text-[18px] text-[#29221D] inter-light">{item.title}</h4>
                      <p className="text-[16px] text-[#86909C] inter-light">{item.description}</p>
                      {item.listItems && <BulletList items={item.listItems} />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <blockquote className="my-[30px] border-l-4 border-[#FFC78B] pl-4 py-3 inter-light italic text-[#86909C] bg-[#F3ECE8]">
            &quot;No central bank will endorse a settlement model they cannot see in real time.&quot;
          </blockquote>
        </div>
      </div>

      {/* Regulatory Dashboard System */}
      <div data-scroll="dashboard" className="bg-[#FAF8F7] px-[24px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="inter-medium text-[32px] text-[#29221D] mb-[12px] text-left md:text-center">
              Regulatory Dashboard System
            </h2>
            <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
              A unified real-time monitoring platform built exclusively for central banks and financial regulators.
            </p>
          </div>
          <div className="space-y-[24px] lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-[32px] mt-[48px] mx-auto">
            {dashboardSystemCards.map((card) => (
              <div
                key={card.title}
                className="bg-[#F7F5F3] p-[30px] rounded-[4px] space-y-8 hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300"
              >
                <h3 className="text-[18px] inter-medium text-[#29221D]">{card.title}</h3>
                <div className="flex flex-col gap-[20px]">
                  <p className="text-[16px] text-[#86909C] inter-light">{card.description}</p>
                  <BulletList items={card.listItems} />
                </div>
              </div>
            ))}
          </div>
          <blockquote className="my-[30px] border-l-4 border-[#FFC78B] pl-4 py-3 inter-light italic text-[#86909C] bg-[#F3ECE8]">
            &quot;The only stablecoin infrastructure that gives regulators the same real-time visibility as traditional payment systems.&quot;
          </blockquote>
        </div>
      </div>

      {/* FATF 40 Recommendations Mapping */}
      <section data-scroll="fatf" className="bg-[#FAF8F7] px-[24px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="inter-medium text-[32px] text-[#29221D] mb-[12px] text-left md:text-center">
              FATF 40 Recommendations Mapping
            </h2>
            <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
              Every Remi capability maps directly to specific FATF Recommendations,{" "}
              <br className="hidden md:flex" />
              ensuring comprehensive compliance coverage across all 40 standards.
            </p>
          </div>
          <div className="space-y-0">
            {fatfItems.map((card, index) => (
              <div key={index} className="border-b border-[#EBE8E5] last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-[20px] md:py-[24px] text-left cursor-pointer focus:outline-none group"
                  onClick={() => toggleFatfAccordion(index)}
                >
                  <h3 className="flex items-center gap-[10px] text-[16px] md:text-[18px] inter-medium text-[#29221D]">
                    <span className="h-[8px] w-[8px] rounded-full bg-[#FF6900] flex-shrink-0" />
                    {card.title}
                  </h3>
                  <ChevronDown className={activeFatfIndex === index ? "rotate-180" : ""} />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    activeFatfIndex === index
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-[24px] pl-[18px]">
                      {card.remiCapability && (
                        <div className="hidden md:flex p-[12px] mb-[12px] bg-[#f9e7d4] text-[#FF6900] text-[16px] inter-light">
                          {card.remiCapability}
                        </div>
                      )}
                      {/* Desktop: table layout */}
                      <table className="hidden md:table w-full border-collapse">
                        <thead>
                          <tr className="border-b border-[#EBE8E5]">
                            <th className="text-left text-[18px] inter-light text-[#29221D] pb-[10px] pr-[16px] w-[60%]">
                              Recommendation
                            </th>
                            <th className="text-left text-[16px] inter-light text-[#86909C] pb-[10px]" />
                          </tr>
                        </thead>
                        <tbody>
                          {card.items.map((item, i) => (
                            <tr key={i} className="border-b border-[#F0EBE7] last:border-b-0">
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
                        {card.remiCapability && (
                          <div className="p-[12px] bg-[#f9e7d4] rounded-[4px]">
                            <p className="text-[16px] inter-light text-[#FF6900] leading-relaxed">
                              {card.remiCapability}
                            </p>
                          </div>
                        )}
                        {card.items.map((item, i) => (
                          <div key={i} className="border border-[#F0EBE7] rounded-[4px] overflow-hidden">
                            <div className="bg-[#FAF5F0] px-[12px] py-[8px]">
                              <p className="text-[16px] inter-light text-[#29221D] mb-[8px]">
                                Recommendation
                              </p>
                              <p className="text-[16px] inter-light text-[#29221D]">
                                {item.recommendation}
                              </p>
                            </div>
                            {item.capability && (
                              <div className="px-[14px] py-[10px]">
                                <p className="text-[16px] inter-light text-[#86909C] leading-relaxed">
                                  {item.capability}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Market Monitoring */}
      <div data-scroll="financial-market" className="bg-[#FAF8F7] px-[24px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="inter-medium text-[32px] text-[#29221D] mb-[12px] text-left md:text-center">
              Financial Market Monitoring
            </h2>
            <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
              Comprehensive real-time monitoring of liquidity, interest rates,{" "}
              <br className="hidden md:flex" />
              and foreign exchange fluctuations across the stablecoin ecosystem.
            </p>
          </div>
          <div className="space-y-[24px] lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-[36px] mt-[48px] mx-auto">
            {financialMarketCards.map((card) => (
              <div
                key={card.title}
                className="bg-[#F7F5F3] p-[30px] rounded-[4px] space-y-8 hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300"
              >
                <h3 className="text-[18px] font-bold inter-medium text-[#29221D]">
                  {card.title}
                </h3>
                <div className="flex flex-col gap-[20px]">
                  <p className="text-[16px] text-[#86909C] inter-light">{card.description}</p>
                  <BulletList items={card.listItems} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seamless Integration with Existing Systems */}
      <div data-scroll="integration" className="bg-[#FAF8F7] px-[24px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="inter-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
              Seamless Integration with <br className="hidden md:flex" />
              Existing Systems
            </h2>
            <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
              Without altering the existing regulatory system and its processes,
              <br className="hidden md:flex" />
              Remi can be systematically integrated with the bank&apos;s existing systems.
            </p>
          </div>
          <div className="space-y-[24px] lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-[36px] mt-[48px] mx-auto">
            {integrationCards.map((card) => (
              <div
                key={card.title}
                className="h-auto min-h-[240px] bg-[#F7F5F3] rounded-[4px] p-[24px] 2xl:py-[32px] hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300"
              >
                <div className="lg:h-[40px] flex justify-between items-center mb-6">
                  <h2 className="text-[18px] inter-light text-[#29221D] mb-4 lg:mb-0">
                    {card.title}
                  </h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="inter-light text-[16px] text-[#86909C]">{card.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <blockquote className="my-[30px] border-l-4 border-[#FFC78B] pl-4 py-3 inter-light italic text-[#86909C] bg-[#F3ECE8]">
            &quot;No central bank will endorse a settlement model they cannot see in real time.&quot;
          </blockquote>
        </div>
      </div>

      {/* Global Regulatory Alignment */}
      <div data-scroll="global-alignment" className="bg-[#FAF8F7] px-[24px] lg:px-0">
        <div className="lg:max-w-[1024px] mx-auto py-[48px] lg:py-[64px] xl:py-[72px] 2xl:py-[88px]">
          <div className="mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="inter-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
              Global Regulatory Alignment
            </h2>
            <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
              Fully compliant with all major international financial regulations and standards.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[35px]">
            {regulatoryAlignmentCards.map((item) => (
              <div key={item.title} className="h-auto p-[24px] 2xl:py-[32px]">
                <div className="flex justify-between items-center border-b border-b-[#EBE8E5]">
                  <h2 className="flex gap-[10px] items-center text-[18px] inter-medium text-[#29221D] pb-[12px] lg:mb-0">
                    <span className="ml-[-20px] h-[8px] w-[8px] bg-[#FF6900]" /> {item.title}
                  </h2>
                </div>
                <div className="pt-[12px]">
                  <p className="inter-light text-[16px] text-[#86909C]">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
          <blockquote className="my-[30px] border-l-4 border-[#FFC78B] pl-4 py-3 inter-light italic text-[#86909C] bg-[#F3ECE8]">
            &quot;The only stablecoin infrastructure that gives regulators the same real-time visibility as traditional payment systems.&quot;
          </blockquote>
        </div>
      </div>

      {/* CTA */}
      <Cta>
        <h2 className="inter-light text-[24px] md:text-[28px] lg:text-[32px] text-white leading-[1.3] mb-[36px] max-w-[860px] mx-auto">
          Ready to build on the most compliant stablecoin infrastructure?
        </h2>
      </Cta>
    </div>
  );
}