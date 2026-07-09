import * as z from "zod"

export const envSchema = z.object({
  PORT: z.coerce.number(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  JWT_REFRESH_SESSION_EXPIRES_IN: z.string(),
  LLM_SECRET: z.string(),
  OLLAMA_URL: z.string(),
  OLLAMA_EMBED_MODEL: z.string(),
});

export type EnvConfig = z.infer<typeof envSchema>

export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error('Invalid ENV Variables. ', result.error.format())
    throw new Error('Invalid env Variables')
  }

  return result.data
}