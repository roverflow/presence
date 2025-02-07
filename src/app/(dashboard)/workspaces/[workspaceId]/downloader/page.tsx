import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import DownloaderClient from "./client";

const WorkspaceIdMembersPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <DownloaderClient user={user} />;
};

export default WorkspaceIdMembersPage;
