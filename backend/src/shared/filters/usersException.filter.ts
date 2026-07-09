import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { UserEmailConflictError, UserNotFoundError, UsersError } from "../errors";
import { Response } from "express";
import { sendError } from "../utils/send-error.util";

@Catch(UsersError)
export class UsersExceptionFilter implements ExceptionFilter {
    catch(exception: UsersError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        if (exception instanceof UserNotFoundError) {
            return sendError(res, 404, exception.message, exception.name)
        }

        if (exception instanceof UserEmailConflictError) {
            return sendError(res, 409, exception.message, exception.name)
        }

        return sendError(res, 500, 'Internal server error', 'Server Error')
    }
}