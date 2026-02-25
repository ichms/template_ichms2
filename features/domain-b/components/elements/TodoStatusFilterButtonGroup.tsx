import type { MouseEvent } from "react";
import type { DomainBTodoFilterStatus } from "@/features/domain-b/type";

interface TodoStatusFilterButtonGroupProps {
  statusFilter: DomainBTodoFilterStatus;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const FILTERS: DomainBTodoFilterStatus[] = ["ALL", "TODO", "DONE"];

export const TodoStatusFilterButtonGroup = ({
  statusFilter,
  onClick,
}: TodoStatusFilterButtonGroupProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((status) => {
        const isActive = statusFilter === status;
        return (
          <button
            key={status}
            type="button"
            value={status}
            onClick={onClick}
            className={`rounded border px-3 py-1 text-sm ${
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 text-slate-700"
            }`}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
};
