import type { MouseEvent } from "react";
import type { DomainAFilterStatus } from "@/features/domain-a/type";

interface StautsFilterButtonGroupProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  statusFilter: DomainAFilterStatus;
}
export const StautsFilterButtonGroup = ({
  onClick,
  statusFilter,
}: StautsFilterButtonGroupProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Status Filter:</span>
      {STATUS_FILTER_OPTIONS.map((option) => {
        return (
          <button
            key={option}
            type="button"
            value={option}
            onClick={onClick}
            className={`rounded border px-3 py-1 text-sm ${
              statusFilter === option
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

const STATUS_FILTER_OPTIONS: readonly DomainAFilterStatus[] = [
  "ALL",
  "ACTIVE",
  "INACTIVE",
];
