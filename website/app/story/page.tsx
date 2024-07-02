import { Separator } from "@/components/ui/separator";

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
          src="/photo.jpg"
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

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-lg">Why AI-First?</h3>

        <p>
          Move beyond marketing hype. AI can transform project management.
          Traditional tools bog teams down in endless processes and manual
          tasks, hindering collaboration and innovation.
        </p>
        <p>
          This is where AI steps in. Imagine an intelligent assistant that
          prioritizes work, automates tedious tasks, and gathers insights from
          various sources. This frees your team to focus on what truly matters:
          building incredible products.
        </p>
        <p className="pb-6">
          AI goes beyond automation. It prioritizes tasks based on insights,
          enabling human-AI collaboration – the future of project management.
          Tegon empowers you to build this future with an AI-powered, central
          hub for your team.
        </p>
      </div>
    </main>
  );
}
