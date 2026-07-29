import catchAsync from "../../utilis/catchAsync";
import httpStatus from "http-status"
import { rentalOrderService } from "./rentalOrder.service";
import { sendResponse } from "../../utilis/sendResponse";

const createRentalOrder = catchAsync(async (req, res) => {
    const payload = req.body;
    const userId = req.user?.id as string;

    const result = await rentalOrderService.createRentalOrderIntoDB(payload, userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Rental Order Created Successfully",
        data: result
    })
})

export const rentalOrderController = {
    createRentalOrder
}
