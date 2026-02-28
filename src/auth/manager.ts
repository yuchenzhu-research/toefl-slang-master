/**
 * API Key 管理模块
 * 优先级：环境变量 > 本地配置文件
 */

import * as fs from "fs";
import * as path from "path";

const CONFIG_PATH = path.join(process.env.HOME || "~", ".toefl-slang", "config.json");

export interface Config {
  apiKey?: string;
}

export function getApiKey(): string {
  // 优先级 1: 环境变量
  const envKey = process.env.OPENAI_API_KEY;
  if (envKey && envKey.trim()) {
    return envKey.trim();
  }

  // 优先级 2: 本地配置文件
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const content = fs.readFileSync(CONFIG_PATH, "utf-8");
      const config: Config = JSON.parse(content);
      if (config.apiKey && config.apiKey.trim()) {
        return config.apiKey.trim();
      }
    }
  } catch (error) {
    // 忽略配置文件读取错误
  }

  // 无配置，报错
  throw new Error(
    "请配置 OPENAI_API_KEY 环境变量或检查本地 config 文件\n" +
    "示例:\n" +
    "  export OPENAI_API_KEY=sk-...\n" +
    `  或创建 ${CONFIG_PATH} 包含 {"apiKey": "sk-..."}`
  );
}

export function setApiKey(apiKey: string): void {
  const configDir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  const config: Config = { apiKey };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  console.log(`✅ API Key 已保存至 ${CONFIG_PATH}`);
}