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
                : "A record with this value already exists";
        } else if (err.code === "P2025") {
            statusCode = httpStatus.NOT_FOUND;
            message = (err.meta?.cause as string) || "Record not found";
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST;
            message = "Foreign key constraint failed";
        } else if (err.code === "P2021") {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            message = "The requested table does not exist in the database";
        } else if (err.meta?.driverAdapterError) {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            const adapterCause = (err.meta.driverAdapterError as any)?.cause;
            message = adapterCause?.originalMessage || adapterCause?.message || "Database driver error occurred";
        } else {
            statusCode = httpStatus.BAD_REQUEST;
            const lines = err.message?.split("\n").map((l: string) => l.trim()).filter(Boolean);
            const cleanLine = lines?.[lines.length - 1] || err.message;
            message = cleanLine.replace(/^Database error\.\s*/i, "");
        }
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Failed to connect to the database";
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "An unknown database error occurred";
    } else if (err.message && err.message.includes("\n")) {
        const lines = err.message.split("\n").map((l: string) => l.trim()).filter(Boolean);
        message = lines[lines.length - 1] || err.message;
    }

    console.log(err);

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
    });
};
