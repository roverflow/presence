import { z } from "zod";

export const createAbsenceSchema = z.object({
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  assigneeId: z.string().trim().min(1, "Required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z.string().trim().min(1, "Required"),
});

export const createRecordSchema = z.object({
  projectId: z.string().trim().min(1, "Required"),
  week: z.coerce.number(),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "Required"),
  inTime: z.string().trim().min(1, "Required"),
  outTime: z.string().trim().min(1, "Required"),
  breakTime: z.string(),
  hrsWorked: z.number(),
  workspaceId: z.string().trim().min(1, "Required"),
});
