import { db } from "../db"
import { pool } from "../db/pool"
import { Post } from "../types"

export class PostsRepository {
    static async findMany(): Promise<Post[]> {
        const response = (await db.posts.findMany()) as Post[]
        return response
    }

    static async findById(id: string): Promise<Post | undefined> {
        const response = await pool.query<Post>(
            "SELECT * FROM users WHERE id = $1",
            [id]
        )

        return response.rows[0]
    }

    static async insertOne(post: {
        description: string
        image: string
        userId: string
    }): Promise<Post> {
        const response = await pool.query<Post>(
            "INSERT INTO posts (description, image, user_id) VALUES ($1, $2, $3) RETURNING *;",
            [post.description, post.image, post.userId]
        )
        return response.rows[0]
    }
}
