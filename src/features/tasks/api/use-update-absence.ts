import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["abs"][":taskIdabs"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["abs"][":taskIdabs"]["$patch"]
>;

export const useUpdateAbsence = ({ isAbsence }: { isAbsence?: boolean }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks["abs"][":taskIdabs"]["$patch"]({
        json,
        param,
      });

      if (isAbsence) {
        console.log("isAbsence is true");
      }

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task updated");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: () => {
      toast.error("Failed to updated task");
    },
  });

  return mutation;
};
