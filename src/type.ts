export type Context<
  T1 extends { [key: string]: string } = { [key: string]: string },
  T2 extends { [key: string]: string } = { [key: string]: string },
  T3 extends { [key: string]: any } = { [key: string]: any },
  T4 extends { [key: string]: any } = { [key: string]: any }
> = {
  params: T1;
  query: T2;
  body: T3;
  request: Request;
  next?: () => Promise<Response>;
  json: (body: T4, status?: number) => Response;
};

export type RequestHandler<
  T1 extends { [key: string]: string },
  T2 extends { [key: string]: string },
  T3 extends { [key: string]: any },
  T4 extends { [key: string]: any }
> = (
  context: Context<T1, T2, T3, T4>
) => Response | Promise<Response> | undefined | Promise<undefined>;
