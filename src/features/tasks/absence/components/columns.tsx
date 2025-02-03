"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";

import { Absence } from "../types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "@/features/tasks/components/task-date";
import { TaskActions } from "@/features/tasks/components/task-actions";

import { Button } from "@/components/ui/button";

export const columnsAbsence: ColumnDef<Absence>[] = [
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Term
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium justify-center">
          <ProjectAvatar
            className="size-6"
            name={project?.name ?? "Error"}
            image={project?.imageUrl}
          />
          <p className="line-clamp-1 text-center">{project?.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;

      return (
        <div className="flex items-center justify-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            className="size-6"
            fallbackClassname="text-xs"
            name={assignee?.name ?? "Error"}
          />
          {assignee && (
            <p className="line-clamp-1 text-center">{assignee.name}</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const startDate = row.original.startDate;

      return <TaskDate value={startDate} />;
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const endDate = row.original.endDate;

      return <TaskDate value={endDate} />;
    },
  },
  {
    accessorKey: "reason",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reason
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const reason = row.original.reason;

      return <span className="text-center">{reason}</span>;
    },
  },
  {
    id: "actions",
    header: () => {
      return <span className="text-center">Actions</span>;
    },
    cell: ({ row }) => {
      const id = row.original.$id;
      const projectId = row.original.projectId;

      return (
        <TaskActions id={id} projectId={projectId} isAbsence={true}>
          <Button variant={"ghost"} className="size-8 p-0">
            <MoreVertical className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
