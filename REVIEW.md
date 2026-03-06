# template_ichms2 검토 의견서

> 검토일: 2026-03-06
> 대상: 환경 구성 및 컨벤션 초안 (main 브랜치 de210df 기준)

---

## 1. README 기준 실행/검증 절차의 적합성

**결론: 적합 (소폭 보완 권장)**

- `pnpm install` → `pnpm dev` → `pnpm build` 절차가 명확하고, `prepare` 스크립트를 통한 Husky 자동 설정도 잘 안내되어 있음
- 스크립트 목록(`dev`, `build`, `lint`, `typecheck`, `lint:rules`, `ci:check`)이 빠짐없이 기술됨
- CI workflow(`.github/workflows/ci.yml`)도 `pnpm ci:check`와 일치하여 로컬-CI 간 검증 동일성이 보장됨

### 보완 권장

| 항목 | 현황 | 제안 |
|------|------|------|
| Node.js 버전 | CI에서 `node-version: 20` 사용, README에 미기재 | `.nvmrc` 또는 `package.json`의 `engines` 필드 추가 |
| pnpm 버전 | `pnpm-workspace.yaml`은 있으나 호환 버전 미기재 | `package.json`의 `packageManager` 필드 추가 |
| MSW 안내 | `msw` 의존성과 `mocks/` 디렉터리 존재, README 미기재 | 목 서버 기반 샘플 실행 방법 안내 추가 |

---

## 2. Husky 워크플로우 및 Hook 네이밍 컨벤션의 팀 표준 적합성

**결론: 적합 (commitlint 연동 누락 확인 필요)**

### Husky 워크플로우

- `pre-commit` → `pnpm lint`, `pre-push` → `pnpm ci:check` 구성이 간결하고 실용적
- 단계별 검증 범위가 적절 (커밋 시 빠른 린트, 푸시 시 전체 검증)
- `human/husky-workflow.md`에 `--no-verify` 금지 원칙 명시됨

### commitlint 연동 누락

`commitlint.config.cjs`와 `@commitlint/cli` 의존성은 설치되어 있으나, **`.husky/commit-msg` 훅 파일이 없음**. 현재 상태에서는 커밋 메시지 규칙이 자동 검증되지 않음.

```bash
# .husky/commit-msg (추가 필요)
pnpm commitlint --edit $1
```

### Hook 네이밍 컨벤션

- `use*Query`, `use*Mutation`, `use*Value`, `useSet*` 패턴이 ESLint `@typescript-eslint/naming-convention`으로 자동 검증되고 있어 좋음
- 샘플 코드 전체가 이 컨벤션을 준수하고 있음을 확인 (9개 검증 항목 모두 PASS)
- `human/hook-naming-convention.md` 문서도 간결하게 잘 정리되어 있음

---

## 3. `skills/team-rules` 문서 구조와 운영 기준의 적합성

**결론: 체계적으로 잘 설계됨 (일부 모호한 경계 보완 필요)**

### 잘 된 점

- **SSOT 원칙 철저** — Hard Rule 원문은 `GOV-02` 한 곳에서만 정의하고, Core Rules 문서는 Rule ID 참조 + 해설/예시만 제공
- **Priority x Enforcement 분리** — 위험도(P0/P1/P2)와 집행 강도(Hard Gate/Warning/Guide)를 분리해 해석하는 매트릭스가 명확
- **사람/AI 문서 분리** — `human/`은 실무자 빠른 참조, `rules/`는 AI 실행 기준으로 역할 구분
- **예외 처리 체계** — `EX-01` 템플릿에 Rule ID, Owner, Approver, Expiry 등 필수 필드 명시
- **Rule Locator** — `00-index.md`에서 경로 독립적으로 Rule ID만으로 문서 탐색 가능

### 보완이 필요한 점

| 항목 | 현황 | 제안 |
|------|------|------|
| `HR-RQ-03` Enforcement 불일치 | GOV-02에서 P1/Warning인데, `02-tanstack-query-rules.md`에서는 MUST로 기술 | MUST인데 Warning인 사유를 GOV-02에 더 명시적으로 기술하거나, 2026-06 재평가 시 Hard Gate 승격 검토 |
| Form 상태 경계 모호 | `07-state-ownership.md`에서 서버 로드 초기값을 form에 복사하는 케이스 미정의 | Form Draft 동기화 규칙 보충 |
| `get*ForPage` 범위 | 예시로만 등장하며 네이밍 패턴인지 필수 컨벤션인지 불명확 | 네이밍 규칙으로 확정하거나 대안 허용 범위 명시 |
| Common 승격 기준 | "공통 변경 책임 수용 가능"이라는 3번째 조건이 추상적 | 구체적 기준 추가 (예: 릴리스 주기 통일, 단일 관리자) |
| 검증 메타 실행성 | "선택", "제한적" 표기가 많아 실제 CI 자동화 수준 불명확 | 각 규칙별 현재 자동화 현황(구현됨/미구현) 명시 |
| 도메인 간 invalidate | 단일 도메인 내 invalidate만 다루고, cross-domain invalidate 규칙 부재 | mutation 영향이 타 도메인에 미칠 때의 가이드 추가 |

---

## 4. 우선적으로 수정이 필요한 항목

### P0 — 즉시 수정

1. **`.husky/commit-msg` 훅 추가**
   - commitlint 설정(`commitlint.config.cjs`, `@commitlint/cli`)은 되어 있으나 실제 훅 파일이 없어 커밋 메시지 검증이 동작하지 않음
   - `README.md`와 `human/husky-workflow.md`에도 `commit-msg` 단계 반영 필요

2. **Node.js / pnpm 버전 고정**
   - `package.json`에 `engines` 또는 `packageManager` 필드를 추가하여 환경 차이로 인한 이슈 방지

### P1 — 초안 보완 단계에서 처리

3. **`HR-RQ-03`의 MUST vs Warning 불일치 해소**
   - 문서를 읽는 사람이 혼란을 느낄 수 있음
   - GOV-02에 "정적 검증 한계로 임시 Warning" 사유를 더 명시적으로 기술

4. **MSW 실행 안내 추가**
   - README에 목 서버 기반 샘플 실행 방법을 안내하면 검토자가 바로 실행해볼 수 있음

5. **Form 상태 경계 명확화**
   - `07-state-ownership.md`에 서버 로드 초기값을 form state로 복사하는 허용 조건 추가

### P2 — 점진 개선

6. **검증 메타의 자동화 현황 문서화** — "선택", "제한적" 대신 "ESLint 구현됨", "CI 미구현(수동 리뷰)" 등으로 현행화
7. **`get*ForPage` 네이밍을 컨벤션으로 확정** 또는 대안 범위 명시
8. **Common 승격 조건 3번 구체화**

---

## 기타 확인 사항

### 샘플 코드 컨벤션 준수 현황

| 검증 항목 | 결과 |
|-----------|------|
| `app/*/page.tsx` Thin Route (HR-ARC-01) | PASS |
| `hooks/queries.ts` export명 `use*Query` | PASS |
| `hooks/mutations.ts` export명 `use*Mutation` | PASS |
| `store/*` export명 `use*Value` / `useSet*` | PASS |
| `service.ts`에서 `@tanstack/react-query` import 없음 (HR-RQ-02) | PASS |
| `queryKeys.ts` factory 패턴 사용 | PASS |
| 함수 표현식 스타일 (HR-STYLE-01) | PASS |
| `features/common` → `features/ticket` import 없음 (HR-IMP-02) | PASS |
| `packages` → `features` import 없음 (HR-IMP-01) | PASS |

### vercel-react-best-practices 스킬

- SWR 관련 내용 없음 — 팀 스택(TanStack Query)과 충돌 없음 확인
- 퍼포먼스 규칙 57개가 8개 카테고리로 분류되어 있음
- 데이터 페칭 라이브러리 특정 가이드는 포함되어 있지 않아 team-rules와 역할 분리가 자연스러움

---

## 총평

초안치고 완성도가 높음. SSOT 기반 규칙 체계, ESLint 자동 검증 연동, 사람/AI 문서 분리 등 설계 방향이 좋고, 샘플 코드도 컨벤션을 일관되게 따르고 있음. P0 항목 2건(commit-msg 훅 추가, 버전 고정)만 우선 반영하면 팀 공유 단계로 충분할 것으로 판단됨.
