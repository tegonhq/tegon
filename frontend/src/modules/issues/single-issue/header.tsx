/** Copyright (c) 2024, Tegon, all rights reserved. **/

import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from 'components/ui/breadcrumb';
import { Button } from 'components/ui/button';

export function Header() {
  return (
    <header className="flex pl-6 px-4 py-3 w-full border-b justify-between items-center">
      <div>
        <Breadcrumb className="text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              className="flex items-center gap-2"
              href="/"
            >
              <span className="inline-block font-bold">Poozle</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/docs/primitives/accordion">
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink as={Link} href="/docs/primitives/breadcrumb">
              Breadcrumb
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div>
        <Button variant="ghost"> Notification </Button>
      </div>
    </header>
  );
}
