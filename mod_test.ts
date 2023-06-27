import { ConnInfo } from "./dev_depts.ts";
import { expect, makeFetch, describe, it, run } from "./dev_depts.ts";
import { logger } from "./mod.ts";

describe("Basic tests", () => {
  it("should write logs", async () => {
    const callback = (line: string) => {
      console.log(line)
      expect(line).toEqual("[LOG] 127.0.0.1 GET / http");
    };
    const handler = (req: Request, connInfo: ConnInfo) => {
      const res = new Response("hello world", { status: 200 });
      logger({ output: [{ callback }], ip: true })(req, res, connInfo);
      return res;
    };

    (await makeFetch(handler)("/")).expectStatus(200);
  });
  it("should take multiple call backs", async () => {
    const callback1 = (line: string) => {

      expect(line).toEqual("[LOG] GET / http");
    };
    const callback2 = (line: string) => {
      expect(line).toEqual("[LOG] GET / http");
    };
    const handler = (req: Request, connInfo: ConnInfo) => {
      const res = new Response("hello world", { status: 200 });
      logger({
        output: [{ callback: callback1 }, { callback: callback2 }]
      })(req, res, connInfo);
      return res;
    };

    (await makeFetch(handler)("/")).expectStatus(200);
  });
  it("should use default options if not supplied", async () => {
    const handler = (req: Request, connInfo: ConnInfo) => {
      const res = new Response("hello world", { status: 200 });
      logger()(req, res, connInfo);
      return res;
    };

    (await makeFetch(handler)("/")).expectStatus(200);
  });
});

run();
