--UP
CREATE TABLE session_context_blocks (
    id                       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id               INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    start_message_id         INTEGER NOT NULL REFERENCES messages(id),
    message_count            INTEGER NOT NULL,
    content                  TEXT NOT NULL,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ
);

CREATE INDEX idx_session_context_blocks_session_created
    ON session_context_blocks (session_id, created_at);

--DOWN
DROP TABLE session_context_blocks;
