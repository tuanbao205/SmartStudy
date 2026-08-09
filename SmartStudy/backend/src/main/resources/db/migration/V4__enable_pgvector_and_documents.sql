CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
    original_name VARCHAR(255) NOT NULL,
    stored_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) NOT NULL, -- PDF, DOCX
    status VARCHAR(20) NOT NULL DEFAULT 'PROCESSING', -- PROCESSING, READY, FAILED
    uploaded_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE document_chunks (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768), -- Gemini text-embedding-004 sinh ra vector 768 chiều
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Index chuyên dụng để tìm kiếm tương đồng (cosine similarity) nhanh hơn
CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);