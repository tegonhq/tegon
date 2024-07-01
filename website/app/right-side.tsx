"use client";
import { Badge, BadgeColor } from "@/components/ui/badge";

import { InProgressLine } from "@/icons";

export function RightSide() {
  return (
    <div className="grow p-6 flex flex-col gap-4">
      <div className="flex flex-col items-start">
        <label className="text-xs">Status</label>
        <div className="h-7 py-1 flex items-center gap-1">
          <InProgressLine className="text-[--status-icon-4]" />
          In Progress
        </div>
      </div>

      <div className="flex flex-col items-start">
        <label className="text-xs">Backed by</label>
        <div className="h-7 py-1 flex items-center gap-1">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Y_Combinator_logo.svg/1200px-Y_Combinator_logo.svg.png"
            className="h-5 w-5"
            alt="YC"
          />
          Y Combinator
        </div>
      </div>

      <div className="flex flex-col items-start">
        <label className="text-xs">Labels</label>
        <div className="h-7 py-1 flex items-center gap-1 flex-wrap">
          <Badge
            variant="secondary"
            key="Opensource"
            className="text-foreground flex items-center"
          >
            <BadgeColor
              style={{ backgroundColor: "var(--custom-color-2)" }}
              className="w-2 h-2"
            />
            Opensource
          </Badge>
          <Badge
            variant="secondary"
            key="Opensource"
            className="text-foreground flex items-center"
          >
            <BadgeColor
              style={{ backgroundColor: "var(--custom-color-3)" }}
              className="w-2 h-2"
            />
            Issue Tracking
          </Badge>
          <Badge
            variant="secondary"
            key="Opensource"
            className="text-foreground flex items-center"
          >
            <BadgeColor
              style={{ backgroundColor: "var(--custom-color-4)" }}
              className="w-2 h-2"
            />
            AI-first
          </Badge>
          <Badge
            variant="secondary"
            key="Opensource"
            className="text-foreground flex items-center"
          >
            <BadgeColor
              style={{ backgroundColor: "var(--custom-color-5)" }}
              className="w-2 h-2"
            />
            Project Management
          </Badge>
        </div>
      </div>
    </div>
  );
}
