// Responsibility: Domain and DTO types for domain-b todo feature.

export type DomainBTodoId = string;

export const DOMAIN_B_TODO_STATUS = {
  TODO: "TODO",
  DONE: "DONE",
} as const;

export const DOMAIN_B_TODO_FILTER_STATUS = {
  ALL: "ALL",
  TODO: DOMAIN_B_TODO_STATUS.TODO,
  DONE: DOMAIN_B_TODO_STATUS.DONE,
} as const;

export const DOMAIN_B_TODO_STATUS_VALUES = [
  DOMAIN_B_TODO_STATUS.TODO,
  DOMAIN_B_TODO_STATUS.DONE,
] as const;

export const DOMAIN_B_TODO_FILTER_STATUS_VALUES = [
  DOMAIN_B_TODO_FILTER_STATUS.ALL,
  DOMAIN_B_TODO_FILTER_STATUS.TODO,
  DOMAIN_B_TODO_FILTER_STATUS.DONE,
] as const;

export type DomainBTodoStatus =
  (typeof DOMAIN_B_TODO_STATUS)[keyof typeof DOMAIN_B_TODO_STATUS];

export type DomainBTodoFilterStatus =
  (typeof DOMAIN_B_TODO_FILTER_STATUS)[keyof typeof DOMAIN_B_TODO_FILTER_STATUS];

export const isDomainBTodoStatus = (value: string): value is DomainBTodoStatus => {
  return (DOMAIN_B_TODO_STATUS_VALUES as readonly string[]).includes(value);
};

export const isDomainBTodoFilterStatus = (
  value: string,
): value is DomainBTodoFilterStatus => {
  return (DOMAIN_B_TODO_FILTER_STATUS_VALUES as readonly string[]).includes(value);
};

export type DomainBTodoItem = {
  id: DomainBTodoId;
  title: string;
  status: DomainBTodoStatus;
  updatedAt: string;
};

export type DomainBTodoListParams = {
  search?: string;
  status?: DomainBTodoFilterStatus;
  page?: number;
  pageSize?: number;
};

export type DomainBTodoListResult = {
  items: DomainBTodoItem[];
  total: number;
};

export type DomainBTodoDetailResult = {
  item: DomainBTodoItem;
};

export type CreateDomainBTodoInput = {
  title: string;
};

export type UpdateDomainBTodoStatusInput = {
  id: DomainBTodoId;
  nextStatus: DomainBTodoStatus;
};

export type DomainBTodoItemDto = {
  id: string;
  title: string;
  status: DomainBTodoStatus;
  updated_at: string;
};

export type DomainBTodoListDtoResponse = {
  items: DomainBTodoItemDto[];
  total: number;
};

export type DomainBTodoDetailDtoResponse = {
  item: DomainBTodoItemDto;
};
