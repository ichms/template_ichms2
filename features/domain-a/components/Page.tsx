import { useState } from "react";
import type { MouseEvent } from "react";
import type { DomainAFilterStatus } from "@/features/domain-a/type";
import {
  DomainA,
  StautsFilterButtonGroup,
} from "@/features/domain-a/components/elements";

// Responsibility: UI rendering and user interactions for domain-a page.
const PAGE_SIZE = 6;

const DomainAPage = () => {
  const [statusFilter, setStatusFilter] = useState<DomainAFilterStatus>("ALL");

  const listParams = {
    page: 1,
    pageSize: PAGE_SIZE,
    status: statusFilter,
  };

  const handleStatusFilterButtonClick = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    const nextFilter = event.currentTarget.value as DomainAFilterStatus;
    setStatusFilter(nextFilter);
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Domain A</h1>
        <p className="text-sm text-slate-600">
          List and detail queries are separated from UI. Mutation invalidates
          list and selected detail.
        </p>
      </header>

      <StautsFilterButtonGroup
        onClick={handleStatusFilterButtonClick}
        statusFilter={statusFilter}
      />
      <DomainA listParams={listParams} />
    </section>
  );
};

export default DomainAPage;
