import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetMembersProps {
  workspaceId: string;
  dateToGet?: string | undefined;
  projectId?: string | undefined;
  enabled?: boolean;
}

export const useGetMembers = ({
  workspaceId,
  dateToGet = undefined,
  projectId = undefined,
  enabled = true,
}: useGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId, dateToGet, projectId],
    queryFn: async () => {
      if (!enabled) {
        return;
      }

      const response = await client.api.members.$get({
        query: { workspaceId, dateToGet, projectId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
