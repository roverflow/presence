"use client";

import Link from "next/link";
import { PlusIcon, SettingsIcon } from "lucide-react";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useWorkSpaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { Project } from "@/features/projects/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Member } from "@/features/members/types";
import { MemberAvatar } from "@/features/members/components/member-avatar";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
// import { Analytics } from "@/components/analytics";
import { Button } from "@/components/ui/button";
import { DottedSeperator } from "@/components/dotted-seperator";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateMemberModel } from "@/features/members/hooks/use-create-member-modal";

export const WorkSpaceIdClient = () => {
  const workspaceId = useWorkSpaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading = isLoadingMembers || isLoadingProjects;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!projects || !members) {
    return <PageError message="Failed to load workspace data" />;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
        <ProjectList
          data={projects.documents}
          total={projects.total}
          workspaceId={workspaceId}
        />
        <MemberList
          data={members.documents}
          total={projects.total}
          workspaceId={workspaceId}
        />
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
  workspaceId: string;
}

export const ProjectList = ({ data, total, workspaceId }: ProjectListProps) => {
  const { open: createProject } = useCreateProjectModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4 h-full">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Record Projects ({total})</p>
          <Button variant={"secondary"} size={"icon"} onClick={createProject}>
            <PlusIcon className="text-neutral-400 size-4" />
          </Button>
        </div>
        <DottedSeperator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 items-center flex gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-12"
                      fallbackClassname="text-lg"
                    />
                    <p className="text-lg truncate font-medium">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No Record Projects found
          </p>
        )}
      </div>
    </div>
  );
};

interface MemberListProps {
  data: Member[];
  total: number;
  workspaceId: string;
}

export const MemberList = ({ data, total, workspaceId }: MemberListProps) => {
  const { open: createMember } = useCreateMemberModel();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <div className="flex gap-x-2">
            <Button variant={"secondary"} size={"icon"} onClick={createMember}>
              <PlusIcon className="text-neutral-400 size-4" />
            </Button>
            <Button asChild variant={"secondary"} size={"icon"}>
              <Link href={`/workspaces/${workspaceId}/members`}>
                <SettingsIcon className="text-neutral-400 size-4" />
              </Link>
            </Button>
          </div>
        </div>
        <DottedSeperator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 items-center flex flex-col gap-x-2">
                  <MemberAvatar name={member.name} className="size-12" />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg line-clamp-1 font-medium">
                      {member.name}
                    </p>
                    <p className="text-sm truncate line-clamp-1 text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Members found
          </li>
        </ul>
      </div>
    </div>
  );
};
