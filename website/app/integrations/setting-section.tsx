/** Copyright (c) 2024, Tegon, all rights reserved. **/

"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SettingSectionProps {
  title: string;
  description: string | React.ReactNode;
  children: React.ReactNode;
}

interface IntegrationCardProps {
  name: string;
  description: string;
  href: string;
  Icon: any;
}

export function IntegrationCard({
  name,
  description,
  href,
  Icon,
}: IntegrationCardProps) {
  return (
    <div className="p-3 rounded-md cursor-pointer bg-background-3">
      <div className="flex items-center gap-2">
        <div className="border p-1 rounded-md dark:bg-foreground">{Icon}</div>
        <div className="grow">
          <div className="font-medium"> {name} </div>
          <div className="text-muted-foreground">{description}</div>
        </div>
        <div>
          <a
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={href}
            target="_blank"
          >
            View docs
          </a>
        </div>
      </div>
    </div>
  );
}

export function SettingSection({
  title,
  description,
  children,
}: SettingSectionProps) {
  return (
    <div className="flex gap-6 w-full flex-wrap xl:flex-nowrap">
      <div className="w-[400px] shrink-0 flex flex-col">
        <h3 className="text-lg"> {title} </h3>
        <p className="text-muted-foreground w-full">{description}</p>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
