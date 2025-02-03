"use client";

import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useWorkSpaceId } from "@/features/workspaces/hooks/useWorkspaceId";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DottedSeperator } from "@/components/dotted-seperator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { createMemberSchema } from "../schemas";
import { MemberRole } from "../types";
import { useCreateMember } from "@/features/workspaces/api/use-create-member";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export const CreateMemberModalForm = ({ onCancel }: CreateProjectFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkSpaceId();
  const { mutate, isPending } = useCreateMember();

  const form = useForm<z.infer<typeof createMemberSchema>>({
    resolver: zodResolver(
      createMemberSchema.omit({ workspaceId: true, role: true })
    ),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createMemberSchema>) => {
    const finalValues = {
      ...values,
      workspaceId,
      role: MemberRole.MEMBER,
    };
    mutate(
      { json: finalValues, param: { workspaceId } },
      {
        onSuccess: () => {
          form.reset();
          router.push(`/workspaces/${workspaceId}/members`);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Add new Member</CardTitle>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter job title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dept"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter department" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month and Year</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter month and year" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="managerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter manager name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                Add Member
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
