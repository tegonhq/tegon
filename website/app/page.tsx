import { Badge, BadgeColor } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Docs, InProgressLine } from "@/icons";
import { RiGithubFill, RiSlackLine } from "@remixicon/react";
import { RightSide } from "./right-side";

export default function Home() {
  return (
    <div className="grid grid-cols-5 h-full">
      <div className="col-span-5 xl:col-span-4 flex flex-col">
        <div className="xl:hidden flex">
          <RightSide />
        </div>
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
          </p>
          <ul className="list-disc ml-6">
            <li>
              Manual efforts in task management, such as task triaging and
              backlog maintenance, can be time-consuming.
            </li>
            <li>
              Engineers often loose time navigating multiple platforms to gather
              task context, rather than accessing details within the task
              itself.
            </li>
            <li>
              Issue tracking tools serve as a task database, directing engineers
              on what to work on but not aiding in faster task completion.
            </li>
            <li>
              Existing tools don&apos;t effectively assist Engineering Managers
              in real-time task, feature, or bug prioritisation.
            </li>
          </ul>

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

        <div className="flex flex-col justify-between px-6 my-6">
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
      <div className="border-l border-border flex-col hidden xl:flex col-span-5 xl:col-span-1">
        <RightSide />
      </div>
    </div>
  );
}
