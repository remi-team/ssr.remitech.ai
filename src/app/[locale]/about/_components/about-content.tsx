"use client";

import { Cta } from "@/components/cta";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const partnerCards = [
  {
    icon: "/images/about-icon_01.png",
    title: "Bison Bank — our strategic partner",
    subtitle: "Lisbon · ECB · MiCA",
    description:
      "A licensed Portuguese institution with 30+ years of history. Europe's first bank-licensed digital asset service provider.",
    colSpan: false,
  },
  {
    icon: "/images/about-icon_02.png",
    title: "Remi Technology",
    subtitle: "Singapore · New York",
    description:
      "The Network. Blockchain-native clearing and settlement. Real-time. Compliant. Born from the inside of a bank.",
    colSpan: false,
  },
  {
    icon: "/images/about-icon_03.png",
    title: "Bison FX & Treasury",
    subtitle: "Hong Kong",
    description:
      "The Revenue Center. FX spread + treasury margin on every cross-border transaction. The structural margin lives here.",
    colSpan: true,
  },
];

const visionCards = [
  {
    title: "For Banks",
    content:
      "REMI gives every bank — regardless of size — world-class settlement infrastructure, breaking Tier 1 dominance.",
  },
  {
    title: "For Fintechs & Payments",
    content:
      "Verified settlement infrastructure — enabling global corridors and underbanked markets from day one.",
  },
  {
    title: "For Sovereign Monetary Systems",
    content:
      "At scale, REMI becomes infrastructure that sovereign monetary policy runs through.",
  },
  {
    title: "Safety as the Foundation",
    content:
      "Every participant is credentialed, regulated, continuously monitored. Safety is not a feature. It is the architecture.",
  },
];

/* ------------------------------------------------------------------ */
/*  Section: Hero                                                      */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section
      data-scroll="hero"
      className="relative w-full min-h-[480px] sm:min-h-[540px] md:h-[560px] lg:h-[610px] overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <picture>
          <source
            media="(min-width:1536px)"
            srcSet="/images/about_banner_1536.webp 1x, /images/about_banner_1536_2x.webp 2x"
            type="image/webp"
          />
          <source
            media="(min-width:1536px)"
            srcSet="/images/about_banner.jpg 1x, /images/about_banner_1536_2x.jpg 2x"
            type="image/jpeg"
          />
          <source
            media="(min-width:1024px)"
            srcSet="/images/about_banner_1280.webp 1x, /images/about_banner_1280_2x.webp 2x"
            type="image/webp"
          />
          <source
            media="(min-width:1024px)"
            srcSet="/images/about_banner_1280.jpg 1x, /images/about_banner_1280_2x.jpg 2x"
            type="image/jpeg"
          />
          <source
            media="(min-width:768px)"
            srcSet="/images/about_banner_768.webp 1x, /images/about_banner_768_2x.webp 2x"
            type="image/webp"
          />
          <source
            media="(min-width:768px)"
            srcSet="/images/about_banner_768.jpg 1x, /images/about_banner_768_2x.jpg 2x"
            type="image/jpeg"
          />
          <source
            srcSet="/images/about_banner_640.webp 1x, /images/about_banner_640_2x.webp 2x"
            type="image/webp"
          />
          <img
            src="/images/about_banner_640.jpg"
            srcSet="/images/about_banner_640.jpg 1x, /images/about_banner_640_2x.jpg 2x"
            alt="Remi Network"
            className="w-full h-full object-cover"
          />
        </picture>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex pt-[140px] sm:pt-[160px] md:pt-[180px] lg:pt-[219px] pb-[48px]">
        <div className="max-w-[1536px] mx-auto px-[24px] sm:px-[32px] md:px-[48px] lg:px-[64px] w-full">
          <h1 className="inter-light text-white text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] uppercase mb-[16px] sm:mb-[20px] md:mb-[24px]">
            Orchestrating the Future of Digital Finance
          </h1>
          <div className="max-w-[838px] space-y-[12px] sm:space-y-[14px] md:space-y-[16px]">
            <p className="text-white/80 text-[15px] sm:text-[16px] lg:text-[20px] inter-light leading-relaxed">
              Singapore fintech company with cutting-edge solutions based on
              blockchain technologies for compliance payment network. One group.
              Three engines. Full value chain.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Engines (3 Partner Cards)                                 */
/* ------------------------------------------------------------------ */

function EnginesSection() {
  return (
    <section
      data-scroll="engines"
      className="bg-white py-[48px] sm:py-[56px] md:py-[64px] lg:py-[80px] xl:py-[96px]"
    >
      <div className="max-w-[1024px] mx-auto px-[24px] sm:px-[32px] md:px-[48px] lg:px-[64px]">
        {/* Title */}
        <div className="text-center mb-[32px] sm:mb-[40px] md:mb-[48px] lg:mb-[56px]">
          <h2 className="inter-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
            One Group. Three Engines.
          </h2>
          <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
            License + Network + Margin = Full value chain capture.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] sm:gap-[24px] lg:gap-[28px] xl:gap-[32px]">
          {partnerCards.map((item) => (
            <div
              key={item.title}
              className={`h-auto min-h-[240px] bg-[#F7F5F3] rounded-[4px] p-[24px] 2xl:py-[32px] hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300 ${
                item.colSpan ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] lg:w-[64px] lg:h-[64px] rounded-[12px] flex items-center justify-center mb-[16px] sm:mb-[20px]">
                <img src={item.icon} alt={item.title} />
              </div>
              <div className="mb-[30px]">
                <h3 className="py-[10px] text-[18px] font-[500] text-[#29221D]">
                  {item.title}
                </h3>
                <p className="text-left text-[16px] text-[#FF6900]">
                  {item.subtitle}
                </p>
              </div>
              <p className="mt-[6px] md:mt-[20px] flex-1 inter-light text-[16px] text-[#86909C]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Vision (4 Vision Cards)                                   */
/* ------------------------------------------------------------------ */

function VisionSection() {
  return (
    <section
      data-scroll="vision"
      className="bg-[#f2efec] px-[24px] lg:px-0 py-[48px] sm:py-[56px] md:py-[64px] lg:py-[80px] xl:py-[96px]"
    >
      <div className="relative z-[2] max-w-[1024px] mx-auto pb-[48px] lg:pb-[64px] xl:pb-[72px] 2xl:pb-[88px]">
        <div className="pt-[30px]">
          <div className="text-center mb-[48px] md:mb-[64px] lg:mb-[72px] xl:mb-[96px]">
            <h2 className="inter-medium text-[32px] text-[#29221D] mx-auto mt-[12px] lg:mt-[16px] 2xl:mt-[24px] text-left md:text-center mb-[12px]">
              Our Vision
            </h2>
            <p className="inter-light text-[16px] md:text-[18px] text-[#86909C] text-left md:text-center mb-[24px] lg:mb-[36px]">
              &quot;The network where every participant becomes more powerful
              from each other
              <br className="hidden lg:flex" /> — compounding in strength as we
              grow.&quot;
            </p>
          </div>
        </div>

        <div className="min-h-[320px] space-y-[24px] lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-[36px] mt-[48px] mx-auto">
          {visionCards.map((card) => (
            <div
              key={card.title}
              data-vision-card
              className="h-auto min-h-[140px] border border-[#FF6900] bg-[#F7F5F3] rounded-[4px] p-[24px] 2xl:py-[32px] hover:shadow-lg shadow-[#F1E3DA] transition-shadow duration-300"
            >
              <h3 className="text-[18px] inter-light text-[#29221D] mb-[12px]">
                {card.title}
              </h3>
              <div className="flex flex-col gap-[20px]">
                <p className="inter-light text-[16px] text-[#86909C]">
                  {card.content}
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
/*  Export                                                              */
/* ------------------------------------------------------------------ */

export default function AboutContent() {
  return (
    <>
      <HeroSection />
      <EnginesSection />
      <VisionSection />
      <Cta>
        <h2 className="inter-light text-[24px] md:text-[28px] lg:text-[32px] text-white leading-[1.3] mb-[36px] max-w-[860px] mx-auto">
          &ldquo;Those who adapt will define the next era of global finance.&rdquo;
        </h2>
      </Cta>
    </>
  );
}
