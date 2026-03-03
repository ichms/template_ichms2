# REF-01 Reference Implementation

- Priority: P2
- 적용 범위: 신규 기능 개발 시 샘플 참조

## 표준 파일 세트

- `app/domain-a/page.tsx`
- `features/domain-a/components/Page.tsx`
- `features/domain-a/hooks/queries.ts`
- `features/domain-a/hooks/mutations.ts`
- `features/domain-a/service.ts`
- `features/domain-a/queryKeys.ts`
- `features/domain-a/type.ts`
- `features/domain-a/mapper.ts`

## 최소 스켈레톤

```tsx
// app/domain-a/page.tsx
import { DomainAPage } from '@/features/domain-a/components/Page';

const Page = () => <DomainAPage />;

export default Page;
```

```ts
// features/domain-a/queryKeys.ts
export const domainAKeys = {
  all: ['domain-a'] as const,
  lists: () => [...domainAKeys.all, 'lists'] as const,
  list: (params: { q?: string }) => [...domainAKeys.lists(), params] as const,
  details: () => [...domainAKeys.all, 'details'] as const,
  detail: (id: string) => [...domainAKeys.details(), id] as const,
};
```

## 리뷰 체크 (Yes/No)

- 표준 파일 세트가 모두 존재하는가?
- 각 파일이 지정 책임만 수행하는가?

## 자동 검증

- 린트: 일부 가능
- 리뷰 수동: 필요
