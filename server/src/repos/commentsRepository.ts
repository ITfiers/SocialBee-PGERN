import { pool } from "../db/pool"
import { Comment } from "../types"

export class CommentsRepository {
    static async findById(id: string): Promise<Comment> {
        const response = await pool.query<Comment>(
            `SELECT * FROM comments WHERE id = $1`,
            [id]
        )
        return response.rows[0]
    }

    static async findMany(postId: string): Promise<Comment[]> {
        const response = await pool.query(
            `SELECT * FROM comments WHERE post_id = $1`,
            [postId]
        )

        return response.rows
    }
}
