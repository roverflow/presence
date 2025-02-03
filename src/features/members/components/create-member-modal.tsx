"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { useCreateMemberModel } from "../hooks/use-create-member-modal";
import { CreateMemberModalForm } from "./create-member-form";

export const CreateMemberModal = () => {
  const { isOpen, setIsOpen, close } = useCreateMemberModel();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateMemberModalForm onCancel={close} />
    </ResponsiveModal>
  );
};
