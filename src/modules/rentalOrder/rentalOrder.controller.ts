import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utilis/catchAsync";
import httpStatus from "http-status"
import { rentalOrderService } from "./rentalOrder.service";
import { sendResponse } from "../../utilis/sendResponse";

const createRentalOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const customerId = req.user?.id as string;

    const result = await rentalOrderService.createRentalOrderIntoDB(payload, customerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rental Order Created Successfully",
        data: result
    })
})

const getCustomersRentalOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const result = await rentalOrderService.getMyRentalOrdersFromDB(customerId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My Rental Orders Fetched Successfully",
        data: result
    })
})

const getCustomersSingleRentalOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const orderId = req.params.id as string;
    const result = await rentalOrderService.getSingleMyRentalOrdersFromDB(customerId, orderId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My Rental Order Fetched Successfully",
        data: result
    })
})

const updateMyRentalOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const orderId = req.params.id as string;
    const payload = req.body;

    const status = payload?.rentalOrderStatus

    if (!status) {
        throw new Error("Rental Order Status is required");
    }

    if (status !== "CANCELLED") {
        throw new Error("Customers are only allowed to cancel their rental order");
    }

    const result = await rentalOrderService.updateMyRentalOrderStatusFromDB(customerId, orderId, status);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My Rental Order Status Updated Successfully",
        data: result
    })
})

const getProvidersAllRentalOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string;
    const result = await rentalOrderService.getProvidersAllRentalOrderFromDB(providerId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Providers All Rental Orders Fetched Successfully",
        data: result
    })
})

const updateProvidersRentalOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string;
    const orderId = req.params.id as string;
    const payload = req.body;

    const status = payload?.rentalOrderStatus;

    if (!status) {
        throw new Error("Rental Order Status is required");
    }

    if (status !== "APPROVED" && status !== "REJECTED" && status !== "RETURNED") {
        throw new Error("Providers are only allowed to approve or reject their rental order");
    }


    const result = await rentalOrderService.updateProvidersRentalOrderStatusFromDB(providerId, orderId, status);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Providers Rental Order Status Updated Successfully",
        data: result
    })
})

const getAllRentalOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalOrderService.getAllRentalOrdersFromDB();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Rental Orders Fetched Successfully",
        data: result
    })
})

export const rentalOrderController = {
    createRentalOrder,
    getCustomersRentalOrders,
    getCustomersSingleRentalOrder,
    updateMyRentalOrderStatus,
    getProvidersAllRentalOrders,
    updateProvidersRentalOrderStatus,
    getAllRentalOrders
}
