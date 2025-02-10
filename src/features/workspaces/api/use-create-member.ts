import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["add"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["add"]["$post"]
>;

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["add"][
        "$post"
      ]({ json, param });

      if (!response.ok) {
        throw new Error("Failed to create member");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Member added");

      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      const url = new URL(window.location.href);
      url.searchParams.delete("create-member");
      window.history.replaceState({}, document.title, url.toString());
      window.location.reload();
    },
    onError: () => {
      toast.error("Failed to create member");
    },
  });

  return mutation;
};
