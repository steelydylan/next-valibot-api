"use client";

import { post } from "@/lib/client";
import { useClientSWR } from "@/lib/swr";
import { useEffect } from "react";

export default function Home() {
  const { data } = useClientSWR("/api/test", {
    query: {
      userId: "a",
      lessonId: "b",
    },
  });

  const { data: data2 } = useClientSWR("/api/test/[id]", {
    params: {
      id: "a",
    },
  });

  useEffect(() => {
    post("/api/test/[id]", {
      params: {
        id: "a",
      },
      body: {
        id: "a",
        html: "b",
      },
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {data?.html}
    </main>
  );
}
