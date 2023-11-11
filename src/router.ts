import { BaseSchema, Input } from "valibot";
import { ApiError, createError } from "./error";
import { RequestHandler } from "./type";

type HandlerObject = {
  handler: RequestHandler<any, any, any, any>;
  middleware?: boolean;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
};

type ErrorHandler = (err: ApiError, req: Request) => void;

type ApiZodSchema = {
  body?: BaseSchema;
  query?: BaseSchema;
  res?: BaseSchema;
  params?: BaseSchema;
};

export type ApiHandler<T extends ApiZodSchema> = {
  body: T["body"] extends BaseSchema ? Input<T["body"]> : never;
  query: T["query"] extends BaseSchema ? Input<T["query"]> : never;
  params: T["params"] extends BaseSchema ? Input<T["params"]> : never;
  res: T["res"] extends BaseSchema ? Input<T["res"]> : never;
};

class Router {
  handlers: {
    method: HandlerObject[];
    error: ErrorHandler;
  };

  constructor() {
    this.handlers = {
      method: [],
      error: (e) => {
        return new Response(JSON.stringify({ message: e.message }), {
          status: e.statusCode,
          headers: {
            "content-type": "application/json",
          },
        });
      },
    };
  }

  use<T extends RequestHandler<any, any, any, any>>(...handlers: T[]) {
    this.handlers.method.push(
      ...handlers.map((handler) => ({ handler, middleware: true }))
    );
    return this;
  }

  get<T extends RequestHandler<any, any, any, any>>(...handlers: T[]) {
    this.handlers.method.push(
      ...handlers.map((handler) => ({ handler, method: "GET" as "GET" }))
    );
    return this;
  }

  post<T extends RequestHandler<any, any, any, any>>(...handlers: T[]) {
    this.handlers.method.push(
      ...handlers.map((handler) => ({ handler, method: "POST" as "POST" }))
    );
    return this;
  }

  put<T extends RequestHandler<any, any, any, any>>(...handlers: T[]) {
    this.handlers.method.push(
      ...handlers.map((handler) => ({ handler, method: "PUT" as "PUT" }))
    );
    return this;
  }

  delete<T extends RequestHandler<any, any, any, any>>(...handlers: T[]) {
    this.handlers.method.push(
      ...handlers.map((handler) => ({ handler, method: "DELETE" as "DELETE" }))
    );
    return this;
  }

  patch<T extends RequestHandler<any, any, any, any>>(...handlers: T[]) {
    this.handlers.method.push(
      ...handlers.map((handler) => ({ handler, method: "PATCH" as "PATCH" }))
    );
    return this;
  }

  onError<T extends ErrorHandler>(handler: T) {
    this.handlers.error = handler;
    return this;
  }

  private async execute(
    request: Request,
    {
      params,
    }: {
      params: Record<string, string>;
    }
  ) {
    const handlers = this.handlers.method.filter(
      (h) => h.method === request.method || h.middleware
    );
    const searchParams = new URL(request.url).searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const body = await request.json().catch(() => undefined);
    let i = 0;
    const next = async () => {
      const handler = handlers[i++];
      if (handler) {
        const result = await handler.handler({
          request,
          next,
          params,
          query,
          body,
          json: (body, status = 200) => {
            return new Response(JSON.stringify(body), {
              status,
              headers: {
                "content-type": "application/json",
              },
            });
          },
        });
        if (result instanceof Response) {
          return result;
        }
      }
      return new Response(JSON.stringify({ message: "Not Found" }), {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
      });
    };
    return await next().catch((e) => {
      return this.handlers.error(e, request);
    });
  }

  public run() {
    return async (
      req: Request,
      {
        params,
      }: {
        params: Record<string, string>;
      }
    ) => {
      try {
        return await this.execute(req, { params });
      } catch (e) {
        if (e instanceof ApiError) {
          this.handlers.error(e, req);
        } else {
          console.log(e);
          const error = createError(500, "Internal Server Error");
          this.handlers.error(error, req);
        }
      }
    };
  }
}

export function createRouter() {
  const router = new Router();
  return router;
}
