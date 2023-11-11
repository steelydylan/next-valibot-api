import { ApiHandler, createRouter } from "@/src/router";
import { validate } from "@/src/validation";
import { object, string } from "valibot";

const getValidation = {
  params: object({
    id: string(),
  }),
  res: object({
    id: string(),
  }),
};

const postValidation = {
  params: object({
    id: string(),
  }),
  body: object({
    id: string(),
    html: string(),
  }),
  res: object({
    id: string(),
    html: string(),
  }),
};

const router = createRouter();

router.get(validate(getValidation), async (ctx) => {
  const { id } = ctx.params;
  return ctx.json({
    id,
  });
});

router.post(validate(postValidation), async (ctx) => {
  const { id, html } = ctx.body;

  return ctx.json({
    id,
    html,
  });
});

export const GET = router.run();

export const POST = router.run();

export type GetHandler = ApiHandler<typeof getValidation>;

export type PostHandler = ApiHandler<typeof postValidation>;
