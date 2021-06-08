import { Router } from "express";
import { pool } from "../db/pool";
import { UserDto } from "../types/dtos";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Password } from "../services/password";

const router = Router();

router.post(
  "/api/auth/signup",
  [
    body("email").isEmail().notEmpty().withMessage("Email is required"),
    body("password")
      .notEmpty()
      .isLength({ min: 8 })
      .withMessage(
        "Password is required and should have more than 8 characters"
      ),
    body("username").notEmpty().withMessage("username is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    const body = req.body as UserDto;

    const hashedPassword = await Password.hash(body.password);

    try {
      const response = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
        [body.username, body.email, hashedPassword]
      );
      res.status(201).send(response.rows);
    } catch (error) {
      console.error(error);

      res.status(500).send("Some error happened");
    }
  }
);

router.post(
  "/api/auth/signin",
  [
    body("email").isEmail().notEmpty().withMessage("Email is required"),
    body("password")
      .notEmpty()
      .isLength({ min: 8 })
      .withMessage(
        "Password is required and should have more than 8 characters"
      ),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    try {
      const response = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [req.body.email]
      );
      // if user exist in db
      if (response.rowCount === 0)
        return res.status(400).json({ error: "Invalid email or password" });

      const user = response.rows[0];

      const isValid = await Password.compare(req.body.password, user.password);

      if (!isValid)
        return res.status(400).json({ error: "Invalid email or password" });

      res.status(200).send(true);
    } catch (error) {
      console.error(error);
      res.status(500).send("Some error occurred");
    }
  }
);

export { router as authRouter };
