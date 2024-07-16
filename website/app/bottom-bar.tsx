"use client";

import React from "react";
import Image from "next/image";
import { Logo } from "@/icons/logo";

export function BottomBar() {
  const [newIssue, setNewIssue] = React.useState(false);
  const [search, setSearch] = React.useState(false);

  return (
    <div className="w-full flex justify-center px-6 py-4">
      <Logo className="h-6 w-fit text-muted-foreground" />
      {/* <Button
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
      </Button> */}
    </div>
  );
}
