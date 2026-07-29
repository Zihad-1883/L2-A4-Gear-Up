import { prisma } from "../../lib/prisma"
import type { IRentalOrderUserPayload } from "./rentalOrder.interface"

const createRentalOrderIntoDB = async (payload: IRentalOrderUserPayload, userId: string) => {
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
                userId,
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

export const rentalOrderService = {
    createRentalOrderIntoDB,
};