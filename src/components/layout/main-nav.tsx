"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { mainNav, type NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

/**
 * Desktop horizontal navigation with a mega-menu for business sectors.
 * Mobile rendering is handled by <MobileNav /> (Sheet).
 */
export function MainNav() {
  // Root translator — nav config keys are absolute (e.g. "Nav.home").
  const t = useTranslations();

  return (
    <NavigationMenu className="hidden lg:flex" aria-label="Primary">
      <NavigationMenuList>
        {mainNav.map((item) => (
          <NavigationMenuItem key={item.labelKey}>
            {item.children ? (
              <>
                <NavigationMenuTrigger className="h-9 bg-transparent px-3 text-sm font-medium text-foreground/80 hover:text-foreground data-[state=open]:bg-transparent data-[state=open]:text-foreground">
                  {t(item.labelKey as never)}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[34rem] grid-cols-2 gap-1 p-2">
                    {item.children.map((child) => (
                      <li key={child.labelKey}>
                        <MegaMenuItem item={child} />
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "h-9 bg-transparent px-3 text-sm font-medium text-foreground/80 hover:text-foreground data-[state=open]:bg-transparent data-[state=open]:text-foreground"
                )}
              >
                <a href={item.href}>{t(item.labelKey as never)}</a>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MegaMenuItem({
  item,
}: {
  item: NonNullable<NavItem["children"]>[number];
}) {
  const t = useTranslations("Nav");
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white dark:text-emerald-400">
        <Icon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold leading-tight">
          {t(item.labelKey as never)}
        </span>
        {item.descriptionKey && (
          <span className="text-xs leading-snug text-muted-foreground">
            {t(item.descriptionKey as never)}
          </span>
        )}
      </span>
    </a>
  );
}
