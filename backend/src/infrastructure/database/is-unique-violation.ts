export function isUniqueViolation(err: unknown, constraint?: string): boolean {
    const pgErr = err as { code?: string; constraint_name?: string }
    return pgErr?.code === '23505' && (!constraint || pgErr.constraint_name === constraint)
}