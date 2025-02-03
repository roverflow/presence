import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { CreateMemberModal } from "@/features/members/components/create-member-modal";

import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateAbsenceModal } from "@/features/tasks/components/create-absence-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <CreateMemberModal />
      <CreateAbsenceModal />
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 overflow-y-auto h-full invisible lg:visible w-0 lg:w-[264px]">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] h-full w-full">
          <Navbar />
          <div className="mx-auto h-full">
            <main className="h-full py-8 px-4 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
