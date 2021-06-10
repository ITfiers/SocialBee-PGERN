import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { JwtPayload } from "../services/token"

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.session?.jwt
    if (!token) return res.status(401).send("Not Authorized")

    try {
        const jwtPayload = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload

        req.user = jwtPayload

        next()
    } catch (error) {
        return res.status(400).send("Invalid Token")
    }
}
