import { prisma } from "../../lib/prisma"
import type { IRentalOrderUserPayload, RentalOrderStatus } from "./rentalOrder.interface"

const createRentalOrderIntoDB = async (payload: IRentalOrderUserPayload, customerId: string) => {
    const { gearItemId, startDate, endDate } = payload;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (rentalDays < 1) {
        throw new Error("Invalid date range");
    }

    const result = await prisma.$transaction(async (tx) => {
        const gearItem = await tx.gearItem.findUniqueOrThrow({
            where: { id: gearItemId },
        });

        const providerId = gearItem.userId;

        if (gearItem.stock < 1) {
            throw new Error("Gear item is out of stock");
        }

        await tx.gearItem.update({
            where: {
                id: gearItemId
            },
            data: {
                stock: {
                    decrement: 1
                }
            },
        });

        const calculatedTotalPrice = Number(gearItem.price) * rentalDays;

        return tx.rentalOrder.create({
            data: {
                gearItemId,
                customerId,
                providerId,
                rentalOrderStatus: "PENDING",
                startDate: start,
                endDate: end,
                days: rentalDays,
                totalPrice: calculatedTotalPrice,
            },
        });
    });

    return result;
};

const getMyRentalOrdersFromDB = async (customerId: string) => {
    const result = await prisma.rentalOrder.findMany({
        where: {
            customerId
        }
    })
    return result;
}

const getSingleMyRentalOrdersFromDB = async (customerId: string, orderId: string) => {
    const result = await prisma.rentalOrder.findFirstOrThrow({
        where: {
            id: orderId,
            customerId
        }
    })
    return result;
}

const updateMyRentalOrderStatusFromDB = async (customerId: string, orderId: string, payload: RentalOrderStatus) => {

    const rentalOrder = await prisma.rentalOrder.findFirstOrThrow({
        where: {
            id: orderId,
            customerId
        }
    });

    if (!rentalOrder) {
        throw new Error("Rental Order Not Found")
    }

    const result = await prisma.rentalOrder.update({
        where: {
            id: rentalOrder.id
        },
        data: {
            rentalOrderStatus: payload
        }
    })
    return result;
}

const getProvidersAllRentalOrderFromDB = async (providerId: string) => {
    const result = await prisma.rentalOrder.findMany({
        where: {
            providerId
        }
    })
    return result;
}

const updateProvidersRentalOrderStatusFromDB = async (providerId: string, orderId: string, payload: RentalOrderStatus) => {
    const rentalOrder = await prisma.rentalOrder.findFirstOrThrow({
        where: {
            id: orderId,
            providerId
        }
    });

    if (!rentalOrder) {
        throw new Error("Rental Order Not Found")
    }

    // Enforce valid status transitions
    const currentStatus = rentalOrder.rentalOrderStatus;
    if (payload === "PICKED_UP" && currentStatus !== "PAID") {
        throw new Error("Order can only be marked as PICKED_UP after the customer has PAID");
    }
    if (payload === "RETURNED" && currentStatus !== "PICKED_UP") {
        throw new Error("Order can only be marked as RETURNED after the gear has been PICKED_UP");
    }

    // If order status changes to RETURNED, increment stock back
    if (payload === "RETURNED") {
        return await prisma.$transaction(async (tx) => {
            const updatedOrder = await tx.rentalOrder.update({
                where: { id: rentalOrder.id },
                data: { rentalOrderStatus: payload },
            });

            await tx.gearItem.update({
                where: { id: rentalOrder.gearItemId },
                data: { stock: { increment: 1 } },
            });

            return updatedOrder;
        });
    }

    const result = await prisma.rentalOrder.update({
        where: {
            id: rentalOrder.id
        },
        data: {
            rentalOrderStatus: payload
        }
    })
    return result;
}

const getAllRentalOrdersFromDB = async () => {
    const result = await prisma.rentalOrder.findMany();
    return result;
}

export const rentalOrderService = {
    createRentalOrderIntoDB,
    getMyRentalOrdersFromDB,
    getSingleMyRentalOrdersFromDB,
    updateMyRentalOrderStatusFromDB,
    getProvidersAllRentalOrderFromDB,
    updateProvidersRentalOrderStatusFromDB,
    getAllRentalOrdersFromDB
};