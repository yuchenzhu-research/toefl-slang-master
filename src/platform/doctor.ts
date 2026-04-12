import "dotenv/config";

import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";
import { CONFIG_PATH, getLocalProviderConfig } from "./auth/manager";
import { listProviderCatalog } from "./providers/catalog";

type DoctorStatus = "ok" | "warn" | "fail";

type DoctorCheck = {
  label: string;
  status: DoctorStatus;
  detail: string;
};

type DoctorReport = {
  generatedAt: string;
  cwd: string;
  checks: DoctorCheck[];
};

export function runDoctorCli(argv: string[]): void {
  const jsonOutput = argv.includes("--json");
  const report = buildDoctorReport();
  const output = jsonOutput
    ? JSON.stringify(report, null, 2)
    : formatDoctorReport(report);
  process.stdout.write(`${output}\n`);
}

function buildDoctorReport(): DoctorReport {
  const cwd = process.cwd();
  const checks: DoctorCheck[] = [];

  const envExamplePath = path.join(cwd, ".env.example");
  const envPath = path.join(cwd, ".env");
  const packageJsonPath = path.join(cwd, "package.json");
  const skillPaths = [
    path.join(cwd, "skills", "dictionary-pro", "SKILL.md"),
    path.join(cwd, "skills", "toefl-writing", "SKILL.md"),
    path.join(cwd, "skills", "content-parser", "SKILL.md"),
  ];
  const isWorkspace =
    fs.existsSync(packageJsonPath) &&
    skillPaths.every((skillPath) => fs.existsSync(skillPath));

  checks.push({
    label: "workspace",
    status: isWorkspace ? "ok" : "warn",
    detail: isWorkspace
      ? cwd
      : `Current cwd does not look like a SPARK workspace: ${cwd}`,
  });
  checks.push({
    label: ".env.example",
    status: fs.existsSync(envExamplePath) ? "ok" : "warn",
    detail: fs.existsSync(envExamplePath) ? envExamplePath : "Missing root .env.example",
  });
  checks.push({
    label: ".env",
    status: fs.existsSync(envPath) ? "ok" : "warn",
    detail: fs.existsSync(envPath) ? envPath : "No root .env file found",
  });
  checks.push({
    label: "local config",
    status: fs.existsSync(CONFIG_PATH) ? "ok" : "warn",
    detail: fs.existsSync(CONFIG_PATH)
      ? `Found ${CONFIG_PATH}`
      : `No local config at ${CONFIG_PATH}`,
  });

  const configuredProviders = listConfiguredProviders();
  checks.push({
    label: "provider credentials",
    status: configuredProviders.length > 0 ? "ok" : "warn",
    detail:
      configuredProviders.length > 0
        ? configuredProviders.join(", ")
        : "No provider API keys detected from .env / env / local config",
  });

  checks.push(checkPython());
  checks.push(checkPyPdf());
  checks.push(checkPdfToText());
  checks.push(checkPdfExtractionReadiness());

  checks.push({
    label: "modules",
    status: skillPaths.every((skillPath) => fs.existsSync(skillPath)) ? "ok" : "warn",
    detail: skillPaths.every((skillPath) => fs.existsSync(skillPath))
      ? "Dictionary Pro, TOEFL Coach, Content Parser"
      : "Missing one or more skill definitions under skills/",
  });
  checks.push({
    label: "global cli",
    status: "ok",
    detail: "spark / dictpro / coachpro / contentpro are registered in package bin",
  });

  return {
    generatedAt: new Date().toISOString(),
    cwd,
    checks,
  };
}

function listConfiguredProviders(): string[] {
  const configured: string[] = [];

  for (const entry of listProviderCatalog()) {
    const envSource = entry.envVars.find((envVar) => Boolean(process.env[envVar]?.trim()));
    if (envSource) {
      configured.push(`${entry.id}(env:${envSource})`);
      continue;
    }

    const localConfig = getLocalProviderConfig(entry.id);
    if (localConfig?.apiKey) {
      configured.push(`${entry.id}(config)`);
    }
  }

  return configured;
}

function checkPython(): DoctorCheck {
  const binary = resolvePythonBinary();
  if (!binary) {
    return {
      label: "python",
      status: "fail",
      detail: "Neither python3 nor python was found",
    };
  }

  const versionResult = spawnSync(binary, ["--version"], { encoding: "utf-8" });
  const version = `${versionResult.stdout || ""}${versionResult.stderr || ""}`.trim();
  return {
    label: "python",
    status: "ok",
    detail: `${binary} (${version || "version unknown"})`,
  };
}

function checkPyPdf(): DoctorCheck {
  const binary = resolvePythonBinary();
  if (!binary) {
    return {
      label: "pypdf",
      status: "warn",
      detail: "Skipped because Python is unavailable",
    };
  }

  const result = spawnSync(binary, ["-c", "import pypdf"], { encoding: "utf-8" });
  return {
    label: "pypdf",
    status: result.status === 0 ? "ok" : "warn",
    detail: result.status === 0 ? "Installed" : "Not installed; PDF extraction will rely on other fallbacks",
  };
}

function checkPdfToText(): DoctorCheck {
  const result = spawnSync("pdftotext", ["-v"], { encoding: "utf-8" });
  return {
    label: "pdftotext",
    status: result.error ? "warn" : "ok",
    detail: result.error ? "Command not found" : "Installed",
  };
}

function checkPdfExtractionReadiness(): DoctorCheck {
  const hasPython = Boolean(resolvePythonBinary());
  const hasPyPdf = checkPyPdf().status === "ok";
  const hasPdftotext = checkPdfToText().status === "ok";

  if (hasPython && (hasPyPdf || hasPdftotext)) {
    return {
      label: "pdf extraction",
      status: "ok",
      detail: "Ready with Python plus a strong extractor",
    };
  }

  if (hasPython) {
    return {
      label: "pdf extraction",
      status: "warn",
      detail: "Python available, but only basic-text-stream fallback may be available for some PDFs",
    };
  }

  return {
    label: "pdf extraction",
    status: "fail",
    detail: "Unavailable because Python is missing",
  };
}

function resolvePythonBinary(): string | null {
  for (const candidate of ["python3", "python"]) {
    const result = spawnSync(candidate, ["--version"], { encoding: "utf-8" });
    if (result.status === 0) {
      return candidate;
    }
  }
  return null;
}

function formatDoctorReport(report: DoctorReport): string {
  const lines = [
    "SPARK Doctor",
    `generatedAt: ${report.generatedAt}`,
    `cwd: ${report.cwd}`,
    "",
  ];

  for (const check of report.checks) {
    lines.push(`${formatStatus(check.status)} ${check.label}: ${check.detail}`);
  }

  return lines.join("\n");
}

function formatStatus(status: DoctorStatus): string {
  if (status === "ok") {
    return "[OK]";
  }
  if (status === "warn") {
    return "[WARN]";
  }
  return "[FAIL]";
}

if (require.main === module) {
  try {
    runDoctorCli(process.argv.slice(2));
  } catch (error) {
    console.error("SPARK Doctor error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
