# AI-01 Hard Rules for AI Generation

- Priority: P0
- 적용 범위: AI가 생성하는 신규/수정 코드 전체

## MUST

- 생성 순서를 지킨다: `type.ts -> queryKeys.ts -> service.ts -> hooks/* -> components/Page.tsx -> app/*/page.tsx`
- 신규 함수는 모두 함수 표현식(`const fn = () => {}`)으로 생성한다.
- 파일 책임을 분리해 생성한다.

## MUST NOT

- `service.ts`에 React Query import를 생성하지 않는다.
- `queryKeys.ts` 없이 key를 직접 생성하지 않는다.
- `packages/* -> features/*` import를 생성하지 않는다.
- `type.ts|types.ts|dto.ts`에 `interface`를 생성하지 않는다(예외 제외).
- `any`를 생성하지 않는다.

## 왜 필요한가

AI 산출물 편차가 크면 리뷰 비용이 급증한다. 생성 규칙을 강제하면 팀이 같은 구조를 반복적으로 얻을 수 있다.

## Bad

```ts
function useOrders() {
  return useQuery({ queryKey: ['orders'], queryFn: getOrders });
}
```

## Good

```ts
export const useOrdersQuery = () => {
  return useQuery({ queryKey: orderKeys.list({}), queryFn: () => getOrders({}) });
};
```

## 리뷰 체크 (Yes/No)

- AI가 생성한 파일이 지정 순서를 따랐는가?
- 금지 패턴이 없는가?

## 자동 검증

- 린트: 부분 가능
- 리뷰 수동: 필수
