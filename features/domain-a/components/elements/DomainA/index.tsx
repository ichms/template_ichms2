import { useState } from "react";
import type { MouseEvent } from "react";

import type { DomainAId, DomainAListParams } from "@/features/domain-a/type";

import { DomainInfo } from "./DomainInfo";
import { DomainList } from "./DomainList";

interface DomainAProps {
  listParams: DomainAListParams;
}
export const DomainA = ({ listParams }: DomainAProps) => {
  const [selectedId, setSelectedId] = useState<DomainAId | null>(null);

  const handleSelectItemButtonClick = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    const nextSelectedId = event.currentTarget.value;
    setSelectedId(nextSelectedId);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DomainList
        onChangeSelectedId={handleSelectItemButtonClick}
        listParams={listParams}
      />
      <DomainInfo selectedId={selectedId} />
    </div>
  );
};
