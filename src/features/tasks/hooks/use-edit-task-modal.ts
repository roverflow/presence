import { useQueryState, parseAsString } from "nuqs";

export const useEditTaskModal = () => {
  const [taskId, setTaskId] = useQueryState("edit-task", parseAsString);
  const [isAbsence, setIsAbsence] = useQueryState("is-absence", parseAsString);

  const open = (id: string, isAbsence?: boolean) => {
    setTaskId(id);
    if (isAbsence) {
      setIsAbsence("true");
    } else {
      setIsAbsence("false");
    }
  };
  const close = () => setTaskId(null);

  return {
    taskId,
    isAbsence,
    open,
    close,
    setTaskId,
  };
};
