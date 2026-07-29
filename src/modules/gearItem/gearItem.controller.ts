import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utilis/catchAsync";
import { gearItemService } from "./gearItem.service";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status"

const createGearItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id
    const result = await gearItemService.createGearItemInDB(payload, userId!);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Gear Item created successfully",
        data: result
    })
})

const updateGearItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const gearId = req.params.gearId;
    const result = await gearItemService.updateGearItemInDB(payload, gearId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear Item updated successfully",
        data: result
    })
})

export const gearItemController = {
    createGearItem,
    updateGearItem
}
