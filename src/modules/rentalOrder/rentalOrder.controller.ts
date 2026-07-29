import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utilis/catchAsync";
import httpStatus from "http-status"
import { rentalOrderService } from "./rentalOrder.service";
import { sendResponse } from "../../utilis/sendResponse";

const createRentalOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id as string;

    const result = await rentalOrderService.createRentalOrderIntoDB(payload, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rental Order Created Successfully",
        data: result
    })
})

const getMyRentalOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const result = await rentalOrderService.getMyRentalOrdersFromDB(userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My Rental Orders Fetched Successfully",
        data: result
    })
})

const getSingleMyRentalOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const orderId = req.params.id as string;
    const result = await rentalOrderService.getSingleMyRentalOrdersFromDB(userId, orderId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My Rental Order Fetched Successfully",
        data: result
    })
})

const updateMyRentalOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const orderId = req.params.id as string;
    const payload = req.body;

    const status = payload?.rentalOrderStatus || payload?.rentalStatus;

    if (!status) {
        throw new Error("Rental Order Status is required");
    }

    if (status !== "CANCELLED") {
        throw new Error("Customers are only allowed to cancel their rental order");
    }

    const result = await rentalOrderService.updateMyRentalOrderStatusFromDB(userId, orderId, status);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My Rental Order Status Updated Successfully",
        data: result
    })
})

export const rentalOrderController = {
    createRentalOrder,
    getMyRentalOrders,
    getSingleMyRentalOrders,
    updateMyRentalOrderStatus
}
