# IMP-01 Import Boundaries

- Priority: P0
- 적용 범위: 전체 코드베이스

## MUST

- 허용 방향만 사용한다.
- `app/*`는 `components/Page.tsx`를 통해 도메인에 진입한다.

## 허용 방향

- `app/* -> features/domain-*`, `features/common`, `packages/*`
- `features/domain-* -> features/common`, `packages/*`
- `features/common -> packages/*`
- `packages/* -> packages/*`

## MUST NOT

- `packages/* -> features/*`
- `features/common -> features/domain-*`
- `app/* -> service.ts` 직접 참조

## 왜 필요한가

경계가 깨지면 공통 레이어가 도메인에 오염되고, 의존성 역전으로 리팩토링 비용이 폭증한다.

## Bad

```ts
// packages/http/order.ts
import { orderKeys } from '@/features/domain-orders/queryKeys';
```

## Good

```ts
// packages/http/index.ts
export const http = {
  get: async (path: string, init?: RequestInit) => fetch(path, init),
};
```

## 리뷰 체크 (Yes/No)

- 금지 방향 import가 없는가?
- `app/*`가 Page 컴포넌트를 통해 진입하는가?

## 자동 검증

- 린트: 가능(`no-restricted-imports`, `eslint-plugin-boundaries`)
- 리뷰 수동: 보조
