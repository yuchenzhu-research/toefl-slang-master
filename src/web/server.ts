import "dotenv/config";

import http from "http";
import { URL } from "url";
import { runDictionaryProQuery } from "../dictionary-pro/runner";
import type { DictionaryProMode, DictionaryProTarget } from "../dictionary-pro/types";
import type { ToeflSlangClientOptions } from "../platform/client";
import { analyzeEconomistStyle } from "../style-engine";

const DEFAULT_PORT = 4173;

type JsonBody = Record<string, unknown>;

export async function runWebCli(argv: string[]): Promise<void> {
  if (argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    return;
  }

  const port = Number(readFlagValue(argv, "--port") ?? process.env.SPARK_WEB_PORT ?? DEFAULT_PORT);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid --port value: ${port}`);
  }

  const server = createSparkWebServer();
  server.listen(port, "127.0.0.1", () => {
    console.log(`SPARK backend API: http://127.0.0.1:${port}`);
  });
}

export function createSparkWebServer(): http.Server {
  return http.createServer((req, res) => {
    void handleSparkApiRequest(req, res);
  });
}

export async function handleSparkApiRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  try {
    const method = req.method ?? "GET";
    const url = new URL(req.url ?? "/", "http://127.0.0.1");

    if (method === "OPTIONS") {
      sendText(res, 204, "", "text/plain; charset=utf-8");
      return;
    }

    if (method === "GET" && url.pathname === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        service: "spark-backend",
        endpoints: ["/api/dict/lookup", "/api/style/economist"],
      });
      return;
    }

    if (method === "GET" && url.pathname === "/") {
      sendJson(res, 200, {
        service: "SPARK backend API",
        endpoints: {
          health: "GET /api/health",
          dictionaryLookup: "POST /api/dict/lookup",
          economistStyle: "POST /api/style/economist",
        },
      });
      return;
    }

    if (method === "POST" && url.pathname === "/api/style/economist") {
      const body = await readJsonBody(req);
      const text = readString(body.text);
      if (!text) {
        sendJson(res, 400, { error: "Missing text." });
        return;
      }
      sendJson(res, 200, analyzeEconomistStyle(text));
      return;
    }

    if (method === "POST" && url.pathname === "/api/dict/lookup") {
      const body = await readJsonBody(req);
      const text = readString(body.text);
      if (!text) {
        sendJson(res, 400, { error: "Missing text." });
        return;
      }

      const query = {
        text,
        context: readString(body.context),
        mode: readOptionalEnum<DictionaryProMode>(body.mode, [
          "meaning",
          "conversion",
          "upgrade",
          "comparison",
        ]),
        target: readOptionalEnum<DictionaryProTarget>(body.target, [
          "toefl-writing",
          "toefl-speaking",
          "general-academic",
          "daily-english",
        ]),
      };

      if (body.dryRun !== false) {
        sendJson(res, 200, {
          dryRun: true,
          query,
          planned: "Dictionary Pro lookup with slang, register, and academic alignment.",
        });
        return;
      }

      const clientOptions: ToeflSlangClientOptions = {
        provider: readString(body.provider) || undefined,
        model: readString(body.model) || undefined,
      };
      const result = await runDictionaryProQuery({ query, clientOptions });
      sendJson(res, 200, {
        dryRun: false,
        structured: result.structured,
        markdown: result.markdown,
      });
      return;
    }

    sendJson(res, 404, { error: "Endpoint not found." });
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
  }
}

function printUsage(): void {
  console.log(
    `
SPARK Backend API

Usage:
  spark web [--port <port>]   Start backend API server for frontend clients.
  npm run web -- --port 4173
`.trim(),
  );
}

function sendJson(res: http.ServerResponse, status: number, payload: unknown): void {
  sendText(res, status, JSON.stringify(payload, null, 2), "application/json; charset=utf-8");
}

function sendText(
  res: http.ServerResponse,
  status: number,
  body: string,
  contentType: string,
): void {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(body);
}

function readJsonBody(req: http.IncomingMessage): Promise<JsonBody> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.setEncoding("utf-8");
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 512 * 1024) {
        reject(new Error("Request body is too large."));
      }
    });
    req.on("end", () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
    req.on("error", reject);
  });
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalEnum<T extends string>(value: unknown, allowed: T[]): T | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return allowed.includes(value as T) ? (value as T) : undefined;
}

function readFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

if (require.main === module) {
  runWebCli(process.argv.slice(2)).catch((error) => {
    console.error("SPARK web error:", error.message);
    process.exit(1);
  });
}
