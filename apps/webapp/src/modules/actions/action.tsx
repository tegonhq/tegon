// import { useParams } from 'next/navigation';

export function Action() {
  // const { actionSlug } = useParams();

  return (
    <div className="flex gap-6">
      <div className="w-[400px] shrink-0 flex flex-col">
        <h3 className="text-lg"> </h3>
        <p className="text-muted-foreground"></p>
      </div>
      <div className="grow"></div>
    </div>
  );
}
