import { CrossCircle } from '@tegonhq/ui/icons';

export const NoTeamContainer = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
      <div>
        <CrossCircle size={34} />
      </div>
      <div className="flex flex-col items-center">
        <p>Team not found</p>
        <p className="text-muted-foreground"> We couldnt find the page </p>
      </div>
    </div>
  );
};
