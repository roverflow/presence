import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateAbsenceModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-absence",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const openAbsence = () => setIsOpen(true);
  const closeAbsence = () => setIsOpen(false);

  return {
    isOpen,
    openAbsence,
    closeAbsence,
    setIsOpen,
  };
};
