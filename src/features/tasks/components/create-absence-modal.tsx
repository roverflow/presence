"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { CreateAbsenceFormWrapper } from "./create-absence-form-wrapper";
import { useCreateAbsenceModal } from "../hooks/use-create-absence-modal";

export const CreateAbsenceModal = () => {
  const { isOpen, setIsOpen, closeAbsence } = useCreateAbsenceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateAbsenceFormWrapper onCancel={closeAbsence} />
    </ResponsiveModal>
  );
};
