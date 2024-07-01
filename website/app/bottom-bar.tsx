/** Copyright (c) 2024, Tegon, all rights reserved. **/

"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Docs, SlackIcon } from "@/icons";
import { RiGithubFill, RiSlackFill, RiSlackLine } from "@remixicon/react";

export function BottomBar() {
  const [newIssue, setNewIssue] = React.useState(false);
  const [search, setSearch] = React.useState(false);

  return (
    <div className="w-full flex justify-between px-6 py-4">
      <Button
        variant="ghost"
        isActive
        className="px-3"
        onClick={() => {
          window.open("https://docs.tegon.ai", "_blank");
        }}
      >
        <Docs size={20} />
      </Button>

      <Button
        variant="ghost"
        isActive
        className="px-3"
        onClick={() => {
          setNewIssue(true);
        }}
      >
        <RiGithubFill size={20} />
      </Button>

      <Button
        variant="ghost"
        isActive
        className="px-3"
        onClick={() => {
          setSearch(true);
        }}
      >
        <RiSlackLine size={20} />
      </Button>
    </div>
  );
}
