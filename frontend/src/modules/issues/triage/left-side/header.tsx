/** Copyright (c) 2024, Tegon, all rights reserved. **/

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex px-4 py-4 w-full border-b justify-between items-center">
      <div className="flex gap-4 items-center">
        <h3 className="text-sm font-medium"> {title} </h3>
      </div>
    </header>
  );
}
