import { z } from "zod";

export const createMemberSchema = z.object({
  workspaceId: z.string(),
  role: z.string().optional(),
  name: z.string(),
  // mailId: z.string(),
  jobTitle: z.string(),
  dept: z.string(),
  monthYear: z.string(),
  managerName: z.string().optional(),
});
