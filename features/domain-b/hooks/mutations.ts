import { useMutation, useQueryClient } from "@tanstack/react-query";
import { domainBQueryKeys } from "@/features/domain-b/queryKeys";
import { createDomainBTodo, updateDomainBTodoStatus } from "@/features/domain-b/service";
import type { DomainBTodoItem } from "@/features/domain-b/type";

// Responsibility: Define domain-b useMutation hooks only.
export const useCreateDomainBTodoMutation = () => {
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: domainBQueryKeys.lists() });
  };

  return useMutation({
    mutationFn: createDomainBTodo,
    onSuccess,
  });
};

export const useUpdateDomainBTodoStatusMutation = () => {
  const queryClient = useQueryClient();

  const onSuccess = (updated: DomainBTodoItem) => {
    queryClient.invalidateQueries({ queryKey: domainBQueryKeys.lists() });
    queryClient.invalidateQueries({
      queryKey: domainBQueryKeys.detail(updated.id),
    });
  };

  return useMutation({
    mutationFn: updateDomainBTodoStatus,
    onSuccess,
  });
};
