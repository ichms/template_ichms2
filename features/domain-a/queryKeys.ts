import type { DomainAId, DomainAListParams } from "@/features/domain-a/type";

// Responsibility: Centralized query key factory for domain-a.
const DOMAIN_A_ALL_KEY = ["domain-a"] as const;

const normalizeListParams = (params: DomainAListParams = {}) => {
  return {
    search: params.search?.trim() ?? "",
    status: params.status ?? "ALL",
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  };
};

const getDomainAListsKey = () => {
  return [...DOMAIN_A_ALL_KEY, "list"] as const;
};

const getDomainAListKey = (params: DomainAListParams = {}) => {
  return [...getDomainAListsKey(), normalizeListParams(params)] as const;
};

const getDomainADetailsKey = () => {
  return [...DOMAIN_A_ALL_KEY, "detail"] as const;
};

const getDomainADetailKey = (id: DomainAId) => {
  return [...getDomainADetailsKey(), id] as const;
};

export const domainAQueryKeys = {
  all: DOMAIN_A_ALL_KEY,
  lists: getDomainAListsKey,
  list: getDomainAListKey,
  details: getDomainADetailsKey,
  detail: getDomainADetailKey,
};
