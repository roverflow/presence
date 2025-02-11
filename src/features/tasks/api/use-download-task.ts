import { client } from "@/lib/rpc";
import { toast } from "sonner";

export const downloadTasks = async (query: any) => {
  try {
    const response = await client.api.tasks.$get({
      query: { ...query, isAbsence: false },
    });

    if (!response.ok) {
      throw new Error("Failed to download tasks");
    }

    const final = await response.json();

    if (final && final.data.total === 0) {
      toast.error("No records found for the selected filters");
    } else {
      toast.success("Successfully fetched records");
    }

    return final;
  } catch (error) {
    toast.error("Failed to download");
    console.error(error);
    return {
      data: {
        documents: [],
        absence: [],
        total: 0,
      },
    };
  }
};
