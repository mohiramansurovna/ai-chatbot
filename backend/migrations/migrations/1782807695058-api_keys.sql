CREATE TYPE api_key_status AS ENUM ('active', 'revoked');
CREATE TABLE api_keys (
  id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id),
  provider        TEXT NOT NULL,
  encrypted_key   TEXT NOT NULL,
  status          api_key_status NOT NULL DEFAULT 'active',
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
--DOWN
DROP TABLE api_keys;
DROP TYPE api_key_status;