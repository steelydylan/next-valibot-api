import { get } from "./client";
import { GetQuery } from ".next-typed-router";
import useSWR from "swr";

type GetOptions<T extends keyof GetQuery> = {
  query?: GetQuery[T]["query"];
  params?: GetQuery[T]["params"];
  requestInit?: Omit<RequestInit, "body">;
  defaultValue?: GetQuery[T]["res"];
};

export function useClientSWR<T extends keyof GetQuery>(
  key: T,
  options?: GetOptions<T>
) {
  const queryKey = [key, options?.query, options?.params];
  const { data, ...rest } = useSWR(queryKey, () => get(key, options));
  return {
    ...rest,
    queryKey,
    data: data?.data ?? options?.defaultValue ?? null,
    error: data?.error,
  };
}
