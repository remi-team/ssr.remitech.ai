"use client";

import * as React from "react";
import { Cta } from "@/components/cta";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

import { filesService } from "@/services/client/client-files-service";
import { BFF_ROUTES } from "@/lib/api/config";
import type { FileItem } from "@/lib/api/types";
import { useAuthStore } from "@/stores/auth-store";
import { useModalStore } from "@/stores/modal-store";

/* FAQ content is shared with the server-rendered FAQPage JSON-LD. */
import { qaItems } from "../faq-data";

/* ── Data (migrated from Vue ref/reactive) ── */

/** Lenient shape of a document coming from the website API file list. */
type DocItem = FileItem & {
  title?: string;
  description?: string;
  format?: string;
  version?: string;
  type_level1?: string;
  type_level2?: string;
};

const categoryIconMap: Record<string, string> = {
  all: "all",
  "whitepapers & tech docs": "docs",
  "compliance & policies": "policy",
  membership: "membership",
  media: "media",
};

/* The document list is fetched from the files BFF at runtime (see
   ResourcesContent below) — same behaviour as the legacy documents store. */

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
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userInfo = useAuthStore((s) => s.userInfo);
  const hydrate = useAuthStore((s) => s.hydrate);
  const showLogin = useModalStore((s) => s.showLogin);

  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQA, setExpandedQA] = useState<number>(0);

  // Legacy parity: `isAuthenticated` = logged in and approved (status 2).
  const isAuthenticated = isLoggedIn && userInfo?.status === 2;

  // Fetch the document list on mount (legacy `documentsStore.getDocumentsList`).
  useEffect(() => {
    void hydrate();
    let cancelled = false;
    (async () => {
      try {
        const res = await filesService.getFileList();
        if (cancelled) return;
        if (res.code === "200" && res.data) {
          setDocuments(res.data as DocItem[]);
        }
      } catch (err) {
        console.error("Document list fetch failed:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrate]);

  const toggleQA = useCallback((index: number) => {
    setExpandedQA((prev) => (prev === index ? -1 : index));
  }, []);

  /* Dynamic categories derived from the docs' type_level1 field. */
  const categories = useMemo(() => {
    const result = [{ id: "all", name: "All Resources", icon: "all" }];
    const seen = new Set<string>();
    documents.forEach((doc) => {
      if (doc.type_level1 && !seen.has(doc.type_level1)) {
        seen.add(doc.type_level1);
        const keyLower = doc.type_level1.toLowerCase();
        result.push({
          id: doc.type_level1,
          name: doc.type_level1,
          icon: categoryIconMap[keyLower] || keyLower,
        });
      }
    });
    return result;
  }, [documents]);

  /* Filter docs by category + search */
  const filteredDocuments = useMemo(() => {
    let docs = documents;
    if (activeCategory !== "all") {
      docs = docs.filter((doc) => doc.type_level1 === activeCategory);
    }
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      docs = docs.filter(
        (doc) =>
          doc.title?.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.format?.toLowerCase().includes(query) ||
          doc.type?.toLowerCase().includes(query) ||
          doc.type_level1?.toLowerCase().includes(query) ||
          doc.type_level2?.toLowerCase().includes(query) ||
          doc.version?.toLowerCase().includes(query)
      );
    }
    return docs;
  }, [documents, activeCategory, searchQuery]);

  /* Group filtered docs by type_level1 */
  const groupedDocuments = useMemo(() => {
    const groups: Record<string, { categoryName: string; items: DocItem[] }> = {};
    filteredDocuments.forEach((doc) => {
      const key = doc.type_level1 || "Other";
      if (!groups[key]) {
        groups[key] = { categoryName: key, items: [] };
      }
      groups[key].items.push(doc);
    });
    return Object.values(groups);
  }, [filteredDocuments]);

  /* Document click — legacy `handleDocClick` parity:
     1) login gate → 2) approval gate (24h review notice) → 3) open/play/download */
  const handleDocClick = async (doc: DocItem) => {
    if (!isLoggedIn) {
      showLogin();
      return;
    }
    if (!isAuthenticated) {
      toast.warning(
        "Your request has been submitted. We will review it within 24 hours.",
        { duration: 5000 },
      );
      return;
    }
    if (doc.format === "pdf") {
      // The BFF download route injects the auth cookie server-side.
      window.open(`${BFF_ROUTES.FILES.DOWNLOAD}/${doc.id}`, "_blank");
    } else if (doc.format === "mp4") {
      router.push(`/player?id=${encodeURIComponent(String(doc.id))}`);
    } else {
      try {
        const blob = await filesService.downloadFile(String(doc.id));
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = doc.title || doc.name || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download failed:", err);
      }
    }
  };

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
            {categories.map((cat) => (
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
          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="py-[8px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-[#EBE8E5] p-[16px_12px] last:border-b-0"
                >
                  <div className="mr-[16px] flex min-w-0 flex-1 items-center">
                    <div className="mr-[14px] h-[20px] w-[20px] shrink-0 animate-pulse rounded-[4px] bg-[#EBE8E5]" />
                    <div className="h-[14px] w-[70%] animate-pulse rounded-[4px] bg-[#EBE8E5]" />
                  </div>
                  <div className="h-[36px] w-[36px] shrink-0 animate-pulse rounded-full border border-[#EBE8E5]" />
                </div>
              ))}
            </div>
          ) : groupedDocuments.length > 0 ? (
            <>
              {groupedDocuments.map((group) => (
                <div key={group.categoryName}>
                  <h3 className="text-[18px] md:text-[20px] font-[600] text-[#29221D] mb-[24px] pb-[12px] border-b border-b-[#EBE8E5]">
                    {group.categoryName}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] sm:gap-[20px] lg:gap-[24px] mb-[60px]">
                    {group.items.map((doc, i) => (
                      <button
                        key={`${doc.id ?? doc.title}-${i}`}
                        type="button"
                        onClick={() => handleDocClick(doc)}
                        className="bg-[#F7F5F3] rounded-[4px] p-[24px] flex flex-col cursor-pointer text-left transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(241,227,218,0.6)] hover:-translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6900]"
                      >
                        <div className="text-[11px] font-[600] uppercase tracking-[0.05em] text-[#FF6900] mb-[12px]">
                          {doc.type_level2 || doc.type?.toUpperCase()}
                        </div>
                        <h4 className="text-[15px] md:text-[16px] font-[500] text-[#29221D] leading-[1.4] mb-[10px] line-clamp-2 transition-colors duration-200 group-hover:text-[#FF6900]">
                          {doc.title}
                        </h4>
                        <p className="text-[13px] sm:text-[14px] text-[#86909C] leading-[1.55] mb-[16px] flex-1 line-clamp-3">
                          {doc.description}
                        </p>
                        <div className="text-[12px] text-[#86909C] mt-auto">
                          {[doc.version, doc.format, doc.type?.toUpperCase()]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                        <div className="mt-[12px] flex items-center">
                          {(doc.format === "pdf" || doc.type === "pdf") && (
                            <img
                              src="/images/icon-pdf.svg"
                              className="w-[18px] h-[18px] object-contain"
                              alt="PDF"
                            />
                          )}
                          {(doc.format === "mp4" || doc.type === "mp4") && (
                            <img
                              src="/images/icon-video.svg"
                              className="w-[18px] h-[18px] object-contain"
                              alt="Video"
                            />
                          )}
                        </div>
                      </button>
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
                  aria-expanded={expandedQA === index}
                  aria-controls={`faq-answer-${index}`}
                  className="group flex w-full cursor-pointer items-start justify-between gap-[16px]"
                >
                  <h3
                    className={`flex-1 text-left font-light text-[18px] leading-[1.2] transition-colors duration-200 ${
                      expandedQA === index
                        ? "text-[#ff7a1a]"
                        : "text-[#2d2722] group-hover:text-[#ff7a1a]"
                    }`}
                  >
                    {qa.title}
                  </h3>
                  <ChevronRight
                    className={`mt-[2px] h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                      expandedQA === index
                        ? "rotate-90 text-[#ff7a1a]"
                        : "text-[#86909C]"
                    }`}
                  />
                </button>
                {expandedQA === index && (
                  <ul
                    id={`faq-answer-${index}`}
                    className="mt-[12px] ml-[20px] space-y-[8px] list-disc"
                  >
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
