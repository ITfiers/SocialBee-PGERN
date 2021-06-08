import { Router } from "express";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";

import { UserDto } from "../types/dtos";

const router = Router();

router.get("/api/users", async (req, res) => {
  try {
    const data = await db.users.findMany();

    res.status(200).json(data);
  } catch (error) {
    return res.status(500).send("Some error happened");
  }
});

router.post("/api/users", async (req, res) => {
  const body = req.body as UserDto;

  console.log(body);
  if (!body?.email || !body?.username || !body?.avatar)
    return res.status(400).send();

  try {
    const data = await db.users.create({
      data: {
        id: uuidv4(),
        email: body.email,
        username: body.username,
        avatar: body.avatar,
      },
    });
    res.status(201).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Some error happened");
  }
});

export { router as usersRouter };
