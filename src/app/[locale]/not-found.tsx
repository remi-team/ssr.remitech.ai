import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

/**
 * Locale-scoped 404 page.
 *
 * `params` may be undefined when this page is rendered outside a locale
 * segment, so we resolve the translator from the request context instead.
 * This keeps the page defensive without sacrificing i18n.
 */
export default async function NotFound() {
  let t;
  try {
    t = await getTranslations("NotFound");
  } catch {
    // Fallback when no intl context is available (e.g. global 404).
    t = {
      title: "Page not found",
      description: "The page you're looking for may have been moved or removed.",
      back: "Back to home",
    } as const;
  }

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-bold text-emerald-600 dark:text-emerald-400">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{t("description")}</p>
      <Button asChild className="mt-8">
        <Link href="/#top">{t("back")}</Link>
      </Button>
    </div>
  );
}
