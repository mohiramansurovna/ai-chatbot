import {
    CompactEncrypt,
    compactDecrypt,
    errors,
    JWTPayload,
    jwtVerify,
    SignJWT,
} from 'jose';

const JWT_ISSUER = 'auth-flow';

export type JwtSignOptions = {
    secret: string;
    expiresIn: string | number;
};

export type JwtVerifyOptions = {
    secret: string;
    clockTolerance?: string | number;
};

export type EncryptOptions = {
    secret: string;
};

export class Jose {
    private static encodeSecret(secret: string): Uint8Array {
        return new TextEncoder().encode(secret);
    }

    static async sign<T extends JWTPayload>(
        payload: T,
        options: JwtSignOptions,
    ): Promise<string> {
        const { secret, expiresIn } = options;

        return new SignJWT(payload)
            .setProtectedHeader({
                alg: 'HS256',
                typ: 'JWT',
            })
            .setIssuer(JWT_ISSUER)
            .setExpirationTime(expiresIn)
            .sign(this.encodeSecret(secret));
    }

    static async verify<T extends JWTPayload>(
        token: string,
        options: JwtVerifyOptions,
    ): Promise<T> {
        try {
            const { payload } = await jwtVerify(
                token,
                this.encodeSecret(options.secret),
                {
                    algorithms: ['HS256'],
                    issuer: JWT_ISSUER,
                },
            );

            return payload as T;
        } catch (error) {
            if (error instanceof errors.JOSEError) {
                throw new InvalidTokenError();
            }

            throw error;
        }
    }

    static async encrypt(
        plaintext: string,
        options: EncryptOptions,
    ): Promise<string> {
        try {
            return await new CompactEncrypt(
                new TextEncoder().encode(plaintext),
            )
                .setProtectedHeader({
                    alg: 'dir',
                    enc: 'A256GCM',
                })
                .encrypt(this.encodeSecret(options.secret));
        } catch (error) {
            if (error instanceof errors.JOSEError) {
                throw new InvalidEncryptionError();
            }

            throw error;
        }
    }

    static async decrypt(
        ciphertext: string,
        options: EncryptOptions,
    ): Promise<string> {
        try {
            const { plaintext } = await compactDecrypt(
                ciphertext,
                this.encodeSecret(options.secret),
            );

            return new TextDecoder().decode(plaintext);
        } catch (error) {
            if (error instanceof errors.JOSEError) {
                throw new InvalidEncryptionError();
            }

            throw error;
        }
    }
}

export class InvalidTokenError extends Error {
    constructor(message = 'Invalid or expired token') {
        super(message);
        this.name = 'InvalidTokenError';
    }
}

export class InvalidEncryptionError extends Error {
    constructor(message = 'Failed to encrypt or decrypt data') {
        super(message);
        this.name = 'InvalidEncryptionError';
    }
}