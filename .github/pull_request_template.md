## Hard Rule Pass/Fail

- [ ] `HR-ARC-01` app route는 Thin Route(엔트리/조합)만 수행
- [ ] `HR-ARC-02` app read-only 조회는 `service.ts` 공개 조회 함수만 경유
- [ ] `HR-ARC-03` app에서 write/invalidate/정책성 side effect 직접 처리 없음
- [ ] `HR-IMP-01` `packages/* -> features/*` import 없음
- [ ] `HR-IMP-02` `features/common -> features/*(common 제외)` import 없음
- [ ] `HR-IMP-03` app의 `service.ts` import는 named import만 사용
- [ ] `HR-RQ-01` query key는 `queryKeys.ts` factory만 사용
- [ ] `HR-RQ-02` `service.ts`에 React Query import 없음
- [ ] `HR-TYPE-01` `any` 사용 없음
- [ ] `HR-REACT-03` `react-hooks/exhaustive-deps` 비활성화 없음

## Scale Check

- File:
- Line Count:
- Branch Count:
- Render Hotspot: yes/no
- Status: Warning / Hard Gate
- Split Plan:
- Owner:
- Target Date:

## Exception (EX-01)

Hard Rule 예외가 필요한 경우만 작성

- Rule ID:
- Owner:
- Approver:
- Reason:
- Scope:
- Expiry:
- Follow-up:
