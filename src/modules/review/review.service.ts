import { prisma } from "../../lib/prisma";
import type { ICreateReviewPayload } from "./review.interface";

const createReviewInDB = async (payload: ICreateReviewPayload, userId: string) => {
    const { gearItemId, rating, comment } = payload;

    if (!gearItemId || rating === undefined || rating === null) {
        throw new Error("gearItemId and rating are required");
    }

    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be an integer between 1 and 5");
    }

    // 1. Must have a RETURNED rental order for this gear item
    const hasReturnedOrder = await prisma.rentalOrder.findFirst({
        where: {
            customerId: userId,
            gearItemId: gearItemId,
            rentalOrderStatus: "RETURNED",
        },
    });

    if (!hasReturnedOrder) {
        throw new Error("You can only review gear items that you have rented and returned");
    }

    // 2. Prevent duplicate review for the same gear item
    const existingReview = await prisma.review.findUnique({
        where: {
            userId_gearItemId: {
                userId,
                gearItemId,
            },
        },
    });

    if (existingReview) {
        throw new Error("You have already reviewed this gear item");
    }

    // 3. Create the review
    const review = await prisma.review.create({
        data: {
            userId,
            gearItemId,
            rating,
            comment: comment ?? null,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            gearItem: {
                select: {
                    id: true,
                    name: true,
                    brand: true,
                },
            },
        },
    });

    return review;
};

const getReviewsForGearFromDB = async (gearItemId: string) => {
    const reviews = await prisma.review.findMany({
        where: {
            gearItemId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return reviews;
};

export const reviewService = {
    createReviewInDB,
    getReviewsForGearFromDB,
};
