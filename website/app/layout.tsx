import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import { cn } from "@/lib/utils";
import { Nav } from "./nav";
import { AI, Home, SettingsLine, StackLine, TeamLine } from "@/icons";
import { BottomBar } from "./bottom-bar";
import { Header } from "./header";
import { Button } from "@/components/ui/button";
import { AvatarText } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Tegon AI",
  description: "Opensource project management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistMono.variable} ${GeistSans.variable}`}>
      <body className={GeistSans.className}>
        <div
          className={cn(
            "min-h-screen font-sans antialiased flex",
            GeistSans.variable,
            GeistMono.variable
          )}
        >
          <div className="h-[100vh] w-[100vw] flex">
            <div className="min-w-[234px] flex flex-col">
              <div className="flex flex-col py-4 px-6">
                <div className="flex justify-between items-center">
                  <Button variant="ghost" size="sm" className="p-0">
                    <div className="flex justify-between gap-2 items-center">
                      <AvatarText text="Tegon" noOfChar={1} />

                      <div> Tegon</div>
                    </div>
                  </Button>
                </div>
              </div>
              <div className="px-6 mt-4 grow">
                <Nav
                  links={[
                    {
                      title: "Home",
                      icon: <Home className="h-4 w-4" />,
                      href: `/home`,
                    },
                    {
                      title: "Integrations",
                      icon: <StackLine className="h-4 w-4" />,
                      href: `/integrations`,
                    },
                    {
                      title: "Features",
                      icon: <AI className="h-4 w-4" />,
                      href: `/features`,
                    },
                    {
                      title: "Our Story",
                      icon: <TeamLine className="h-4 w-4" />,
                      href: `/story`,
                    },
                  ]}
                />
              </div>
              {/* <BottomBar /> */}
            </div>

            <div className="max-w-[calc(100vw_-_234px)] w-full">
              <main className="flex flex-col h-[100vh]">
                <Header />
                <div className="bg-background-2 rounded-tl-3xl flex flex-col h-[calc(100vh_-_53px)]">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
