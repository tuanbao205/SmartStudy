import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { chatApi } from '../api/chatApi';
import type { ChatMessage } from '../types/chat';

function AnswerMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <p className="font-display text-base font-semibold text-ink mt-3 first:mt-0">{children}</p>,
        h2: ({ children }) => <p className="font-display text-base font-semibold text-ink mt-3 first:mt-0">{children}</p>,
        h3: ({ children }) => <p className="font-display text-sm font-semibold text-ink mt-3 first:mt-0">{children}</p>,
        p: ({ children }) => <p className="text-sm text-ink leading-relaxed mt-2 first:mt-0">{children}</p>,
        strong: ({ children }) => <span className="font-semibold text-ink">{children}</span>,
        ul: ({ children }) => <ul className="mt-2 space-y-1 pl-1">{children}</ul>,
        ol: ({ children }) => <ol className="mt-2 space-y-1 pl-1 list-decimal list-inside">{children}</ol>,
        li: ({ children }) => (
          <li className="text-sm text-ink leading-relaxed flex gap-2">
            <span className="text-amber shrink-0">·</span>
            <span>{children}</span>
          </li>
        ),
        hr: () => <div className="my-3 border-t border-ink/10" />,
        code: ({ children }) => (
          <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-xs text-ink">{children}</code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function SourcesList({ sources }: { sources: NonNullable<ChatMessage['sources']> }) {
  const [expanded, setExpanded] = useState(false);
  if (sources.length === 0) return null;

  // Gộp các chunk theo tên tài liệu gốc
  const grouped = sources.reduce<Record<string, typeof sources>>((acc, s) => {
    acc[s.documentName] = acc[s.documentName] ? [...acc[s.documentName], s] : [s];
    return acc;
  }, {});
  const documentNames = Object.keys(grouped);

  return (
    <div className="mt-3 pt-3 border-t border-ink/10">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted hover:text-ink transition"
      >
        <span>{expanded ? '▾' : '▸'}</span>
        Nguồn tham khảo ({documentNames.length} tài liệu, {sources.length} đoạn trích)
      </button>

      {expanded && (
        <div className="mt-2 space-y-3">
          {documentNames.map((docName) => (
            <div key={docName}>
              <p className="text-xs font-medium text-ink flex items-center gap-1.5">
                <span>📄</span> {docName}
                <span className="font-normal text-muted">· {grouped[docName].length} đoạn trích</span>
              </p>
              <div className="mt-1.5 space-y-1.5">
                {grouped[docName].map((s, si) => (
                  <div key={si} className="rounded-lg bg-paper px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-mono text-muted">Đoạn trích {si + 1}</p>
                      <span className="shrink-0 rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-medium text-ink">
                        {(s.similarity * 100).toFixed(0)}% liên quan
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1 line-clamp-2">{s.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (question: string) => {
    if (!question.trim() || loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatApi.ask(question);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.answer, sources: res.data.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="flex flex-col h-full p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">AI Assistant</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Hỏi đáp tài liệu</h1>
          <p className="mt-1 text-sm text-muted">
            Đặt câu hỏi dựa trên tài liệu bạn đã upload — AI chỉ trả lời dựa trên nội dung đó.
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => send('Tóm tắt lại nội dung các tài liệu đã upload')}
            disabled={loading}
            className="shrink-0 rounded-lg bg-ink px-4 py-2 text-xs font-medium text-white hover:bg-ink/90 disabled:opacity-50 transition"
          >
            Tóm tắt lại
          </button>
        )}
      </div>

      <div className="flex-1 mt-6 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && (
          <div className="rounded-xl border border-dashed border-ink/20 bg-white py-12 text-center">
            <p className="text-sm text-muted">
              Chưa có tin nhắn nào. Hãy đặt câu hỏi về tài liệu bạn đã upload.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' ? 'bg-ink text-white' : 'bg-white border border-ink/10 shadow-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="text-sm text-white whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <>
                  <AnswerMarkdown content={msg.content} />
                  {msg.sources && <SourcesList sources={msg.sources} />}
                </>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white border border-ink/10 px-4 py-3 shadow-sm">
              <p className="text-sm text-muted">Đang suy nghĩ...</p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Đặt câu hỏi về tài liệu của bạn..."
          className="flex-1 rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-lg bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-50 transition"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}