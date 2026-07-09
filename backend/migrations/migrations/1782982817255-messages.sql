--UP
CREATE TYPE message_role AS ENUM ('assistant', 'user');
CREATE TABLE messages (
  id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id         INTEGER NOT NULL REFERENCES sessions(id),
  role            message_role NOT NULL,
  content         TEXT NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
--DOWN
DROP TABLE IF EXISTS messages;
DROP TYPE IF EXISTS message_type;

