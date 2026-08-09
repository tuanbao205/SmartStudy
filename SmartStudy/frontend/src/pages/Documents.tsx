import { useEffect, useRef, useState } from 'react';
import { documentApi } from '../api/documentApi';
import type { DocumentItem } from '../types/document';

const statusLabel: Record<string, { text: string; color: string }> = {
  PROCESSING: { text: 'Đang xử lý', color: 'bg-amber/15 text-ink' },
  READY: { text: 'Sẵn sàng', color: 'bg-green-100 text-green-700' },
  FAILED: { text: 'Lỗi', color: 'bg-red-100 text-red-700' },
};

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    documentApi
      .getMyDocuments()
      .then((res) => setDocuments(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toUpperCase();
    if (ext !== 'PDF' && ext !== 'DOCX') {
      setError('Chỉ hỗ trợ file PDF hoặc DOCX');
      return;
    }

    setUploading(true);
    setError('');
    try {
      await documentApi.upload(file);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload thất bại, vui lòng thử lại');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleView = (doc: DocumentItem) => {
    const url = documentApi.getViewUrl(doc.id);
    if (doc.fileType === 'PDF') {
      window.open(url, '_blank');
    } else {
      // DOCX không xem trực tiếp được trên trình duyệt -> tải về
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.originalName;
      a.click();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xoá tài liệu này? AI sẽ không còn tham khảo được nội dung của nó nữa.')) return;
    setDeletingId(id);
    try {
      await documentApi.delete(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">AI Assistant</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Tài liệu học tập</h1>
          <p className="mt-1 text-sm text-muted">
            Upload tài liệu (PDF, DOCX) để AI có thể trả lời câu hỏi dựa trên nội dung học của bạn.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            className="hidden"
            id="doc-upload"
          />
          <label
            htmlFor="doc-upload"
            className={`inline-block rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition cursor-pointer ${
              uploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {uploading ? 'Đang tải lên...' : '+ Upload tài liệu'}
          </label>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <div className="mt-10 text-center text-muted text-sm">Đang tải...</div>
      ) : documents.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-ink/20 bg-white py-16 text-center">
          <p className="text-sm text-muted">Bạn chưa upload tài liệu nào.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-2">
          {documents.map((doc) => {
            const status = statusLabel[doc.status] || statusLabel.PROCESSING;
            return (
              <div
                key={doc.id}
                className="group flex items-center gap-4 rounded-xl border border-ink/10 bg-white px-5 py-4 shadow-sm"
              >
                <span className="text-2xl shrink-0">{doc.fileType === 'PDF' ? '📄' : '📝'}</span>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => doc.status === 'READY' && handleView(doc)}
                    disabled={doc.status !== 'READY'}
                    className="text-sm font-medium text-ink truncate hover:underline disabled:no-underline disabled:cursor-default text-left"
                  >
                    {doc.originalName}
                  </button>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(doc.uploadedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                  {status.text}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  {doc.status === 'READY' && (
                    <button
                      onClick={() => handleView(doc)}
                      className="rounded-md p-2 text-muted hover:bg-ink/5 hover:text-ink transition"
                      aria-label="Xem tài liệu"
                    >
                      👁
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                    aria-label="Xoá"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}