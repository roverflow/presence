import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["absence"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["absence"]["$post"]
>;

export const useCreateAbsence = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["absence"]["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to Absence");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Absence added");
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to create absence");
    },
  });

  return mutation;
};
