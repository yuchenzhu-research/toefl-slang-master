import test from "node:test";
import assert from "node:assert";
import { EventEmitter } from "node:events";
import type http from "node:http";
import { handleSparkApiRequest } from "../src/web/server";

type ApiRecord = Record<string, any>;
type MockResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

function callApi(params: {
  method: string;
  url: string;
  body?: unknown;
}): Promise<MockResponse> {
  const request = new EventEmitter() as http.IncomingMessage;
  request.method = params.method;
  request.url = params.url;
  request.setEncoding = () => request;

  const response: MockResponse = {
    statusCode: 0,
    headers: {},
    body: "",
  };

  const serverResponse = {
    writeHead(statusCode: number, headers: Record<string, string>) {
      response.statusCode = statusCode;
      response.headers = headers;
    },
    end(body: string) {
      response.body = body;
      resolveResponse(response);
    },
  } as http.ServerResponse;

  let resolveResponse: (value: MockResponse) => void;
  const result = new Promise<MockResponse>((resolve) => {
    resolveResponse = resolve;
  });

  void handleSparkApiRequest(request, serverResponse);

  process.nextTick(() => {
    if (params.body !== undefined) {
      request.emit("data", JSON.stringify(params.body));
    }
    request.emit("end");
  });

  return result;
}

test("backend API exposes health and CORS headers", async () => {
  const response = await callApi({ method: "GET", url: "/api/health" });
  const body = JSON.parse(response.body) as ApiRecord;

  assert.strictEqual(response.statusCode, 200);
  assert.strictEqual(response.headers["Access-Control-Allow-Origin"], "*");
  assert.strictEqual(body.ok, true);
  assert.deepStrictEqual(body.endpoints, ["/api/dict/lookup", "/api/style/economist"]);
});

test("backend API returns Economist style analysis", async () => {
  const response = await callApi({
    method: "POST",
    url: "/api/style/economist",
    body: {
      text: "Although the reform may look simple, it could change incentives because firms adapt quickly.",
    },
  });
  const body = JSON.parse(response.body) as ApiRecord;

  assert.strictEqual(response.statusCode, 200);
  assert.strictEqual(body.profile, "economist");
  assert.ok(body.overallScore > 0);
});

test("backend API dictionary lookup defaults to dry run", async () => {
  const response = await callApi({
    method: "POST",
    url: "/api/dict/lookup",
    body: {
      text: "gonna",
      context: "I am gonna explain this policy.",
      target: "toefl-writing",
    },
  });
  const body = JSON.parse(response.body) as ApiRecord;

  assert.strictEqual(response.statusCode, 200);
  assert.strictEqual(body.dryRun, true);
  assert.strictEqual(body.query.text, "gonna");
  assert.ok(body.planned.includes("Dictionary Pro"));
});
