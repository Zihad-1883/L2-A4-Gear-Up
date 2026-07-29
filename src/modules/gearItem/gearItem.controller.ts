import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utilis/catchAsync";
import { gearItemService } from "./gearItem.service";
import { sendResponse } from "../../utilis/sendResponse";

const createGearItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id
    const result = await gearItemService.createGearItemInDB(payload, userId!);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Gear Item created successfully",
        data: result
    })
})

export const gearItemController = {
    createGearItem
}
