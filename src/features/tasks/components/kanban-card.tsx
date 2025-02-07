import { MoreHorizontal } from "lucide-react";

import { Task } from "@/features/tasks/types";
import { TaskActions } from "@/features/tasks/components/task-actions";
import { TaskDate } from "@/features/tasks/components/task-date";
import { MemberAvatar } from "@/features/members/components/member-avatar";

import { DottedSeperator } from "@/components/dotted-seperator";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

interface KanbanCardProps {
    task: Task;
}

export const KanbanCard = ({
    task
}: KanbanCardProps) => {
    return (
        <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-x-2">
                <p className="text-sm line-clamp-2">{task.name}</p>
                <TaskActions id={task.$id} projectId={task.projectId}>
                    <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
                </TaskActions>
            </div>
            <DottedSeperator />
            <div className="flex items-center gap-x-1.5">
                <MemberAvatar 
                    name={task.assignee.name}
                    fallbackClassname="text-[10px]"
                />
                <div className="size-1 rounded-full bg-neutral-300" />
                <TaskDate value={task.dueDate} classname="text-xs" />
            </div>
            <div className="flex items-center gap-x-1.5">
                <ProjectAvatar 
                    name={task.project.name}
                    image={task.project.imageUrl}
                    fallbackClassname="text-[10px]"
                />
                <span className="text-xs font-medium">{task.project.name}</span>
            </div>
        </div>
    );
}