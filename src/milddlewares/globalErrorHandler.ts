import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message: string = err.message || "Something went wrong!";
    let errorDetails: any = err;

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Invalid input data or type provided";
        errorDetails = err.message;
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = httpStatus.BAD_REQUEST;
            const target = (err.meta?.target as string[])?.join(", ");
            message = target
                ? `Unique constraint failed on field: ${target}`
                : "Unique constraint failed";
        } else if (err.code === "P2025") {
            statusCode = httpStatus.NOT_FOUND;
            message = (err.meta?.cause as string) || "Record not found";
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST;
            message = "Foreign key constraint failed";
        } else {
            statusCode = httpStatus.BAD_REQUEST;
            message = err.message;
        }
    }

    console.log(err);

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
    });
};
