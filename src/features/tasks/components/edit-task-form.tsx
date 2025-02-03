"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createRecordSchema } from "@/features/tasks/schemas";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Task } from "@/features/tasks/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useUpdateTask } from "@/features/tasks/api/use-update-task";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DottedSeperator } from "@/components/dotted-seperator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker";

import { cn } from "@/lib/utils";
import { calculateHrsWorked } from "../utils";
import { Absence } from "../absence/types";

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string | undefined }[];
  memberOptions: { id: string; name: string }[];
  initialValues: Task | Absence;
}

export const EditTaskForm = ({
  onCancel,
  memberOptions,
  projectOptions,
  initialValues,
}: EditTaskFormProps) => {
  // make sure type is Task for this component

  const { mutate, isPending } = useUpdateTask({
    isAbsence: false,
  });

  const transformInitialValues = (initialValues: Task | Absence) => {
    const { break: breakTime, ...rest } = initialValues;
    return { ...rest, breakTime };
  };

  const initialData = transformInitialValues(initialValues);

  const form = useForm<z.infer<typeof createRecordSchema>>({
    resolver: zodResolver(
      createRecordSchema.omit({ workspaceId: true, hrsWorked: true })
    ),
    defaultValues: {
      ...initialData,
      dueDate:
        "dueDate" in initialData ? new Date(initialData.dueDate) : undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof createRecordSchema>) => {
    const final = {
      ...values,
      hrsWorked: calculateHrsWorked(
        values.inTime,
        values.outTime,
        values.breakTime
      ),
    };
    mutate(
      { json: final, param: { taskId: initialData.$id } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit a Record</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeperator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Week</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" max={24} min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Name" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />

                      <SelectContent>
                        {memberOptions.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar
                                className="size-6"
                                name={member.name}
                              />
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record Project</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Project" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />

                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-x-2">
                              <ProjectAvatar
                                className="size-6"
                                name={project.name}
                                image={project.imageUrl}
                              />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className="flex w-full gap-4">
                <FormField
                  control={form.control}
                  name="inTime"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>In Time (24 Hour)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          pattern="^\d{1,2}:\d{2}$"
                          maxLength={5}
                          placeholder="08:30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="outTime"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Out Time (24 Hour)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          pattern="^\d{1,2}:\d{2}$"
                          maxLength={5}
                          placeholder="19:30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="breakTime"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Break (HH:MM)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          pattern="^\d{1,2}:\d{2}$"
                          maxLength={5}
                          placeholder="1:30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DottedSeperator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size={"lg"}
                variant={"secondary"}
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" size={"lg"} disabled={isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
