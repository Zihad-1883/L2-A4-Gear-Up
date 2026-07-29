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

const getAllGearItemsFromDB = async () => {
    const result = await prisma.gearItem.findMany({
        include: {
            category: true
        }
    })
    return result
}

const updateGearItemInDB = async (payload: Partial<IGearItem>, gearId: string) => {
    const result = await prisma.gearItem.update({
        where: {
            id: gearId,
        },
        data: {
            ...payload
        },
        include: {
            category: true,
        },
    })
    return result
}

export const gearItemService = {
    createGearItemInDB,
    getAllGearItemsFromDB,
    updateGearItemInDB
}