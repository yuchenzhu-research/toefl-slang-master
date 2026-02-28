/**
 * OpenAI API 客户端模块
 * 封装流式请求处理
 */

import OpenAI from "openai";
import { getApiKey } from "../auth/manager";

export class ToeflSlangClient {
  private client: OpenAI;

  constructor() {
    const apiKey = getApiKey();
    this.client = new OpenAI({
      apiKey,
    });
  }

  /**
   * 流式聊天请求
   * @param systemPrompt System Prompt
   * @param userInput 用户输入
   */
  async chatStreaming(systemPrompt: string, userInput: string): Promise<void> {
    const stream = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput },
      ],
      stream: true,
      temperature: 0.3,
    });

    process.stdout.write("\n");

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        process.stdout.write(content);
      }
    }

    process.stdout.write("\n\n");
  }

  /**
   * 非流式聊天请求（用于测试）
   */
  async chat(systemPrompt: string, userInput: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput },
      ],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || "";
  }
}