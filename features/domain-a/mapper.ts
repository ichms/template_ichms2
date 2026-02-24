import type {
  DomainADetailDtoResponse,
  DomainADetailResult,
  DomainAItem,
  DomainAItemDto,
  DomainAListDtoResponse,
  DomainAListResult,
} from "@/features/domain-a/type";

// Responsibility: Convert transport DTOs into domain models.
export const toDomainAItem = (dto: DomainAItemDto): DomainAItem => {
  return {
    id: dto.id,
    name: dto.display_name,
    status: dto.status,
    updatedAt: dto.updated_at,
  };
};

export const toDomainAListResult = (
  response: DomainAListDtoResponse,
): DomainAListResult => {
  return {
    items: response.items.map(toDomainAItem),
    total: response.total,
  };
};

export const toDomainADetailResult = (
  response: DomainADetailDtoResponse,
): DomainADetailResult => {
  return {
    item: toDomainAItem(response.item),
  };
};
