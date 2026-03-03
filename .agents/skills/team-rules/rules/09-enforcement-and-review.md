# REV-01 Enforcement and Review

- Priority: P0
- 적용 범위: CI, 코드리뷰, PR 템플릿

## MUST

- Hard 체크리스트를 Pass/Fail로 먼저 판단한다.
- 자동화 가능한 항목은 린트 규칙으로 우선 이관한다.
- P0 항목 위반은 예외 승인 없이는 CI fail로 차단한다.
- P1 항목은 경고 + 리뷰 코멘트, P2 항목은 개선 권고로 처리한다.

## 권장 린트 매핑

- `any` 금지: `@typescript-eslint/no-explicit-any` (error)
- import 경계: `no-restricted-imports`/`boundaries` (error)
- hooks deps: `react-hooks/exhaustive-deps` (error)
- query key 하드코딩: custom lint 또는 PR bot check (error)

## Hard Checklist (Pass/Fail)

- `app/*/page.tsx`가 엔트리 역할만 수행하는가?
- `service.ts`가 순수 API 함수만 포함하는가?
- query key가 `queryKeys.ts` factory를 통해 사용되는가?
- mutation 성공 시 필요한 invalidate가 포함되는가?
- 서버 상태를 store로 복제하지 않았는가?
- import 방향 규칙을 위반하지 않았는가?
- 함수 표현식/타입 규칙/`any` 금지를 지켰는가?
- 350/500/600줄 단계 기준(경고/분리계획/예외승인)을 준수했는가?

## Soft Checklist (Comment)

- 분리 수준이 과하거나 부족하지 않은가?
- 컴포넌트 책임 분리 기준(재렌더/복잡도/재사용성)을 충족하는가?

## 리뷰 체크 (Yes/No)

- Hard 항목 모두 Pass인가?
- Soft 항목 코멘트가 남았는가?

## 자동 검증

- 린트/CI: P0 항목 필수 차단, P1/P2 항목은 경고 또는 리뷰 보조
- 리뷰 수동: 필수
