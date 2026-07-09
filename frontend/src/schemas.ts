import z from "zod";

export const ProviderSchema = z.enum(['gemini']);
export type Provider = z.infer<typeof ProviderSchema>;

export const MessageRoleSchema = z.enum(['user', 'assistant']);

export const ChatMessageSchema = z.object({
    id: z.union([z.string(), z.number()]),
    role: MessageRoleSchema,
    content: z.string(),
    createdAt: z.coerce.date().optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const SessionSchema = z.object({
    id: z.number(),
    title: z.string(),
    createdAt: z.coerce.date().optional(),
    messages: z.array(ChatMessageSchema).optional(),
});
export type Session = z.infer<typeof SessionSchema>;

export const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginResponseSchema = z.object({
    accessToken: z.string(),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const UserSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    name: z.string().optional(),
    email: z.email().optional(),
});
export type User = z.infer<typeof UserSchema>;