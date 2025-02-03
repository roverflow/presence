import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetTaskProps {
  taskId: string;
  isAbsence?: boolean;
}

export const useGetTask = ({ taskId, isAbsence = false }: useGetTaskProps) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"].$get({
        param: { taskId },
        query: { isAbsence: isAbsence ? "true" : "false" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
