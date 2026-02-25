import { http } from "@/packages/http";
import {
  toDomainBTodoDetailResult,
  toDomainBTodoItem,
  toDomainBTodoListResult,
} from "@/features/domain-b/mapper";
import type {
  CreateDomainBTodoInput,
  DomainBTodoDetailDtoResponse,
  DomainBTodoDetailResult,
  DomainBTodoId,
  DomainBTodoItem,
  DomainBTodoItemDto,
  DomainBTodoListDtoResponse,
  DomainBTodoListParams,
  DomainBTodoListResult,
  UpdateDomainBTodoStatusInput,
} from "@/features/domain-b/type";

// Responsibility: Pure API calls only. No React Query hooks here.
export const getDomainBTodoList = async (
  params: DomainBTodoListParams,
): Promise<DomainBTodoListResult> => {
  const response = await http.get<DomainBTodoListDtoResponse>("/domain-b", {
    params,
  });
  return toDomainBTodoListResult(response);
};

export const getDomainBTodoDetail = async (
  id: DomainBTodoId,
): Promise<DomainBTodoDetailResult> => {
  const response = await http.get<DomainBTodoDetailDtoResponse>(`/domain-b/${id}`);
  return toDomainBTodoDetailResult(response);
};

export const createDomainBTodo = async (
  input: CreateDomainBTodoInput,
): Promise<DomainBTodoItem> => {
  const response = await http.post<DomainBTodoItemDto>("/domain-b", {
    title: input.title,
  });
  return toDomainBTodoItem(response);
};

export const updateDomainBTodoStatus = async (
  input: UpdateDomainBTodoStatusInput,
): Promise<DomainBTodoItem> => {
  const response = await http.patch<DomainBTodoItemDto>(
    `/domain-b/${input.id}/status`,
    {
      status: input.nextStatus,
    },
  );
  return toDomainBTodoItem(response);
};
