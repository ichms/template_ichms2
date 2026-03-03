# RQ-01 TanStack Query Rules

- Priority: P0
- 적용 범위: `features/domain-*/service.ts`, `hooks/*`, `queryKeys.ts`

## MUST

- TanStack Query는 `@tanstack/react-query` v5 기준으로 사용한다.
- `service.ts`는 순수 API 호출 함수만 가진다.
- `hooks/queries.ts`는 `useQuery` 계열만 가진다.
- `hooks/mutations.ts`는 `useMutation` 계열만 가진다.
- query key는 반드시 `queryKeys.ts` factory를 통해서만 사용한다.
- mutation 성공 시 관련 `lists/detail` invalidate를 수행한다.
- 서버 상태는 Query cache를 단일 소스로 사용한다.
- 조건부 query는 `enabled`로 제어한다.
- 화면은 loading/error 상태를 반드시 처리한다.

## SHOULD

- key 구조를 `all > lists > list`, `all > details > detail`로 유지한다.
- key 파라미터는 정규화 객체로 전달한다.
- prefetch/optimistic update는 사용자 체감 성능이 필요한 화면에서 사용한다.

## MUST NOT

- `service.ts`에서 React Query 훅을 사용하지 않는다.
- 문자열/배열 query key를 컴포넌트에서 하드코딩하지 않는다.
- 과도한 invalidate(`all`)를 기본값으로 사용하지 않는다.
- `useEffect`로 서버 데이터 fetch를 구현하지 않는다.
- 서버 데이터를 store/local state로 중복 저장하지 않는다.

## 왜 필요한가

캐시 정책 누락과 잘못된 invalidate를 구조적으로 차단하려면 파일 책임을 고정해야 한다.

## Bad

```ts
// features/domain-orders/service.ts
import { useQueryClient } from '@tanstack/react-query';

export const updateOrder = async (id: string) => {
  const qc = useQueryClient();
  await http.patch(`/orders/${id}`);
  qc.invalidateQueries({ queryKey: ['orders'] });
};
```

## Good

```ts
// features/domain-orders/queryKeys.ts
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'lists'] as const,
  list: (params: { status?: string }) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'details'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};
```

```ts
// features/domain-orders/service.ts
export const getOrders = async (params: { status?: string }) =>
  http.get('/orders', { searchParams: params });

export const patchOrderStatus = async (id: string, status: string) =>
  http.patch(`/orders/${id}`, { json: { status } });
```

```ts
// features/domain-orders/hooks/queries.ts
import { useQuery } from '@tanstack/react-query';

export const useOrdersQuery = (params: { status?: string }) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
    enabled: true,
  });
};
```

```ts
// features/domain-orders/hooks/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePatchOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      patchOrderStatus(id, status),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
};
```

```tsx
// features/domain-orders/components/Page.tsx
const OrdersPage = () => {
  const { data, isPending, isError, error } = useOrdersQuery({});

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return <OrderList items={data.items} />;
};
```

## 성능/운영 패턴

- hover/진입 전 prefetch가 필요한 화면은 `queryClient.prefetchQuery`를 사용한다.
- 낙관적 업데이트는 `onMutate -> onError rollback -> onSettled invalidate` 순서를 지킨다.
- 글로벌 에러 핸들링은 `QueryClient` 기본 옵션에서 일관되게 처리한다.

## 안티패턴

- `queryKey: ['orders']` 같은 하드코딩 key를 컴포넌트에 직접 작성
- mutation 성공 후 invalidate 누락
- 상세 변경 후 목록만 invalidate 하고 `detail(id)` 누락
- 서버 응답을 store로 복제해 Query cache와 이중 소스로 운영

## 리뷰 체크 (Yes/No)

- Query key가 `queryKeys.ts`에서만 생성되는가?
- Mutation 성공 시 필요한 invalidate가 최소 범위로 포함되는가?
- `service.ts`가 훅 없이 순수 API 함수만 포함하는가?
- 서버 상태를 Query cache 단일 소스로 유지하는가?
- 조건부 query에서 `enabled`를 사용하고 loading/error 처리를 했는가?

## 자동 검증

- 린트: 가능(커스텀 룰 권장)
- 리뷰 수동: 필요
