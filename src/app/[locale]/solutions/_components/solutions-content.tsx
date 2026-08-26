"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ── Static data (migrated from Vue solution/index.vue) ──

const metrics = [
  { value: "24/7", title: "Settlement", subtitle: "", emphasis: true },
  { value: "Instant", title: "Rate Lock", subtitle: "", emphasis: false },
  {
    value: "Zero FX",
    title: "Fluctuation Risk Settlement",
    subtitle: "",
    emphasis: false,
  },
  {
    value: "Exotic",
    title: "Currency Direct Settlement",
    subtitle: "",
    emphasis: false,
  },
];

const components = [
  {
    icon: "/images/icon-oscbp.png",
    title: "One-Stop Cross-Border Payment",
    description:
      "Enables seamless, real-time FX and payment in a single transaction.",
    extContent:
      "FX Trading Platform enables seamless cross-border payment experiences by combining real-time FX and payment capabilities, allowing for a single integrated transaction that streamlines the process.",
  },
  {
    icon: "/images/icon-dfbmc.png",
    title: "Direct FX between Minor Currencies",
    description:
      "Supports instant and direct conversion between minor currencies, without need to bridge with majors.",
    extContent:
      "Eliminating the need for multi-step conversions through major currencies, thereby reducing transaction costs and settlement times.",
  },
  {
    icon: "/images/icon-fee.png",
    title: "Faster Execution & Efficiency",
    description:
      "Reduces FX processing time from days to seconds, boosts capital efficiency, enables 7×24 instant settlement.",
    extContent:
      "By leveraging stablecoins and blockchain technology, FX Trading Platform reduces foreign exchange processing times from days to seconds, enabling 24/7 instant settlements.",
  },
  {
    icon: "/images/icon-fee2.png",
    title: "Faster Execution & Efficiency",
    description:
      "Locks spot rate at execution, eliminates exposure from lengthy processes, reduces volatility-hedging costs.",
    extContent:
      "As corridor volume scales, every transaction contributes to a proprietary dataset on minor currency flows that no incumbent can replicate. The infrastructure generates the intelligence.",
  },
];

const capitalMarkets = [
  { label: "Interbank Overnight Lending" },
  { label: "RWA Tokenization" },
  { label: "Money Market Fund (MMF)" },
  { label: "Long-term Bond & Short-term Debt" },
];

const funcCompare = [
  { label: "7x24 Instant Settlement" },
  { label: "Direct Minor Currency Pairs" },
  { label: "Atomic Rate Lock" },
  { label: "Real-time Collateralisation" },
  { label: "KYC/AML Embedded" },
  { label: "Regulated Stablecoin Rails" },
];

// ── Inline SVG icons ──

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-[11px] w-[11px] stroke-current"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 8.2 6.5 11 12.5 4.8"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="180"
      height="180"
      viewBox="0 0 180 180"
      fill="none"
    >
      <circle cx="90" cy="90" r="89.5" stroke="#FFC399" />
      <circle cx="90.0022" cy="89.9993" r="76.6429" stroke="#FFB480" />
      <path
        d="M88.3547 124.389C89.3903 124.947 90.6931 124.949 91.7334 124.4C120.084 109.325 122.219 79.6456 122.23 71.2041C122.23 70.5257 122.033 69.8619 121.661 69.2941C121.29 68.7262 120.761 68.279 120.139 68.0072L91.7727 55.2969C91.3212 55.0956 90.8327 54.9908 90.3385 54.9894C89.8442 54.9879 89.355 55.0897 88.9024 55.2882L60.6265 67.758C60.0117 68.0247 59.4866 68.4625 59.1137 69.0193C58.7408 69.576 58.5357 70.2282 58.5231 70.8982C58.3674 79.2967 59.9321 109.055 88.3547 124.389Z"
        fill="url(#paint0_shield_sol)"
      />
      <defs>
        <linearGradient
          id="paint0_shield_sol"
          x1="90.4422"
          y1="54.9898"
          x2="90.1457"
          y2="124.81"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC399" />
          <stop offset="1" stopColor="#FF781A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Sub-components ──

/** Smart image with fallback */
function SmartImg({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
      }}
    />
  );
}

/** Modal overlay for component card extContent */
function DetailModal({
  open,
  onClose,
  title,
  content,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[80vh] w-full max-w-[640px] overflow-y-auto rounded-[4px] bg-white p-10 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#86909C] hover:bg-[#f4f2f0] hover:text-[#2d2722] transition-colors"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 stroke-current"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-[24px] font-semibold text-[#2d2722] mb-5 md:text-[28px]">
          {title}
        </h2>
        <p className="text-[14px] leading-[1.6] text-[#86909C]">{content}</p>
      </div>
    </div>
  );
}

// ── Main export ──

export function SolutionsContent() {
  const cardsRef = React.useRef<HTMLDivElement | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalItem, setModalItem] = React.useState<{
    title: string;
    content: string;
  } | null>(null);

  // Scroll-triggered card reveal (IntersectionObserver)
  React.useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;
    const articles = Array.from(container.querySelectorAll("article"));
    articles.forEach((el) => el.classList.add("card-hidden"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target) {
            const idx = articles.indexOf(entry.target as HTMLElement);
            (entry.target as HTMLElement).style.transitionDelay = `${
              idx * 100
            }ms`;
            entry.target.classList.remove("card-hidden");
            entry.target.classList.add("card-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    articles.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const openModal = (item: {
    title: string;
    description: string;
    extContent: string;
  }) => {
    setModalItem({
      title: item.title,
      content: item.extContent || item.description,
    });
    setModalOpen(true);
  };

  return (
    <>
      {/* ── Metrics (desktop only) ── */}
      <section
        data-scroll="metrics"
        className="hidden overflow-hidden bg-white md:block"
      >
        <div className="mx-auto max-w-[1536px] overflow-hidden">
          <div className="flex gap-[54px] px-8 py-7 lg:min-w-0 lg:justify-between lg:px-12 lg:py-[112px] xl:gap-[72px]">
            {metrics.map((m) => (
              <div key={m.title} className="shrink-0">
                <div
                  className={cn(
                    "text-[54px] font-medium uppercase leading-none tracking-[-0.05em] lg:text-[62px] xl:text-[68px]",
                    m.emphasis ? "text-[#ff7a1a]" : "text-[#2f2823]",
                  )}
                >
                  {m.value}
                </div>
                <div className="mt-[2px] text-[18px] uppercase leading-none tracking-[-0.03em] text-[#86909C] lg:text-[19px] xl:text-[21px]">
                  {m.title}
                </div>
                {m.subtitle && (
                  <div className="mt-[4px] text-[12px] uppercase tracking-[0.04em] text-[#9d938b] lg:text-[13px]">
                    {m.subtitle}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Technical Components ── */}
      <section data-scroll="components" className="bg-white">
        <div className="mx-auto max-w-[1536px] px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="flex flex-col lg:flex-row">
            {/* Side image (desktop) */}
            <div className="hidden h-[638px] w-[625px] md:flex">
              <SmartImg
                src="/images/home-stablefx_1536x.png"
                alt="StableFX"
                className="object-contain"
              />
            </div>
            {/* Content */}
            <div className="relative">
              <div className="pb-[54px] pt-[90px] text-center lg:mx-0 lg:p-0 lg:pt-[83px] lg:text-left">
                <h2 className="text-[28px] font-medium uppercase leading-none text-[#2d2722] md:text-[36px] lg:pl-[30px] lg:text-[42px] xl:text-[46px]">
                  Key Technical Components
                </h2>
                <p className="mt-2 text-[11px] leading-[1.45] text-[#8f867f] lg:pl-[30px] md:text-[12px] lg:text-[13px]">
                  A Rapidly Expanding Network of Banks and Licensed Financial
                  Institutions Worldwide
                </p>
              </div>
              <div className="px-6 pb-1.5 md:overflow-x-auto md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden lg:absolute lg:left-[-400px] lg:pt-[37px]">
                <div
                  ref={cardsRef}
                  className="flex flex-wrap justify-between gap-2.5 md:w-max md:justify-start md:gap-3"
                >
                  {components.map((item) => (
                    <article
                      key={item.title}
                      className="flex w-[calc(50%-5px)] min-h-[260px] flex-col rounded-[4px] bg-[#f4f2f0] px-4 py-6 md:h-[360px] md:w-[280px] md:py-8"
                    >
                      <div className="flex h-[44px] w-[44px] items-center justify-center md:h-[60px] md:w-[60px]">
                        <SmartImg
                          src={item.icon}
                          alt={item.title}
                          className="h-7 w-7 object-contain md:h-auto md:w-auto"
                        />
                      </div>
                      <h3 className="mt-2.5 text-[14px] font-medium leading-[1.2] text-[#2d2722] md:mt-3 md:text-[18px]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 flex-1 text-[12px] leading-[1.45] text-[#86909C] md:mt-5 md:text-[18px]">
                        {item.description}
                      </p>
                      <span
                        className="mt-2.5 flex cursor-pointer items-center text-[13px] font-semibold text-[#ff7a1a] md:mt-3 md:text-[16px]"
                        onClick={() => openModal(item)}
                      >
                        <span>Learn more</span>
                        <span className="ml-1 text-[#FF6900]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 stroke-current"
                            fill="none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bison Bank (mobile only) ── */}
      <section data-scroll="bison-mobile" className="bg-white p-8 lg:hidden">
        <div className="rounded-[4px] bg-[#f3efec] md:hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="px-[30px] py-9">
              <h3 className="text-[24px] font-semibold uppercase leading-[1.15] text-[#493a31]">
                <strong className="text-[32px]">Bison Bank</strong> <br />
                Portugal Bank for over 30 years
              </h3>
              <p className="mt-2 text-[18px] leading-[1.45] text-[#aa9f96]">
                Hold both of commercial bank and crypto assets licenses. Virtual
                Asset Service Provider (VASP) licence. Conduct cross-border
                payment, crypto to issue regulated transaction token in EUR
                &amp; USD, respectively.
              </p>
            </div>
            <SmartImg
              src="/images/bison-water.png"
              alt="Bison Bank mark"
              className="h-[78px] w-[78px] object-contain opacity-80"
            />
          </div>
        </div>
      </section>

      {/* ── Capital Markets ── */}
      <section data-scroll="capital" className="bg-[#f2efec]">
        <div className="mx-auto max-w-[1536px] px-6 py-11 md:px-8 md:py-[58px] lg:px-10 lg:py-[72px] xl:px-12 xl:py-[84px]">
          {/* Shield + intro */}
          <div className="mx-auto max-w-[880px] text-center">
            <div className="mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-full border border-[#f4b788]/65 bg-transparent md:h-[124px] md:w-[124px]">
              <ShieldSvg />
            </div>
            <p className="mx-auto mt-[18px] max-w-[840px] text-[13px] leading-[1.55] text-[#4a3d33] md:text-[16px] lg:text-[18px]">
              Innovations in Capital Market{" "}
              <br className="md:hidden" /> Empower Institutions with
              <br />
              Diversified &amp; Efficient Transaction Token{" "}
              <br className="md:hidden" /> Liquidity Management for Yield
              Optimization
            </p>
          </div>

          {/* Benefit cards */}
          <div className="mx-auto mt-[30px] grid max-w-[980px] gap-[14px] md:mt-[42px] md:grid-cols-2 md:gap-4 lg:mt-12 lg:gap-[18px]">
            {capitalMarkets.map((b) => (
              <article
                key={b.label}
                className="flex items-center gap-[14px] rounded-[4px] border border-[#f1b486] bg-transparent px-5 py-[18px] text-[#9f948c] md:min-h-[82px] md:px-[22px] lg:min-h-[88px] lg:px-6"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff7a1a] text-white shadow-[0_6px_12px_rgba(255,122,34,0.24)]">
                  <CheckIcon />
                </span>
                <span className="text-[15px] leading-[1.25] md:text-[16px] lg:text-[18px]">
                  {b.label}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Function Comparison (Architectural View) ── */}
      <section data-scroll="func-compare" className="bg-white">
        <div className="mx-auto max-w-[1536px] px-6 py-11 md:px-8 md:py-[58px] lg:px-10 lg:py-[72px] xl:px-12 xl:py-[84px]">
          <div className="mx-auto max-w-[880px] text-center mb-12 md:mb-16">
            <h2 className="text-[28px] font-medium uppercase leading-none text-[#2d2722] md:text-[36px] lg:text-[42px]">
              Architectural View
            </h2>
            <p className="mt-2 text-[11px] leading-[1.45] text-[#8f867f] md:text-[12px] lg:text-[13px]">
              A comparison of core functional capabilities
            </p>
          </div>
          <div className="mx-auto grid max-w-[980px] gap-[14px] md:grid-cols-2 md:gap-4 lg:gap-[18px]">
            {funcCompare.map((f) => (
              <article
                key={f.label}
                className="flex items-center gap-[14px] rounded-[4px] border border-[#f1b486] bg-transparent px-5 py-[18px] text-[#9f948c] md:min-h-[82px] md:px-[22px] lg:min-h-[88px] lg:px-6"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff7a1a] text-white shadow-[0_6px_12px_rgba(255,122,34,0.24)]">
                  <CheckIcon />
                </span>
                <span className="text-[15px] leading-[1.25] md:text-[16px] lg:text-[18px]">
                  {f.label}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#141110]">
        <div className="mx-auto max-w-[1536px] px-6 py-[60px] text-center md:px-8 md:py-[80px] lg:py-[100px]">
          <h2 className="mx-auto max-w-[860px] text-[24px] font-light leading-[1.3] text-white md:text-[28px] lg:text-[32px] mb-9">
            Ready to Transform Your Cross-Border Payments?
          </h2>
          <a
            href="/contact"
            className="inline-block rounded-[4px] bg-[#FF6900] px-8 py-3 text-[14px] font-medium uppercase tracking-[0.04em] text-white transition-colors hover:bg-[#e55e00]"
          >
            Get In Touch
          </a>
        </div>
      </section>

      {/* ── Modal ── */}
      <DetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalItem?.title ?? ""}
        content={modalItem?.content ?? ""}
      />

      {/* ── Global styles for card reveal animation ── */}
      <style jsx global>{`
        .card-hidden {
          opacity: 0;
          transform: translateY(24px);
        }
        .card-visible {
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </>
  );
}
