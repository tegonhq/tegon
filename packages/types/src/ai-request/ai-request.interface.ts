export interface AIStreamResponse {
  textStream: AsyncIterable<string> & ReadableStream<string>;
}
