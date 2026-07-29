import bcrypt from "bcryptjs";

import { prisma } from "../../lib/prisma";
import config from "../../config";
import type { IRegisterUserPayload, IUser, IUserStatus } from "./user.interface";

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

const getAllUsersFromDB = async () => {
    const users = await prisma.user.findMany({
        omit: {
            password: true
        }
    })
    return users
}

const updateUserStatusInDB = async (userId: string, payload: IUserStatus) => {
    if (payload !== "ACTIVE" && payload !== "BLOCKED") {
        throw new Error("Invalid user status");
    }
    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            userStatus: payload
        }
    })
    return result
}


export const userService = {
    registerUserIntoDB,
    getMyProfileFromDB,
    getAllUsersFromDB,
    updateUserStatusInDB
};
