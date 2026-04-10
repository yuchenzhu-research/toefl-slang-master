export class TextChunker {
  /**
   * Splits text into smaller chunks without cutting sentences in half.
   * Assumes max length ~2000 words per chunk for standard LLM capacity context limits.
   */
  static splitIntoChunks(text: string, maxWordsPerChunk: number = 2000): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+[\])'"`’”]*|.+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = "";
    let currentWordCount = 0;

    for (const sentence of sentences) {
      const words = sentence.trim().split(/\s+/).length;
      if (currentWordCount + words > maxWordsPerChunk && currentWordCount > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
        currentWordCount = 0;
      }
      currentChunk += sentence + " ";
      currentWordCount += words;
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}
