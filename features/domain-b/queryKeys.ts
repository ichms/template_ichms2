import type { DomainBTodoId, DomainBTodoListParams } from "@/features/domain-b/type";

// Responsibility: Centralized query key factory for domain-b.
const DOMAIN_B_ALL_KEY = ["domain-b"] as const;

const normalizeListParams = (params: DomainBTodoListParams = {}) => {
  return {
    search: params.search?.trim() ?? "",
    status: params.status ?? "ALL",
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  };
};

const getDomainBListsKey = () => {
  return [...DOMAIN_B_ALL_KEY, "lists"] as const;
};

const getDomainBListKey = (params: DomainBTodoListParams = {}) => {
  return [...getDomainBListsKey(), normalizeListParams(params)] as const;
};

const getDomainBDetailsKey = () => {
  return [...DOMAIN_B_ALL_KEY, "details"] as const;
};

const getDomainBDetailKey = (id: DomainBTodoId) => {
  return [...getDomainBDetailsKey(), id] as const;
};

export const domainBQueryKeys = {
  all: DOMAIN_B_ALL_KEY,
  lists: getDomainBListsKey,
  list: getDomainBListKey,
  details: getDomainBDetailsKey,
  detail: getDomainBDetailKey,
};
