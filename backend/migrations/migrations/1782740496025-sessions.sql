--UP
CREATE TABLE sessions (
  id         INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  title      TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
--DOWN
DROP TABLE sessions;