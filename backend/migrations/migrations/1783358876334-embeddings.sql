--UP
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS embeddings (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    session_id INTEGER NOT NULL REFERENCES sessions(id),
    role message_role NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768) NOT NULL,
    embedding_model TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS embeddings_embedding_idx
    ON embeddings USING hnsw (embedding vector_cosine_ops);

--DOWN
DROP TABLE IF EXISTS embeddings;
DROP INDEX IF EXISTS embeddings_embedding_idx;