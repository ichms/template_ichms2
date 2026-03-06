# template_ichms2

협업을 위한 환경설정 및 컨벤션 초안입니다.
예시 코드는 프로젝트로 대체합니다. 

티켓을 예매하는 웹 애플리케이션으로
티켓 예매 플로우(상세 -> 대기열 -> 좌석 -> 완료)를 중심으로 구성한 
Next.js(App Router) 기반 프로젝트입니다.

## 프로젝트 개요

- 핵심 도메인: `features/ticket/*`
- 공통 UI/스토어: `features/common/*`
- 라우팅 엔트리: `app/*`
- 주요 기술 스택:
  - Next.js 16
  - React 19
  - TypeScript 5
  - TanStack Query 5
  - Jotai
  - ESLint 9
  - Tailwind CSS 4

## 디렉터리 구조

```text
.
├── app/                      # App Router 라우트
│   └── ticket/[id]/*
├── features/
│   ├── ticket/               # 도메인별 service/hooks/queryKeys/components
│   ├── common/               # 공통 컴포넌트/훅/스토어
│   └── shell/                # 전역 provider
├── packages/
│   ├── http/                 # HTTP client
│   └── utils/                # 공용 유틸
├── scripts/
│   └── check-query-keys.mjs  # Query Key 규칙 검사
└── .husky/                   # Git hooks
```

## 실행 방법

### 1) 의존성 설치

```bash
pnpm install
```

설치 시 `prepare` 스크립트가 실행되어 Husky 훅이 활성화됩니다.

### 2) 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속

### 3) 빌드 및 프로덕션 실행

```bash
pnpm build
pnpm start
```

## 스크립트

- `pnpm dev`: 개발 서버 실행
- `pnpm build`: 프로덕션 빌드
- `pnpm start`: 빌드 결과 실행
- `pnpm lint`: ESLint 검사
- `pnpm typecheck`: TypeScript 타입 검사
- `pnpm lint:rules`: 커스텀 규칙 검사(`scripts/check-query-keys.mjs`)
- `pnpm ci:check`: `lint + typecheck + lint:rules` 일괄 실행

`pnpm lint`에는 훅 네이밍 컨벤션(`Query/Mutation/Jotai`) 검사도 포함됩니다.

## Husky 워크플로우

이 프로젝트는 커밋/푸시 시점에 자동 검증을 수행합니다.

- `pre-commit` -> `pnpm lint`
- `pre-push` -> `pnpm ci:check`

### 동작 흐름

1. `git commit` 실행
2. Husky `pre-commit`에서 린트 수행
3. 린트 통과 시 커밋 완료
4. `git push` 실행
5. Husky `pre-push`에서 `ci:check` 수행
6. 전체 검증 통과 시 푸시 완료

### 실패 시 대응

- 커밋 실패: `pnpm lint` 결과를 수정 후 재커밋
- 푸시 실패: `pnpm ci:check` 결과를 수정 후 재푸시

상세 설명 문서: [`.agents/skills/team-rules/human/husky-workflow.md`](.agents/skills/team-rules/human/husky-workflow.md)

## 코드 컨벤션

- 모든 신규 함수는 함수 표현식(`const fn = () => {}` 또는 `const fn = function () {}`)으로 작성한다.
- 함수 선언식(`function name() {}`)은 지양한다.
- React 컴포넌트, 이벤트 핸들러, 렌더 헬퍼도 함수 표현식으로 작성한다.
- 훅 네이밍은 `React Query: use*Query/use*Mutation`, `Jotai: use*Value/useSet*`를 따른다.

관련 문서: [`.agents/skills/team-rules/human/hook-naming-convention.md`](.agents/skills/team-rules/human/hook-naming-convention.md)
