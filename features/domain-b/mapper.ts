import type {
  DomainBTodoDetailDtoResponse,
  DomainBTodoDetailResult,
  DomainBTodoItem,
  DomainBTodoItemDto,
  DomainBTodoListDtoResponse,
  DomainBTodoListResult,
} from "@/features/domain-b/type";

// Responsibility: Convert transport DTOs into domain models.
export const toDomainBTodoItem = (dto: DomainBTodoItemDto): DomainBTodoItem => {
  return {
    id: dto.id,
    title: dto.title,
    status: dto.status,
    updatedAt: dto.updated_at,
  };
};

export const toDomainBTodoListResult = (
  response: DomainBTodoListDtoResponse,
): DomainBTodoListResult => {
  return {
    items: response.items.map(toDomainBTodoItem),
    total: response.total,
  };
};

export const toDomainBTodoDetailResult = (
  response: DomainBTodoDetailDtoResponse,
): DomainBTodoDetailResult => {
  return {
    item: toDomainBTodoItem(response.item),
  };
};
