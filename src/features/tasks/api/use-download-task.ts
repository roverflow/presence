import { client } from "@/lib/rpc";
import { toast } from "sonner";

export const downloadTasks = async (query: any) => {
  try {
    const response = await client.api.tasks.$get({ query });

    if (!response.ok) {
      throw new Error("Failed to download tasks");
    }

    const final = await response.json();
    console.log(final);
    toast.success("Download started");
    return final;
  } catch (error) {
    toast.error("Failed to download");
    throw error;
  }
};
