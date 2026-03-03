# Team Rules Index

이 디렉토리는 간단하고 명확한 규칙으로 코드 품질을 일관되게 통제하기 위한 실행 규칙 모음이다.

## 우선순위

- P0: 즉시 장애/구조 붕괴 위험. 반드시 차단.
- P1: 유지보수 비용 급증 위험. 반드시 준수.
- P2: 품질/확장성 향상. 가급적 준수.

## 규칙 ID 체계

- `ARC-*`: 아키텍처
- `RQ-*`: TanStack Query
- `AI-*`: AI 코드 생성
- `TYPE-*`: 타입/함수 스타일/안전성
- `IMP-*`: Import 경계
- `DOM-*`: 도메인 경계/common 승격
- `STATE-*`: 상태 소유권
- `EX-*`: 예외/우선순위
- `REV-*`: 검증/리뷰
- `REF-*`: 참조 구현
- `SCALE-*`: 확장/도입

## 파일 목록

1. `01-architecture-foundation.md`
2. `02-tanstack-query-rules.md`
3. `03-hard-rules-ai.md`
4. `04-types-style-safety.md`
5. `05-import-boundaries.md`
6. `06-domain-boundary-common-promotion.md`
7. `07-state-ownership.md`
8. `08-exceptions-and-priority.md`
9. `09-enforcement-and-review.md`
10. `10-reference-implementation.md`
11. `11-scaling-and-adoption.md`
12. `12-react-component-practices.md`

## 사용 방법

1. 신규 기능 시작 전 `01`, `02`, `05`, `04`를 먼저 읽는다.
2. 코드리뷰 시 `09` 체크리스트로 Pass/Fail를 먼저 판단한다.
3. 예외가 필요하면 `08` 양식으로 기록 후 PR에 남긴다.
