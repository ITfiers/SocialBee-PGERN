import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { pool } from "../db/pool";
import { requireAuth } from "../middlewares/require-auth";
import { Post } from "../types";

const router = Router();

router.get("/api/posts", async (req, res) => {
  const response = await pool.query<Post[]>("SELECT * FROM posts;", []);

  res.status(200).json(response.rows);
});

router.get("/api/posts/:postId", async (req, res) => {
  const postId = req.params.postId;

  const response = await pool.query<Post>("SELECT * FROM posts WHERE id = $1", [
    postId,
  ]);

  res.status(200).json(response.rows[0]);
});

router.post(
  "/api/posts",
  requireAuth,
  [body("description").notEmpty(), body("image").notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    const userId = req.user?.id!;

    try {
      const response = await pool.query<Post>(
        "INSERT INTO posts (description, image, user_id) VALUES ($1, $2, $3) RETURNING *;",
        [req.body.description, req.body.image, userId]
      );
      return res.status(201).send(response.rows[0]);
    } catch (error) {
      return res.status(500).send("something went wrong");
    }
  }
);

export { router as postsRouter };
