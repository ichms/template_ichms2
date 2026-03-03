---
name: nextjs-domain-architecture
description: Domain-oriented architecture standard for Next.js App Router + TanStack Query projects. Use when defining team conventions, outsourcing handoff rules, AI agent coding constraints, and gradual scaling rules for service/hooks/query keys/state ownership.
---

# Next.js Domain Architecture Skill

## 1. 목적 / 적용 대상

이 문서는 Next.js App Router + TanStack Query(v5) 기반 프로젝트에서 다음 목적을 위해 사용한다.

- 팀 공통 아키텍처 기준 통일
- 외주 협업 산출물 형식 표준화
- AI 에이전트 코드 생성 규칙 강제
- 신규 팀원 온보딩 기준 제공

적용 대상은 `app/*`, `features/*`, `packages/*`를 사용하는 프론트엔드 코드 전체다.

## 2. 핵심 설계 원칙

- 도메인 응집: 기능 코드는 `features/domain-*` 내부에 모은다.
- 얇은 라우트: `app/*/page.tsx`는 엔트리 역할만 수행한다.
- 서버 상태 단일화: 서버 상태는 TanStack Query가 단일 소스다.
- 계층 분리: API 호출, 캐시 제어, UI 렌더링을 파일 단위로 분리한다.
- 점진 분리: 초기에는 단순 구조로 시작하고 복잡도 상승 시 승격 분리한다.

## 3. 권장 디렉토리 구조

```text
app/
  domain-a/
    page.tsx

features/
  common/
    components/
    hooks/
    stores/
    utils/
  domain-a/
    components/
      Page.tsx
    hooks/
      queries.ts
      mutations.ts
    service.ts
    queryKeys.ts
    type.ts
    mapper.ts

packages/
  http/
    index.ts
```

## 4. 레이어 역할 정의

### `app`

- 허용: 라우트 진입, 메타데이터 선언, `Page` 컴포넌트 렌더링
- 금지: API 호출, query key 선언, 복잡한 비즈니스 로직
- 이유: 라우트 파일 비대화를 막고 도메인 코드 탐색 비용을 줄이기 위함

### `features/domain-*`

- 허용: 도메인 UI, 도메인 훅, 도메인 API 함수, 도메인 타입
- 금지: 타 도메인 내부 구현 직접 참조
- 이유: 도메인별 소유권을 명확히 유지하기 위함

### `features/common`

- 허용: 도메인 비의존 공통 UI/유틸/훅, 앱 전역 UI 상태(Jotai 등)
- 금지: 특정 도메인 정책/타입 import
- 이유: `common` 오염 방지 및 재사용성 보장

### `packages`

- 허용: HTTP, 날짜, 검증 등 범용 모듈
- 금지: `features/*` import
- 이유: 하위 레이어의 상위 의존 역전 방지

## 5. TanStack Query 적용 패턴

### 파일 책임

- `service.ts`: 순수 API 호출 함수만 작성
- `hooks/queries.ts`: `useQuery` 계열만 작성
- `hooks/mutations.ts`: `useMutation` 계열만 작성
- `queryKeys.ts`: key factory 패턴으로 query key 중앙 관리

### 필수 규칙

- 허용: `useQuery`, `useMutation`, `useQueryClient`는 `hooks/*` 내부에서만 사용
- 금지: `service.ts`에서 React Query 훅 사용
- 금지: 문자열 query key 하드코딩
- 권장: list/detail 계층 key (`all > lists > list`, `all > details > detail`)

### 기본 흐름

1. `service.ts`에 fetch/update 함수 작성
2. `queryKeys.ts`에 list/detail key 작성
3. `hooks/*`에서 query/mutation 훅 작성
4. mutation 성공 시 list/detail invalidate 실행
5. `components/Page.tsx`에서 훅 호출 후 UI 렌더링

## 6. 장점

- 파일 위치와 책임이 고정되어 신규 기능 속도가 빨라진다.
- query key/invalidations 누락이 줄어든다.
- 외주/AI 산출물 품질 편차가 감소한다.
- 코드리뷰가 구조 지적보다 제품 품질 중심으로 이동한다.

## 7. 단점 / 리스크 / 개선 솔루션

- 리스크: 초기에는 파일 수가 늘어 복잡해 보일 수 있다.
- 솔루션: 도메인 템플릿으로 생성 자동화(`gen:feature`)를 적용한다.
- 리스크: `common`으로 과도 승격되어 역으로 결합도가 높아질 수 있다.
- 솔루션: 2개 이상 도메인에서 검증 전 `common` 승격 금지 규칙을 적용한다.
- 리스크: invalidate 범위 과다로 불필요한 refetch가 증가할 수 있다.
- 솔루션: `queryKeys.lists()` / `queryKeys.detail(id)` 단위로 최소 invalidate 원칙을 적용한다.

## 8. 운영 규칙 (필수 규칙)

### Hard Rules (사람용)

- `service.ts`에 `useQuery`, `useMutation`, `useQueryClient` 사용 금지
- `components/*`에서 `service.ts` 직접 import 금지 (반드시 `hooks/*`를 통해 호출)
- `features/common`에서 도메인(`features/domain-*`) import 금지
- query key 하드코딩 금지 (`queryKeys.ts`만 사용)
- 서버 상태를 store에 중복 저장 금지
- `app/*/page.tsx`에 과도한 비즈니스 로직 금지
- `packages/*`에서 `features/*` import 금지
- `packages/*`는 애플리케이션의 정책/화면 흐름/사용자 행위에 간섭하지 않는다
- `packages/*`는 signal/callback/event만 제공하고, 정책성 side effect(redirect/logout/toast/모달 오픈 등) 실행 금지
- 공통 이벤트(예: 인증 실패 `401`)의 실제 행위는 `app/*` 또는 `features/*`에서 handler 주입으로 처리
- mutation 성공 시 관련 list/detail invalidate 누락 금지
- 신규 코드에서 함수 선언식(`function name() {}`) 금지, 함수 표현식(`const name = () => {}`) 사용
- React 컴포넌트/훅/핸들러/헬퍼는 함수 표현식으로 작성
- `type.ts`, `types.ts`, `dto.ts`에서 타입 선언은 `type`만 사용
- 단, 유니온 파생용 상수(`as const`) 값 선언은 같은 파일에서 허용
- `declaration merging`/모듈 보강이 필요한 경우에만 `interface` 예외 허용
- 유니온 타입은 상수(`as const`)를 단일 소스로 두고 파생 타입으로 선언
- `any` 사용 금지. 불확실 타입은 `unknown`으로 받고 타입 가드/내로잉 수행
- 도메인 상태값/식별자/코드값은 raw `string` 대신 literal union 또는 브랜드 타입 우선 사용
- 일반 텍스트 필드(`title`, `description`, `search`)는 `string` 사용 허용

### Hard Rules (AI용)

#### 파일별 책임

- `service.ts`: API 호출 함수만 생성
- `queryKeys.ts`: key factory만 생성
- `hooks/queries.ts`: query 훅만 생성
- `hooks/mutations.ts`: mutation 훅만 생성
- `components/Page.tsx`: UI와 사용자 이벤트 처리만 생성
- 모든 신규 함수는 함수 표현식(`const name = () => {}`)으로 생성

#### 금지 패턴

- `service.ts`에 React Query import 금지
- `components/*`에서 `service.ts` 직접 import하는 코드 생성 금지 (반드시 `hooks/*` 경유)
- `queryKeys.ts` 없이 배열/문자열 key 직접 작성 금지
- `packages/* -> features/*` import 금지
- `packages/*`에서 앱 정책/화면 흐름/사용자 행위를 직접 결정하거나 실행하는 코드 생성 금지
- `packages/*`에서 라우팅 상수(`PATH` 등) 직접 참조 및 redirect 실행 금지
- `packages/*`에서 공통 이벤트(예: `401`)는 signal emit만 수행하고, 행위는 `app/features` handler에서 처리
- 신규 코드에서 함수 선언식(`function name() {}`) 생성 금지
- `type.ts`, `types.ts`, `dto.ts`에서 `interface` 생성 금지 (예외: `declaration merging`/모듈 보강)
- 유니온 타입을 상수 소스 없이 문자열 리터럴로 직접 하드코딩 금지
- 코드에서 `any` 생성 금지

#### 생성 순서

1. `type.ts`
2. `queryKeys.ts`
3. `service.ts`
4. `hooks/*`
5. `components/Page.tsx`
6. `app/*/page.tsx`

#### import 방향

- 상위 레이어에서 하위 레이어를 참조한다.
- 역방향 참조를 생성하지 않는다.

#### query key 규칙

- `all/lists/list/details/detail` 구조를 유지한다.
- 파라미터는 정규화 객체로 key에 넣는다.

### Soft Rules

- `components/Page.tsx` 네이밍을 기본으로 사용
- `index.tsx` 과도 사용 지양 (진입점이 아닌 파일은 명시적 파일명 사용)
- `common` 승격은 2개 이상 도메인 재사용 + 정책 비의존 확인 후 진행
- 분리 타이밍은 체감 불편 이전이 아니라 복잡도 지표 충족 시점에 수행
- `hooks/*`, `components/*`에서는 확장 의도를 명확히 보여야 할 때 `interface`를 우선 사용
- 단, 유니온/조건부/매핑 타입이 필요한 경우 위치와 무관하게 `type`을 사용
- 단일 컴포넌트에 서로 다른 UI 책임(입력/필터/목록/상세/요약 등)이 공존할 수 있으나, 아래 조건 중 하나라도 충족하면 책임 단위로 분리
- 특정 상태 변경이 무관한 UI 영역까지 불필요한 재렌더링을 유발하는 경우 (React DevTools Profiler로 확인)
- 분기/검증/이벤트 로직 증가로 컴포넌트 가독성과 변경 안정성이 떨어지는 경우
- 하위 영역의 재사용 가능성이 생긴 경우
- 단일 컴포넌트가 180줄 이상이거나 조건 분기가 5개 이상으로 증가한 경우
- 분리 후 상위는 데이터 흐름 조합, 하위는 UI 표현/입력 처리에 집중
- props는 DOM 이벤트 객체보다 도메인 값(`id`, `status`, `filter`) 중심 전달을 우선

### 규칙 충돌/예외 처리

- 충돌 시 우선순위: 런타임 안전성 > 아키텍처 규칙 > 스타일 규칙
- Hard Rule 예외는 PR 설명에 사유, 범위, 만료 조건을 명시
- `eslint-disable`는 라인 단위 최소 범위로만 허용하고 사유 주석 필수

### 규칙-검증 매핑 (도입 권장)

- `any` 금지: `@typescript-eslint/no-explicit-any`
- import 경계: `no-restricted-imports` 또는 `eslint-plugin-boundaries`
- query key 하드코딩 금지: 커스텀 ESLint 룰 또는 코드리뷰 체크리스트 강제
- 함수 스타일 통일: `func-style` + 코드리뷰 체크리스트
- 문서 규칙은 가능한 항목부터 린트/PR 템플릿으로 자동 검증

## 9. import 방향 규칙

### 허용 방향

- `app/* -> features/domain-*`, `features/common`, `packages/*`
- `features/domain-* -> features/common`, `packages/*`
- `features/common -> packages/*`
- `packages/* -> packages/*`

### 금지 방향

- `packages/* -> features/*`
- `features/common -> features/domain-*`
- `app/* -> service.ts` 직접 참조 (반드시 `components/Page.tsx`를 통해 진입)

## 10. 도메인 경계 기준 (소유권 기준)

- 도메인 폴더는 해당 비즈니스 기능의 UI/API/캐시 정책을 소유한다.
- 다른 도메인에서 재사용이 필요해도 비즈니스 정책이 다르면 복사 후 분기한다.
- 완전히 중립적인 요소만 `features/common`으로 승격한다.

### `common` 승격 기준

- 동일 요구를 가진 2개 이상 도메인에서 반복 사용한다.
- 도메인 고유 용어/정책 의존이 없다.
- 소유 팀이 공통 변경 책임을 수용 가능하다.

## 11. 상태관리 역할 분리

### 기준

- TanStack Query: 서버 상태(목록/상세/캐시/동기화)
- Store(Jotai): 앱 전역 UI 상태(모달, 토스트, 레이아웃 상태)
- URL 상태: 공유 가능한 필터/탭/페이지/검색 조건
- Local State: 단일 컴포넌트 임시 UI 상태

### 상태 위치 의사결정 질문

1. 서버가 진실 소스인가?
2. URL로 표현/공유해야 하는가?
3. 앱 전역 UI 상태인가?
4. 컴포넌트 로컬 상태로 충분한가?

질문의 첫 `Yes`에 해당하는 위치를 우선 적용한다.

## 12. 도입 전략 (점진 도입 로드맵)

### Phase 1. 규칙 고정

- 본 문서 합의
- 템플릿 파일 구조 합의
- 리뷰 체크리스트 도입

### Phase 2. 신규 기능 우선 적용

- 신규 도메인/페이지부터 강제
- 외주 산출물 동일 규칙 적용

### Phase 3. 고통 도메인 우선 리팩토링

- 변경 빈도/장애 빈도 높은 도메인부터 개선

### Phase 4. 자동화

- 생성기, 린트 제약, PR 템플릿에 규칙 반영

## 13. 코드 리뷰 체크리스트

### Hard Checklist (Pass/Fail)

- `app/*/page.tsx`가 엔트리 역할만 수행하는가?
- `service.ts`가 순수 API 함수만 포함하는가?
- `components/*`가 `service.ts`를 직접 참조하지 않고 `hooks/*`를 통해 데이터/행위를 사용하는가?
- query key가 `queryKeys.ts` factory를 통해서만 사용되는가?
- mutation 성공 시 필요한 invalidate가 정확히 포함되는가?
- 서버 상태를 store로 복제하지 않았는가?
- `features/common`이 도메인 비의존성을 지키는가?
- import 방향이 허용 규칙을 위반하지 않는가?
- 함수 스타일이 함수 표현식 기준으로 통일되어 있는가?
- `type.ts`, `types.ts`, `dto.ts`에서 `type` 규칙과 예외 규칙을 지켰는가?
- 유니온 타입이 상수 소스(`as const`)에서 파생되었는가?
- `any` 없이 `unknown` + 내로잉 규칙을 지켰는가?

### Soft Checklist (Review Comment)

- 분리 수준이 과하거나 부족하지 않은가?
- 컴포넌트 책임 분리 기준(재렌더 영향/복잡도/재사용성/파일 크기)을 충족하는가?

## 14. 예시 코드 설명 (파일 책임 요약)

- `app/domain-a/page.tsx`: 라우트 엔트리. `Page` 컴포넌트 렌더링만 수행
- `features/domain-a/components/Page.tsx`: 화면 UI + 사용자 이벤트 처리
- `features/domain-a/hooks/queries.ts`: list/detail query 훅 정의
- `features/domain-a/hooks/mutations.ts`: 상태 변경 mutation + invalidate 정책
- `features/domain-a/service.ts`: API 호출 함수와 응답 매핑 연결
- `features/domain-a/queryKeys.ts`: key factory 정의
- `features/domain-a/type.ts`: 도메인 타입 및 DTO 타입 정의
- `features/domain-a/mapper.ts`: DTO -> 도메인 모델 매핑
- `packages/http/index.ts`: 범용 HTTP 레이어(예시 mock)

## 15. 확장 시 분리 기준

### `type.ts` 분리 기준

- `type.ts`가 150줄 초과
- DTO 타입이 3개 이상으로 증가
- snake_case -> camelCase 매핑 로직이 2개 이상 발생

분리 방식: `type.ts` -> `dto.ts`, `types.ts`, `mapper.ts`

### `service.ts` 분리 기준

- 파일 길이 200줄 초과
- API 함수 6개 이상
- 목록/상세/생성/수정/삭제 책임이 혼재

분리 방식: `services/list.ts`, `services/detail.ts`, `services/update.ts`

### `hooks/queries.ts`, `hooks/mutations.ts` 분리 기준

- 파일 길이 220줄 초과
- 훅 개수 6개 이상
- 도메인 하위 기능이 2개 이상으로 분기

분리 방식: `hooks/useDomainAListQuery.ts`, `hooks/useDomainADetailQuery.ts`, `hooks/useUpdateDomainAStatusMutation.ts`

### 분리 원칙

- 처음부터 과분할하지 않는다.
- 복잡도 지표 충족 시점에만 승격 분리한다.
- 분리 후에도 파일 책임 1개 원칙을 유지한다.
