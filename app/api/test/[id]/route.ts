import { ApiHandler, createRouter } from "@/src/router";
import { validate } from "@/src/validation";
import { z } from "zod";

const getValidation = {
  params: z.object({
    id: z.string(),
  }),
  res: z.object({
    id: z.string(),
  }),
};

const postValidation = {
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    id: z.string(),
    html: z.string(),
  }),
  res: z.object({
    id: z.string(),
    html: z.string(),
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
