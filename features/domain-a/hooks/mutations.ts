import { useMutation, useQueryClient } from "@tanstack/react-query";
import { domainAQueryKeys } from "@/features/domain-a/queryKeys";
import { updateDomainAStatus } from "@/features/domain-a/service";
import type { DomainAItem } from "@/features/domain-a/type";

// Responsibility: Define domain-a useMutation hooks only.
export const useUpdateDomainAStatusMutation = () => {
  const queryClient = useQueryClient();

  const onSuccess = (updated: DomainAItem) => {
    queryClient.invalidateQueries({ queryKey: domainAQueryKeys.lists() });
    queryClient.invalidateQueries({
      queryKey: domainAQueryKeys.detail(updated.id),
    });
  };

  return useMutation({
    mutationFn: updateDomainAStatus,
    onSuccess,
  });
};
