import { Shared } from "@/shared"
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
@Catch(Shared.Errors.DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(err: Shared.Errors.DomainError, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse()
        const status =
            err instanceof Shared.Errors.NotFoundError ? 404 :
                err instanceof Shared.Errors.ConflictError ? 409 :
                    err instanceof Shared.Errors.ValidationError ? 400 :
                        err instanceof Shared.Errors.UnauthorizedError ? 401 :
                            err instanceof Shared.Errors.ForbiddenError ? 403 : 500

        res.status(status).json({ code: err.code, message: err.message })
    }
}