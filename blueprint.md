# 최종 청사진 (Blueprint)

## 한 줄 요약

이 구조를 도입하면 **“페이지를 고치는 일”이 폴더 찾기 + 규칙 추측**이 아니라,  
**도메인 안의 정해진 위치만 수정하는 일**로 바뀝니다.

결과적으로:

- 신규 기능 추가 속도 향상
- PR 리뷰 효율 향상
- 외주/AI 산출물 품질 편차 감소
- 구조 붕괴 속도 감소
- 유지보수성 향상

---

## 1. 도입 후 팀이 체감하는 변화 (Before → After)

### Before (도입 전)
- 어디에 코드를 둘지 사람마다 다름
- `common`으로 올릴지 도메인에 둘지 매번 논쟁
- API 호출 / Query / UI 로직이 섞여 있음
- query key 불일치 / invalidate 누락 발생
- 외주/AI 코드가 팀 패턴을 자주 벗어남
- PR 리뷰가 구조 지적 위주로 소모됨

### After (도입 후)
- 기능 추가 시 **도메인 템플릿 기반으로 시작**
- `service.ts` / `hooks/queries.ts` / `hooks/mutations.ts` / `queryKeys.ts` 위치가 고정
- query key 패턴 통일로 invalidate 실수 감소
- PR 리뷰가 구조보다 **비즈니스 로직/UX 품질 중심**으로 이동
- AI/외주 산출물의 형태가 일정해짐
- 신규 팀원 온보딩 속도 개선

---

## 2. 아키텍처 청사진 (최종 모습)

### 레이어별 책임

#### `app/`
- Next.js App Router 진입점
- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- 라우트 조합 및 진입 역할
- 가능한 얇게 유지

#### `features/domain-*`
- 도메인 UI (`components`)
- TanStack Query 훅 (`hooks`)
- API 호출 (`service`)
- query key (`queryKeys`)
- 타입 (`type.ts`, 필요 시 `dto.ts`/`types.ts`)
- 도메인 중심 응집도 확보

#### `features/common`
- 도메인 비의존 공통 UI/훅/유틸/타입
- 앱 전역 UI 상태만 store에 관리
- 특정 도메인 정책 금지

#### `packages`
- 앱/도메인 비의존 범용 모듈
- 예: `http`, `utils`, `validation`, `date`
- `features/*`에 의존하지 않음

---

## 3. 기능 개발의 표준 플로우 (도입 후)

### 신규 기능 추가 시 (예: `domain-b/b3`)

#### Step 1. 도메인 템플릿 생성
기본 생성 파일(권장):
- `components/Page.tsx`
- `hooks/queries.ts`
- `hooks/mutations.ts`
- `service.ts`
- `queryKeys.ts`
- `type.ts`

#### Step 2. API 함수 작성 (`service.ts`)
- 순수 API 호출 함수만 작성
- React Query 로직 금지

#### Step 3. Query Key 작성 (`queryKeys.ts`)
- list/detail 패턴 통일
- query key 하드코딩 금지

#### Step 4. Query/Mutation 훅 작성 (`hooks/*`)
- `useQuery`, `useMutation`
- `enabled`, `staleTime`, `select`
- `invalidateQueries` 관리

#### Step 5. UI 작성 (`components/Page.tsx`)
- 렌더링/상호작용 중심
- 네트워크/캐시 로직 최소화

#### Step 6. 라우트 연결 (`app/.../page.tsx`)
- feature의 `Page.tsx` import 후 렌더링

---

## 4. PR / 코드리뷰 청사진 (도입 후 변화)

### 도입 전 리뷰의 주요 소모 포인트
- “왜 common에 있나요?”
- “service에 `useQuery`가 있네요”
- “query key가 제각각이네요”
- “폴더 구조 통일 필요”

### 도입 후 리뷰의 중심
구조 지적보다 다음 항목에 집중 가능:

- 비즈니스 로직 정확성
- 에러 처리 / 로딩 UX
- 캐시 전략 적절성 (`staleTime`, invalidate 범위)
- 타입 안정성
- 접근성 및 컴포넌트 책임 분리

> 즉, **구조 정렬 비용 감소 → 제품 품질 리뷰 강화**로 전환됩니다.

---

## 5. 외주 협업 청사진

### 외주 가이드 전달 방식 (도입 후)
외주에 “우리 스타일로 맞춰주세요”가 아니라, **고정된 산출물 형식**을 전달할 수 있습니다.

#### 외주가 따라야 할 최소 규칙 예시
- 화면 컴포넌트는 `components/Page.tsx`
- API 호출은 `service.ts`
- Query 훅은 `hooks/queries.ts`, `hooks/mutations.ts`
- query key는 `queryKeys.ts`
- `common`은 승인된 공통만 사용/추가
- `packages` 수정은 승인 후 진행

### 기대 효과
- 산출물 구조 편차 감소
- 병합/검수 속도 향상
- 리팩토링 비용 감소
- 내부팀의 인수 난이도 하락

> 핵심은 퍼블리싱 결과물 자체보다, **결과물이 들어오는 형식의 표준화**입니다.

---

## 6. AI 에이전트 활용 청사진

이 구조는 AI와 궁합이 좋습니다. 이유는 **반복 가능한 패턴**이 명확하기 때문입니다.

### 도입 후 AI 활용 방식
예시 프롬프트:
- “`domain-a`에 상세 조회 쿼리 추가”
- “`service.ts`에 API 함수 추가하고 `hooks/queries.ts`에 `useQuery` 생성”
- “`queryKeys.ts` 패턴 유지”
- “`components/Page.tsx`에는 UI만 작성”

### 기대 효과
- AI가 구조를 덜 벗어남
- 결과물 형태가 팀 패턴에 수렴
- 리뷰 포인트 감소
- 팀원별 AI 사용 편차 완화

### AI Hard Rule로 연결 가능한 포인트
- `service.ts`에 hook 금지
- `common`에서 domain import 금지
- query key 하드코딩 금지
- `app/page.tsx`에 비즈니스 로직 과도 작성 금지

---

## 7. 확장 청사진 (프로젝트 규모 증가 시)

이 구조는 **성장 가능한 기본형**입니다.

### 초기 단계 (권장 기본형)
도메인마다 최소 구성:
- `components/Page.tsx`
- `hooks/queries.ts`
- `hooks/mutations.ts`
- `service.ts`
- `queryKeys.ts`
- `type.ts`

### 성장 단계 (복잡도 증가 시)
증상:
- `service.ts` 비대화
- 타입 혼재
- hooks 파일 비대화
- invalidate 복잡성 증가

#### 점진 분리 방향

##### 타입 분리
- `type.ts` → `dto.ts`, `types.ts`, `mapper.ts`

##### service 분리
- `service.ts` → `services/list.ts`, `services/detail.ts`, `services/update.ts`
- 또는 `api/*` 구조 승격

##### hooks 분리
- `hooks/queries.ts` → `hooks/useXxxListQuery.ts`, `hooks/useXxxDetailQuery.ts`
- `hooks/mutations.ts` → `hooks/useCreateXxxMutation.ts` 등

> 처음부터 과하게 쪼개지 않고, **복잡도가 실제로 올라갈 때 승격**합니다.

---

## 8. 상태관리 청사진 (TanStack Query + Store + URL + Local State)

도입 후 가장 선명해지는 부분 중 하나입니다.

### 역할 분담

#### TanStack Query (서버 상태)
- 목록/상세 API 데이터
- 캐싱/리패치
- 로딩/에러 상태
- invalidate
- 서버와 동기화

#### Store (클라이언트 UI 전역 상태)
- 모달 열림/닫힘
- 토스트
- 사이드바 상태
- 앱 셸 UI 상태
- 테마/언어

#### URL 상태 (공유 가능한 화면 상태)
- 필터/정렬/페이지
- 검색어
- 탭 (딥링크 필요 시)

#### 컴포넌트 로컬 상태
- 일회성 입력값
- 임시 UI 상태
- 폼 편집 중 상태

### 결과
“이 상태를 어디에 둬야 하지?”에 대한 판단이 빨라지고, 역할 충돌이 줄어듭니다.

---

## 9. 팀 운영 청사진 (문서 + 룰 + 자동화)

구조 도입만으로는 절반이고, 운영 자산이 붙어야 완성됩니다.

### 최종적으로 갖추게 되는 운영 자산

#### 1) `SKILL.md`
- 디자인 패턴
- 디렉토리 구조
- 책임/경계
- 예시 코드
- 운영 원칙

#### 2) Hard Rules (사람용)
- 코드 리뷰 체크리스트
- 금지/허용 사항
- 예외 처리 절차

#### 3) Hard Rules (AI용)
- 에이전트 프롬프트 규칙
- 생성 결과 검증 규칙
- 금지 패턴 명시

#### 4) Soft Rules
- 권장 네이밍
- common 승격 기준
- 분리 타이밍 기준
- 도메인 소유권 기준

#### 5) 템플릿 / 생성기
- 예: `pnpm gen:feature domain-a`
- 기본 파일 자동 생성
- 구조 표준화 자동화

#### 6) 린트 / 제약 규칙 (가능하면)
- import 방향 제한
- forbidden import
- query key 하드코딩 방지 (린트 또는 리뷰 체크리스트)

---

## 10. 도입 로드맵 청사진 (현실적인 순서)

한 번에 전면 교체하지 않고 **점진 도입**을 권장합니다.

### Phase 1. 규칙 정의 (문서화)
목표: “무엇이 정답인지” 먼저 고정

- `SKILL.md` 공유
- 도메인 템플릿 확정
- `service / hooks / queryKeys` 책임 정의
- `common / store` 경계 정의
- import 방향 정의

**성과**
- 신규 코드부터 품질 기준 통일 가능

---

### Phase 2. 신규 기능부터 적용
목표: 기존 코드 대수술 없이 패턴 정착

- 신규 화면/기능에만 우선 적용
- 외주 산출물도 동일 형식 요구
- 코드리뷰에서 구조 규칙 먼저 확인

**성과**
- 낮은 리스크로 빠른 체감 효과

---

### Phase 3. 고통 큰 도메인부터 점진 리팩토링
목표: 유지보수 비용이 큰 영역 우선 개선

#### 우선순위 추천
1. 변경이 잦은 도메인
2. query key / invalidate 오류가 자주 나는 도메인
3. service/hooks/UI가 섞여 있는 도메인
4. 외주 병합 예정 도메인

**성과**
- 높은 ROI 리팩토링

---

### Phase 4. 자동화 / 강제
목표: 사람 의존도 감소

- 템플릿 생성기 도입
- ESLint import restriction
- PR 체크리스트 템플릿
- AI용 프롬프트 템플릿 배포

**성과**
- 구조 유지 비용 감소
- 팀 규모 확대 시 안정성 증가

---

## 11. 성공 여부 판단 지표 (KPI)

### 정성 지표
- 신규 기능 PR에서 구조 지적 코멘트 감소
- “어디에 둬야 하나요?” 질문 감소
- 온보딩 시간 단축
- 외주 산출물 병합 난이도 감소

### 정량 지표 (가능하면)
- PR 리뷰 시간 감소
- query key / invalidate 관련 버그 감소
- 리팩토링 없이 기능 추가 가능한 비율 증가
- 신규 도메인 생성 시간 감소 (템플릿 도입 후)
- 공통 컴포넌트 재사용률 증가 (의미 있는 범위 내)

---

## 12. 최종 청사진 (도입 후 이상적인 상태)

도입 후 이상적인 팀/코드베이스의 모습은 다음과 같습니다.

- `app`은 얇고 라우팅 엔트리에 집중한다.
- `features`는 도메인별로 응집되어 있다.
- `service.ts`는 순수 API 호출만 담당한다.
- `hooks/`가 서버 상태(TanStack Query)를 통제한다.
- `queryKeys.ts`가 캐시 규칙을 통일한다.
- `common`에는 진짜 공통만 남는다.
- `store`는 UI 전역 상태만 관리한다.
- 외주/AI 산출물도 동일한 구조로 들어온다.
- PR 리뷰는 구조 정렬보다 제품 품질에 집중한다.

### 최종 효과
팀은 더 이상 “구조를 맞추느라” 시간을 쓰지 않고,  
**제품 문제를 해결하는 데 시간을 쓸 수 있게 됩니다.**

---

## 부록: 실행 우선순위 (빠른 적용용)

바로 시작한다면 아래 5개를 먼저 고정하세요.

1. `service.ts` = API 호출만
2. TanStack Query는 `hooks/`에서만 사용
3. `queryKeys.ts` 분리
4. `common`의 도메인 비의존성 유지
5. import 방향 규칙 고정

이 5개만 잡아도 구조 붕괴 속도를 크게 낮출 수 있습니다.# 최종 청사진 (Blueprint)

## 한 줄 요약

이 구조를 도입하면 **“페이지를 고치는 일”이 폴더 찾기 + 규칙 추측**이 아니라,  
**도메인 안의 정해진 위치만 수정하는 일**로 바뀝니다.

결과적으로:

- 신규 기능 추가 속도 향상
- PR 리뷰 효율 향상
- 외주/AI 산출물 품질 편차 감소
- 구조 붕괴 속도 감소
- 유지보수성 향상

---

## 1. 도입 후 팀이 체감하는 변화 (Before → After)

### Before (도입 전)
- 어디에 코드를 둘지 사람마다 다름
- `common`으로 올릴지 도메인에 둘지 매번 논쟁
- API 호출 / Query / UI 로직이 섞여 있음
- query key 불일치 / invalidate 누락 발생
- 외주/AI 코드가 팀 패턴을 자주 벗어남
- PR 리뷰가 구조 지적 위주로 소모됨

### After (도입 후)
- 기능 추가 시 **도메인 템플릿 기반으로 시작**
- `service.ts` / `hooks/queries.ts` / `hooks/mutations.ts` / `queryKeys.ts` 위치가 고정
- query key 패턴 통일로 invalidate 실수 감소
- PR 리뷰가 구조보다 **비즈니스 로직/UX 품질 중심**으로 이동
- AI/외주 산출물의 형태가 일정해짐
- 신규 팀원 온보딩 속도 개선

---

## 2. 아키텍처 청사진 (최종 모습)

### 레이어별 책임

#### `app/`
- Next.js App Router 진입점
- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- 라우트 조합 및 진입 역할
- 가능한 얇게 유지

#### `features/domain-*`
- 도메인 UI (`components`)
- TanStack Query 훅 (`hooks`)
- API 호출 (`service`)
- query key (`queryKeys`)
- 타입 (`type.ts`, 필요 시 `dto.ts`/`types.ts`)
- 도메인 중심 응집도 확보

#### `features/common`
- 도메인 비의존 공통 UI/훅/유틸/타입
- 앱 전역 UI 상태만 store에 관리
- 특정 도메인 정책 금지

#### `packages`
- 앱/도메인 비의존 범용 모듈
- 예: `http`, `utils`, `validation`, `date`
- `features/*`에 의존하지 않음

---

## 3. 기능 개발의 표준 플로우 (도입 후)

### 신규 기능 추가 시 (예: `domain-b/b3`)

#### Step 1. 도메인 템플릿 생성
기본 생성 파일(권장):
- `components/Page.tsx`
- `hooks/queries.ts`
- `hooks/mutations.ts`
- `service.ts`
- `queryKeys.ts`
- `type.ts`

#### Step 2. API 함수 작성 (`service.ts`)
- 순수 API 호출 함수만 작성
- React Query 로직 금지

#### Step 3. Query Key 작성 (`queryKeys.ts`)
- list/detail 패턴 통일
- query key 하드코딩 금지

#### Step 4. Query/Mutation 훅 작성 (`hooks/*`)
- `useQuery`, `useMutation`
- `enabled`, `staleTime`, `select`
- `invalidateQueries` 관리

#### Step 5. UI 작성 (`components/Page.tsx`)
- 렌더링/상호작용 중심
- 네트워크/캐시 로직 최소화

#### Step 6. 라우트 연결 (`app/.../page.tsx`)
- feature의 `Page.tsx` import 후 렌더링

---

## 4. PR / 코드리뷰 청사진 (도입 후 변화)

### 도입 전 리뷰의 주요 소모 포인트
- “왜 common에 있나요?”
- “service에 `useQuery`가 있네요”
- “query key가 제각각이네요”
- “폴더 구조 통일 필요”

### 도입 후 리뷰의 중심
구조 지적보다 다음 항목에 집중 가능:

- 비즈니스 로직 정확성
- 에러 처리 / 로딩 UX
- 캐시 전략 적절성 (`staleTime`, invalidate 범위)
- 타입 안정성
- 접근성 및 컴포넌트 책임 분리

> 즉, **구조 정렬 비용 감소 → 제품 품질 리뷰 강화**로 전환됩니다.

---

## 5. 외주 협업 청사진

### 외주 가이드 전달 방식 (도입 후)
외주에 “우리 스타일로 맞춰주세요”가 아니라, **고정된 산출물 형식**을 전달할 수 있습니다.

#### 외주가 따라야 할 최소 규칙 예시
- 화면 컴포넌트는 `components/Page.tsx`
- API 호출은 `service.ts`
- Query 훅은 `hooks/queries.ts`, `hooks/mutations.ts`
- query key는 `queryKeys.ts`
- `common`은 승인된 공통만 사용/추가
- `packages` 수정은 승인 후 진행

### 기대 효과
- 산출물 구조 편차 감소
- 병합/검수 속도 향상
- 리팩토링 비용 감소
- 내부팀의 인수 난이도 하락

> 핵심은 퍼블리싱 결과물 자체보다, **결과물이 들어오는 형식의 표준화**입니다.

---

## 6. AI 에이전트 활용 청사진

이 구조는 AI와 궁합이 좋습니다. 이유는 **반복 가능한 패턴**이 명확하기 때문입니다.

### 도입 후 AI 활용 방식
예시 프롬프트:
- “`domain-a`에 상세 조회 쿼리 추가”
- “`service.ts`에 API 함수 추가하고 `hooks/queries.ts`에 `useQuery` 생성”
- “`queryKeys.ts` 패턴 유지”
- “`components/Page.tsx`에는 UI만 작성”

### 기대 효과
- AI가 구조를 덜 벗어남
- 결과물 형태가 팀 패턴에 수렴
- 리뷰 포인트 감소
- 팀원별 AI 사용 편차 완화

### AI Hard Rule로 연결 가능한 포인트
- `service.ts`에 hook 금지
- `common`에서 domain import 금지
- query key 하드코딩 금지
- `app/page.tsx`에 비즈니스 로직 과도 작성 금지

---

## 7. 확장 청사진 (프로젝트 규모 증가 시)

이 구조는 **성장 가능한 기본형**입니다.

### 초기 단계 (권장 기본형)
도메인마다 최소 구성:
- `components/Page.tsx`
- `hooks/queries.ts`
- `hooks/mutations.ts`
- `service.ts`
- `queryKeys.ts`
- `type.ts`

### 성장 단계 (복잡도 증가 시)
증상:
- `service.ts` 비대화
- 타입 혼재
- hooks 파일 비대화
- invalidate 복잡성 증가

#### 점진 분리 방향

##### 타입 분리
- `type.ts` → `dto.ts`, `types.ts`, `mapper.ts`

##### service 분리
- `service.ts` → `services/list.ts`, `services/detail.ts`, `services/update.ts`
- 또는 `api/*` 구조 승격

##### hooks 분리
- `hooks/queries.ts` → `hooks/useXxxListQuery.ts`, `hooks/useXxxDetailQuery.ts`
- `hooks/mutations.ts` → `hooks/useCreateXxxMutation.ts` 등

> 처음부터 과하게 쪼개지 않고, **복잡도가 실제로 올라갈 때 승격**합니다.

---

## 8. 상태관리 청사진 (TanStack Query + Store + URL + Local State)

도입 후 가장 선명해지는 부분 중 하나입니다.

### 역할 분담

#### TanStack Query (서버 상태)
- 목록/상세 API 데이터
- 캐싱/리패치
- 로딩/에러 상태
- invalidate
- 서버와 동기화

#### Store (클라이언트 UI 전역 상태)
- 모달 열림/닫힘
- 토스트
- 사이드바 상태
- 앱 셸 UI 상태
- 테마/언어

#### URL 상태 (공유 가능한 화면 상태)
- 필터/정렬/페이지
- 검색어
- 탭 (딥링크 필요 시)

#### 컴포넌트 로컬 상태
- 일회성 입력값
- 임시 UI 상태
- 폼 편집 중 상태

### 결과
“이 상태를 어디에 둬야 하지?”에 대한 판단이 빨라지고, 역할 충돌이 줄어듭니다.

---

## 9. 팀 운영 청사진 (문서 + 룰 + 자동화)

구조 도입만으로는 절반이고, 운영 자산이 붙어야 완성됩니다.

### 최종적으로 갖추게 되는 운영 자산

#### 1) `SKILL.md`
- 디자인 패턴
- 디렉토리 구조
- 책임/경계
- 예시 코드
- 운영 원칙

#### 2) Hard Rules (사람용)
- 코드 리뷰 체크리스트
- 금지/허용 사항
- 예외 처리 절차

#### 3) Hard Rules (AI용)
- 에이전트 프롬프트 규칙
- 생성 결과 검증 규칙
- 금지 패턴 명시

#### 4) Soft Rules
- 권장 네이밍
- common 승격 기준
- 분리 타이밍 기준
- 도메인 소유권 기준

#### 5) 템플릿 / 생성기
- 예: `pnpm gen:feature domain-a`
- 기본 파일 자동 생성
- 구조 표준화 자동화

#### 6) 린트 / 제약 규칙 (가능하면)
- import 방향 제한
- forbidden import
- query key 하드코딩 방지 (린트 또는 리뷰 체크리스트)

---

## 10. 도입 로드맵 청사진 (현실적인 순서)

한 번에 전면 교체하지 않고 **점진 도입**을 권장합니다.

### Phase 1. 규칙 정의 (문서화)
목표: “무엇이 정답인지” 먼저 고정

- `SKILL.md` 공유
- 도메인 템플릿 확정
- `service / hooks / queryKeys` 책임 정의
- `common / store` 경계 정의
- import 방향 정의

**성과**
- 신규 코드부터 품질 기준 통일 가능

---

### Phase 2. 신규 기능부터 적용
목표: 기존 코드 대수술 없이 패턴 정착

- 신규 화면/기능에만 우선 적용
- 외주 산출물도 동일 형식 요구
- 코드리뷰에서 구조 규칙 먼저 확인

**성과**
- 낮은 리스크로 빠른 체감 효과

---

### Phase 3. 고통 큰 도메인부터 점진 리팩토링
목표: 유지보수 비용이 큰 영역 우선 개선

#### 우선순위 추천
1. 변경이 잦은 도메인
2. query key / invalidate 오류가 자주 나는 도메인
3. service/hooks/UI가 섞여 있는 도메인
4. 외주 병합 예정 도메인

**성과**
- 높은 ROI 리팩토링

---

### Phase 4. 자동화 / 강제
목표: 사람 의존도 감소

- 템플릿 생성기 도입
- ESLint import restriction
- PR 체크리스트 템플릿
- AI용 프롬프트 템플릿 배포

**성과**
- 구조 유지 비용 감소
- 팀 규모 확대 시 안정성 증가

---

## 11. 성공 여부 판단 지표 (KPI)

### 정성 지표
- 신규 기능 PR에서 구조 지적 코멘트 감소
- “어디에 둬야 하나요?” 질문 감소
- 온보딩 시간 단축
- 외주 산출물 병합 난이도 감소

### 정량 지표 (가능하면)
- PR 리뷰 시간 감소
- query key / invalidate 관련 버그 감소
- 리팩토링 없이 기능 추가 가능한 비율 증가
- 신규 도메인 생성 시간 감소 (템플릿 도입 후)
- 공통 컴포넌트 재사용률 증가 (의미 있는 범위 내)

---

## 12. 최종 청사진 (도입 후 이상적인 상태)

도입 후 이상적인 팀/코드베이스의 모습은 다음과 같습니다.

- `app`은 얇고 라우팅 엔트리에 집중한다.
- `features`는 도메인별로 응집되어 있다.
- `service.ts`는 순수 API 호출만 담당한다.
- `hooks/`가 서버 상태(TanStack Query)를 통제한다.
- `queryKeys.ts`가 캐시 규칙을 통일한다.
- `common`에는 진짜 공통만 남는다.
- `store`는 UI 전역 상태만 관리한다.
- 외주/AI 산출물도 동일한 구조로 들어온다.
- PR 리뷰는 구조 정렬보다 제품 품질에 집중한다.

### 최종 효과
팀은 더 이상 “구조를 맞추느라” 시간을 쓰지 않고,  
**제품 문제를 해결하는 데 시간을 쓸 수 있게 됩니다.**

---

## 부록: 실행 우선순위 (빠른 적용용)

바로 시작한다면 아래 5개를 먼저 고정하세요.

1. `service.ts` = API 호출만
2. TanStack Query는 `hooks/`에서만 사용
3. `queryKeys.ts` 분리
4. `common`의 도메인 비의존성 유지
5. import 방향 규칙 고정

이 5개만 잡아도 구조 붕괴 속도를 크게 낮출 수 있습니다.
