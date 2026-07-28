import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken"

export const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions) => {

    const token = jwt.sign(payload, secret, expiresIn as SignOptions)
    return token
}

export const verifyToken = (token: string, secret: string) => {
    try {
        const verifiedToken = jwt.verify(token, secret) as JwtPayload
        return {
            success: true,
            data: verifiedToken
        }
    } catch (error) {
        console.log("Invalid token", error);
        return {
            success: false,
            error: error
        }
    }
}