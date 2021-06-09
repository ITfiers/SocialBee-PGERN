import jwt from "jsonwebtoken";

export class Token {
  static sign(payload: { id: string; username: string }): string {
    const token = jwt.sign(payload, process.env.JWT_KEY);
    return token;
  }
}
