import type { Request, Response, NextFunction } from "express";
import catchAsync from "../../utilis/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await userService.createUserIntoDB(payload);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});

export const userController = {
    createUser,
};
