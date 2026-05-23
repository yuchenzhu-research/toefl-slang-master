import test from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";

const repoRoot = process.cwd();

function exists(relativePath: string): boolean {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf-8");
}

test("desktop workspace stays under apps with a single root lockfile", () => {
  const packageJson = JSON.parse(readText("package.json")) as {
    workspaces?: string[];
    scripts?: Record<string, string>;
  };

  assert.ok(exists("apps/desktop/package.json"));
  assert.ok(exists("apps/desktop/src/renderer"));
  assert.ok(!exists("spark-desktop"));
  assert.ok(!exists("apps/desktop/package-lock.json"));
  assert.ok(exists("package-lock.json"));

  assert.deepStrictEqual(packageJson.workspaces, ["apps/desktop"]);
  assert.strictEqual(packageJson.scripts?.["desktop:dev"], "npm run dev --prefix apps/desktop");
  assert.strictEqual(packageJson.scripts?.["desktop:typecheck"], "npm run typecheck --prefix apps/desktop");
  assert.strictEqual(packageJson.scripts?.["desktop:build"], "npm run build --prefix apps/desktop");
});

test("repository does not require changelog or devlog maintenance files", () => {
  assert.ok(!exists("CHANGELOG.md"));
  assert.ok(!exists("DEVLOG.md"));

  const filesToCheck = [
    "AGENTS.md",
    "MANUAL.md",
    "README.md",
    "README_zh-CN.md",
    "README_zh-TW.md",
    "skills/readme-generator/templates/library.md",
    "skills/readme-generator/templates/cli.md",
  ];

  for (const file of filesToCheck) {
    const content = readText(file);
    assert.ok(!content.includes("CHANGELOG.md"), `${file} should not link to CHANGELOG.md`);
    assert.ok(!content.includes("DEVLOG.md"), `${file} should not link to DEVLOG.md`);
  }
});

test("secondary locale readmes stay under docs/locales", () => {
  for (const locale of ["de", "es", "fr", "ja", "ko"]) {
    assert.ok(exists(`docs/locales/README_${locale}.md`));
    assert.ok(!exists(`README_${locale}.md`));
  }
});

test("frontend CI baseline remains wired to desktop workspace scripts", () => {
  const ci = readText(".github/workflows/ci.yml");

  assert.ok(ci.includes("npm run test:ci"));
  assert.ok(ci.includes("npm run desktop:typecheck"));
  assert.ok(ci.includes("npm run desktop:build"));
});
