import bcrypt from "bcryptjs"
import type { ILoginUserPayload, IRegisterUserPayload } from "./auth.interface"
import { prisma } from "../../lib/prisma"
import config from "../../config"
import jwt, { type SignOptions } from "jsonwebtoken"
import { createToken } from "../../utilis/jwtToken"

const registerUserIntoDB = async (payload: IRegisterUserPayload) => {
    const { name, email, password, role } = payload

    const isUserExists = await prisma.user.findFirst({
        where: {
            email
        }
    })

    if (isUserExists) {
        throw new Error("User already exists")
    }

    const hashPassword = await bcrypt.hash(password, Number(config.BCRYPT_SALT_ROUNDS))
    // console.log("hashed password : ", hashPassword)

    const registeredUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            role
        }
    })

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: registeredUser.email || email
        },
        omit: {
            password: true
        }
    })

    return user
}

const loginUserIntoDB = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email
        }
    })

    if (!user) {
        throw new Error("User not found")
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) {
        throw new Error("Password not matched")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.JWT_ACCESS_SECRET!,
        { expiresIn: config.JWT_ACCESS_EXPIRES_IN } as SignOptions
    )

    const refreshToken = createToken(
        jwtPayload,
        config.JWT_REFRESH_SECRET!,
        { expiresIn: config.JWT_REFRESH_EXPIRES_IN } as SignOptions,
    );

    return {
        accessToken,
        refreshToken
    }
}

export const authService = {
    registerUserIntoDB,
    loginUserIntoDB
}