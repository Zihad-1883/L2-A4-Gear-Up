import { prisma } from "../../lib/prisma";
import type { ICategory } from "./category.interface";

const createCategoryIntoDB = async (payload: ICategory) => {
    const { name, description } = payload;

    const category = await prisma.category.create({
        data: {
            name,
            description,
        },
    });

    return category;
};

const getAllCategoriesFromDB = async () => {
    const result = await prisma.category.findMany();
    return result;
};

export const categoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
};