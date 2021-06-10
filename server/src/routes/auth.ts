import { Router } from "express";
import { pool } from "../db/pool";
import { SignInDto, SignUpDto } from "../types/dtos";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Password } from "../services/password";
import { Token } from "../services/token";
import { UsersRepository } from "../repos/usersRepository";

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

    const { email, password, username, avatar } = req.body as SignUpDto;

    const hashedPassword = await Password.hash(password);

    try {
      const userByEmail = await UsersRepository.findByEmail(email);
      const userWithUsername = await UsersRepository.findByUsername(username);

      if (!userByEmail) {
        return res.status(400).json({ message: "email already taken" });
      }

      if (!userWithUsername) {
        return res.status(400).json({ message: "username already taken" });
      }

      const userResponse = await UsersRepository.insertOne({
        email,
        hashedPassword,
        username,
        avatar,
      });

      const token = Token.sign(userResponse);

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
    const { email, password } = req.body as SignInDto;

    try {
      const user = await UsersRepository.findByEmail(email);
      // if user exist in db
      if (!user)
        return res.status(400).json({ error: "Invalid email or password" });

      const passwordMatch = await Password.compare(password, user.password);

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
