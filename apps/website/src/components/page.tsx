import { cn } from '@tegonhq/ui/lib/utils';

function PageHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        'mx-auto flex flex-col items-start gap-2 px-0 py-8 md:py-12 md:pb-8 lg:py-12 lg:pb-10',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

function PageHeaderHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'text-[30px] lg:text-[42px] font-semibold leading-tight tracking-tighter lg:leading-[1.1]',
        className,
      )}
      {...props}
    />
  );
}

function PageHeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-balance max-w-2xl text-lg font-light text-foreground',
        className,
      )}
      {...props}
    />
  );
}

function PageActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-start gap-2 py-2',
        className,
      )}
      {...props}
    />
  );
}

export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading };
