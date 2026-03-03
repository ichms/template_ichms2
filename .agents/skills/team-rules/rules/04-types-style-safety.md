# TYPE-01 Types, Style, Safety

- Priority: P1
- 적용 범위: `features/*`, `packages/*`의 TypeScript 코드

## MUST

- 함수 선언은 함수 표현식으로 통일한다.
- `type.ts|types.ts|dto.ts`의 타입 선언은 `type`을 사용한다.
- 유니온 타입은 상수(`as const`)를 단일 소스로 두고 파생한다.
- 불확실 타입 입력은 `unknown`으로 받고 내로잉한다.

## MUST NOT

- `any`를 사용하지 않는다.
- 문자열 리터럴 유니온을 값 소스 없이 중복 하드코딩하지 않는다.

## SHOULD

- 도메인 식별자/상태 코드는 literal union 또는 브랜드 타입을 우선 사용한다.

## 왜 필요한가

타입 일관성이 없으면 안전성 통제가 깨지고 런타임 오류가 리뷰 단계로 유입된다.

## Bad

```ts
export interface OrderDto {
  id: string;
  status: string;
}

export const isDone = (value: any) => value.status === 'DONE';
```

## Good

```ts
export const ORDER_STATUS = {
  READY: 'READY',
  DONE: 'DONE',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export type OrderDto = {
  id: string;
  status: OrderStatus;
};

export const isOrderDto = (value: unknown): value is OrderDto => {
  if (!value || typeof value !== 'object') return false;
  const v = value as { id?: unknown; status?: unknown };
  return typeof v.id === 'string' && typeof v.status === 'string';
};
```

## 리뷰 체크 (Yes/No)

- `any`가 없는가?
- 유니온이 상수 소스에서 파생되는가?
- 타입 파일에서 `type` 규칙을 지키는가?

## 자동 검증

- 린트: 가능(`@typescript-eslint/no-explicit-any`)
- 리뷰 수동: 필요
