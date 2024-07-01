/** Copyright (c) 2024, Tegon, all rights reserved. **/

"use client";

import { useRouter } from "next/router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "@/icons";

export const Header = () => {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes("/integrations")) {
      return "Integrations";
    } else if (pathname.includes("/features")) {
      return "Features";
    } else if (pathname.includes("/story")) {
      return "Story";
    } else {
      return "Home";
    }
  };

  return (
    <header className="hidden xl:flex px-6 w-full justify-between gap-2 items-center">
      <div className="flex gap-2 py-4 items-center">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              className="flex items-center gap-2"
              href={`/`}
            >
              <span className="inline-block">Tegon</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>{getTitle()}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="flex justify-end gap-3 py-2">
        <Button
          variant="secondary"
          className="flex items-center gap-1"
          onClick={() => {
            window.open("https://github.com/tegonhq/tegon", "_blank");
          }}
        >
          <Star />
          Star us on github
        </Button>
      </div>
    </header>
  );
};
