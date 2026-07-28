import type { Request, Response } from "express";
import httpStatus from "http-status"

export const notFound = (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorDetails: [
            {
                path: req.originalUrl,
                message: "API Route not found"
            }
        ]
    })
}