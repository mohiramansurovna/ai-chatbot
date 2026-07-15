import {
    CompactEncrypt,
    compactDecrypt,
    errors,
    JWTPayload,
    jwtVerify,
    SignJWT,
} from 'jose';

const JWT_ISSUER = 'ai-chatbot';

export type JwtSignOptions = { secret: string; expiresIn: string | number };
export type JwtVerifyOptions = { secret: string; clockTolerance?: string | number };
export type EncryptOptions = { secret: string };

export class JoseError extends Error {
    constructor(message: string, options?: { cause?: unknown }) {
        super(message, options)
        this.name = this.constructor.name
    }
}

export class TokenExpiredError extends JoseError {
    constructor(cause?: unknown) {
        super('Token has expired', { cause })
    }
}

export class TokenInvalidError extends JoseError {
    constructor(cause?: unknown) {
        super('Token is invalid', { cause })
    }
}

export class EncryptionError extends JoseError {
    constructor(cause?: unknown) {
        super('Failed to encrypt or decrypt data', { cause })
    }
}

export class Jose {
    private static encodeSecret(secret: string): Uint8Array {
        return new TextEncoder().encode(secret);
    }

    static async sign<T extends JWTPayload>(payload: T, options: JwtSignOptions): Promise<string> {
        const { secret, expiresIn } = options;
        return new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .setIssuer(JWT_ISSUER)
            .setExpirationTime(expiresIn)
            .sign(this.encodeSecret(secret));
    }

    static async verify<T extends JWTPayload>(token: string, options: JwtVerifyOptions): Promise<T> {
        try {
            const { payload } = await jwtVerify(token, this.encodeSecret(options.secret), {
                algorithms: ['HS256'],
                issuer: JWT_ISSUER,
            });
            return payload as T;
        } catch (error) {
            if (error instanceof errors.JWTExpired) {
                throw new TokenExpiredError(error)
            }
            if (error instanceof errors.JOSEError) {
                throw new TokenInvalidError(error)
            }
            throw error
        }
    }

    static async encrypt(plaintext: string, options: EncryptOptions): Promise<string> {
        try {
            return await new CompactEncrypt(new TextEncoder().encode(plaintext))
                .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
                .encrypt(this.encodeSecret(options.secret));
        } catch (error) {
            if (error instanceof errors.JOSEError) throw new EncryptionError(error)
            throw error
        }
    }

    static async decrypt(ciphertext: string, options: EncryptOptions): Promise<string> {
        try {
            const { plaintext } = await compactDecrypt(ciphertext, this.encodeSecret(options.secret));
            return new TextDecoder().decode(plaintext);
        } catch (error) {
            if (error instanceof errors.JOSEError) throw new EncryptionError(error)
            throw error
        }
    }
}