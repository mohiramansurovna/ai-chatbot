--UP
CREATE TYPE message_role AS ENUM ('assistant', 'user');
CREATE TABLE messages (
  id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id      INTEGER NOT NULL REFERENCES sessions(id),
  role            message_role NOT NULL,
  is_compressed   BOOLEAN DEFAULT FALSE,
  content         TEXT NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
--DOWN
DROP TABLE messages;
DROP TYPE message_type;

