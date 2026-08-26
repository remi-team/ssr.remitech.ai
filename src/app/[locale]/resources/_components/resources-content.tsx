"use client";

import * as React from "react";
import { Cta } from "@/components/cta";
import { useState, useMemo, useCallback } from "react";

/* ── Data (migrated from Vue ref/reactive → const) ── */

/** 5 static category definitions */
const CATEGORIES = [
  { id: "all", name: "All Resources", icon: "all" },
  {
    id: "Whitepapers & Tech Docs",
    name: "Whitepapers & Tech Docs",
    icon: "docs",
  },
  {
    id: "Compliance & Policies",
    name: "Compliance & Policies",
    icon: "policy",
  },
  { id: "Membership", name: "Membership", icon: "membership" },
  { id: "Media", name: "Media", icon: "media" },
] as const;

const categoryIconMap: Record<string, string> = {
  all: "all",
  "whitepapers & tech docs": "docs",
  "compliance & policies": "policy",
  membership: "membership",
  media: "media",
};

/* Placeholder document list per category */
const PLACEHOLDER_DOCS: Record<string, { title: string; description: string; type: string; version: string; format: string }[]> = {
  "Whitepapers & Tech Docs": [
    {
      title: "Remi Network Architecture Overview",
      description: "Comprehensive overview of the Remi cross-border settlement network including protocol design, node architecture, and security model.",
      type: "PDF",
      version: "v2.1",
      format: "pdf",
    },
    {
      title: "Remi API Reference Guide",
      description: "Complete REST and WebSocket API documentation for integrating with the Remi Network.",
      type: "PDF",
      version: "v1.8",
      format: "pdf",
    },
    {
      title: "Stablecoin Monetary Policy Framework",
      description: "Technical whitepaper on Remi's AI-driven stablecoin monetary policy management system.",
      type: "PDF",
      version: "v1.0",
      format: "pdf",
    },
    {
      title: "Cross-Border Settlement Protocol",
      description: "Detailed specification of the peer-to-peer settlement protocol powering Remi.",
      type: "PDF",
      version: "v3.2",
      format: "pdf",
    },
    {
      title: "Integration Guide",
      description: "Step-by-step guide for integrating Remi with existing core banking and payment systems.",
      type: "PDF",
      version: "v2.4",
      format: "pdf",
    },
    {
      title: "Security Architecture Whitepaper",
      description: "In-depth analysis of Remi's multi-layer security architecture and cryptographic protocols.",
      type: "PDF",
      version: "v1.5",
      format: "pdf",
    },
  ],
  "Compliance & Policies": [
    {
      title: "FATF Travel Rule Compliance",
      description: "How Remi implements the FATF Travel Rule for cross-border digital asset transfers.",
      type: "PDF",
      version: "v2.0",
      format: "pdf",
    },
    {
      title: "AML & Sanctions Screening Framework",
      description: "Overview of Remi's real-time AML and sanctions screening capabilities for member institutions.",
      type: "PDF",
      version: "v1.3",
      format: "pdf",
    },
    {
      title: "Regulatory Dashboard Whitepaper",
      description: "Mapping Remi's capabilities to all 40 FATF anti-money laundering recommendations.",
      type: "PDF",
      version: "v1.0",
      format: "pdf",
    },
    {
      title: "MiCA Compliance Overview",
      description: "How Remi aligns with the EU Markets in Crypto-Assets (MiCA) regulation.",
      type: "PDF",
      version: "v1.1",
      format: "pdf",
    },
    {
      title: "Data Privacy & GDPR Policy",
      description: "Remi's approach to data privacy, encryption, and GDPR compliance across regions.",
      type: "PDF",
      version: "v2.1",
      format: "pdf",
    },
    {
      title: "Third-Party Audit Reports",
      description: "Independent security and compliance audit summaries for the Remi Network.",
      type: "PDF",
      version: "v1.0",
      format: "pdf",
    },
    {
      title: "Sanctions Policy",
      description: "Global sanctions compliance policy for all Remi member institutions.",
      type: "PDF",
      version: "v2.0",
      format: "pdf",
    },
    {
      title: "KYC/AML Onboarding Guide",
      description: "Member onboarding procedures aligned with global KYC/AML requirements.",
      type: "PDF",
      version: "v1.7",
      format: "pdf",
    },
  ],
  Membership: [
    {
      title: "Remi Network Membership Agreement",
      description: "Complete terms and conditions for joining the Remi Network as a member institution.",
      type: "PDF",
      version: "v3.0",
      format: "pdf",
    },
    {
      title: "Membership Categories Guide",
      description: "Detailed overview of Issuing, Custodian, Transaction, and Messaging membership tiers.",
      type: "PDF",
      version: "v2.2",
      format: "pdf",
    },
    {
      title: "Onboarding Checklist",
      description: "Step-by-step checklist for regulated financial institutions joining Remi.",
      type: "PDF",
      version: "v1.5",
      format: "pdf",
    },
    {
      title: "Fee Schedule",
      description: "Transparent fee structure for all Remi Network services and functions.",
      type: "PDF",
      version: "v2.0",
      format: "pdf",
    },
    {
      title: "Technical Requirements",
      description: "Minimum technical requirements and infrastructure specifications for member nodes.",
      type: "PDF",
      version: "v1.9",
      format: "pdf",
    },
    {
      title: "Service Level Agreement",
      description: "SLA terms including uptime guarantees, support channels, and escalation procedures.",
      type: "PDF",
      version: "v2.3",
      format: "pdf",
    },
  ],
  Media: [
    {
      title: "Remi Network Overview Video",
      description: "Executive overview of the Remi cross-border settlement network and its capabilities.",
      type: "MP4",
      version: "2024",
      format: "mp4",
    },
    {
      title: "Product Demo: Regulatory Dashboard",
      description: "Live demonstration of Remi's regulatory dashboard for anti-money laundering monitoring.",
      type: "MP4",
      version: "2024",
      format: "mp4",
    },
    {
      title: "Press Kit",
      description: "Official Remi brand assets, logos, and media resources for partners.",
      type: "ZIP",
      version: "2024",
      format: "zip",
    },
    {
      title: "Case Study: APAC Corridor Launch",
      description: "How Remi launched its first Asia-Pacific cross-border settlement corridor.",
      type: "PDF",
      version: "v1.0",
      format: "pdf",
    },
    {
      title: "Event: BAFT Global Summit 2024",
      description: "Remi's presentation on stablecoin regulatory frameworks at BAFT Global Summit.",
      type: "PDF",
      version: "v1.0",
      format: "pdf",
    },
    {
      title: "Interview: CEO on Cross-Border Payments",
      description: "Exclusive interview discussing the future of cross-border settlement infrastructure.",
      type: "MP4",
      version: "2024",
      format: "mp4",
    },
  ],
};

/** Flatten all docs for search/filter */
const ALL_DOCS = Object.entries(PLACEHOLDER_DOCS).flatMap(([category, docs]) =>
  docs.map((doc) => ({ ...doc, category }))
);

/* ── FAQ data ── */

interface QAItem {
  title: string;
  content: string[];
}

const qaItems: QAItem[] = [
  {
    title: "Q1: What is Remi Technology?",
    content: [
      "Remi Technology is a Singapore-headquartered financial technology infrastructure provider, specializing in building the next-generation peer-to-peer cross-border clearing and settlement network for regulated financial institutions worldwide.",
    ],
  },
  {
    title: "Q2: Is Remi a bank, payment company, or technology infrastructure provider?",
    content: [
      "Remi is exclusively a global financial technology infrastructure provider.",
      " We do not operate as a bank, remittance company, or payment institution.",
      " Our core focus is building and operating a compliant, bank-grade cross-border clearing and settlement network, empowering our partner institutions with faster, lower-cost, and more transparent cross-border payment capabilities.",
    ],
  },
  {
    title: "Q3: What core problems does Remi solve for regulated financial institutions?",
    content: [
      "Remi solves the long-standing pain points of traditional cross-border payments: slow settlement that takes days, opaque and stacked fees from intermediary banks, high pre-funding requirements across multiple jurisdictions, and limited traceability of transactions. ",
      "We replace the multi-intermediary model with a point-to-point clearing network, cutting through the inefficiencies of legacy cross-border payment systems.",
    ],
  },
  {
    title: "Q4: How does Remi complement our existing remittance and transfer business?",
    content: [
      "Remi is designed to integrate seamlessly with your existing business infrastructure, rather than replace it. ",
      "We enhance your current cross-border payment capabilities with faster settlement, lower all-in transaction costs, reduced pre-funding requirements, and end-to-end transaction traceability — helping you improve customer retention, expand into new markets, and drive sustainable revenue growth.",
    ],
  },
  {
    title: "Q5: What makes Remi's infrastructure compliant for regulated financial institutions?",
    content: [
      "Remi's network is built with compliance at its core, fully aligned with FATF standards, EU MiCA regulatory requirements, and global anti-money laundering (AML) and sanctions regimes. ",
      "Our infrastructure natively integrates the FATF Travel Rule, real-time sanctions screening, end-to-end encrypted information exchange, and immutable on-chain audit trails for all transactions, meeting the strictest bank-grade compliance requirements.",
    ],
  },
  {
    title: "Q6: How does Remi reduce pre-funding requirements for partner institutions?",
    content: [
      "Traditional cross-border payments require institutions to maintain pre-funded liquidity accounts in multiple jurisdictions and with multiple correspondent banks, locking up large amounts of working capital. ",
      "Remi's peer-to-peer network eliminates the need for multi-correspondent pre-funding, allowing partners to centralize liquidity and significantly reduce idle capital requirements across global markets.",
    ],
  },
  {
    title: "Q7: How fast can cross-border settlement be completed through Remi?",
    content: [
      "Remi enables near-instant cross-border settlement, with transactions typically completed within 3 minutes for supported corridors, 24/7/365, with no downtime on weekends, holidays, or non-banking hours.",
    ],
  },
  {
    title: "Q8: Which countries and regions does Remi support?",
    content: [
      "Remi's network currently covers core markets across Europe, Asia Pacific, Latin America, and North America, with active live clearing corridors in all key regions.",
      "Our global network is continuously expanding, and we can support customized corridor access for partner institutions based on their business needs.",
    ],
  },
  {
    title: "Q9: How does Remi integrate with existing banking or payment systems?",
    content: [
      "Remi offers lightweight, flexible integration with your existing core banking and payment systems.",
      "We provide standard API interfaces, support SWIFT-compatible messaging formats, and are fully aligned with existing bank workflows, minimizing system transformation costs and operational disruption for our partners.",
    ],
  },
  {
    title: "Q10: What is the onboarding process for new partners?",
    content: [
      "Our partner onboarding process is structured and streamlined, typically following 6 key stages: introductory consultation & business assessment, compliance and legal due diligence, technical solution review, integration & testing, pilot program launch, and full-scale commercial go-live.",
      "We assign a dedicated implementation and account management team to support partners through every step of the process.",
    ],
  },
  {
    title: "Q11: How can we discuss a partnership with Remi?",
    content: [
      "We welcome all regulated financial institutions to reach out to us.",
      "You can book a dedicated consultation meeting with our team via the contact form on our website, or send an inquiry to our business development team directly.",
      " We will get back to you within 1 business day.",
    ],
  },
];

/* ── Search icon (inline SVG) ── */

function SearchIcon() {
  return (
    <svg
      className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#86909C]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

/* ── Chevron icon ── */

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

/* ── Empty document icon ── */

function EmptyDocIcon() {
  return (
    <svg
      className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] text-[#86909C] mx-auto mb-[16px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
      <path d="M14 2V8H20" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ResourcesContent
   ═══════════════════════════════════════════════════════════════════════════ */

export function ResourcesContent() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQA, setExpandedQA] = useState<number>(-1);

  const toggleQA = useCallback((index: number) => {
    setExpandedQA((prev) => (prev === index ? -1 : index));
  }, []);

  /* Filter docs by category + search */
  const filteredDocuments = useMemo(() => {
    let docs = ALL_DOCS;
    if (activeCategory !== "all") {
      docs = docs.filter((doc) => doc.category === activeCategory);
    }
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      docs = docs.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query) ||
          doc.type.toLowerCase().includes(query) ||
          doc.version.toLowerCase().includes(query) ||
          doc.format.toLowerCase().includes(query) ||
          doc.category.toLowerCase().includes(query)
      );
    }
    return docs;
  }, [activeCategory, searchQuery]);

  /* Group filtered docs by category */
  const groupedDocuments = useMemo(() => {
    const groups: Record<string, { categoryName: string; items: typeof ALL_DOCS }> = {};
    filteredDocuments.forEach((doc) => {
      if (!groups[doc.category]) {
        groups[doc.category] = { categoryName: doc.category, items: [] };
      }
      groups[doc.category].items.push(doc);
    });
    return Object.values(groups);
  }, [filteredDocuments]);

  return (
    <div className="min-h-screen bg-[#f2efec] text-[#2c2520]">
      {/* ═══ Hero Banner ═══ */}
      <section
        data-scroll="hero"
        className="relative w-full min-h-[480px] sm:min-h-[540px] md:h-[560px] lg:h-[610px] overflow-hidden"
      >
        <div className="absolute inset-0">
          <picture>
            <source
              media="(min-width:1536px)"
              srcSet="/images/res_banner.jpg"
            />
            <source
              media="(min-width:1280px)"
              srcSet="/images/res_banner_1280.jpg"
            />
            <source
              media="(min-width:768px)"
              srcSet="/images/res_banner_768.jpg"
            />
            <img
              src="/images/res_banner_640.jpg"
              alt="Remi Network"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>
        <div className="relative z-10 h-full flex pt-[140px] sm:pt-[160px] md:pt-[180px] lg:pt-[219px] pb-[48px]">
          <div className="max-w-[1536px] mx-auto px-[24px] sm:px-[32px] lg:px-[40px] xl:px-[48px] w-full">
            <h1 className="font-light text-white text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] uppercase mb-[16px] sm:mb-[20px] md:mb-[24px]">
              RESOURCE CENTER
            </h1>
            <p className="text-white/80 text-[15px] sm:text-[16px] lg:text-[20px] font-light leading-relaxed">
              All the documentation, guides and tools you need to integrate,
              deploy and scale bank-grade compliant stablecoin payments
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Resource Library ═══ */}
      <section
        data-scroll="library"
        className="bg-white pt-[60px] lg:pt-[80px] xl:pt-[100px]"
      >
        <div className="max-w-[1024px] mx-auto px-[24px] sm:px-[32px] lg:px-[40px]">
          {/* Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[24px] mb-[24px]">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-start bg-[#F7F5F3] rounded-[4px] border p-[20px] transition-colors duration-200 cursor-pointer hover:shadow-lg ${
                  activeCategory === cat.id
                    ? "border-[#ff7a1a]"
                    : "border-[#f4f2f0] hover:border-[#ff7a1a]"
                }`}
                style={{ boxShadow: "0 0 0 transparent" }}
              >
                <div className="w-[80px] h-[80px] flex items-center justify-center mb-[12px] flex-shrink-0">
                  <img
                    src={`/images/icon-resources-${cat.icon}.png`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/icon-resources-docs.png";
                    }}
                    className="w-full h-full object-contain"
                    alt={cat.name}
                  />
                </div>
                <span className="text-[12px] md:text-[14px] text-center leading-tight text-[#29221D]">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex justify-center py-[94px]">
            <div className="relative w-full max-w-[600px]">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-[46px] pr-[20px] py-[12px] bg-[#F7F5F3] border border-[#E5E6EB] rounded-[12px] text-[14px] text-[#2d2722] placeholder-[#86909C] focus:outline-none focus:border-[#ff7a1a] transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Document List ═══ */}
      <section
        data-scroll="docs"
        className="bg-white px-[24px] sm:px-[48px] lg:px-0 pt-[24px] pb-[48px] sm:pb-[56px] md:pb-[64px] lg:pb-[80px]"
      >
        <div className="max-w-[1024px] mx-auto">
          {/* Grouped Document List */}
          {groupedDocuments.length > 0 ? (
            <>
              {groupedDocuments.map((group) => (
                <div key={group.categoryName}>
                  <h3 className="text-[18px] md:text-[20px] font-[600] text-[#29221D] mb-[24px] pb-[12px] border-b border-b-[#EBE8E5]">
                    {group.categoryName}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] sm:gap-[20px] lg:gap-[24px] mb-[60px]">
                    {group.items.map((doc, i) => (
                      <div
                        key={`${doc.title}-${i}`}
                        className="bg-[#F7F5F3] rounded-[4px] p-[24px] flex flex-col cursor-pointer transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(241,227,218,0.6)] hover:-translate-y-[2px]"
                      >
                        <div className="text-[11px] font-[600] uppercase tracking-[0.05em] text-[#FF6900] mb-[12px]">
                          {doc.type}
                        </div>
                        <h4 className="text-[15px] md:text-[16px] font-[500] text-[#29221D] leading-[1.4] mb-[10px] line-clamp-2 transition-colors duration-200 group-hover:text-[#FF6900]">
                          {doc.title}
                        </h4>
                        <p className="text-[13px] sm:text-[14px] text-[#86909C] leading-[1.55] mb-[16px] flex-1 line-clamp-3">
                          {doc.description}
                        </p>
                        <div className="text-[12px] text-[#86909C] mt-auto">
                          {[doc.version, doc.format?.toUpperCase(), doc.type]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                        <div className="mt-[12px] flex items-center">
                          {doc.format === "pdf" && (
                            <img
                              src="/images/icon-pdf.svg"
                              className="w-[18px] h-[18px] object-contain"
                              alt="PDF"
                            />
                          )}
                          {doc.format === "mp4" && (
                            <img
                              src="/images/icon-video.svg"
                              className="w-[18px] h-[18px] object-contain"
                              alt="Video"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            /* Empty State */
            <div className="py-[40px] sm:py-[48px] text-center bg-[#f4f2f0] rounded-[4px] border border-[#EBE8E5]">
              <EmptyDocIcon />
              <p className="text-[#86909C] text-[14px] md:text-[15px]">
                No documents available
              </p>
              <p className="text-[#86909C]/60 text-[13px] mt-[8px]">
                Please check back later.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section
        data-scroll="faq"
        className="bg-[#f2efec] py-[60px] lg:py-[80px] xl:py-[100px]"
      >
        <div className="mx-auto max-w-[1024px] px-[24px] sm:px-[32px] lg:px-[40px]">
          <div className="mb-[36px] lg:mb-[48px]">
            <h2 className="font-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
              FAQ
            </h2>
            <p className="font-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
              Are These Your Concerns To Choose Remi?
            </p>
          </div>
          <div className="divide-y divide-[#EBE8E5]">
            {qaItems.map((qa, index) => (
              <div key={index} className="py-[20px] lg:py-[24px]">
                <button
                  onClick={() => toggleQA(index)}
                  className="group flex w-full cursor-pointer items-start justify-between gap-[16px]"
                >
                  <div className="flex-1 text-left">
                    <h3
                      className={`font-light text-[18px] leading-[1.2] transition-colors duration-200 ${
                        expandedQA === index
                          ? "text-[#ff7a1a]"
                          : "text-[#2d2722] group-hover:text-[#ff7a1a]"
                      }`}
                    >
                      {qa.title}
                    </h3>
                    {expandedQA === index && (
                      <ul className="mt-[12px] ml-[20px] space-y-[8px] list-disc">
                        {qa.content.map((item, i) => (
                          <li
                            key={i}
                            className="font-light text-[16px] leading-[1.45] text-[#86909C]"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <ChevronRight
                    className={`mt-[2px] h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                      expandedQA === index
                        ? "rotate-90 text-[#ff7a1a]"
                        : "text-[#86909C]"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <Cta>
        <h2 className="font-light text-[24px] md:text-[28px] lg:text-[32px] text-white leading-[1.3] mb-[24px] max-w-[860px] mx-auto">
          Need help finding a document?
        </h2>
        <p className="font-light text-[16px] md:text-[18px] text-white mb-[36px] max-w-[860px] mx-auto">
          Our team is happy to assist with any questions about documentation,
          compliance, or integration.
        </p>
      </Cta>
    </div>
  );
}

export default ResourcesContent;
