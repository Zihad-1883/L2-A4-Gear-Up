import type { Request, Response, NextFunction } from "express";
import catchAsync from "../../utilis/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status";
import type { JwtPayload } from "jsonwebtoken";

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await userService.registerUserIntoDB(payload);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getMyProfileFromDB(req.user?.id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile fetched successfully",
        data: result,
    });
});

export const userController = {
    registerUser,
    getMyProfile
};
