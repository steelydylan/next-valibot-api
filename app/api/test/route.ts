import { ApiHandler, createRouter } from "@/src/router";
import { validate } from "@/src/validation";
import { object, string, nullable } from "valibot";

const getValidation = {
  query: object({
    userId: string(),
    lessonId: string(),
  }),
  res: object({
    id: string(),
    html: string(),
    css: string(),
    js: nullable(string()),
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
