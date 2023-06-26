import { Server } from "./dev_depts.ts";
import { logger } from "./mod.ts";

const port = 5000

const app = new Server({
  handler: (req) => {
    const res = new Response("hello", { status: 200 });
    logger({ ip: true })(req, res);
    return res;
  },
  port: port
});

console.log(`Listening on localhost:${port}`)
await app.listenAndServe()
