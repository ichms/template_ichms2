// Responsibility: Domain and DTO types for domain-b todo feature.

export type DomainBTodoId = string;

export type DomainBTodoStatus = "TODO" | "DONE";

export type DomainBTodoFilterStatus = DomainBTodoStatus | "ALL";

export interface DomainBTodoItem {
  id: DomainBTodoId;
  title: string;
  status: DomainBTodoStatus;
  updatedAt: string;
}

export interface DomainBTodoListParams {
  search?: string;
  status?: DomainBTodoFilterStatus;
  page?: number;
  pageSize?: number;
}

export interface DomainBTodoListResult {
  items: DomainBTodoItem[];
  total: number;
}

export interface DomainBTodoDetailResult {
  item: DomainBTodoItem;
}

export interface CreateDomainBTodoInput {
  title: string;
}

export interface UpdateDomainBTodoStatusInput {
  id: DomainBTodoId;
  nextStatus: DomainBTodoStatus;
}

export interface DomainBTodoItemDto {
  id: string;
  title: string;
  status: DomainBTodoStatus;
  updated_at: string;
}

export interface DomainBTodoListDtoResponse {
  items: DomainBTodoItemDto[];
  total: number;
}

export interface DomainBTodoDetailDtoResponse {
  item: DomainBTodoItemDto;
}
