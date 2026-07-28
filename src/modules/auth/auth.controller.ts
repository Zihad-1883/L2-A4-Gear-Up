import type { Request, Response, NextFunction } from "express";
import catchAsync from "../../utilis/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utilis/sendResponse"; // or { sendResponse } depending on your export
import httpStatus from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.registerUserIntoDB(payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});

export const authController = {
    registerUser,
};
