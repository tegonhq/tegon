import { Separator } from "@/components/ui/separator";
import { SettingSection } from "../integrations/setting-section";

export default function Features() {
  return (
    <main className="flex min-h-screen flex-col items-start w-full gap-4 p-6">
      <SettingSection
        title="Supercharge your workflow with Tegon AI"
        description={null}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <h3 className="font-medium text-md">Effortless Titles</h3>
            <p className="">
              AI suggests concise titles, eliminating writer&apos;s block.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-md">Smart Delegation</h3>
            <p>
              AI recommends labels and assignees for efficient task routing.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-md">No Duplicates</h3>
            <p>AI prevents creating duplicate issues.</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-md">AI Summarization</h3>
            <p>Quickly grasp key points with AI-generated summaries.</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-md">Natural Language Filtering</h3>
            <p>Effortlessly filter issues with plain language.</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-md">Automated Triaging</h3>
            <p>AI saves time by automatically categorizing issues.</p>
          </div>
        </div>
      </SettingSection>
      <Separator />

      <SettingSection title="Track Work Your Way" description={null}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <h3 className="font-medium text-md">Interactive Layouts</h3>
            <p className="">Choose between List or Kanban views.</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-md">Focus on What Matters</h3>
            <p>
              Easily update key details and highlight critical dependencies
              (sub-tasks, blocked/blocking issues).
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-md">List View</h3>
            <p>
              Perfect for scanning prioritized issues, grouped by status.
              Collapse sections for focus.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-md">Kanban View</h3>
            <p>
              Visualize workflow with Kanban boards, ideal for tracking progress
              at a glance.
            </p>
          </div>
        </div>
      </SettingSection>

      <Separator />

      <SettingSection title="Centralised Triage" description={null}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <h3 className="font-medium text-md">Unified Inbox</h3>
            <p className="">
              Capture issues from all sources (sales, support, monitoring tools)
              in a single queue.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-md">Slack Integration</h3>
            <p>
              Create issues directly from Slack, empowering non-technical users.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-md">Automatic Routing</h3>
            <p>
              Errors detected by tools (e.g., Sentry) automatically flow into
              triage for prioritization.
            </p>
          </div>
        </div>
      </SettingSection>

      <Separator />

      <SettingSection title="Customisable Views" description={null}>
        <div className="flex flex-col gap-3 pb-6">
          <div className="flex flex-col">
            <h3 className="font-medium text-md">Filter & Focus</h3>
            <p className="">
              See what matters most with custom filters and personalized
              dashboards.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-md">Save & Share</h3>
            <p>
              Quickly access favorite views and collaborate with shared
              dashboards.
            </p>
          </div>
        </div>
      </SettingSection>
    </main>
  );
}
