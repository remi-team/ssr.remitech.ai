"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Check } from "lucide-react";

import { routing, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const localeLabels: Record<Locale, string> = {
  zh: "简体中文",
  en: "English",
};

/**
 * Locale switcher that preserves the current pathname.
 *
 * `dark` prop tints the trigger for the overlay (transparent) header.
 */
export function LanguageSwitcher({
  align = "end",
  dark = false,
}: {
  align?: "start" | "end";
  dark?: boolean;
}) {
  const t = useTranslations("Lang");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  // Hidden while only one locale is served (kept mounted-safe: the switcher
  // reappears automatically once `routing.locales` holds more than one entry).
  if (routing.locales.length < 2) return null;

  const onSelect = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-1.5 px-2.5", dark && "text-white hover:bg-white/10")}
          aria-label={t("switch")}
        >
          <Globe className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
          <span className="hidden text-sm font-medium sm:inline">
            {locale.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[10rem]">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onSelect={() => onSelect(l)}
            className="gap-2"
          >
            <Check
              className={cn("h-4 w-4", l === locale ? "opacity-100" : "opacity-0")}
              aria-hidden="true"
            />
            <span>{localeLabels[l]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
