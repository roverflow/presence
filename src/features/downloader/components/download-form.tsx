"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createRecordSchema } from "@/features/tasks/schemas";
import { useWorkSpaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

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
import { useState } from "react";
import PDFTable from "./pdf-doc";
import { downloadTasks } from "@/features/tasks/api/use-download-task";

interface CreateTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string | undefined }[];
  memberOptions: { id: string; name: string }[];
}

export const DownloadForm = ({
  memberOptions,
  projectOptions,
}: CreateTaskFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<any>([]);

  const workspaceId = useWorkSpaceId();

  const form = useForm<z.infer<typeof createRecordSchema>>({
    resolver: zodResolver(createRecordSchema.partial()),
    defaultValues: {
      workspaceId,
    },
  });

  const onSubmit = async (values: z.infer<typeof createRecordSchema>) => {
    setIsLoading(true);
    const { data } = await downloadTasks(values);
    const final = (data.documents as any[]) ?? [];
    setIsLoading(false);
    console.log(final);
    setRecords(final);
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Download records</CardTitle>
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
            </div>
            <DottedSeperator className="py-7" />
            <div className="flex items-center gap-3">
              <Button type="submit" size={"lg"} disabled={isLoading}>
                Generate
              </Button>
              {records.length > 0 && (
                <div onClick={() => setRecords([])}>
                  <PDFTable data={records} />{" "}
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardContent></CardContent>
    </Card>
  );
};
