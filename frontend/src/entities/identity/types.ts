import { z } from 'zod';

export const userSchema = z.object({ id: z.number(), name: z.string(), email: z.string().email() });

export type User = z.infer<typeof userSchema>;

export const loginResponseSchema = z.object({ accessToken: z.string() });

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const refreshResponseSchema = z.object({ accessToken: z.string() });

export type RefreshResponse = z.infer<typeof refreshResponseSchema>;

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };
export type UpdateProfilePayload = Partial<Pick<User, 'name' | 'email'>>;
