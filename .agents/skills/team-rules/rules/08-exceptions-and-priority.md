# EX-01 Exceptions and Rule Priority

- Priority: P1
- 적용 범위: 모든 예외 상황

## MUST

- 규칙 충돌 시 우선순위를 적용한다.
  1. 런타임 안전성
  2. 아키텍처 규칙
  3. 스타일 규칙
- Hard Rule 예외는 PR에 예외는 승인자/작성자/만료일을 필수로 기록한다.
- Hard Rule 예외는 PR에 Owner, Approver, Expiry를 포함해야 하며, 정보 누락 시 예외를 무효로 본다.
- 만료일 도달 시 갱신 또는 제거 중 하나를 반드시 수행한다.

## MUST NOT

- 사유 없는 `eslint-disable`를 허용하지 않는다.
- 파일 전체 disable을 기본값으로 사용하지 않는다.

## SHOULD

- `eslint-disable`는 라인 단위 최소 범위만 허용한다.

## 왜 필요한가

예외 기록이 없으면 임시 코드가 표준이 되어 규칙 체계가 빠르게 무너진다.

## 예외 기록 템플릿

```md
### Rule Exception
- Rule ID: IMP-01
- Owner: @코드_작성자_깃헙_계정
- Approver: @리뷰자__깃헙_계정
- Reason: 외부 SDK 구조 제약
- Scope: /features/domain-a/service.ts:21
- Expiry: 2026-04-30
- Follow-up: SDK wrapper 도입 후 제거
```

## 리뷰 체크 (Yes/No)

- 예외 기록에 사유/범위/만료조건이 모두 있는가?
- disable 범위가 최소인가?

## 자동 검증

- 린트: 부분 가능
- 리뷰 수동: 필수
