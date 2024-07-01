import { Badge, BadgeColor } from "@/components/ui/badge";
import { Docs, InProgressLine } from "@/icons";
import { RiGithubFill, RiSlackLine } from "@remixicon/react";

export default function Home() {
  return (
    <main className="grid grid-cols-5 h-[calc(100vh_-_53px)] bg-background-2 rounded-tl-3xl">
      <div className="col-span-5 xl:col-span-4 flex flex-col h-[calc(100vh_-_55px)]">
        <div className="border-0 px-6 pt-6 pb-3 font-medium resize-none bg-transparent no-scrollbar overflow-hidden outline-none focus-visible:ring-0 text-xl">
          Tegon: The AI-first Issue Tracking Tool
        </div>

        <div className="px-6">
          <p>
            Modern, fast, open source platform to simplify issue tracking for
            engineering teams.
          </p>
          <p className="mt-2">
            Issue Tracking is important for fast-paced teams, enabling them to
            organize list of tasks, collaborate, and track progress effectively.
            However, existing tools often introduce the following challenges:
            <ul className="list-disc ml-6">
              <li>
                Manual efforts in task management, such as task triaging and
                backlog maintenance, can be time-consuming.
              </li>
              <li>
                Engineers often loose time navigating multiple platforms to
                gather task context, rather than accessing details within the
                task itself.
              </li>
              <li>
                Issue tracking tools serve as a task database, directing
                engineers on what to work on but not aiding in faster task
                completion.
              </li>
              <li>
                Existing tools don't effectively assist Engineering Managers in
                real-time task, feature, or bug prioritisation.
              </li>
            </ul>
          </p>

          <div className="mt-2">
            <h3 className="text-lg font-medium">Features</h3>
            <ul className="list-disc ml-6">
              <li>Issues Tracking (List and Kanban View)</li>
              <li>
                Automatically create a title from the description, eliminating
                the need to spend time crafting the perfect title
              </li>
              <li>Custom Views</li>
              <li>Sprints (coming soon)</li>
              <li>Task Prioritisation (coming soon)</li>
              <li>
                Suggest Stack Overflow references for Sentry-linked bug issues
                (coming soon)
              </li>
            </ul>
          </div>

          <div className="mt-2">
            <h3 className="text-lg font-medium">Integrations</h3>
            <ul className="list-disc ml-6">
              <li>
                Github: Automatically update issues status based on commits and
                pull requests and link mentions of issues back to Tegon
              </li>
              <li>
                Slack: Mention the Tegon bot in a Slack channel to automatically
                create a bug or feature request. Link a Slack thread to an issue
                to provide full context about the discussions happening on a
                specific task or a feature request.
              </li>
              <li>
                Sentry: Get information about Sentry errors in Tegon issues
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between px-6 mt-6">
          <div className="text-md mb-2 border-t pt-3"> Links</div>

          <div className="flex flex-col gap-1">
            <a
              target="_blank"
              href="https://github.com/tegonhq/tegon"
              className="cursor-pointer w-full bg-grayAlpha-100 px-2 pr-0 py-2 rounded-md flex gap-2 items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <RiGithubFill size={20} /> Github Repo{" "}
              </div>
            </a>
            <a
              target="_blank"
              href="https://github.com/tegonhq/tegon"
              className="cursor-pointer w-full bg-grayAlpha-100 px-2 pr-0 py-2 rounded-md flex gap-2 items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <RiSlackLine size={20} /> Slack community
              </div>
            </a>
            <a
              target="_blank"
              href="https://docs.tegon.ai"
              className="cursor-pointer w-full bg-grayAlpha-100 px-2 pr-0 py-2 rounded-md flex gap-2 items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Docs size={20} /> Tegon Docs
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="border-l border-border hidden flex-col xl:flex">
        <div className="grow p-6 flex flex-col gap-4">
          <div className="flex flex-col items-start">
            <label className="text-xs">Status</label>
            <div className="h-7 py-1 flex items-center gap-1">
              <InProgressLine className="text-[--status-icon-5]" />
              In Progress
            </div>
          </div>

          <div className="flex flex-col items-start">
            <label className="text-xs">Trusted by</label>
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
      </div>
    </main>
  );
}
