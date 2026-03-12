import {
  formatProviderCatalog,
  formatResolvedProviderPreview,
  generateTextWithProvider,
  resolveProviderConfig,
} from "../providers/runtime";
import { ProviderApi, ProviderResolutionOptions, ResolvedProvider } from "../providers/types";

export interface ToeflSlangClientOptions extends ProviderResolutionOptions {}

export class ToeflSlangClient {
  constructor(private readonly options: ToeflSlangClientOptions = { provider: "openai" }) {}

  async chatStreaming(systemPrompt: string, userInput: string): Promise<void> {
    const response = await generateTextWithProvider({
      provider: this.options,
      request: {
        systemPrompt,
        userPrompt: userInput,
        temperature: 0.3,
      },
    });

    process.stdout.write("\n");
    process.stdout.write(response.text);
    process.stdout.write("\n\n");
  }

  async chat(systemPrompt: string, userInput: string): Promise<string> {
    const response = await generateTextWithProvider({
      provider: this.options,
      request: {
        systemPrompt,
        userPrompt: userInput,
        temperature: 0.3,
      },
    });

    return response.text;
  }

  previewProvider(): ResolvedProvider {
    return resolveProviderConfig(this.options, { requireApiKey: false });
  }

  formatPreview(): string {
    return formatResolvedProviderPreview(this.previewProvider());
  }

  static listProviders(): string {
    return formatProviderCatalog();
  }
}

export type { ProviderApi };
