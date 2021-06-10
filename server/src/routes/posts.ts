import { Router, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { requireAuth } from "../middlewares/require-auth"
import { PostsRepository } from "../repos/postsRepository"
import { CreatePostDto } from "../types/dtos"

const router = Router()

router.get("/api/posts", async (req, res) => {
    try {
        const posts = await PostsRepository.findMany()
        res.status(200).json(posts)
    } catch (error) {
        console.error(error)
        res.status(500).send("Something went wrong")
    }
})

router.get("/api/posts/:postId", async (req, res) => {
    const postId = req.params.postId

    try {
        const post = await PostsRepository.findById(postId)
        if (!post) return res.status(404).json({ error: "Post not found" })
        res.status(200).json(post)
    } catch (error) {
        console.error(error)
        res.status(500).send("Something went wrong")
    }
})

router.post(
    "/api/posts",
    requireAuth,
    [body("description").notEmpty(), body("image").notEmpty()],
    async (req: Request, res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json(errors)
        }

        const userId = req.user?.id!
        const { description, image } = req.body as CreatePostDto

        try {
            const post = await PostsRepository.insertOne({
                description,
                userId,
                image,
            })

            return res.status(201).send(post)
        } catch (error) {
            return res.status(500).send("something went wrong")
        }
    }
)

export { router as postsRouter }
