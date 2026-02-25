import { memo } from "react";
import {
  DOMAIN_B_TODO_FILTER_STATUS_VALUES,
  type DomainBTodoFilterStatus,
} from "@/features/domain-b/type";

interface TodoStatusFilterButtonGroupProps {
  statusFilter: DomainBTodoFilterStatus;
  onClick: (status: DomainBTodoFilterStatus) => void;
}

const FILTERS = DOMAIN_B_TODO_FILTER_STATUS_VALUES;

const TodoStatusFilterButtonGroupComponent = ({
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
            onClick={() => {
              onClick(status);
            }}
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

export const TodoStatusFilterButtonGroup = memo(TodoStatusFilterButtonGroupComponent);
