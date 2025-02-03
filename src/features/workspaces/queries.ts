import { Query } from "node-appwrite";

import { envKeys } from "@/lib/env";
import { createSessionClient } from "@/lib/appwrite";

export const getWorkspaces = async () => {
  const { account, databases } = await createSessionClient();

  const user = await account.get();
  console.log("user", user);

  const members = await databases.listDocuments(
    envKeys.appwriteDatabaseId,
    envKeys.appwriteCollectionMembersId,
    [Query.equal("userId", user.$id)]
  );

  console.log("members", members);

  if (members.total == 0) {
    return { documents: [], total: 0 };
  }

  const workspaceIds = members.documents.map((member) => member.workspaceId);

  const workspaces = await databases.listDocuments(
    envKeys.appwriteDatabaseId,
    envKeys.appwriteCollectionWorkspacesId,
    [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
  );

  return workspaces;
};
