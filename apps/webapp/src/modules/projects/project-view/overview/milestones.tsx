import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@tegonhq/ui/components/alert-dialog';
import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import { Input } from '@tegonhq/ui/components/ui/input';
import {
  AddLine,
  CheckLine,
  CrossLine,
  DeleteLine,
  EditLine,
  LabelLine,
  MoreLine,
} from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { ProjectDatePicker } from 'modules/projects/dropdowns/project-date-picker';
import { ProjectDropdownVariant } from 'modules/projects/dropdowns/status';

import type { ProjectMilestoneType } from 'common/types';

import { useProject } from 'hooks/projects';

import {
  useCreateProjectMilestoneMutation,
  useDeleteProjectMilestoneMutation,
} from 'services/projects';
import { useUpdateProjectMilestoneMutation } from 'services/projects/update-project-milestone';

import { useContextStore } from 'store/global-context-provider';

export const MilestoneItem = observer(
  ({
    milestone,
    setEdit,
  }: {
    milestone: ProjectMilestoneType;
    setEdit: (milestone: ProjectMilestoneType) => void;
  }) => {
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    const { mutate: updateMilestone } = useUpdateProjectMilestoneMutation({});
    const { mutate: deleteMilestone } = useDeleteProjectMilestoneMutation({});

    const onChangeDate = (date: string) => {
      updateMilestone({
        projectMilestoneId: milestone.id,
        endDate: date,
        name: milestone.name,
      });
    };

    return (
      <div className="px-3">
        <div className="flex gap-2 items-center px-3 hover:bg-grayAlpha-100 py-2 rounded">
          <LabelLine size={18} className="flex-shrink-0" />
          <div className="grow">{milestone.name}</div>
          <ProjectDatePicker
            value={milestone.endDate}
            onChange={(date) => onChangeDate(date)}
            variant={ProjectDropdownVariant.NO_ICON}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="link"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <MoreLine size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setEdit(milestone)}>
                  <div className="flex items-center gap-1">
                    <EditLine size={16} /> Edit
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                  <div className="flex items-center gap-1">
                    <DeleteLine size={16} /> Remove
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {deleteOpen && (
          <AlertDialog open onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will project milestone from
                  the issues also.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteMilestone(milestone.id);
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    );
  },
);

export const CreateMilestone = ({
  onClose,
  milestone,
}: {
  milestone?: ProjectMilestoneType;
  onClose: () => void;
}) => {
  const [date, setDate] = React.useState<string | undefined>(
    milestone ? milestone.endDate : undefined,
  );
  const [input, setInput] = React.useState<string>(
    milestone ? milestone.name : '',
  );
  const project = useProject();
  const { mutate: createMilestone } = useCreateProjectMilestoneMutation({});
  const { mutate: updateMilestone } = useUpdateProjectMilestoneMutation({});

  const onSubmit = () => {
    if (milestone) {
      updateMilestone({
        projectMilestoneId: milestone.id,
        endDate: date,
        name: input,
      });
      onClose();
      return;
    }
    createMilestone({
      projectId: project.id,
      endDate: date,
      name: input,
    });
    onClose();
  };

  return (
    <div className="flex px-3 py-1 bg-grayAlpha-100 rounded items-center">
      <LabelLine size={16} className="flex-shrink-0" />
      <Input
        className="bg-transparent"
        placeholder="Milestone"
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
      />
      <ProjectDatePicker
        value={date}
        onChange={(date) => setDate(date)}
        variant={ProjectDropdownVariant.NO_ICON}
      />
      <Button variant="ghost" size="sm" className="px-1" onClick={onClose}>
        <CrossLine />
      </Button>
      <Button variant="ghost" size="sm" className="px-1" onClick={onSubmit}>
        <CheckLine />
      </Button>
    </div>
  );
};

export const Milestones = observer(() => {
  const [newMilestone, setNewMilestone] = React.useState(false);
  const [editMilestone, setEditMilestone] = React.useState<
    ProjectMilestoneType | undefined
  >();
  const { projectMilestonesStore } = useContextStore();
  const project = useProject();
  const milestones = projectMilestonesStore.getMilestonesForProject(project.id);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between px-6 items-center">
        <h3> Milestones</h3>
        <Button variant="ghost" size="sm" onClick={() => setNewMilestone(true)}>
          <AddLine size={14} />
        </Button>
      </div>

      {newMilestone && (
        <div className="px-6 mt-2">
          <CreateMilestone onClose={() => setNewMilestone(false)} />
        </div>
      )}

      <div className="flex flex-col mt-2">
        {milestones.map((milestone: ProjectMilestoneType) => {
          if (editMilestone && editMilestone.id === milestone.id) {
            return (
              <div key={milestone.id} className="px-3">
                <CreateMilestone
                  onClose={() => setEditMilestone(undefined)}
                  milestone={editMilestone}
                  key={milestone.id}
                />
              </div>
            );
          }

          return (
            <MilestoneItem
              milestone={milestone}
              key={milestone.id}
              setEdit={(milestone: ProjectMilestoneType) =>
                setEditMilestone(milestone)
              }
            />
          );
        })}
      </div>
    </div>
  );
});
