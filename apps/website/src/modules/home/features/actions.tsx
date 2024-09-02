import { cn } from '@tegonhq/ui/lib/utils';
import Image from 'next/image';

export function Actions() {
  return (
    <div className="flex flex-col mt-16 gap-6 text-md">
      <h4
        className={cn(
          'text-balance max-w-2xl text-xl font-medium text-foreground',
        )}
      >
        Write, deploy and automate anything
      </h4>

      <div className="relative grid justify-center grid-cols-1 sm:grid-cols-12 divide-x-0 pt-0 grid-rows-[1fr_auto] divide-y divide-grid-dimmed lg:divide-x lg:divide-y-0">
        <div className="grid col-span-12 lg:col-span-5">
          <Image
            src="/features/AI_BUG.png"
            width={1280}
            height={800}
            alt="AI Bug"
            className="dark:block rounded w-full"
          />
        </div>
        <div className="col-span-2 my-6"></div>
        <div className="grid col-span-12 lg:col-span-5">
          <div className="relative flex flex-col overflow-hidden">
            <div className="flex h-full max-w-lg flex-1 flex-col justify-center md:max-w-full">
              <h3 className="text-lg">AI Bug Enricher</h3>
              <p className="text-muted-foreground">
                Add context based tips on where to start, drop the barrier to
                resolve bugs
              </p>

              <div className="flex gap-2"></div>
            </div>
          </div>
        </div>

        <div className="grid lg:hidden col-span-12 lg:col-span-5">
          <Image
            src="/features/PR.png"
            width={1280}
            height={800}
            alt="AI Bug"
            className="dark:block rounded w-full mt-6"
          />
        </div>
        <div className="hidden lg:grid col-span-12 lg:col-span-5">
          <div className="relative flex flex-col overflow-hidden">
            <div className="flex h-full max-w-lg flex-1 flex-col justify-center md:max-w-full">
              <h3 className="text-lg">Seamless PR Tracking</h3>
              <p className="text-muted-foreground">
                Automatically create an issue to track a Pull Request (PR) as
                soon as it is assigned and linked to a Tegon issue
              </p>

              <div className="flex gap-2"></div>
            </div>
          </div>
        </div>
        <div className="col-span-2 my-6"></div>
        <div className="hidden lg:grid col-span-12 lg:col-span-5">
          <Image
            src="/features/PR.png"
            width={1280}
            height={800}
            alt="AI Bug"
            className="dark:block rounded w-full"
          />
        </div>
        <div className="grid lg:hidden col-span-12 lg:col-span-5">
          <div className="relative flex flex-col overflow-hidden">
            <div className="flex h-full max-w-lg flex-1 flex-col justify-center md:max-w-full">
              <h3 className="text-md">Seamless PR Tracking</h3>
              <p className="text-muted-foreground">
                Automatically create an issue to track a Pull Request (PR) as
                soon as it is assigned and linked to a Tegon issue
              </p>

              <div className="flex gap-2"></div>
            </div>
          </div>
        </div>

        <div className="grid col-span-12 lg:col-span-5">
          <Image
            src="/features/Slack.png"
            width={1280}
            height={800}
            alt="AI Bug"
            className="dark:block rounded w-full mt-6"
          />
        </div>
        <div className="col-span-2 my-6"></div>
        <div className="grid col-span-12 lg:col-span-5">
          <div className="relative flex flex-col overflow-hidden">
            <div className="flex h-full max-w-lg flex-1 flex-col justify-center md:max-w-full">
              <h3 className="text-md">Create Issues directly from Slack</h3>
              <p className="text-muted-foreground">
                Effortlessly create issues from Slack and keep your
                conversations in sync by using 👀 emoji
              </p>

              <div className="flex gap-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
