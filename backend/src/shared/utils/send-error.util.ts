import { Response } from "express";
export function sendError(res: Response, statusCode: number, message: string, type: string) {
    return res.status(statusCode).json({
        statusCode,
        message,
        type
    })
}