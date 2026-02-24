import { useDomainADetailQuery } from "@/features/domain-a/hooks/queries";
import type { DomainAId } from "@/features/domain-a/type";

interface DomainInfoProps {
  selectedId: DomainAId | null;
}
export const DomainInfo = ({ selectedId }: DomainInfoProps) => {
  const detailQuery = useDomainADetailQuery(selectedId);
  return (
    <article className="rounded border border-slate-200 p-4">
      <h2 className="mb-3 text-lg font-medium">Detail</h2>
      {!selectedId && (
        <p className="text-sm text-slate-500">Select an item from the list.</p>
      )}
      {selectedId && detailQuery.isLoading && (
        <p className="text-sm text-slate-500">Loading detail...</p>
      )}
      {selectedId && detailQuery.isError && (
        <p className="text-sm text-red-600">Failed to load detail.</p>
      )}
      {selectedId && detailQuery.data?.item && (
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-slate-500">ID</dt>
            <dd className="font-medium">{detailQuery.data.item.id}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Name</dt>
            <dd className="font-medium">{detailQuery.data.item.name}</dd>
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
