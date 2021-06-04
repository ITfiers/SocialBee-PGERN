import { Router } from "express";
import { pool } from "../db/pool";
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

export { router as postsRouter };
