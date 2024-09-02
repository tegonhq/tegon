/* eslint-disable react/no-unescaped-entities */
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from 'components/page';

/* eslint-disable @next/next/no-img-element */
export default function Company() {
  return (
    <main className="container relative">
      <PageHeader className="my-4">
        <PageHeaderHeading>Our story</PageHeaderHeading>
        <PageHeaderDescription>
          We're building a new type of Project management platform, for
          developers.
        </PageHeaderDescription>
      </PageHeader>
      <div className="flex items-center justify-center w-full">
        <img
          src="/photo.jpg"
          className="w-full border max-w-[500px] rounded"
          alt={''}
        />
      </div>

      <div className="flex flex-col gap-4 my-6">
        <div className="flex flex-col gap-1 text-md">
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
      </div>

      <div className="flex flex-col gap-4 mt-6 text-md">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">Why Project Management?</h3>

          <p>
            Our experience with existing tools that have been there for decades
            haven&apos;t been great. Being such an important tool which is
            central to how you work, these tools are bloated, complex and often
            act as a burden for engineers. With the advent of AI - we thought
            what project management and issue tracking will look like 5-10 years
            down the line, the current tools were nowhere close to our
            imagination which got us excited and began the journey of Tegon. We
            want to reimagine project management, by taking an AI-first approach
            and starting with a simplified issue tracker built by and for
            engineers. Be open-source, be community-driven. That&apos;s Tegon.
          </p>
        </div>
      </div>
    </main>
  );
}
