import { useState } from "react";
import type { MouseEvent } from "react";
import type { DomainBTodoFilterStatus, DomainBTodoId } from "@/features/domain-b/type";
import {
  DomainB,
  TodoStatusFilterButtonGroup,
} from "@/features/domain-b/components/elements";

// Responsibility: UI rendering and user interactions for domain-b page.
const PAGE_SIZE = 8;

const DomainBPage = () => {
  const [statusFilter, setStatusFilter] = useState<DomainBTodoFilterStatus>("ALL");
  const [todoTitle, setTodoTitle] = useState("");
  const [selectedTodoId, setSelectedTodoId] = useState<DomainBTodoId | null>(null);

  const listParams = {
    page: 1,
    pageSize: PAGE_SIZE,
    status: statusFilter,
  };

  const handleStatusFilterButtonClick = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    const nextFilter = event.currentTarget.value as DomainBTodoFilterStatus;
    setStatusFilter(nextFilter);
  };

  const handleSelectTodoButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    const nextSelectedTodoId = event.currentTarget.value;
    setSelectedTodoId(nextSelectedTodoId);
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Domain B To-do</h1>
        <p className="text-sm text-slate-600">
          Create to-dos, filter by status, inspect detail, and toggle completion.
        </p>
      </header>

      <TodoStatusFilterButtonGroup
        statusFilter={statusFilter}
        onClick={handleStatusFilterButtonClick}
      />

      <DomainB
        listParams={listParams}
        todoTitle={todoTitle}
        selectedTodoId={selectedTodoId}
        onChangeTodoTitle={setTodoTitle}
        onSelectTodo={handleSelectTodoButtonClick}
      />
    </section>
  );
};

export default DomainBPage;
