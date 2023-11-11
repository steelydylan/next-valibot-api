import { BaseSchema, Input, safeParse } from "valibot";
import { createError } from "./error";
import { Context } from "./type";

type Options<
  T1 extends BaseSchema,
  T2 extends BaseSchema,
  T3 extends BaseSchema,
  T4 extends BaseSchema
> = {
  params?: T1;
  query?: T2;
  body?: T3;
  res: T4;
};

export const validate =
  <
    T1 extends BaseSchema,
    T2 extends BaseSchema,
    T3 extends BaseSchema,
    T4 extends BaseSchema
  >(
    options: Options<T1, T2, T3, T4>
  ) =>
  (ctx: Context<Input<T1>, Input<T2>, Input<T3>, Input<T4>>) => {
    Object.entries(options).forEach(([type, schema]) => {
      if (type === "body") {
        const isSafe = safeParse(schema, ctx.body);
        if (!isSafe.success) {
          throw createError(400, JSON.stringify(isSafe.error));
        }
      } else if (type === "query") {
        const isSafe = safeParse(schema, ctx.query);
        if (!isSafe.success) {
          throw createError(400, JSON.stringify(isSafe.error.message));
        }
      } else if (type === "params") {
        const isSafe = safeParse(schema, ctx.params);
        if (!isSafe.success) {
          throw createError(400, JSON.stringify(isSafe.error.message));
        }
      }
    });
    if (ctx.next) return ctx.next();
  };
