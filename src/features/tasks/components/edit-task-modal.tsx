"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useEditTaskModal } from "@/features/tasks/hooks/use-edit-task-modal";
import { EditTaskFormWrapper } from "@/features/tasks/components/edit-task-form-wrapper";
import { EditAbsenceFormWrapper } from "./edit-absence-wrapper";

export const EditTaskModal = () => {
  const { taskId, isAbsence, close } = useEditTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && isAbsence !== "true" && (
        <EditTaskFormWrapper id={taskId} onCancel={close} />
      )}
      {taskId && isAbsence == "true" && (
        <EditAbsenceFormWrapper id={taskId} onCancel={close} />
      )}
    </ResponsiveModal>
  );
};
