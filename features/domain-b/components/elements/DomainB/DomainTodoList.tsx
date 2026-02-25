import { memo, useCallback } from "react";
import type { SubmitEvent, ChangeEvent } from "react";
import { useCreateDomainBTodoMutation, useUpdateDomainBTodoStatusMutation } from "@/features/domain-b/hooks/mutations";
import { useDomainBTodoListQuery } from "@/features/domain-b/hooks/queries";
import {
  DOMAIN_B_TODO_STATUS,
  type DomainBTodoId,
  type DomainBTodoListParams,
  type DomainBTodoStatus,
} from "@/features/domain-b/type";

interface DomainTodoListProps {
  listParams: DomainBTodoListParams;
  todoTitle: string;
  onChangeTodoTitle: (nextTitle: string) => void;
  onSelectTodo: (todoId: DomainBTodoId) => void;
}

const DomainTodoListComponent = ({
  listParams,
  todoTitle,
  onChangeTodoTitle,
  onSelectTodo,
}: DomainTodoListProps) => {
  const { isLoading, isError, isSuccess, data } = useDomainBTodoListQuery(listParams);
  const createTodoMutation = useCreateDomainBTodoMutation();
  const updateStatusMutation = useUpdateDomainBTodoStatusMutation();

  const getNextStatus = useCallback((status: DomainBTodoStatus): DomainBTodoStatus => {
    return status === DOMAIN_B_TODO_STATUS.TODO
      ? DOMAIN_B_TODO_STATUS.DONE
      : DOMAIN_B_TODO_STATUS.TODO;
  }, []);

  const handleSubmit = useCallback((event: SubmitEvent<HTMLFormElement>) => {
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
  }, [createTodoMutation, onChangeTodoTitle, todoTitle]);

  const handleToggleStatusButtonClick = useCallback((
    targetId: DomainBTodoId,
    currentStatus: DomainBTodoStatus,
  ) => {
    updateStatusMutation.mutate({
      id: targetId,
      nextStatus: getNextStatus(currentStatus),
    });
  }, [getNextStatus, updateStatusMutation]);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChangeTodoTitle(event.currentTarget.value);
  }, [onChangeTodoTitle]);

  return (
    <article className="rounded border border-slate-200 p-4">
      <h2 className="mb-3 text-lg font-medium">To-do List</h2>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={todoTitle}
          onChange={handleInputChange}
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
                  onClick={() => {
                    onSelectTodo(item.id);
                  }}
                  className="text-left"
                >
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.status}</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleToggleStatusButtonClick(item.id, item.status);
                  }}
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

export const DomainTodoList = memo(DomainTodoListComponent);
