import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { domainBQueryKeys } from "@/features/domain-b/queryKeys";
import { getDomainBTodoDetail, getDomainBTodoList } from "@/features/domain-b/service";
import type { DomainBTodoId, DomainBTodoListParams } from "@/features/domain-b/type";

// Responsibility: Define domain-b useQuery hooks only.
const EMPTY_DETAIL_ID = "__empty__";

export const useDomainBTodoListQuery = (params: DomainBTodoListParams) => {
  const queryFn = () => {
    return getDomainBTodoList(params);
  };

  return useQuery({
    queryKey: domainBQueryKeys.list(params),
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

export const useDomainBTodoDetailQuery = (id: DomainBTodoId | null) => {
  const queryFn = () => {
    if (!id) {
      throw new Error("id is required");
    }
    return getDomainBTodoDetail(id);
  };

  return useQuery({
    queryKey: domainBQueryKeys.detail(id ?? EMPTY_DETAIL_ID),
    queryFn,
    enabled: Boolean(id),
    staleTime: 10_000,
  });
};
