import { expect, makeFetch, describe, it, run, ConnInfo } from "./dev_depts.ts";
import { logger } from "./mod.ts";

describe("Basic tests", () => {
  it("should write logs", async () => {
    const callback = (line: string) => {
      expect(line).toBeDefined();
      console.log(line);
    };
    const handler = (req: Request, connInfo: ConnInfo) => {
      const res = new Response("hello world", { status: 200 });
      logger({ output: { callback }, ip: true })(req, res, connInfo);
      return res;
    };

    (await makeFetch(handler)("/")).expectStatus(200);
  });
});

run();
