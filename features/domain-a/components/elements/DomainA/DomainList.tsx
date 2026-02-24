import type { MouseEvent } from "react";

import { useUpdateDomainAStatusMutation } from "@/features/domain-a/hooks/mutations";
import { useDomainAListQuery } from "@/features/domain-a/hooks/queries";
import { DomainAListParams, DomainAStatus } from "@/features/domain-a/type";

interface DomainListProps {
  listParams: DomainAListParams;
  onChangeSelectedId: (event: MouseEvent<HTMLButtonElement>) => void;
}
export const DomainList = ({
  listParams,
  onChangeSelectedId,
}: DomainListProps) => {
  const { isLoading, isError, data, isSuccess } =
    useDomainAListQuery(listParams);
  const updateStatusMutation = useUpdateDomainAStatusMutation();

  const getNextStatus = (status: DomainAStatus): DomainAStatus => {
    return status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  };

  const handleToggleStatusButtonClick = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    const targetId = event.currentTarget.value;
    const currentStatus = event.currentTarget.dataset.status;

    if (currentStatus !== "ACTIVE" && currentStatus !== "INACTIVE") {
      return;
    }
    updateStatusMutation.mutate({
      id: targetId,
      nextStatus: getNextStatus(currentStatus),
    });
  };

  return (
    <article className="rounded border border-slate-200 p-4">
      <h2 className="mb-3 text-lg font-medium">List</h2>
      {isLoading && <p className="text-sm text-slate-500">Loading...</p>}
      {isError && <p className="text-sm text-red-600">Failed to load list.</p>}
      {isSuccess && (
        <ul className="space-y-2">
          {data.items.map((item) => {
            return (
              <li
                key={item.id}
                className="flex items-center justify-between rounded border border-slate-200 p-2"
              >
                <button
                  type="button"
                  value={item.id}
                  onClick={onChangeSelectedId}
                  className="text-left"
                >
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.status}</p>
                </button>
                <button
                  type="button"
                  value={item.id}
                  data-status={item.status}
                  onClick={handleToggleStatusButtonClick}
                  disabled={updateStatusMutation.isPending}
                  className="rounded border border-slate-300 px-2 py-1 text-xs"
                >
                  Toggle
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
};
