import { Router } from "express";
import { db } from "../db";
import { Post } from "../types";

const router = Router();

router.get("/api/posts", async (req, res) => {
  const data = await db.posts.findMany();

  res.status(200).json(data);
});

router.get("/api/posts/:postId", async (req, res) => {
  const postId = req.params.postId;

  const data = await db.posts.findFirst({
    where: {
      id: postId,
    },
  });

  res.status(200).json(data);
});

export { router as postsRouter };
