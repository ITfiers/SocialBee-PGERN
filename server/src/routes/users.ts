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

export { router as usersRouter };
