export interface SourceChunk {
  documentName: string;
  excerpt: string;
  similarity: number;
}

export interface ChatResponse {
  answer: string;
  sources: SourceChunk[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceChunk[];
}