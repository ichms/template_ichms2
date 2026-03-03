# REACT-01 React Component Practices

- Priority: P1
- 적용 범위: `features/*`의 React 컴포넌트/훅 (`.tsx`, `.jsx`)

## MUST

- Effect는 외부 시스템 동기화 용도로만 사용한다.
- 파생 상태는 render 단계에서 계산하고, 비싼 계산은 `useMemo`로 처리한다.
- 이벤트에 의해 발생한 로직은 Effect가 아니라 이벤트 핸들러에 둔다.
- eslint의 `react-hooks/exhaustive-deps`를 비활성화하지 않는다.
- 서버 상태 fetch는 TanStack Query 또는 프레임워크 데이터 페칭으로 처리한다.
- 전역 UI 상태는 Jotai로 관리한다.
- 부모가 소유한 상태값은 명사형 props로 전달한다. (`query`, `selectedId`, `isOpen`)
- 부모 상태 변경 요청 핸들러는 `on*` 접두사로 전달한다. (`onQueryChange`, `onSelect`, `onOpenChange`)
- 자식 내부 DOM 이벤트 핸들러는 `handle*` 네이밍을 사용한다. (`handleChange`, `handleClick`)

## SHOULD

- Effect 의존성은 최소화하고, updater function 패턴으로 불필요한 의존성을 제거한다.
- 객체/함수 의존성으로 인한 재실행이 발생하면 Effect 내부로 이동해 안정화한다.
- 컴포넌트 간 전달은 props/composition을 우선 사용한다.
- `controlled`/`uncontrolled` 여부와 무관하게 부모-자식 네이밍 계약(`value`/`on*`/`handle*`)을 동일하게 적용한다.

## MUST NOT

- `useEffect`를 파생 상태 계산/이벤트 처리 용도로 사용하지 않는다.
- mount 시점 데이터 fetch를 `useEffect` 기본 패턴으로 사용하지 않는다.
- 서버 상태를 Jotai/local state에 중복 저장하지 않는다.
- Context를 전역 상태 기본 수단으로 사용하지 않는다.
- 부모의 React setter(`setQuery`, `setOpen`)를 자식 props 이름으로 직접 노출하지 않는다.
- 부모 변경 요청 핸들러를 `handle*`로 export하지 않는다. (`handleQuery` 같은 혼합 네이밍 금지)

## Advanced (선택 적용)

- `useEffectEvent`는 동작을 정확히 이해한 경우에만 적용한다. 
- `flushSync`는 복잡도와 오용 리스크가 커서 기본 규칙에서 제외한다. 
- ref callback + `Map` 기반 동적 리스트 패턴은 기본 규칙에서 제외한다.

## 왜 필요한가

각자의 개성이 드러나는 React 사용과
Effect 남용과 상태 책임 혼합은 렌더 흐름과 코드 관리의 난이도를 높여, 리뷰/디버깅 비용을 크게 증가시키므로
다음과 같은 규칙을 정의한다.

