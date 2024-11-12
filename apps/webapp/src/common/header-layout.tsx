interface HeaderLayoutProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function HeaderLayout({ children, actions }: HeaderLayoutProps) {
  return (
    <header className="flex px-4 w-full items-center">
      <div className="flex justify-between w-full py-2.5 h-[48px] items-center">
        <div className="flex gap-1 items-center">{children}</div>
        {actions && <div>{actions}</div>}
      </div>
    </header>
  );
}
