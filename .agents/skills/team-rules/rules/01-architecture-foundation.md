# ARC-01 Architecture Foundation

- Priority: P0
- Enforcement: Rule ID별 상이 (`GOV-02` Enforcement Matrix 참조)
- 적용 범위: `app/*`, `features/*`, `packages/*`
- Hard Rule 참조: `GOV-02` (`HR-ARC-01,02,03`, `HR-IMP-01,02,03`)

## SSOT 적용

- 아래 내용은 `HR-ARC-*` 해설이며, 강제 문구 원문/집행 강도는 `GOV-02`를 따른다.
- 예외는 `EX-01` 템플릿으로만 기록한다.

## MUST

- 기능 코드는 `features/domain-*` 내부에 둔다.
- `app/*/page.tsx`는 라우트 엔트리와 조합만 담당한다.
- API 호출, 캐시 제어, UI 렌더링을 파일 단위로 분리한다.
- `app/*`에서 read-only 조회가 필요하면 `features/domain-*/service.ts` 공개 함수(`get*ForPage`)만 호출한다.

## MUST 검증 메타

| Rule ID | 자동 검증 | 수동 검증 체크포인트 |
| --- | --- | --- |
| `HR-ARC-01` | 경계 린트(선택) | `app/*/page.tsx`가 엔트리/조합만 수행하는지 |
| `HR-ARC-02` | import 제한 규칙 | app read-only가 `get*ForPage`만 경유하는지 |
| `HR-ARC-03` | 제한적 | app에서 write/invalidate/정책 side effect 유무 |

## SHOULD

- 공통 요소는 `features/common`으로 모은다.
- 초기에는 단순 구조로 시작하고 복잡도 증가 시 분리한다.

## MUST NOT

- `app/*/page.tsx`에 도메인 비즈니스 로직을 넣지 않는다.
- 도메인 폴더에서 타 도메인 내부 구현을 직접 참조하지 않는다.
- `app/*`에서 write 요청(생성/수정/삭제)이나 invalidate를 직접 처리하지 않는다.

## ARC-EX-01 (허용 예외)

아래 조건을 모두 충족하면 `app/*` read-only 조회를 허용한다.

1. SEO/SSR 요구가 명확하다.
2. 호출 함수는 `features/domain-*/service.ts`의 공개 함수다.
3. 호출 함수 내부에서 write/invalidate를 수행하지 않는다.
4. 캐시 정책은 Query 또는 서버 캐시 정책 중 하나로 일관되게 관리한다.

## 왜 필요한가

라우트 파일 비대화와 책임 혼합을 막아 변경 영향 범위를 통제하기 위함이다.

## Bad

```tsx
// app/orders/page.tsx
import { useQuery } from '@tanstack/react-query';

const Page = () => {
  const { data } = useQuery({ queryKey: ['orders'], queryFn: fetchOrders });
  return <div>{/* ... */}</div>;
};

export default Page;
```

## Good

```tsx
// app/orders/page.tsx
import { OrdersPage } from '@/features/domain-orders/components/Page';

const Page = () => <OrdersPage />;

export default Page;
```

```ts
// features/domain-orders/service.ts
import { apiClient } from '@/packages/api/apiClient'

export const getOrders = async (params: { status?: string }) => {
  return await apiClient.get('/api/orders/v1', { params })
}

export const getOrdersForPage = async () => {
  return await getOrders({})
}
```

## 리뷰 체크 (Yes/No)

- `app/*/page.tsx`가 엔트리 역할만 하는가?
- `app/*` read-only 조회가 필요할 때 `service.ts` 공개 함수만 경유하는가?
- `app/*`에서 write/invalidate가 없는가?

## 자동 검증

- 린트: 부분 가능(`no-restricted-imports`)
- 리뷰 수동: 필요
