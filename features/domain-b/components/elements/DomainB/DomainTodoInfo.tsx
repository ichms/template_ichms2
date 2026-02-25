import { useDomainBTodoDetailQuery } from "@/features/domain-b/hooks/queries";
import type { DomainBTodoId } from "@/features/domain-b/type";

interface DomainTodoInfoProps {
  selectedTodoId: DomainBTodoId | null;
}

export const DomainTodoInfo = ({ selectedTodoId }: DomainTodoInfoProps) => {
  const detailQuery = useDomainBTodoDetailQuery(selectedTodoId);

  return (
    <article className="rounded border border-slate-200 p-4">
      <h2 className="mb-3 text-lg font-medium">To-do Detail</h2>

      {!selectedTodoId && (
        <p className="text-sm text-slate-500">Select a to-do item from the list.</p>
      )}

      {selectedTodoId && detailQuery.isLoading && (
        <p className="text-sm text-slate-500">Loading detail...</p>
      )}

      {selectedTodoId && detailQuery.isError && (
        <p className="text-sm text-red-600">Failed to load detail.</p>
      )}

      {selectedTodoId && detailQuery.data?.item && (
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-slate-500">ID</dt>
            <dd className="font-medium">{detailQuery.data.item.id}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Title</dt>
            <dd className="font-medium">{detailQuery.data.item.title}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Status</dt>
            <dd className="font-medium">{detailQuery.data.item.status}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Updated At</dt>
            <dd className="font-medium">{detailQuery.data.item.updatedAt}</dd>
          </div>
        </dl>
      )}
    </article>
  );
};
