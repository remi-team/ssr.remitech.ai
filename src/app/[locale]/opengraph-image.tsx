import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/config/site";

export const alt = "Remi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic Open Graph image.
 *
 * Renders per-locale so social previews show the correct language.
 * NOTE: Satori (the OG renderer) requires every <div> with multiple children
 * to declare `display: "flex"` explicitly — hence the verbose inline styles.
 */
export default async function OpengraphImage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "Meta",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0E0B09 0%, #29221D 50%, #1a1410 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "88px",
              height: "88px",
              borderRadius: "22px",
              background: "linear-gradient(135deg, #FF6900, #FF8C2E)",
              fontSize: "48px",
              fontWeight: 700,
            }}
          >
            R
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "32px",
              fontWeight: 600,
              opacity: 0.85,
            }}
          >
            {siteConfig.shortName}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "56px",
            fontWeight: 700,
            lineHeight: 1.2,
            maxWidth: "1000px",
          }}
        >
          {t("title")}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "32px",
            fontSize: "26px",
            opacity: 0.7,
          }}
        >
          {siteConfig.url.replace("https://", "")}
        </div>
      </div>
    ),
    { ...size }
  );
}
