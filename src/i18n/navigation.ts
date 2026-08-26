import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Typed navigation helpers bound to the central routing config.
 *
 * Components import `Link`, `usePathname`, `useRouter`, `redirect` from here
 * (not from next-intl directly) so locale prefixing stays consistent everywhere.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
