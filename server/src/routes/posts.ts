import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { pool } from "../db/pool";
import { requireAuth } from "../middlewares/requireAuth";
import { Post } from "../types";

const router = Router();

router.get("/api/posts", async (req, res) => {
  const response = await pool.query<Post[]>("SELECT * FROM posts;", []);

  console.log(req.session.jwt);
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
  (req: Request, res: Response) => {
    console.log((req as any).user);
    return res.status(200).send();
  }
);

export { router as postsRouter };
