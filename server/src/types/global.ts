import { JwtPayload } from "../services/token";

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}
