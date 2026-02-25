// HTTP 코드는 class로 따로 만들 예정, 이 곳에선 디렉토리 구조패턴만 보시면 됩니다.

type HttpMethod = "GET" | "POST" | "PATCH";

type Primitive = string | number | boolean | null | undefined;

interface RequestOptions<TParams = unknown> {
  params?: TParams;
}

type DomainStatus = "ACTIVE" | "INACTIVE";

type TodoStatus = "TODO" | "DONE";

interface DomainRow {
  id: string;
  name: string;
  status: DomainStatus;
  updatedAt: string;
}

interface DomainItemDto {
  id: string;
  display_name: string;
  status: DomainStatus;
  updated_at: string;
}

interface TodoRow {
  id: string;
  title: string;
  status: TodoStatus;
  updatedAt: string;
}

interface TodoItemDto {
  id: string;
  title: string;
  status: TodoStatus;
  updated_at: string;
}

const domainARows: DomainRow[] = [
  {
    id: "a-1",
    name: "Alpha",
    status: "ACTIVE",
    updatedAt: "2026-02-24T09:00:00Z",
  },
  {
    id: "a-2",
    name: "Beta",
    status: "INACTIVE",
    updatedAt: "2026-02-24T09:10:00Z",
  },
  {
    id: "a-3",
    name: "Gamma",
    status: "ACTIVE",
    updatedAt: "2026-02-24T09:20:00Z",
  },
  {
    id: "a-4",
    name: "Delta",
    status: "INACTIVE",
    updatedAt: "2026-02-24T09:30:00Z",
  },
  {
    id: "a-5",
    name: "Epsilon",
    status: "ACTIVE",
    updatedAt: "2026-02-24T09:40:00Z",
  },
  {
    id: "a-6",
    name: "Zeta",
    status: "ACTIVE",
    updatedAt: "2026-02-24T09:50:00Z",
  },
  {
    id: "a-7",
    name: "Eta",
    status: "INACTIVE",
    updatedAt: "2026-02-24T10:00:00Z",
  },
];

const domainCRows: DomainRow[] = [
  {
    id: "c-1",
    name: "Canopus",
    status: "ACTIVE",
    updatedAt: "2026-02-24T11:00:00Z",
  },
  {
    id: "c-2",
    name: "Capella",
    status: "INACTIVE",
    updatedAt: "2026-02-24T11:10:00Z",
  },
  {
    id: "c-3",
    name: "Castor",
    status: "ACTIVE",
    updatedAt: "2026-02-24T11:20:00Z",
  },
  {
    id: "c-4",
    name: "Cetus",
    status: "INACTIVE",
    updatedAt: "2026-02-24T11:30:00Z",
  },
  {
    id: "c-5",
    name: "Cygnus",
    status: "ACTIVE",
    updatedAt: "2026-02-24T11:40:00Z",
  },
  {
    id: "c-6",
    name: "Corona",
    status: "ACTIVE",
    updatedAt: "2026-02-24T11:50:00Z",
  },
  {
    id: "c-7",
    name: "Crux",
    status: "INACTIVE",
    updatedAt: "2026-02-24T12:00:00Z",
  },
];

const domainBTodos: TodoRow[] = [
  {
    id: "b-1",
    title: "Define domain-b data types",
    status: "DONE",
    updatedAt: "2026-02-24T13:00:00Z",
  },
  {
    id: "b-2",
    title: "Implement todo list query",
    status: "TODO",
    updatedAt: "2026-02-24T13:10:00Z",
  },
  {
    id: "b-3",
    title: "Connect mutation invalidation",
    status: "TODO",
    updatedAt: "2026-02-24T13:20:00Z",
  },
  {
    id: "b-4",
    title: "Add domain-b route page",
    status: "DONE",
    updatedAt: "2026-02-24T13:30:00Z",
  },
];

const toDto = (row: DomainRow): DomainItemDto => {
  return {
    id: row.id,
    display_name: row.name,
    status: row.status,
    updated_at: row.updatedAt,
  };
};

const toTodoDto = (row: TodoRow): TodoItemDto => {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    updated_at: row.updatedAt,
  };
};

const wait = (ms: number): Promise<void> => {
  const resolveAfterDelay = (
    resolve: (value: void | PromiseLike<void>) => void,
  ) => {
    setTimeout(resolve, ms);
  };

  return new Promise<void>(resolveAfterDelay);
};

const getPathSegments = (path: string): string[] => {
  return path.replace(/^\/+/, "").split("/").filter(Boolean);
};

type BasePath = "/domain-a" | "/domain-b" | "/domain-c";

const resolveBasePath = (path: string): BasePath => {
  const segments = getPathSegments(path);
  const top = segments[0];

  if (top === "domain-a") {
    return "/domain-a";
  }

  if (top === "domain-c") {
    return "/domain-c";
  }

  if (top === "domain-b") {
    return "/domain-b";
  }

  throw new Error(`Mock endpoint not found: ${path}`);
};

const resolveRowsByBasePath = (basePath: BasePath): DomainRow[] => {
  if (basePath === "/domain-a") {
    return domainARows;
  }
  return domainCRows;
};

const resolveTodosByBasePath = (basePath: BasePath): TodoRow[] => {
  if (basePath !== "/domain-b") {
    throw new Error(`Todo rows are not available for: ${basePath}`);
  }

  return domainBTodos;
};

const extractId = (path: string): string | null => {
  const segments = getPathSegments(path);
  return segments[1] ?? null;
};

type DomainListParams = {
  search?: Primitive;
  status?: Primitive;
  page?: Primitive;
  pageSize?: Primitive;
};

type TodoListParams = {
  search?: Primitive;
  status?: Primitive;
  page?: Primitive;
  pageSize?: Primitive;
};

const readList = (rows: DomainRow[], params?: DomainListParams) => {
  const status = params?.status;
  const search = String(params?.search ?? "")
    .trim()
    .toLowerCase();
  const page = Number(params?.page ?? 1);
  const pageSize = Number(params?.pageSize ?? 10);

  let filteredRows = [...rows];

  if (status === "ACTIVE" || status === "INACTIVE") {
    const hasSameStatus = (row: DomainRow) => {
      return row.status === status;
    };
    filteredRows = filteredRows.filter(hasSameStatus);
  }

  if (search) {
    const includesSearchText = (row: DomainRow) => {
      return row.name.toLowerCase().includes(search);
    };
    filteredRows = filteredRows.filter(includesSearchText);
  }

  const total = filteredRows.length;
  const start = Math.max(0, (page - 1) * pageSize);
  const pagedRows = filteredRows.slice(start, start + pageSize);

  return {
    items: pagedRows.map(toDto),
    total,
  };
};

const readDetail = (rows: DomainRow[], id: string) => {
  const isTargetItem = (item: DomainRow) => {
    return item.id === id;
  };

  const row = rows.find(isTargetItem);
  if (!row) {
    throw new Error(`Item not found: ${id}`);
  }

  return { item: toDto(row) };
};

const readTodoList = (rows: TodoRow[], params?: TodoListParams) => {
  const status = params?.status;
  const search = String(params?.search ?? "")
    .trim()
    .toLowerCase();
  const page = Number(params?.page ?? 1);
  const pageSize = Number(params?.pageSize ?? 10);

  let filteredRows = [...rows];

  if (status === "TODO" || status === "DONE") {
    const hasSameStatus = (row: TodoRow) => {
      return row.status === status;
    };
    filteredRows = filteredRows.filter(hasSameStatus);
  }

  if (search) {
    const includesSearchText = (row: TodoRow) => {
      return row.title.toLowerCase().includes(search);
    };
    filteredRows = filteredRows.filter(includesSearchText);
  }

  const total = filteredRows.length;
  const start = Math.max(0, (page - 1) * pageSize);
  const pagedRows = filteredRows.slice(start, start + pageSize);

  return {
    items: pagedRows.map(toTodoDto),
    total,
  };
};

const readTodoDetail = (rows: TodoRow[], id: string) => {
  const isTargetItem = (item: TodoRow) => {
    return item.id === id;
  };

  const row = rows.find(isTargetItem);
  if (!row) {
    throw new Error(`Todo not found: ${id}`);
  }

  return { item: toTodoDto(row) };
};

const createTodo = (rows: TodoRow[], body: unknown) => {
  const payload = body as { title?: string };
  const title = String(payload.title ?? "").trim();

  if (!title) {
    throw new Error("Invalid title payload");
  }

  const nextNumber = rows.length + 1;
  const createdRow: TodoRow = {
    id: `b-${nextNumber}`,
    title,
    status: "TODO",
    updatedAt: new Date().toISOString(),
  };

  rows.unshift(createdRow);
  return toTodoDto(createdRow);
};

const patchTodoStatus = (rows: TodoRow[], id: string, body: unknown) => {
  const payload = body as { status?: TodoStatus };

  const isTargetItem = (item: TodoRow) => {
    return item.id === id;
  };

  const row = rows.find(isTargetItem);
  if (!row) {
    throw new Error(`Todo not found: ${id}`);
  }

  if (payload.status !== "TODO" && payload.status !== "DONE") {
    throw new Error("Invalid status payload");
  }

  row.status = payload.status;
  row.updatedAt = new Date().toISOString();

  return toTodoDto(row);
};

const patchStatus = (rows: DomainRow[], id: string, body: unknown) => {
  const payload = body as { status?: DomainStatus };

  const isTargetItem = (item: DomainRow) => {
    return item.id === id;
  };

  const row = rows.find(isTargetItem);
  if (!row) {
    throw new Error(`Item not found: ${id}`);
  }
  if (payload.status !== "ACTIVE" && payload.status !== "INACTIVE") {
    throw new Error("Invalid status payload");
  }

  row.status = payload.status;
  row.updatedAt = new Date().toISOString();

  return toDto(row);
};

const request = async <T, TParams = unknown>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options?: RequestOptions<TParams>,
): Promise<T> => {
  const basePath = resolveBasePath(path);

  await wait(120);

  if (basePath === "/domain-b") {
    const todos = resolveTodosByBasePath(basePath);

    if (method === "GET" && path === basePath) {
      return readTodoList(
        todos,
        options?.params as TodoListParams | undefined,
      ) as T;
    }

    if (method === "POST" && path === basePath) {
      return createTodo(todos, body) as T;
    }

    const id = extractId(path);
    if (!id) {
      throw new Error(`Invalid path: ${path}`);
    }

    if (method === "GET" && path === `${basePath}/${id}`) {
      return readTodoDetail(todos, id) as T;
    }

    if (method === "PATCH" && path === `${basePath}/${id}/status`) {
      return patchTodoStatus(todos, id, body) as T;
    }

    throw new Error(`Mock route not implemented: [${method}] ${path}`);
  }

  const rows = resolveRowsByBasePath(basePath);

  if (method === "GET" && path === basePath) {
    return readList(rows, options?.params as DomainListParams | undefined) as T;
  }

  const id = extractId(path);
  if (!id) {
    throw new Error(`Invalid path: ${path}`);
  }

  if (method === "GET" && path === `${basePath}/${id}`) {
    return readDetail(rows, id) as T;
  }

  if (method === "PATCH" && path === `${basePath}/${id}/status`) {
    return patchStatus(rows, id, body) as T;
  }

  throw new Error(`Mock route not implemented: [${method}] ${path}`);
};

export const http = {
  get: <T, TParams = unknown>(
    path: string,
    options?: RequestOptions<TParams>,
  ) => {
    return request<T, TParams>("GET", path, undefined, options);
  },
  post: <T>(path: string, body?: unknown) => {
    return request<T>("POST", path, body);
  },
  patch: <T>(path: string, body?: unknown) => {
    return request<T>("PATCH", path, body);
  },
};
