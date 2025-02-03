import { Models } from "node-appwrite";

export type Absence = Models.Document & {
  projectId: string;
  assigneeId: string;
  workspaceId: string;
  name: string;
  startDate: string;
  endDate: string;
  reason: string;
};
