import type { JwtPayload } from "jsonwebtoken";
import type { Role } from "../../prisma/src/generated/prisma/enums";
import config from "../config";
import catchAsync from "../utilis/catchAsync";
import { verifyToken } from "../utilis/jwtToken";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: Role;
            }
        }
    }
}

export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req, res, next) => {
        const token = req.cookies.accessToken ? req.cookies.accessToken :
            req.headers.authorization?.startsWith("Bearer ") ?
                req.headers.authorization?.split(" ")[1] :
                req.headers.authorization

        if (!token) {
            throw new Error("Unauthorized")
        }

        const verifiedToken = verifyToken(token, config.JWT_ACCESS_SECRET!)

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error as string)
        }

        const { id, name, email, role } = verifiedToken.data as JwtPayload

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id
            }
        })

        if (!user) {
            throw new Error("User Not Found")
        }

        if (user.userStatus === "BLOCKED") {
            throw new Error("User Is Blocked.")
        }

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("You Do Not Have Permission To Access This Route")
        }

        req.user = {
            id,
            name,
            email,
            role
        }

        next()
    })
}