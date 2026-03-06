# Hook 네이밍 컨벤션

React Query 훅과 Jotai 훅을 이름만 보고 구분할 수 있도록 아래 규칙을 사용합니다.

## 1) React Query 훅

- Query 훅: `use*Query`
- Mutation 훅: `use*Mutation`

예시:

- `useTicketDetailQuery`
- `useCreateReservationMutation`

## 2) Jotai 훅

- 값 조회 훅: `use*Value`
- 값 변경 훅: `useSet*`

예시:

- `useTokenIdValue`
- `useSetTokenId`

## 3) 파일 위치 규칙

- Query 훅: `features/**/hooks/queries.ts`
- Mutation 훅: `features/**/hooks/mutations.ts`
- Jotai 훅: `features/**/store/*`

## 4) 린트 강제

`eslint.config.mjs`에서 파일별 네이밍 규칙을 강제합니다.

- `**/hooks/queries.ts` -> exported const는 `use*Query`만 허용
- `**/hooks/mutations.ts` -> exported const는 `use*Mutation`만 허용
- `features/**/store/*` -> exported const는 `use*Value` 또는 `useSet*`만 허용

규칙 위반 시 `pnpm lint`에서 실패합니다.

