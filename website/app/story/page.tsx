import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function Story() {
  return (
    <main className="flex min-h-screen flex-col items-start w-full p-6 gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-lg">About us</h3>

        <p>
          We&apos;re Harshith, Manoj, and Manik - friends, co-founders, and
          passionate open-source believers. For the past 5 years, we&apos;ve
          been working together, and last year, our journey took an exciting
          turn when we were accepted into Y Combinator. While we entered Y
          Combinator with a different open-source project, the experience was
          invaluable. We learned a lot, iterated on our ideas, and ultimately
          decided to pivot towards Tegon.
        </p>
      </div>

      <div className="flex items-center justify-center w-full">
        <img
          src="https://www.ycombinator.com/media/?type=post&id=73686&key=user_uploads/983234/0b9bffde-d69c-4863-b33c-e4f42cc4f00a"
          className="w-full border max-w-[500px] rounded"
          alt={""}
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-lg">Why Project Management?</h3>

        <p>
          Our experience with existing tools that have been there for decades
          haven&apos;t been great. Being such an important tool which is central
          to how you work, these tools are bloated, complex and often act as a
          burden for engineers. With the advent of AI - we thought what project
          management and issue tracking will look like 5-10 years down the line,
          the current tools were nowhere close to our imagination which got us
          excited and began the journey of Tegon. We want to reimagine project
          management, by taking an AI-first approach and starting with a
          simplified issue tracker built by and for engineers. Be open-source,
          be community-driven. That&apos;s Tegon.
        </p>
      </div>

      <Separator />
      <div>
        Is AI just a marketing gimmick? We believe not, especially when it comes
        to project management ...............
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-lg">
          The Challenge: Escaping the Vortex
        </h3>

        <p>
          Collaboration is key to building great products, but traditional
          project management often gets in the way. Endless processes, manual
          tasks, and conflicting priorities create a vortex of inefficiency that
          sucks the life out of innovation.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-lg">
          The AI Advantage: Your Intelligent Partner
        </h3>

        <p>
          Imagine an tireless assistant that prioritizes work, gathers
          information from various sources, and automates tedious tasks. This is
          the power of AI-first project management. It frees your team to focus
          on what matters most – building amazing products.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-lg">Prioritization Made Simple</h3>

        <p>
          AI goes beyond automation. It gathers context from diverse sources,
          helping teams identify and focus on the most critical tasks. Human-AI
          collaboration is the future of project management.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-lg">
          The Command Center for a Hybrid Workforce
        </h3>

        <p>
          In this hybrid world, issue trackers become the command center for
          human and AI workers. These digital collaborators assist with
          automation, prioritization, and even complete tasks.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-lg">Building the Future, Together</h3>

        <p className="mb-6">
          We believe in an open-source approach to build this new way of
          working. Together, let&apos;s create a future where AI empowers teams
          to escape the project management vortex and achieve groundbreaking
          innovation.
        </p>
      </div>
    </main>
  );
}
