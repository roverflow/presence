import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnalyticsCard } from "@/components/analytics-card";

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  if (!data) return null;

  return (
    <ScrollArea className="rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row gap-2">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total Records"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.taskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
