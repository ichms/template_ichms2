# REF-01 Reference Implementation

- Priority: P2
- Enforcement: Guide
- 적용 범위: 신규 기능 개발 시 샘플 참조
- API 전략: Next.js App Router Route Handlers (`app/api/*/route.ts`) + `createProxy`
- 클라이언트 API 호출: `features/*/service.ts`에서 `apiClient` 사용

## 템플릿 타입

### A. Minimal (조회 전용, Client Page + Route Handler)

- `app/(page)/domain-a/list/page.tsx`
- `app/api/domain-a/v1/route.ts`
- `features/domain-a/components/Page.tsx`
- `features/domain-a/hooks/queries.ts`
- `features/domain-a/service.ts`
- `features/domain-a/queryKeys.ts`
- `features/domain-a/type.ts`

### B. Full (조회 + 변경)

- Minimal 세트 + `hooks/mutations.ts`, `app/api/domain-a/v1/[id]/route.ts`

### C. SSR/SEO read-only (선택)

- Full 또는 Minimal 세트 + `service.ts`의 `get*ForPage` 함수
- `get*ForPage`는 `apiClient` 대신 서버 안전한 `fetch`를 사용
- `pages/api/*`는 사용하지 않고 `app/api/*/route.ts`만 사용한다.

## Minimal 스켈레톤 (현재 워크스페이스 Best Practice)

```tsx
// app/(page)/domain-a/list/page.tsx
'use client'

import { DomainAPage } from '@/features/domain-a/components/Page'

const DomainAListRoute = () => <DomainAPage />

export default DomainAListRoute
```

```ts
// app/api/domain-a/v1/route.ts
import { createProxy } from '@/packages/api/middleware/createProxy'

const OPERATION_SERVER_BASE_URL = process.env.OPERATION_SERVER_BASE_URL
const URL = '/api/domain-a/v1'

export const GET = createProxy(OPERATION_SERVER_BASE_URL, URL)
```

```ts
// features/domain-a/type.ts
export const DOMAIN_A_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const

export type DomainAStatus = (typeof DOMAIN_A_STATUS)[keyof typeof DOMAIN_A_STATUS]

export type DomainAListParams = {
  page: number
  pageSize: number
  keyword: string
  status: DomainAStatus | ''
}

export type DomainAItem = {
  id: string
  name: string
  status: DomainAStatus
  createdAt: string
}

export type DomainAListResponse = {
  items: DomainAItem[]
  totalCount: number
  totalPage: number
  page: number
  pageSize: number
}

export type UpdateDomainAStatusRequest = {
  id: string
  status: DomainAStatus
}
```

```ts
// features/domain-a/queryKeys.ts
import type { DomainAListParams } from '@/features/domain-a/type'

const normalizeListParams = (params: DomainAListParams) => ({
  page: params.page,
  pageSize: params.pageSize,
  keyword: params.keyword.trim(),
  status: params.status,
})

export const domainAKeys = {
  all: ['domain-a'] as const,
  lists: () => [...domainAKeys.all, 'lists'] as const,
  list: (params: DomainAListParams) =>
    [...domainAKeys.lists(), normalizeListParams(params)] as const,
  details: () => [...domainAKeys.all, 'details'] as const,
  detail: (id: string) => [...domainAKeys.details(), id] as const,
}
```

```ts
// features/domain-a/service.ts
import { apiClient } from '@/packages/api/apiClient'
import type {
  DomainAListParams,
  DomainAListResponse,
  UpdateDomainAStatusRequest,
} from '@/features/domain-a/type'

export const getDomainAList = async (
  params: DomainAListParams,
): Promise<DomainAListResponse> => await apiClient.get('/api/domain-a/v1', { params })

export const updateDomainAStatus = async (
  request: UpdateDomainAStatusRequest,
): Promise<void> => await apiClient.patch('/api/domain-a/v1/status', request)
```

```ts
// features/domain-a/hooks/queries.ts
import { useQuery } from '@tanstack/react-query'
import { domainAKeys } from '@/features/domain-a/queryKeys'
import { getDomainAList } from '@/features/domain-a/service'
import type { DomainAListParams } from '@/features/domain-a/type'

export const useDomainAListQuery = (params: DomainAListParams) => {
  return useQuery({
    queryKey: domainAKeys.list(params),
    queryFn: () => getDomainAList(params),
    enabled: params.page > 0 && params.pageSize > 0,
  })
}
```

```tsx
// features/domain-a/components/Page.tsx

import { useState } from 'react'
import { useDomainAListQuery } from '@/features/domain-a/hooks/queries'
import { DOMAIN_A_STATUS, type DomainAListParams } from '@/features/domain-a/type'

const INITIAL_PARAMS: DomainAListParams = {
  page: 1,
  pageSize: 10,
  keyword: '',
  status: '',
}

export const DomainAPage = () => {
  const [params, setParams] = useState<DomainAListParams>(INITIAL_PARAMS)
  const { data, isLoading, isError } = useDomainAListQuery(params)

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>목록 조회에 실패했습니다.</div>

  return (
    <section>
      <button
        type='button'
        onClick={() =>
          setParams((prev) => ({
            ...prev,
            status:
              prev.status === DOMAIN_A_STATUS.ACTIVE
                ? DOMAIN_A_STATUS.INACTIVE
                : DOMAIN_A_STATUS.ACTIVE,
          }))
        }
      >
        상태 토글
      </button>
      <ul>
        {(data?.items ?? []).map((item) => (
          <li key={item.id}>
            {item.name} ({item.status})
          </li>
        ))}
      </ul>
    </section>
  )
}
```

## Full 스켈레톤 (조회 + 변경)

```ts
// app/api/domain-a/v1/[id]/route.ts
import { createProxy } from '@/packages/api/middleware/createProxy'

const OPERATION_SERVER_BASE_URL = process.env.OPERATION_SERVER_BASE_URL
const URL = '/api/domain-a/v1/:id'

export const GET = createProxy(OPERATION_SERVER_BASE_URL, URL)
export const PATCH = createProxy(OPERATION_SERVER_BASE_URL, URL, 'PATCH')
```

```ts
// features/domain-a/hooks/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { domainAKeys } from '@/features/domain-a/queryKeys'
import { updateDomainAStatus } from '@/features/domain-a/service'

export const useUpdateDomainAStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateDomainAStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: domainAKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: domainAKeys.detail(variables.id),
      })
    },
  })
}
```

## SSR/SEO read-only 스켈레톤 (선택)

```ts
// features/domain-a/service.ts
import type { DomainAListParams, DomainAListResponse } from '@/features/domain-a/type'

const OPERATION_SERVER_BASE_URL = process.env.OPERATION_SERVER_BASE_URL

const toQueryString = (params: DomainAListParams) => {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    keyword: params.keyword,
    status: params.status,
  })
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

export const getDomainAListForPage = async (
  params: DomainAListParams,
): Promise<DomainAListResponse> => {
  if (!OPERATION_SERVER_BASE_URL) {
    throw new Error('OPERATION_SERVER_BASE_URL is not configured')
  }

  const response = await fetch(
    `${OPERATION_SERVER_BASE_URL}/api/domain-a/v1${toQueryString(params)}`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch domain-a list for page')
  }

  return (await response.json()) as DomainAListResponse
}
```

## 리뷰 체크 (Yes/No)

- 기능 성격에 맞는 템플릿 타입을 선택했는가?
- API가 `app/api/*/route.ts` + `createProxy`로 구성되었는가? (`pages/api/*` 미사용)
- `queryKeys.ts`를 통해서만 query key를 생성하는가?
- `service.ts`가 순수 API 호출만 수행하는가? (React Query 훅 없음)
- mutation 성공 시 최소 범위(`lists/detail`) invalidate를 수행하는가?
- SSR/SEO read-only에서 `get*ForPage`가 서버 안전한 `fetch`를 사용하는가?

## 자동 검증

- 린트: 일부 가능
- 리뷰 수동: 필요
