import type { MouseEvent } from "react";
import type { DomainBTodoId, DomainBTodoListParams } from "@/features/domain-b/type";
import { DomainTodoInfo } from "@/features/domain-b/components/elements/DomainB/DomainTodoInfo";
import { DomainTodoList } from "@/features/domain-b/components/elements/DomainB/DomainTodoList";

interface DomainBProps {
  listParams: DomainBTodoListParams;
  todoTitle: string;
  selectedTodoId: DomainBTodoId | null;
  onChangeTodoTitle: (nextTitle: string) => void;
  onSelectTodo: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const DomainB = ({
  listParams,
  todoTitle,
  selectedTodoId,
  onChangeTodoTitle,
  onSelectTodo,
}: DomainBProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DomainTodoList
        listParams={listParams}
        todoTitle={todoTitle}
        onChangeTodoTitle={onChangeTodoTitle}
        onSelectTodo={onSelectTodo}
      />
      <DomainTodoInfo selectedTodoId={selectedTodoId} />
    </div>
  );
};
