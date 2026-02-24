import { http } from "@/packages/http";
import {
  toDomainADetailResult,
  toDomainAItem,
  toDomainAListResult,
} from "@/features/domain-a/mapper";
import type {
  DomainADetailDtoResponse,
  DomainADetailResult,
  DomainAItem,
  DomainAItemDto,
  DomainAListDtoResponse,
  DomainAListParams,
  DomainAListResult,
  UpdateDomainAStatusInput,
} from "@/features/domain-a/type";

// Responsibility: Pure API calls only. No React Query hooks here.
export const getDomainAList = async (
  params: DomainAListParams,
): Promise<DomainAListResult> => {
  const response = await http.get<DomainAListDtoResponse>("/domain-a", {
    params,
  });
  return toDomainAListResult(response);
};

export const getDomainADetail = async (
  id: string,
): Promise<DomainADetailResult> => {
  const response = await http.get<DomainADetailDtoResponse>(`/domain-a/${id}`);
  return toDomainADetailResult(response);
};

export const updateDomainAStatus = async (
  input: UpdateDomainAStatusInput,
): Promise<DomainAItem> => {
  const response = await http.patch<DomainAItemDto>(
    `/domain-a/${input.id}/status`,
    {
      status: input.nextStatus,
    },
  );
  return toDomainAItem(response);
};
