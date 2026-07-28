import bcrypt from "bcryptjs";

import { prisma } from "../../lib/prisma";
import config from "../../config";
import type { IRegisterUserPayload } from "./user.interface";

const registerUserIntoDB = async (payload: IRegisterUserPayload) => {
    const { name, email, password, role } = payload;

    const isUserExists = await prisma.user.findFirst({
        where: {
            email,
        },
    });

    if (isUserExists) {
        throw new Error("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, Number(config.BCRYPT_SALT_ROUNDS));

    const registeredUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            role,
        },
    });

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: registeredUser.email || email,
        },
        omit: {
            password: true,
        },
    });

    return user;
};

const getMyProfileFromDB = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    })

    return user
}


export const userService = {
    registerUserIntoDB,
    getMyProfileFromDB
};
