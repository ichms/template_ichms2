# STATE-01 State Ownership

- Priority: P0
- 적용 범위: 상태 저장 로직 전반

## MUST

- 서버 상태는 TanStack Query를 단일 소스로 사용한다.
- URL 공유가 필요한 상태는 URL 상태로 관리한다.
- 앱 전역 UI 상태는 store(Jotai 등)로 관리한다.
- 컴포넌트 임시 상태는 local state로 관리한다.

## MUST NOT

- 서버 상태를 store에 중복 저장하지 않는다.

## SHOULD

- 상태 추가 전 아래 질문으로 위치를 먼저 결정한다.
  1. 서버가 진실 소스인가?
  2. URL로 공유해야 하는가?
  3. 앱 전역 UI 상태인가?
  4. 로컬 상태로 충분한가?

## 왜 필요한가

상태 위치가 섞이면 동기화 버그가 반복되고 변경 통제가 어려워진다.

## Bad

```ts
const useOrderStore = create(() => ({
  orders: [],
  setOrders: (orders) => ({ orders }),
}));

// query 결과를 store로 복제
```

## Good

```ts
export const useOrdersPageState = () => {
  const [tab, setTab] = useState<'all' | 'done'>('all');
  const ordersQuery = useOrdersQuery({ tab });
  return { tab, setTab, ordersQuery };
};
```

## 리뷰 체크 (Yes/No)

- 서버 데이터가 Query 캐시 외에 중복 저장되지 않았는가?
- URL/전역/로컬 상태 역할이 분리되었는가?

## 자동 검증

- 린트: 제한적
- 리뷰 수동: 필수
