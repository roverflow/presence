import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import MembersList from "@/features/workspaces/components/members-list";
import DownloaderClient from "./client";

const WorkspaceIdMembersPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <DownloaderClient user={user} />;
};

export default WorkspaceIdMembersPage;
