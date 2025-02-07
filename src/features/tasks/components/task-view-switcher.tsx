"use client";

import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useWorkSpaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { DataFilters } from "@/features/tasks/components/data-filters";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { DataTable } from "@/features/tasks/components/data-table";
import { columns } from "@/features/tasks/components/columns";
import { columnsAbsence } from "../absence/components/columns";
// import { DataKanban } from "@/features/tasks/components/data-kanban";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { DataCalendar } from "@/features/tasks/components/data-calendar";
import { useProjectId } from "@/features/projects/hooks/use-projectId";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DottedSeperator } from "@/components/dotted-seperator";
import { useCreateAbsenceModal } from "../hooks/use-create-absence-modal";
import { Absence } from "../absence/types";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  const [{ assigneeId, dueDate, projectId, week }] = useTaskFilters();

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  // const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const workspaceId = useWorkSpaceId();
  const paramProjectId = useProjectId();

  const { data: tasks, isLoading: isTasksLoading } = useGetTasks({
    workspaceId,
    assigneeId,
    dueDate,
    projectId: paramProjectId || projectId,
    week,
  });

  const { open } = useCreateTaskModal();
  const { openAbsence } = useCreateAbsenceModal();

  // const onKanbanChange = useCallback(
  //   (
  //     tasks: {
  //       $id: string;
  //       status: TaskStatus;
  //       position: number;
  //     }[]
  //   ) => {
  //     bulkUpdate({
  //       json: { tasks },
  //     });
  //   },
  //   [bulkUpdate]
  // );

  return (
    <Tabs
      onValueChange={setView}
      value={view}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4 bg-white rounded-md">
        <div className="tabs-switcher">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Records
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="absence">
              Absence
            </TabsTrigger>
            {/* <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger> */}
          </TabsList>
          <div className="flex gap-2">
            <Button onClick={open} size={"sm"} className="lg:w-auto w-full">
              <PlusIcon className="size-4 mr-2" />
              New Record
            </Button>
            <Button
              onClick={openAbsence}
              size={"sm"}
              className="lg:w-auto w-full"
            >
              <PlusIcon className="size-4 mr-2" />
              Add Absence
            </Button>
          </div>
        </div>
        <DottedSeperator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <DottedSeperator className="my-4" />
        {isTasksLoading ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="text-muted-foreground size-5 animate-spin" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>

            {/* <DataKanban
                onChange={onKanbanChange}
                data={tasks?.documents ?? []}
              /> */}
            <TabsContent value="absence" className="mt-0">
              <DataTable
                columns={columnsAbsence}
                data={(tasks?.absence as unknown as Absence[]) ?? []}
              />
            </TabsContent>

            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
