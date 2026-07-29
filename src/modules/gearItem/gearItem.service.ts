import { prisma } from "../../lib/prisma"
import type { IGearItem } from "./gearItem.interface"

const createGearItemInDB = async (payload: IGearItem, userId: string) => {

    const createdGearItem = { ...payload, userId }

    const result = await prisma.gearItem.create({
        data: {
            ...createdGearItem,
        },
        include: {
            category: true,
        },
    })

    return result
}

export const gearItemService = { createGearItemInDB }