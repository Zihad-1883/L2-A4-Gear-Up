import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utilis/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status";

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id as string;

    const result = await reviewService.createReviewInDB(payload, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review submitted successfully",
        data: result,
    });
});

const getReviewsForGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const gearItemId = (req.params.gearId || req.params.id) as string;
    const result = await reviewService.getReviewsForGearFromDB(gearItemId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear reviews fetched successfully",
        data: result,
    });
});

export const reviewController = {
    createReview,
    getReviewsForGear,
};
