import { RiGithubFill } from "@remixicon/react";
import { IntegrationCard, SettingSection } from "./setting-section";
import { SentryIcon, SlackIcon } from "@/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Integrations() {
  const Description = () => {
    return (
      <>
        Tegon seamlessly integrates with the tools you already use, keeping you
        productive and in the zone. Say goodbye to frustrating app switching!
        Feel free to suggest a new integration by creating a GitHub issue - we
        value your input!
        <a
          className={cn(
            "mt-2 text-foreground",
            buttonVariants({ variant: "secondary", size: "lg" })
          )}
          href="https://github.com/tegonhq/tegon/issues"
          target="_blank"
        >
          Request new integration
        </a>
      </>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-start w-full p-6">
      <SettingSection title="Integrations" description={Description()}>
        <div className="flex flex-col gap-2">
          <IntegrationCard
            name="Github"
            description="Automate your pull request and commit workflows and keep issues synced both ways"
            href="https://docs.tegon.ai/integrations/github"
            Icon={<RiGithubFill size={24} className="dark:text-background" />}
          />
          <IntegrationCard
            name="Slack"
            description="Create issues from Slack messages and sync threads"
            href="https://docs.tegon.ai/integrations/slack"
            Icon={<SlackIcon size={24} className="dark:text-background" />}
          />
          <IntegrationCard
            name="Sentry"
            description="Connect sentry issues with the tegon issues"
            href="https://docs.tegon.ai/integrations/sentry"
            Icon={<SentryIcon size={24} className="dark:text-background" />}
          />
        </div>
      </SettingSection>
    </main>
  );
}
