import { cn } from '@tegonhq/ui/lib/utils';
import Image from 'next/image';

export function Triage() {
  return (
    <div className="flex flex-col mt-16 gap-6">
      <h4
        className={cn(
          'text-balance max-w-2xl text-xl font-medium text-foreground',
        )}
      >
        Have omni-channel bug reporting system
      </h4>

      <div className="relative grid justify-center grid-cols-1 sm:grid-cols-12 divide-x-0 pt-0 grid-rows-[1fr_auto] divide-y divide-grid-dimmed lg:divide-x lg:divide-y-0">
        <div className="grid col-span-1 sm:col-span-12 lg:col-span-3">
          <div className="relative flex flex-col overflow-hidden">
            <div className="flex h-full max-w-lg flex-1 flex-col justify-start md:max-w-full">
              <h3 className="text-md">Central hub for bugs</h3>
              <p className="text-muted-foreground">
                Automatically create bugs from various external sources.
              </p>
            </div>

            <div className="flex gap-4 mt-2">
              <Image
                src="/features/triage.png"
                key={2}
                alt="logo"
                width={1280}
                height={800}
                className="w-full rounded"
              />
            </div>
          </div>
        </div>
        <div className="col-span-1"></div>
        <div className="grid col-span-1 sm:col-span-12 lg:col-span-3">
          <div className="relative flex flex-col overflow-hidden">
            <div className="flex h-full max-w-lg flex-1 flex-col justify-start md:max-w-full">
              <h3 className="text-md">Automatic grouping</h3>
              <p className="text-muted-foreground">
                Automatically create bugs from various external sources.
              </p>
            </div>

            <div className="flex gap-4 mt-2">
              <Image
                src="/features/grouping.png"
                key={2}
                alt="logo"
                width={1280}
                height={800}
                className="w-full rounded"
              />
            </div>
          </div>
        </div>
        <div className="col-span-1"></div>

        <div className="grid col-span-1 sm:col-span-12 lg:col-span-3">
          <div className="relative flex flex-col overflow-hidden">
            <div className="flex h-full max-w-lg flex-1 flex-col justify-start md:max-w-full">
              <h3 className="text-md">AI suggestions</h3>
              <p className="text-muted-foreground">
                Automatically create bugs from various external sources.
              </p>

              <div className="flex gap-2"></div>
            </div>

            <div className="flex gap-4 mt-2">
              <Image
                src="/features/ai-suggestions.png"
                key={2}
                alt="logo"
                width={1280}
                height={800}
                className="w-full rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
