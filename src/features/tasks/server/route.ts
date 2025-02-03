import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";
import { envKeys } from "@/lib/env";
import { createAdminClient } from "@/lib/appwrite";

import {
  createAbsenceSchema,
  createRecordSchema,
} from "@/features/tasks/schemas";
import { getMember } from "@/features/members/utils";
import { Task, TaskStatus } from "@/features/tasks/types";
import { Project } from "@/features/projects/types";
import { MemberRole } from "@/features/members/types";
import { Absence } from "../absence/types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        dueDate: z.string().nullish(),
        search: z.string().nullish(),
        week: z.number().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");

      const { assigneeId, dueDate, projectId, workspaceId, search } =
        c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      const absenceQuery = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        query.push(Query.equal("projectId", projectId));
        absenceQuery.push(Query.equal("projectId", projectId));
      }

      if (assigneeId) {
        query.push(Query.equal("assigneeId", assigneeId));
        absenceQuery.push(Query.equal("assigneeId", assigneeId));
      }

      if (dueDate) {
        query.push(Query.equal("dueDate", dueDate));
        absenceQuery.push(Query.equal("startDate", dueDate));
      }

      if (search) {
        query.push(Query.search("name", search));
      }

      const tasks = await databases.listDocuments<Task>(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionTasksId,
        query
      );

      const absence = await databases.listDocuments(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionAbsenceId,
        absenceQuery
      );

      const absAssiIds = absence.documents.map((abs) => abs.assigneeId);

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionProjectsId,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      const members = await databases.listDocuments(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionMembersId,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const absenceMembers = await databases.listDocuments(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionMembersId,
        absAssiIds.length > 0 ? [Query.contains("$id", absAssiIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          if (member.role === MemberRole.ADMIN) {
            const user = await users.get(member.userId);
            return {
              ...member,
              name: user.name || user.email.split("@")[0] || user.email,
              email: user.email,
            };
          } else {
            return {
              ...member,
            };
          }
        })
      );

      const assigneesAbs = await Promise.all(
        absenceMembers.documents.map(async (member) => {
          if (member.role === MemberRole.ADMIN) {
            const user = await users.get(member.userId);
            return {
              ...member,
              name: user.name || user.email.split("@")[0] || user.email,
              email: user.email,
            };
          } else {
            return {
              ...member,
            };
          }
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );

        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );
        return {
          ...task,
          project,
          assignee,
        };
      });

      const populatedAbsence = absence.documents.map((abs) => {
        const project = projects.documents.find(
          (project) => project.$id === abs.projectId
        );

        const assignee = assigneesAbs.find(
          (assignee) => assignee.$id === abs.assigneeId
        );
        return {
          ...abs,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
          absence: populatedAbsence,
        },
      });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createRecordSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const {
        assigneeId,
        breakTime,
        dueDate,
        projectId,
        workspaceId,
        inTime,
        outTime,
        hrsWorked,
        week,
      } = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const highestPositionTask = await databases.listDocuments(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionTasksId,
        [
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionTasksId,
        ID.unique(),
        {
          break: breakTime,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          position: newPosition,
          inTime,
          outTime,
          hrsWorked,
          week,
        }
      );

      return c.json({ data: task });
    }
  )
  .delete(
    "/:taskId",
    sessionMiddleware,
    zValidator("query", z.object({ isAbsence: z.string().optional() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { taskId } = c.req.param();

      const { isAbsence } = c.req.valid("query");
      const actualAbs = isAbsence === "true";

      if (actualAbs) {
        console.log("Deleting absence");
        await databases.deleteDocument(
          envKeys.appwriteDatabaseId,
          envKeys.appwriteCollectionAbsenceId,
          taskId
        );

        return c.json({ data: { $id: taskId } });
      }

      const task = await databases.getDocument<Task>(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionTasksId,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await databases.deleteDocument(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionTasksId,
        taskId
      );

      return c.json({ data: { $id: task.$id } });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createRecordSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const {
        assigneeId,
        breakTime,
        dueDate,
        projectId,
        workspaceId,
        inTime,
        outTime,
        hrsWorked,
        week,
      } = c.req.valid("json");
      const { taskId } = c.req.param();

      const existingTask = await databases.getDocument<Task>(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionTasksId,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionTasksId,
        taskId,
        {
          break: breakTime,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          inTime,
          outTime,
          hrsWorked,
          week,
        }
      );

      return c.json({ data: task });
    }
  )
  .patch(
    "/abs/:taskIdabs",
    sessionMiddleware,
    zValidator("json", createAbsenceSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { assigneeId, projectId, workspaceId, startDate, endDate, reason } =
        c.req.valid("json");
      const { taskIdabs } = c.req.param();
      const existingTask = await databases.getDocument<Task>(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionAbsenceId,
        taskIdabs
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionAbsenceId,
        taskIdabs,
        {
          workspaceId,
          projectId,
          assigneeId,
          startDate,
          endDate,
          reason,
        }
      );

      return c.json({ data: task });
    }
  )
  .get(
    "/:taskId",
    sessionMiddleware,
    zValidator("query", z.object({ isAbsence: z.string().optional() })),
    async (c) => {
      const { taskId } = c.req.param();

      const databases = c.get("databases");
      const currentUser = c.get("user");

      const { isAbsence } = c.req.valid("query");
      const actualAbs = isAbsence === "true";

      const { users } = await createAdminClient();
      const task = await databases.getDocument<Task | Absence>(
        envKeys.appwriteDatabaseId,
        actualAbs
          ? envKeys.appwriteCollectionAbsenceId
          : envKeys.appwriteCollectionTasksId,
        taskId
      );

      const currentMember = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: currentUser.$id,
      });

      if (!currentMember) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const project = await databases.getDocument<Project>(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionProjectsId,
        task.projectId
      );

      const member = await databases.getDocument(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionMembersId,
        task.assigneeId
      );

      let assignee = {};
      if (member.role == MemberRole.ADMIN) {
        const user = await users.get(member.userId);
        assignee = {
          ...member,
          name: user.name || user.email.split("@")[0] || user.email,
          email: user.email,
        };
      } else {
        assignee = {
          ...member,
        };
      }

      return c.json({
        data: {
          ...task,
          project,
          assignee,
        },
      });
    }
  )
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { tasks } = await c.req.valid("json");

      const tasksToUpdate = await databases.listDocuments<Task>(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionTasksId,
        [
          Query.contains(
            "$id",
            tasks.map((task) => task.$id)
          ),
        ]
      );

      const workSpaceIds = new Set(
        tasksToUpdate.documents.map((task) => task.workspaceId)
      );

      if (workSpaceIds.size !== 1) {
        return c.json(
          { error: "All task must belong to the same workspace" },
          400
        );
      }

      const workspaceId = workSpaceIds.values().next().value;

      if (!workspaceId) {
        return c.json({ error: "No workspace found" }, 400);
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map((task) => {
          const { $id, status, position } = task;

          return databases.updateDocument<Task>(
            envKeys.appwriteDatabaseId,
            envKeys.appwriteCollectionTasksId,
            $id,
            {
              status,
              position,
            }
          );
        })
      );

      return c.json({ data: updatedTasks });
    }
  )
  .post(
    "/absence",
    sessionMiddleware,
    zValidator("json", createAbsenceSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { assigneeId, projectId, workspaceId, startDate, endDate, reason } =
        c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.createDocument(
        envKeys.appwriteDatabaseId,
        envKeys.appwriteCollectionAbsenceId,
        ID.unique(),
        {
          workspaceId,
          projectId,
          startDate,
          assigneeId,
          endDate,
          reason,
        }
      );

      return c.json({ data: task });
    }
  );

export default app;
