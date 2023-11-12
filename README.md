# next-valibot-api

A library for simple API routing in Next.js
while leveraging valibot and Typescript to create typesafe routes and middlewares with built in validation.

## Motivation

I wanted to create type-safe APIs in Next.js using valibot and also wanted to generate type definition files for client-side use so that I could use intuitive API calls.
But I couldn't find a library that met my needs, so I created this library.

## Features

- Type-safe API routing
- Type-safe API call
- Validation using valibot
- Error handling
- Type definition file generation for client-side use
- Middleware support

## Usage

### Installation

```bash
## npm
npm install next-valibot-api

## yarn
yarn add next-valibot-api
```

### Server-side

1. Use valibot to define the types for body, query, and res.
2. Create routing handling with createRouter.
3. Assign types to the created routing handling with validate.
4. Export the types as GetHandler and PostHandler.

```ts
// pages/api/sample.ts
import { ApiHandler, createRouter } from "next-valibot-api";
import { validate } from "next-valibot-api/validation";
import { object, string, optional } from "valibot";

/* Schema definition using valibot */
const postValidation = {
  body: object({
    foo: string(),
  }),
  query: object({
    bar: optional(string()),
  }),
  res: object({
    message: string(),
  }),
};

const getValidation = {
  query: object({
    bar: optional(string()),
  }),
  res: object({
    message: string(),
  }),
};

/* Routing */
const router = createRouter();

router
  .use((ctx) => {
    console.log("middleware");
    return ctx.next();
  })
  .post(validate(postValidation), (ctx) => {
    ctx.body.foo;
    ctx.query.bar;
    ctx.json({ message: "ok" });
  })
  .get(validate(getValidation), (ctx) => {
    ctx.query.bar;
    ctx.json({ message: "ok" });
  });

/* Type export */
// the export type name should be as follows
// so that the type definition file can be generated correctly via the command.
export type PostHandler = ApiHandler<typeof postValidation>;
export type GetHandler = ApiHandler<typeof getValidation>;

/* Routing handling export */
export const GET = router.run();
export const POST = router.run();
```

### dynamic routing

#### Server-side

```ts
// pages/api/[id].ts

const getValidation = {
  // 👇 for server side validation
  // 👇 also necessary for client side url construction
  query: object({
    id: string().optional(),
  }),
};

router.get(validate(getValidation), (ctx) => {
  ctx.query.id;
  ctx.json({ message: "ok" });
});
```

#### Client-side

```ts
// client.ts
import { client } from "next-valibot-api";

client.get("/api/[id]", {
  query: {
    id: "1",
  },
});

// url will be /api/1
```

### Error handling

#### throw error

```ts
// pages/api/sample.ts
router.post(validate(postValidation), (ctx) => {
  const session = getSession(ctx);
  if (!session) {
    throw createError(401, "Unauthorized");
  }
  ctx.json({ message: "ok" });
});
```

#### custom error handling

```ts
// pages/api/sample.ts

router.onError((err) => {
  // custom error handling
  res.status(err.statusCode).json({ message: err.message });
});
```

## Plugin

You have to use the plugin to generate the type definition file.

next.config.js

```js:next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {};

const withValibotApi = require("next-valibot-api/plugin")(/* options */);

module.exports = withValibotApi(nextConfig);
```

### Config options

The default pages directory is `app`, so if you want to change it, you can use the `--appDir` option.

| Option          | Description                             | Default value                  |
| --------------- | --------------------------------------- | ------------------------------ |
| appDir          | app directory path                      | app                            |
| baseDir         | Project directory                       | .                              |
| distDir         | Type definition file output destination | node_modules/.next-valibot-api |
| moduleNameSpace | Type definition file module name        | .next-valibot-api              |

```

```
