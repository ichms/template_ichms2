# ARC-01 Architecture Foundation

- Priority: P0
- 적용 범위: `app/*`, `features/*`, `packages/*`

## MUST

- 기능 코드는 `features/domain-*` 내부에 둔다.
- `app/*/page.tsx`는 라우트 엔트리와 조합만 담당한다.
- API 호출, 캐시 제어, UI 렌더링을 파일 단위로 분리한다.
- 기본 원칙은 `app` thin route이며, 데이터 처리/정책은 `features`가 소유한다.

## SHOULD

- 공통 요소는 `features/common`으로 모은다.
- 초기에는 단순 구조로 시작하고 복잡도 증가 시 분리한다.
- SEO/SSR 성능상 필요한 경우에만 `app/*`에서 read-only fetch를 예외 허용한다.

## MUST NOT

- `app/*/page.tsx`에 도메인 비즈니스 로직을 넣지 않는다.
- 도메인 폴더에서 타 도메인 내부 구현을 직접 참조하지 않는다.
- `app/*`에서 write 요청(생성/수정/삭제)이나 캐시 정책(invalidate 등)을 직접 처리하지 않는다.

## 왜 필요한가

라우트 파일이 비대해지면 책임 경계가 무너지고 변경 영향 범위 통제가 어려워진다.

## Bad

```tsx
// app/orders/page.tsx
import { useQuery } from '@tanstack/react-query';

const Page = () => {
  const { data } = useQuery({ queryKey: ['orders'], queryFn: fetchOrders });
  const approve = async (id: string) => { /* ... */ };
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

## 리뷰 체크 (Yes/No)

- `app/*/page.tsx`가 엔트리 역할만 하는가?
- 도메인 코드가 `features/domain-*` 내부에 모였는가?
- `app/*` 예외 사용 시 read-only fetch 범위로 제한되었는가?

## 자동 검증

- 린트: 부분 가능(`no-restricted-imports`)
- 리뷰 수동: 필요
