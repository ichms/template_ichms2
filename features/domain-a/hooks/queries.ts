import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { domainAQueryKeys } from "@/features/domain-a/queryKeys";
import { getDomainADetail, getDomainAList } from "@/features/domain-a/service";
import type { DomainAId, DomainAListParams } from "@/features/domain-a/type";

// Responsibility: Define domain-a useQuery hooks only.
const EMPTY_DETAIL_ID = "__empty__";

export const useDomainAListQuery = (params: DomainAListParams) => {
  const queryFn = () => {
    return getDomainAList(params);
  };

  return useQuery({
    queryKey: domainAQueryKeys.list(params),
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

export const useDomainADetailQuery = (id: DomainAId | null) => {
  const queryFn = () => {
    if (!id) {
      throw new Error("id is required");
    }
    return getDomainADetail(id);
  };

  return useQuery({
    queryKey: domainAQueryKeys.detail(id ?? EMPTY_DETAIL_ID),
    queryFn,
    enabled: Boolean(id),
    staleTime: 10_000,
  });
};
