import { PencilIcon, TrashIcon } from "lucide-react";

import { useDeleteTask } from "@/features/tasks/api/use-delete-task";
import { useEditTaskModal } from "@/features/tasks/hooks/use-edit-task-modal";

import { useConfirm } from "@/hooks/use-confirm";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface taskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
  isAbsence?: boolean;
}

export const TaskActions = ({
  children,
  id,
  isAbsence = false,
}: taskActionsProps) => {
  const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();

  const { ConfirmationDialog: DeleteTaskDialog, confirm: confirmDeleteTask } =
    useConfirm("Delete task", "This action cannot be undone", "destructive");

  const { open } = useEditTaskModal();

  const onDelete = async () => {
    const ok = await confirmDeleteTask();
    if (!ok) return;

    deleteTask({
      param: { taskId: id },
      query: {
        isAbsence: String(isAbsence),
      },
    });
  };

  return (
    <div className="flex justify-end">
      <DeleteTaskDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => {
              open(id, isAbsence);
            }}
            disabled={false}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit {isAbsence ? "Absence" : "Record"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isDeletingTask}
            className="font-medium p-[10px] text-amber-700 focus:text-amber-700"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete {isAbsence ? "Absence" : "Record"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
