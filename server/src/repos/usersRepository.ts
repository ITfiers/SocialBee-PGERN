import { pool } from "../db/pool"
import { User } from "../types"

type UserReturn = { id: string; username: string }

export class UsersRepository {
    static async findByEmail(email: string): Promise<User | undefined> {
        const response = await pool.query<User>(
            "SELECT * FROM users WHERE email = $1;",
            [email]
        )

        return response.rows[0]
    }

    static async findByUsername(username: string): Promise<User | undefined> {
        const response = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        )

        return response.rows[0]
    }

    static async insertOne(user: {
        username: string
        email: string
        hashedPassword: string
        avatar: string | undefined
    }): Promise<UserReturn> {
        const res = await pool.query<UserReturn>(
            "INSERT INTO users (username, email, password, avatar) VALUES ($1, $2, $3, $4) RETURNING id, username;",
            [user.username, user.email, user.hashedPassword, user?.avatar]
        )

        return res.rows[0]
    }
}
