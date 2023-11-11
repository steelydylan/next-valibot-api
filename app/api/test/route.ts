import { ApiHandler, createRouter } from "@/src/router";
import { validate } from "@/src/validation";
import { z } from "zod";

const getValidation = {
  query: z.object({
    userId: z.string(),
    lessonId: z.string(),
  }),
  res: z.object({
    id: z.string(),
    html: z.string(),
    css: z.string(),
    js: z.string().nullable(),
  }),
};

const router = createRouter();

router.get(validate(getValidation), async (ctx) => {
  const { userId, lessonId } = ctx.query;

  return ctx.json({
    id: "1",
    html: "<h1>Hello World</h1>",
    css: "h1 { color: red }",
    js: null,
  });
});

export const GET = router.run();

export type GetHandler = ApiHandler<typeof getValidation>;
