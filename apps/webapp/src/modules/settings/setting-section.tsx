interface SettingSectionProps {
  title: string;
  description: string;
  metadata?: React.ReactNode;
  children: React.ReactNode;
}

export function SettingSection({
  title,
  description,
  metadata,
  children,
}: SettingSectionProps) {
  return (
    <div className="flex gap-6">
      <div className="w-[400px] shrink-0 flex flex-col">
        <h3 className="text-lg"> {title} </h3>
        <p className="text-muted-foreground">{description}</p>
        {metadata ? metadata : null}
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
