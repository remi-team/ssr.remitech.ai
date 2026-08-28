/**
 * Resources page FAQ data — shared between the client accordion
 * (resources-content.tsx) and the server-rendered FAQPage structured data
 * (page.tsx). Keeping a single source of truth guarantees the JSON-LD
 * always matches the visible Q&A content.
 */

export interface QAItem {
  title: string;
  content: string[];
}

export const qaItems: QAItem[] = [
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
