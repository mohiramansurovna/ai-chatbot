--UP
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE user_memories (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id),
    content         TEXT NOT NULL,
    embedding       vector(768) NOT NULL,
    embedding_model TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

CREATE INDEX idx_user_memories_user_created
    ON user_memories (user_id, created_at);

CREATE INDEX idx_user_memories_embedding
    ON user_memories USING hnsw (embedding vector_cosine_ops);

--DOWN
DROP TABLE user_memories;