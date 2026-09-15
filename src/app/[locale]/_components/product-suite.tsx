"use client";

import * as React from "react";
import { Link } from "@/i18n/navigation";
import { IMAGES } from "./images";

/**
 * ProductSuite — 6 product cards (migrated from "Our Product Suite").
 * Hover swaps between the default icon and the hover variant (both canonical
 * `/images/*` paths). onError hides a missing icon gracefully.
 */
const products = [
  { ...IMAGES.productSuite.crossBorder, title: "Cross-Border Settlement", desc: "Real-time atomic settlement", href: "/solutions/cross-border-payment" },
  { ...IMAGES.productSuite.fx, title: "FX & Treasury", desc: "Capture the full FX spread", href: "/solutions/fx" },
  { ...IMAGES.productSuite.stablecoin, title: "Stablecoin Issuance", desc: "MiCA-authorized EMT issuance", href: "/solutions/stablecoin" },
  { ...IMAGES.productSuite.regtech, title: "RegTech", desc: "Real-time regulatory reporting", href: "/solutions/regtech" },
  { ...IMAGES.productSuite.lc, title: "Tokenized L/C", desc: "Smart contract letter of credit", href: "/solutions/lc" },
  { ...IMAGES.productSuite.cheque, title: "E-Cheque", desc: "Smart digital checks", href: "/solutions/cheque" },
];

function SmartImg({
  src,
  alt,
  className,
  ariaHidden,
}: {
  src: string;
  alt: string;
  className?: string;
  ariaHidden?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={ariaHidden || undefined}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
      }}
    />
  );
}

export function ProductSuite() {
  return (
    <section data-scroll="suite" className="pb-[80px] pt-5 lg:pb-[133px] lg:pt-[100px]">
      <div className="relative mx-auto max-w-[1536px] bg-white px-6 lg:px-[123px]">
        <div className="text-left md:text-center">
          <h2 className="text-[32px] inter-medium text-[#29221D]">Our Product Suite</h2>
          <p className="mx-auto py-3 text-[18px] inter-light text-[#86909C]">Explore our products</p>
          <div className="inline-flex" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              focusable="false"
            >
              <path
                d="M31.7755 11.1047L21.7278 5.32527C21.3546 5.11214 20.9319 5 20.5017 5C20.0714 5 19.6487 5.11214 19.2755 5.32527L9.22617 11.1047C8.85413 11.3202 8.5452 11.6289 8.33009 12.0003C8.11497 12.3716 8.00117 12.7925 8 13.2213V24.7801C8 25.6488 8.46995 26.4615 9.22617 26.8967L19.2738 32.6761C19.6473 32.8886 20.0701 33.0003 20.5002 33C20.9304 32.9997 21.353 32.8875 21.7262 32.6744L31.7738 26.895C32.53 26.4598 33 25.6488 33 24.7784V13.2213C32.9997 12.7926 32.8864 12.3715 32.6715 12C32.4566 11.6286 32.1477 11.3199 31.7755 11.1047ZM29.7137 14.7213L21.3307 19.4408V29.1731C21.3307 29.3917 21.2435 29.6014 21.0884 29.7559C20.9332 29.9105 20.7227 29.9974 20.5033 29.9974C20.2839 29.9974 20.0734 29.9105 19.9183 29.7559C19.7631 29.6014 19.6759 29.3917 19.6759 29.1731V19.421L11.3261 14.7213C11.1349 14.6136 10.9946 14.4346 10.9359 14.2237C10.8773 14.0129 10.9051 13.7875 11.0133 13.5971C11.1215 13.4067 11.3012 13.2669 11.5128 13.2085C11.7244 13.1501 11.9507 13.1778 12.1418 13.2855L20.5215 18.0017L28.8995 13.2855C29.0908 13.1785 29.3168 13.1512 29.5283 13.2095C29.7397 13.2679 29.9194 13.4072 30.0281 13.5971C30.1354 13.7879 30.1626 14.0132 30.1037 14.2238C30.0448 14.4345 29.9045 14.6133 29.7137 14.7213Z"
                fill="#4E5969"
              />
            </svg>
          </div>
        </div>
        <div className="mx-auto mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-[30px] lg:mt-12 lg:w-[960px] lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="group flex flex-col rounded bg-[#F7F5F3] p-5 md:min-h-[220px] md:p-8 transition-all duration-300 hover:bg-[#FF6900] hover:shadow-lg hover:shadow-[#F1E3DA]"
            >
              <div className="relative h-[60px] w-[60px]">
                <SmartImg
                  src={p.icon}
                  alt={`${p.title} icon`}
                  className="absolute inset-0 h-[60px] w-[60px] object-contain transition-opacity duration-300 group-hover:opacity-0"
                />
                {/* Colour-swapped twin of the icon above, only visible while
                    the pointer is over the card. Screen-reader users cannot
                    hover, so it is a decorative duplicate — hiding it also
                    removes the "Product icon hover" style generic alt
                    flagged in QA BUG-14. */}
                <SmartImg
                  src={p.iconHover}
                  alt=""
                  ariaHidden
                  className="absolute inset-0 h-[60px] w-[60px] object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
              <h3 className="mb-3 py-3 text-[18px] inter-light text-[#29221D] transition-colors duration-300 group-hover:text-white">
                {p.title}
              </h3>
              <p className="flex-1 text-[16px] inter-light leading-relaxed text-[#86909C] transition-colors duration-300 group-hover:text-white/90">
                {p.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
