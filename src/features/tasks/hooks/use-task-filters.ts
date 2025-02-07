import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { TaskStatus } from "@/features/tasks/types";

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    week: parseAsString,
    assigneeId: parseAsString,
    dueDate: parseAsString,
    search: parseAsString,
  });
};
