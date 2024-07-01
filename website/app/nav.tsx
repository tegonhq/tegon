/** Copyright (c) 2024, Tegon, all rights reserved. **/

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface NavProps {
  links: Array<{
    title: string;
    label?: string;

    icon?: any;
    href: string;
    count?: number;
  }>;
}

export function checkIsActive(pathname: string, href: string): boolean {
  if (pathname.endsWith(href)) {
    return true;
  }

  return false;
}

export function Nav({ links }: NavProps) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-0.5">
      {links.map((link, index) => {
        const isActive = checkIsActive(pathname, link.href);

        return (
          <div className="flex gap-1 items-center " key={index}>
            <Link
              href={link.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "flex items-center gap-1 justify-between text-foreground bg-grayAlpha-100 w-fit",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              <div className="flex items-center gap-1">
                {link.icon}
                {link.title}
                {link.label && (
                  <span className={cn("ml-auto")}>{link.label}</span>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
