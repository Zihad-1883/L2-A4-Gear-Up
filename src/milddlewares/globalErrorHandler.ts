import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../lib/prisma";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode: number = typeof err.statusCode === "number" ? err.statusCode : 500;
    let message: string = err.message || "Something went wrong!";
    let errorDetails: any = err;

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid input data or type provided";
        errorDetails = err.message;
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = 400;
            const target = (err.meta?.target as string[])?.join(", ");
            message = target
                ? `Unique constraint failed on field: ${target}`
                : "A record with this value already exists";
        } else if (err.code === "P2025") {
            statusCode = 404;
            message = (err.meta?.cause as string) || "Record not found";
        } else if (err.code === "P2003") {
            statusCode = 400;
            message = "Foreign key constraint failed";
        } else if (err.code === "P2021") {
            statusCode = 500;
            message = "The requested table does not exist in the database";
        } else if (err.meta?.driverAdapterError) {
            statusCode = 500;
            const adapterCause = (err.meta.driverAdapterError as any)?.cause;
            message = adapterCause?.originalMessage || adapterCause?.message || "Database driver error occurred";
        } else {
            statusCode = 400;
            const lines = err.message?.split("\n").map((l: string) => l.trim()).filter(Boolean);
            const cleanLine = lines?.[lines.length - 1] || err.message;
            message = cleanLine.replace(/^Database error\.\s*/i, "");
        }
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = 500;
        message = "Failed to connect to the database";
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        message = "An unknown database error occurred";
    } else if (err.message && err.message.includes("\n")) {
        const lines = err.message.split("\n").map((l: string) => l.trim()).filter(Boolean);
        message = lines[lines.length - 1] || err.message;
    }

    console.error("[Global Error Handler]", err);

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
    });
};
