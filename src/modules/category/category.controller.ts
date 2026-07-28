import type { Request, Response, NextFunction } from "express";
import catchAsync from "../../utilis/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utilis/sendResponse";

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await categoryService.createCategoryIntoDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Category created successfully",
        data: result
    })
})

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getAllCategoriesFromDB();

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Categories fetched successfully",
        data: result
    })
})

export const categoryController = {
    createCategory,
    getAllCategories
}