

<div align="center">
  
  <h1 align="center">http_logger - A tiny http logger for Deno</h1>

[![CI](https://github.com/aarontravass/http_logger/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/aarontravass/http_logger/actions/workflows/main.yml)

</div>

## Example
```ts
const port = 5000

const app = new Server({
  handler: (req, connInfo) => {
    const res = new Response("hello", { status: 200 });
    logger({ ip: true })(req, res, connInfo);
    return res;
  },
  port: port
});

console.log(`Listening on localhost:${port}`)
await app.listenAndServe()
```