import { Router } from "express";
import { pool } from "../db/pool";
import { UserDto } from "../types/dtos";

const router = Router();

router.get("/api/users", async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM users;");
    res.json(response.rows);
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
    const response = await pool.query(
      "INSERT INTO users (id, username, email, avatar) VALUES (gen_random_uuid(), $1, $2, $3)",
      [body.username, body.email, body.avatar]
    );
    res.status(201).send(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Some error happened");
  }
});

export { router as usersRouter };
