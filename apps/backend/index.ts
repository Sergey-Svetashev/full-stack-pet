import type { Context } from "oak/mod.ts";
import { Application } from "oak/mod.ts";
import { load } from "std/dotenv/mod.ts";
import { errorHandle } from "./middleware/error.ts";
import { router } from "./router.ts";
import type { State } from "./state/index.ts";
import { appState } from "./state/index.ts";

const env = await load();
const PORT = Number(env["PORT"]);
const CLIENT_ORIGIN = env["CLIENT_ORIGIN"];

const app = new Application<State>({ state: appState });

app.use(async ({ request, response }: Context, next) => {
  response.headers.set("Access-Control-Allow-Origin", CLIENT_ORIGIN); // TODO: configure
  response.headers.set("Access-Control-Allow-Methods", "GET, POST");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cookie"
  );

  if (request.method === "OPTIONS") {
    response.status = 204;
  } else {
    await next();
  }
});

app.use(errorHandle);
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: PORT || 8081 });
