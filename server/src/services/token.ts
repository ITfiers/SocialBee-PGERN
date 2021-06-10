import jwt from "jsonwebtoken"

export interface JwtPayload {
    id: string
    username: string
}
export class Token {
    static sign(payload: JwtPayload): string {
        const token = jwt.sign(payload, process.env.JWT_KEY!)
        return token
    }
}
