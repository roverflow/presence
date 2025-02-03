"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";

import { Task } from "@/features/tasks/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "@/features/tasks/components/task-date";
import { TaskActions } from "@/features/tasks/components/task-actions";

import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Task>[] = [
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
            name={project.name}
            image={project.imageUrl}
          />
          <p className="line-clamp-1 text-center">{project.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "week",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Week
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const week = row.original.week;

      return <span className="">{week}</span>;
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
            name={assignee.name}
          />
          <p className="line-clamp-1 text-center">{assignee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;

      return <TaskDate value={dueDate} />;
    },
  },
  {
    accessorKey: "inTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          In Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const inTime = row.original.inTime;

      return <span className="text-center">{inTime}</span>;
    },
  },
  {
    accessorKey: "outTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Out Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const outTime = row.original.outTime;

      return <span className="text-center">{outTime}</span>;
    },
  },
  {
    accessorKey: "break",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Break
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const breakTime = row.original.break;

      return <span className="text-center">{breakTime}</span>;
    },
  },
  {
    accessorKey: "hrsWorked",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hours Worked
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const hrsWorked = row.original.hrsWorked;

      return <span className="text-center">{hrsWorked}</span>;
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
        <TaskActions id={id} projectId={projectId}>
          <Button variant={"ghost"} className="size-8 p-0">
            <MoreVertical className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
