# Team Rules Human Guide

`team-rules` 스킬의 규칙/가이드라인 구조를 빠르게 이해하고, 
실제 PR 의사결정에 바로 적용할 수 있도록 정리한 운영 문서입니다.

## 1) 온보딩 경로

1. `rules/00-governance/hard-rules.md` (`GOV-02`): Hard Rule SSOT
2. `rules/00-governance/priority-matrix.md` (`GOV-01`): Priority/Enforcement 해석
3. `rules/01,02,05,07,12`: 핵심 설계/데이터/경계/React 규칙
4. `rules/09-enforcement-and-review.md` (`REV-01`): PR/CI 리뷰 방식
5. `rules/08-exceptions-and-priority.md` (`EX-01`): 예외 처리 체계

## 2) 규칙 시스템의 핵심 모델

규칙 문장 자체보다 `위험도(Priority)`와 `집행 강도(Enforcement)`를 분리 운영한다.

| 축 | 값 | 의미 |
| --- | --- | --- |
| Priority | `P0` | 장애/보안/정합성 붕괴 위험 |
| Priority | `P1` | 유지보수성/변경 안정성 위험 |
| Priority | `P2` | 품질/확장성 개선 항목 |
| Enforcement | `Hard Gate` | 위반 시 차단 |
| Enforcement | `Warning` | 머지 가능, 코멘트/추적 필수 |
| Enforcement | `Guide` | 권고 |

핵심 포인트: `P0`가 항상 Hard Gate는 아니며, 
최종 차단 여부는 `GOV-02`의 Rule ID별 Enforcement를 따른다.

## 3) 문서 구조(어디서 무엇을 찾는가)

- `rules/00-governance/*`: 규칙 SSOT, 우선순위/집행 강도, soft guidance
- `rules/01~12`: 도메인별 실행 규칙(아키텍처, Query, 타입, import, 상태, React)
- `rules/30-ai/*`: AI 에이전트 실행형 지시(자동 생성/수정 기준)
- `rules/40-operations/*`: 린트/CI/PR 템플릿 매핑
- `rules/50-reference/*`, `*.example.md`: 참고/예시(실행 지시 아님)

문서 위치가 헷갈리면 `rules/00-index.md`의 Rule Locator를 기준으로 찾는다.

## 4) 실무 적용 프레임 (개발/리뷰 공통)

1. 작업 시작 전: 변경 대상 파일이 어떤 레이어(`app`, `features/domain-*`, `features/common`, `packages`)인지 먼저 확정한다.
2. 구현 중: Hard Gate 항목부터 선검증하고, Warning/Guide는 “근거 있는 선택”으로 남긴다.
3. PR 전: `REV-01` Hard Checklist를 Pass/Fail로 기록하고, Warning 항목은 코멘트 + 추적 액션(언제/누가/어떻게)까지 남긴다.

## 5) 반드시 지켜야 할 Hard Gate 축

- 아키텍처: `app/*/page.tsx` Thin Route 유지, app 직접 write/invalidate 금지
- 경계: `packages -> features`, `common -> domain` 금지
- Query: key factory 강제, `service.ts`의 React Query 훅 금지
- 타입 안정성: `any` 금지
- React: `react-hooks/exhaustive-deps` disable 금지

이 5축은 “구현 스타일”이 아니라 “운영 안전장치”로 취급한다.

## 6) Warning/Guide에서 자주 갈리는 판단

- mutation invalidate 범위: broad invalidate(`all`)보다 최소 범위(`lists/detail`) 우선
- 상태 소유권: 서버 상태는 Query cache 단일 소스 유지
- 타입 표현: 모델 타입 파일은 `type` 기본, 컴포넌트/훅 계약은 `type|interface` 허용
- React Effect: 동기화 용도만 허용, 이벤트/파생 상태 처리에 남용 금지
- 스케일링: 파일 길이 단일 지표가 아니라 크기/복잡도/렌더 영향 3축으로 판단

## 7) 예외 처리 원칙 (`EX-01`)

Hard Rule 예외는 “허용”이 아니라 “기한 있는 부채”로 기록한다.

- 필수 필드: `Rule ID`, `Owner`, `Approver`, `Reason`, `Scope`, `Expiry`
- 누락 시 예외 무효
- 만료 시 7일 내 갱신/제거
- `eslint-disable`는 최소 라인 범위 + 사유 주석 필수

## 8) 신규 기능과 기존 수정의 차이

- 신규 기능(Mode A): `type -> queryKeys -> service -> hooks -> Page -> app route` 순서 권장
- 기존 수정(Mode B): 필요한 파일만 최소 수정, 다만 Hard Gate는 동일 적용

즉, 생성 순서는 달라도 준수 기준은 동일하다.

## 9) Senior 개발자가 특히 보는 포인트

- 규칙의 목표가 “코드 모양 통일”인지 “운영 리스크 차단”인지 구분했는가?
- Warning 항목을 무시하지 않고, 팀 합의 가능한 기술 부채로 관리하고 있는가?
- 예외가 개인 판단이 아니라 추적 가능한 운영 이벤트로 남는가?
- 규칙 자동화 대상(린트/CI)과 수동 리뷰 대상을 분리해 운영하는가?

## 10) 빠른 참조 맵

- 규칙 SSOT: `rules/00-governance/hard-rules.md`
- 우선순위 해석: `rules/00-governance/priority-matrix.md`
- 리뷰 프로세스: `rules/09-enforcement-and-review.md`
- 예외 템플릿: `rules/08-exceptions-and-priority.md`
- AI 생성 규칙: `rules/30-ai/ai-agent-rules.md`
- 검증 매핑: `rules/40-operations/enforcement-mapping.md`
