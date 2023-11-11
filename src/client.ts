import {
  DeleteQuery,
  PatchQuery,
  GetQuery,
  PostQuery,
  PutQuery,
} from ".next-valid-api";
import qs from "qs";

const defaultHeaders = {
  "Content-Type": "application/json",
};

function buildParams(url: string, params?: Record<string, string>) {
  if (!params) {
    return { url, usedKeys: [] };
  }
  // find [vars] in url
  const usedKeys: string[] = [];
  const matches = url.match(/\[([^\]]+)\]/g);
  const replacedUrl = matches
    ? matches.reduce((acc, match) => {
        const key = match.slice(1, -1);
        const value = params[key];
        if (!value) {
          return acc;
        }
        usedKeys.push(key);
        return acc.replace(match, value);
      }, url)
    : url;
  return {
    url: replacedUrl,
    usedKeys,
  };
}

function buildQuery(url: string, query?: Record<string, string>) {
  if (!query) {
    return url;
  }
  if (Object.keys(query).length === 0) {
    return url;
  }
  const queryString = qs.stringify(query);
  return `${url}?${queryString}`;
}

function buildUrl(
  url: string,
  {
    query,
    params,
  }: {
    query?: Record<string, string>;
    params?: Record<string, string>;
  }
) {
  if (!query && !params) {
    return url;
  }
  const { url: replacedUrl, usedKeys } = buildParams(url, params);
  const unUsedKeys = Object.keys(query || {}).filter(
    (key) => !usedKeys.includes(key)
  );
  const unUsedQuery = unUsedKeys.reduce((acc, key) => {
    if (!query) return acc;
    acc[key] = query[key];
    return acc;
  }, {} as Record<string, string>);
  const finalUrl = buildQuery(replacedUrl, unUsedQuery);
  return finalUrl;
}

export async function post<T extends keyof PostQuery>(
  key: T,
  {
    query,
    params,
    body,
    requestInit,
  }: {
    query?: PostQuery[T]["query"];
    params?: PostQuery[T]["params"];
    body?: PostQuery[T]["body"];
    requestInit?: Omit<RequestInit, "body"> & { body?: PostQuery[T]["body"] };
  } = {}
): Promise<{ data: PostQuery[T]["res"] | null; error: unknown | null }> {
  if (typeof key !== "string") {
    return {
      data: null,
      error: new Error("url key must be string"),
    };
  }
  const url = buildUrl(key, {
    query,
    params,
  });
  const requestBody = body || requestInit?.body;
  const res = await fetch(url, {
    ...requestInit,
    method: "POST",
    headers: { ...defaultHeaders, ...requestInit?.headers },
    body: requestBody ? JSON.stringify(requestBody) : undefined,
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error(res.statusText);
    })
    .then((data) => {
      return {
        data,
        error: null,
      };
    })
    .catch((err) => {
      return {
        data: null,
        error: err,
      };
    });
  return res;
}

export async function put<T extends keyof PutQuery>(
  key: T,
  {
    query,
    params,
    body,
    requestInit,
  }: {
    query?: PutQuery[T]["query"];
    params?: PutQuery[T]["params"];
    body?: PutQuery[T]["body"];
    requestInit?: Omit<RequestInit, "body"> & { body?: PutQuery[T]["body"] };
  } = {}
): Promise<{ data: PutQuery[T]["res"] | null; error: unknown | null }> {
  if (typeof key !== "string") {
    return {
      data: null,
      error: new Error("url key must be string"),
    };
  }
  const url = buildUrl(key, {
    query,
    params,
  });
  const requestBody = body || requestInit?.body;
  const res = await fetch(url, {
    ...requestInit,
    method: "PUT",
    headers: { ...defaultHeaders, ...requestInit?.headers },
    body: requestBody ? JSON.stringify(requestBody) : undefined,
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error(res.statusText);
    })
    .then((data) => {
      return {
        data,
        error: null,
      };
    })
    .catch((err) => {
      return {
        data: null,
        error: err,
      };
    });
  return res;
}

export async function patch<T extends keyof PatchQuery>(
  key: T,
  {
    query,
    params,
    body,
    requestInit,
  }: {
    query?: PatchQuery[T]["query"];
    params?: PatchQuery[T]["params"];
    body?: PatchQuery[T]["body"];
    requestInit?: Omit<RequestInit, "body"> & { body?: PatchQuery[T]["body"] };
  } = {}
): Promise<{ data: PatchQuery[T]["res"] | null; error: unknown | null }> {
  if (typeof key !== "string") {
    return {
      data: null,
      error: new Error("url key must be string"),
    };
  }
  const url = buildUrl(key, {
    query,
    params,
  });
  const requestBody = body || requestInit?.body;
  const res = await fetch(url, {
    ...requestInit,
    method: "PATCH",
    headers: { ...defaultHeaders, ...requestInit?.headers },
    body: requestBody ? JSON.stringify(requestBody) : undefined,
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error(res.statusText);
    })
    .then((data) => {
      return {
        data,
        error: null,
      };
    })
    .catch((err) => {
      return {
        data: null,
        error: err,
      };
    });
  return res;
}

export async function remove<T extends keyof DeleteQuery>(
  key: T,
  {
    query,
    params,
    body,
    requestInit,
  }: {
    query?: DeleteQuery[T]["query"];
    params?: DeleteQuery[T]["params"];
    body?: DeleteQuery[T]["body"];
    requestInit?: Omit<RequestInit, "body"> & { body?: DeleteQuery[T]["body"] };
  } = {}
): Promise<{ data: DeleteQuery[T]["res"] | null; error: unknown | null }> {
  if (typeof key !== "string") {
    return {
      data: null,
      error: new Error("url key must be string"),
    };
  }
  const url = buildUrl(key, {
    query,
    params,
  });
  const requestBody = body || requestInit?.body;
  const res = await fetch(url, {
    ...requestInit,
    method: "DELETE",
    headers: { ...defaultHeaders, ...requestInit?.headers },
    body: requestBody ? JSON.stringify(requestBody) : undefined,
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error(res.statusText);
    })
    .then((data) => {
      return {
        data,
        error: null,
      };
    })
    .catch((err) => {
      return {
        data: null,
        error: err,
      };
    });
  return res;
}

export async function get<T extends keyof GetQuery>(
  key: T,
  {
    query,
    params,
    requestInit,
  }: {
    query?: GetQuery[T]["query"];
    params?: GetQuery[T]["params"];
    requestInit?: Omit<RequestInit, "body">;
  } = {}
): Promise<{ data: GetQuery[T]["res"] | null; error: unknown | null }> {
  if (typeof key !== "string") {
    return {
      data: null,
      error: new Error("url key must be string"),
    };
  }
  const url = buildUrl(key, {
    query,
    params,
  });
  const res = await fetch(url, {
    ...requestInit,
    method: "GET",
    headers: { ...defaultHeaders, ...requestInit?.headers },
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error(res.statusText);
    })
    .then((data) => {
      return {
        data,
        error: null,
      };
    })
    .catch((err) => {
      return {
        data: null,
        error: err,
      };
    });
  return res;
}
