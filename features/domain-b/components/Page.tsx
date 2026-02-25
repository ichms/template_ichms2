import { useCallback, useState } from "react";
import {
  DOMAIN_B_TODO_FILTER_STATUS,
  type DomainBTodoFilterStatus,
  type DomainBTodoId,
} from "@/features/domain-b/type";
import { DomainB } from "@/features/domain-b/components/elements/DomainB";
import { TodoStatusFilterButtonGroup } from "@/features/domain-b/components/elements/TodoStatusFilterButtonGroup";

// Responsibility: UI rendering and user interactions for domain-b page.
const PAGE_SIZE = 8;

const DomainBPage = () => {
  const [statusFilter, setStatusFilter] = useState<DomainBTodoFilterStatus>(
    DOMAIN_B_TODO_FILTER_STATUS.ALL,
  );
  const [todoTitle, setTodoTitle] = useState("");
  const [selectedTodoId, setSelectedTodoId] = useState<DomainBTodoId | null>(null);

  const listParams = {
    page: 1,
    pageSize: PAGE_SIZE,
    status: statusFilter,
  };

  const handleStatusFilterButtonClick = useCallback((nextFilter: DomainBTodoFilterStatus) => {
    setStatusFilter(nextFilter);
  }, []);

  const handleSelectTodoButtonClick = useCallback((nextSelectedTodoId: DomainBTodoId) => {
    setSelectedTodoId(nextSelectedTodoId);
  }, []);

  const handleTodoTitleChange = useCallback((nextTitle: string) => {
    setTodoTitle(nextTitle);
  }, []);

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
        onChangeTodoTitle={handleTodoTitleChange}
        onSelectTodo={handleSelectTodoButtonClick}
      />
    </section>
  );
};

export default DomainBPage;
