import type{ SubmitEvent, MouseEvent } from "react";
import { useCreateDomainBTodoMutation, useUpdateDomainBTodoStatusMutation } from "@/features/domain-b/hooks/mutations";
import { useDomainBTodoListQuery } from "@/features/domain-b/hooks/queries";
import type { DomainBTodoListParams, DomainBTodoStatus } from "@/features/domain-b/type";

interface DomainTodoListProps {
  listParams: DomainBTodoListParams;
  todoTitle: string;
  onChangeTodoTitle: (nextTitle: string) => void;
  onSelectTodo: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const DomainTodoList = ({
  listParams,
  todoTitle,
  onChangeTodoTitle,
  onSelectTodo,
}: DomainTodoListProps) => {
  const { isLoading, isError, isSuccess, data } = useDomainBTodoListQuery(listParams);
  const createTodoMutation = useCreateDomainBTodoMutation();
  const updateStatusMutation = useUpdateDomainBTodoStatusMutation();

  const getNextStatus = (status: DomainBTodoStatus): DomainBTodoStatus => {
    return status === "TODO" ? "DONE" : "TODO";
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = todoTitle.trim();
    if (!normalizedTitle) {
      return;
    }

    createTodoMutation.mutate(
      { title: normalizedTitle },
      {
        onSuccess: () => {
          onChangeTodoTitle("");
        },
      },
    );
  };

  const handleToggleStatusButtonClick = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    const targetId = event.currentTarget.value;
    const currentStatus = event.currentTarget.dataset.status;

    if (currentStatus !== "TODO" && currentStatus !== "DONE") {
      return;
    }

    updateStatusMutation.mutate({
      id: targetId,
      nextStatus: getNextStatus(currentStatus),
    });
  };

  return (
    <article className="rounded border border-slate-200 p-4">
      <h2 className="mb-3 text-lg font-medium">To-do List</h2>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={todoTitle}
          onChange={(event) => onChangeTodoTitle(event.currentTarget.value)}
          placeholder="Add a new to-do"
          className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={createTodoMutation.isPending}
          className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Add
        </button>
      </form>

      {isLoading && <p className="text-sm text-slate-500">Loading...</p>}
      {isError && <p className="text-sm text-red-600">Failed to load to-do list.</p>}
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
                  onClick={onSelectTodo}
                  className="text-left"
                >
                  <p className="text-sm font-medium">{item.title}</p>
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
