import { cn } from '@tegonhq/ui/lib/utils';

export function Actions() {
  return (
    <div className="flex flex-col mt-16 gap-6">
      <h4
        className={cn(
          'text-balance max-w-2xl text-xl font-medium text-foreground',
        )}
      >
        Write, deploy and automate anything
      </h4>

      <div className="relative grid justify-center grid-cols-1 sm:grid-cols-12 divide-x-0 pt-0 grid-rows-[1fr_auto] divide-y divide-grid-dimmed lg:divide-x lg:divide-y-0">
        <div className="grid col-span-1 sm:col-span-12 lg:col-span-4">
          <div className="relative flex flex-col overflow-hidden">
            <div className="flex h-full max-w-lg flex-1 flex-col justify-start md:max-w-full">
              <h3 className="text-md">General workflows</h3>
              <p className="text-muted-foreground">
                Automatically create bugs from various external sources.
              </p>

              <div className="flex gap-2"></div>
            </div>
          </div>
        </div>

        <div className="grid col-span-1 sm:col-span-12 lg:col-span-4">
          <div className="relative flex flex-col overflow-hidden">
            <div className="flex h-full max-w-lg flex-1 flex-col justify-start md:max-w-full">
              <h3 className="text-md">Integration based</h3>
              <p className="text-muted-foreground">
                Automatically create bugs from various external sources.
              </p>
            </div>
          </div>
        </div>

        <div className="grid col-span-1 sm:col-span-12 lg:col-span-4">
          <div className="relative flex flex-col overflow-hidden">
            <div className="flex h-full max-w-lg flex-1 flex-col justify-start md:max-w-full">
              <h3 className="text-md">Agentic workflows</h3>
              <p className="text-muted-foreground">
                Automatically create bugs from various external sources.
              </p>

              <div className="flex gap-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
