import { Router } from "express";
import { pool } from "../db/pool";
import { UserDto } from "../types/dtos";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
import { Token } from "../services/token";

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
      const emailReponse = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [req.body.email]
      );
      const usernameResponse = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [req.body.username]
      );

      if (emailReponse.rowCount > 0) {
        return res.status(400).json({ message: "email already taken" });
      }

      if (usernameResponse.rowCount > 0) {
        return res.status(400).json({ message: "username already taken" });
      }

      const response = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username;",
        [body.username, body.email, hashedPassword]
      );

      const token = Token.sign({
        id: response.rows[0].id,
        username: response.rows[0].username,
      });

      req.session = {
        jwt: token,
      };

      res.status(201).json({});
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
        "SELECT * FROM users WHERE email = $1;",
        [req.body.email]
      );
      // if user exist in db
      if (response.rowCount === 0)
        return res.status(400).json({ error: "Invalid email or password" });

      const user = response.rows[0];

      const passwordMatch = await Password.compare(
        req.body.password,
        user.password
      );

      if (!passwordMatch)
        return res.status(400).json({ error: "Invalid email or password" });
      const token = Token.sign({ id: user.id, username: user.username });

      req.session = {
        jwt: token,
      };

      res.status(200).json({});
    } catch (error) {
      console.error(error);
      res.status(500).send("Some error occurred");
    }
  }
);

router.post("/api/auth/signout", (req, res) => {
  req.session = null;
  res.status(200).send();
});

export { router as authRouter };
