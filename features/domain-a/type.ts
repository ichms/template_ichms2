// Responsibility: Domain and DTO types for domain-a.

export type DomainAId = string;

export type DomainAStatus = "ACTIVE" | "INACTIVE";

export type DomainAFilterStatus = DomainAStatus | "ALL";

export interface DomainAItem {
  id: DomainAId;
  name: string;
  status: DomainAStatus;
  updatedAt: string;
}

export interface DomainAListParams {
  search?: string;
  status?: DomainAFilterStatus;
  page?: number;
  pageSize?: number;
}

export interface DomainAListResult {
  items: DomainAItem[];
  total: number;
}

export interface DomainADetailResult {
  item: DomainAItem;
}

export interface UpdateDomainAStatusInput {
  id: DomainAId;
  nextStatus: DomainAStatus;
}

export interface DomainAItemDto {
  id: string;
  display_name: string;
  status: DomainAStatus;
  updated_at: string;
}

export interface DomainAListDtoResponse {
  items: DomainAItemDto[];
  total: number;
}

export interface DomainADetailDtoResponse {
  item: DomainAItemDto;
}
