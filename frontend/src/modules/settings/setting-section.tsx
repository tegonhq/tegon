/** Copyright (c) 2024, Tegon, all rights reserved. **/

interface SettingSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SettingSection({
  title,
  description,
  children,
}: SettingSectionProps) {
  return (
    <div className="flex gap-6">
      <div className="w-[400px] shrink-0 flex flex-col">
        <h3 className="text-lg"> {title} </h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
