# DOM-01 Domain Boundary and Common Promotion

- Priority: P1
- 적용 범위: `features/domain-*`, `features/common`

## MUST

- 도메인 폴더가 해당 기능의 UI/API/캐시 정책을 소유한다.
- 정책이 다르면 재사용 대신 복사 후 분기한다.

## SHOULD

- 아래 3조건을 모두 만족할 때만 `common`으로 승격한다.
  1. 2개 이상 도메인에서 동일 요구로 반복 사용
  2. 도메인 고유 용어/정책 의존 없음
  3. 공통 변경 책임 수용 가능

## MUST NOT

- 재사용 가능성만으로 조기 승격하지 않는다.

## 왜 필요한가

성급한 common 승격은 결합도 증가로 이어지고, 결국 모든 도메인의 변경 속도를 떨어뜨린다.

## Bad

```ts
// features/common/hooks/useOrderApprovalPolicy.ts
// order 도메인 정책이 공통 훅으로 침투
```

## Good

```ts
// features/domain-orders/policy/canApprove.ts
export const canApprove = (role: 'ADMIN' | 'STAFF') => role === 'ADMIN';
```

## 리뷰 체크 (Yes/No)

- 공통 승격 근거(2개 이상 + 정책 비의존)가 있는가?
- 도메인 정책 코드가 common에 없는가?

## 자동 검증

- 린트: 제한적
- 리뷰 수동: 필수
