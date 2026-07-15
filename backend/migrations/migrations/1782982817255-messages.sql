--UP
CREATE TYPE message_role AS ENUM ('assistant', 'user');
CREATE TYPE message_status AS ENUM ('compressed','compressing','raw');

CREATE TABLE messages (
  id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id      INTEGER NOT NULL REFERENCES sessions(id),
  role            message_role NOT NULL,
  status          message_status NOT NULL DEFAULT 'raw',
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--DOWN
DROP TABLE messages;
DROP TYPE message_role;
DROP TYPE message_status;

