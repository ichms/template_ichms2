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

## 예시 코드 (맥락별 Bad/Good)

### 1) 파생 상태: Effect로 계산하지 않는다

```tsx
// BAD: 파생 상태를 Effect + state로 중복 관리
const ProfileName = () => {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);

  return (
    <div>
      <button onClick={() => setFirstName('Ariana')}>Change</button>
      <p>{fullName}</p>
    </div>
  );
};
```

```tsx
// GOOD: render 단계에서 직접 계산
const ProfileName = () => {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const fullName = firstName + ' ' + lastName;

  return (
    <div>
      <button onClick={() => setFirstName('Ariana')}>Change</button>
      <p>{fullName}</p>
    </div>
  );
};
```

### 2) 서버 상태 fetch: useEffect 대신 TanStack Query 사용

```tsx
// BAD: mount fetch를 useEffect로 직접 구현
const OrdersPage = () => {
  const [orders, setOrders] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then(setOrders);
  }, []);

  return <OrderList items={orders} />;
};
```

```tsx
// GOOD: Query 훅으로 서버 상태 관리
const OrdersPage = () => {
  const { data, isPending, isError, error } = useOrdersQuery({});

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return <OrderList items={data.items} />;
};
```

### 3) 사용자 액션 로직: Effect가 아니라 이벤트 핸들러에 둔다

```tsx
// BAD: 이벤트성 로직을 Effect에 배치
const ProductPage = ({ product, addToCart }: Props) => {
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name}`);
    }
  }, [product]);

  return <button onClick={() => addToCart(product)}>Buy</button>;
};
```

```tsx
// GOOD: 사용자 액션 시점에 명시적으로 처리
const ProductPage = ({ product, addToCart }: Props) => {
  const handleBuy = () => {
    addToCart(product);
    showNotification(`Added ${product.name}`);
  };

  return <button onClick={handleBuy}>Buy</button>;
};
```

### 4) 의존성 안정화: updater function으로 불필요한 재실행 제거

```tsx
// BAD: messages 의존성으로 매번 재구독
const ChatRoom = ({ roomId }: { roomId: string }) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('message', (msg: string) => {
      setMessages([...messages, msg]);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, messages]);

  return <MessageList items={messages} />;
};
```

```tsx
// GOOD: updater function으로 messages 의존성 제거
const ChatRoom = ({ roomId }: { roomId: string }) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('message', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <MessageList items={messages} />;
};
```

### 5) 객체 의존성: Effect 내부에서 생성해 불필요 재실행 방지

```tsx
// BAD: 렌더마다 새 객체 -> Effect 반복 실행
const ChatRoom = ({ roomId }: { roomId: string }) => {
  const options = { serverUrl: 'wss://chat.example.com', roomId };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <div>room: {roomId}</div>;
};
```

```tsx
// GOOD: 객체를 Effect 내부로 이동
const ChatRoom = ({ roomId }: { roomId: string }) => {
  useEffect(() => {
    const options = { serverUrl: 'wss://chat.example.com', roomId };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <div>room: {roomId}</div>;
};
```

### 6) UI 상태 전달: controlled + composition 우선

```tsx
// BAD: 한 컴포넌트가 입력/목록/선택 책임을 모두 소유
const SearchPanel = () => {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filtered = ITEMS.filter((item) => item.title.includes(query));

  return (
    <section>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {filtered.map((item) => (
          <li key={item.id}>
            <button onClick={() => setSelectedId(item.id)}>{item.title}</button>
          </li>
        ))}
      </ul>
      <div>selected: {selectedId}</div>
    </section>
  );
};
```

```tsx
// GOOD: 입력/목록/선택 책임을 분리하고 부모가 상태를 조합
type SearchInputProps = {
  query: string;
  onQueryChange: (next: string) => void;
};

const SearchInput = ({ query, onQueryChange }: SearchInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };

  return <input value={query} onChange={handleChange} />;
};

type SearchListProps = {
  items: Array<{ id: string; title: string }>;
  onSelect: (id: string) => void;
};

const SearchList = ({ items, onSelect }: SearchListProps) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <button onClick={() => onSelect(item.id)}>{item.title}</button>
        </li>
      ))}
    </ul>
  );
};

const SearchPanel = () => {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filtered = ITEMS.filter((item) => item.title.includes(query));

  return (
    <section>
      <SearchInput query={query} onQueryChange={setQuery} />
      <SearchList items={filtered} onSelect={setSelectedId} />
      <div>selected: {selectedId}</div>
    </section>
  );
};
```

### 7) Parent-Child 네이밍 계약: controlled/uncontrolled 공통 규칙

```tsx
// BAD: setter 직접 전달 + 부모 핸들러/자식 핸들러 네이밍 혼합
type SearchInputProps = {
  query: string;
  setQuery: (value: string) => void;
};

const SearchInput = ({ query, setQuery }: SearchInputProps) => {
  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return <input value={query} onChange={onQueryChange} />;
};

const SearchPage = () => {
  const [query, setQuery] = useState('');
  return <SearchInput query={query} setQuery={setQuery} />;
};
```

```tsx
// GOOD: controlled 컴포넌트에서 on* (부모 계약), handle* (자식 내부) 분리
type SearchInputProps = {
  query: string;
  onQueryChange: (nextQuery: string) => void;
};

const SearchInput = ({ query, onQueryChange }: SearchInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };

  return <input value={query} onChange={handleChange} />;
};

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
  };

  return <SearchInput query={query} onQueryChange={handleQueryChange} />;
};
```

```tsx
// GOOD: uncontrolled에서도 부모와의 계약은 on*로 통일
type SearchFormProps = {
  initialQuery?: string;
  onQuerySubmit: (submittedQuery: string) => void;
};

const SearchForm = ({ initialQuery = '', onQuerySubmit }: SearchFormProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submittedQuery = inputRef.current?.value ?? '';
    onQuerySubmit(submittedQuery);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input defaultValue={initialQuery} ref={inputRef} />
      <button type="submit">Search</button>
    </form>
  );
};

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const handleQuerySubmit = (submittedQuery: string) => {
    setQuery(submittedQuery);
  };

  return <SearchForm initialQuery={query} onQuerySubmit={handleQuerySubmit} />;
};
```

## 리뷰 체크 (Yes/No)

- Effect가 외부 시스템 동기화에만 사용되었는가?
- `useEffect` 기반 mount fetch 대신 TanStack Query 패턴을 사용했는가?
- 파생 상태를 render/useMemo에서 계산했는가?
- 서버 상태와 Jotai 역할이 분리되었는가?
- `exhaustive-deps` 억제가 없는가?
- 부모-자식 props 네이밍이 계약(`value`/`on*`/`handle*`)을 따르는가?

## 자동 검증

- 린트: 가능(`react-hooks/exhaustive-deps`)
- 리뷰 수동: 필수
