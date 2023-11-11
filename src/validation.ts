import { z } from "zod";
import { createError } from "./error";
import { Context } from "./type";

type ZodSchema = z.ZodSchema<any>;
type Options<
  T1 extends ZodSchema,
  T2 extends ZodSchema,
  T3 extends ZodSchema,
  T4 extends ZodSchema
> = {
  params?: T1;
  query?: T2;
  body?: T3;
  res: T4;
};

export const validate =
  <
    T1 extends ZodSchema,
    T2 extends ZodSchema,
    T3 extends ZodSchema,
    T4 extends ZodSchema
  >(
    options: Options<T1, T2, T3, T4>
  ) =>
  (ctx: Context<z.infer<T1>, z.infer<T2>, z.infer<T3>, z.infer<T4>>) => {
    Object.entries(options).forEach(([type, schema]) => {
      if (type === "body") {
        const isSafe = schema.safeParse(ctx.body);
        if (!isSafe.success) {
          throw createError(400, JSON.stringify(isSafe.error));
        }
      } else if (type === "query") {
        const isSafe = schema.safeParse(ctx.query);
        if (!isSafe.success) {
          throw createError(400, JSON.stringify(isSafe.error.message));
        }
      } else if (type === "params") {
        const isSafe = schema.safeParse(ctx.params);
        if (!isSafe.success) {
          throw createError(400, JSON.stringify(isSafe.error.message));
        }
      }
    });
    if (ctx.next) return ctx.next();
  };
