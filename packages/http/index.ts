// HTTP 코드는 class로 따로 만들 예정, 이 곳에선 디렉토리 구조패턴만 보시면 됩니다.

type HttpMethod = "GET" | "PATCH";

type Primitive = string | number | boolean | null | undefined;

interface RequestOptions<TParams = unknown> {
  params?: TParams;
}

type DomainStatus = "ACTIVE" | "INACTIVE";

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

const toDto = (row: DomainRow): DomainItemDto => {
  return {
    id: row.id,
    display_name: row.name,
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

type BasePath = "/domain-a" | "/domain-c";

const resolveBasePath = (path: string): BasePath => {
  const segments = getPathSegments(path);
  const top = segments[0];

  if (top === "domain-a") {
    return "/domain-a";
  }

  if (top === "domain-c") {
    return "/domain-c";
  }

  throw new Error(`Mock endpoint not found: ${path}`);
};

const resolveRowsByBasePath = (basePath: BasePath): DomainRow[] => {
  if (basePath === "/domain-a") {
    return domainARows;
  }
  return domainCRows;
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
  const rows = resolveRowsByBasePath(basePath);

  await wait(120);

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
  patch: <T>(path: string, body?: unknown) => {
    return request<T>("PATCH", path, body);
  },
};
