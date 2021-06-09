import express from "express";
import { pool } from "./db/pool";
import { logger } from "./middlewares/logger";
import { postsRouter } from "./routes/posts";
import morgan from "morgan";
import cookieSession from "cookie-session";

import { authRouter } from "./routes/auth";

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

if (app.get("env") === "development") {
  app.use(morgan("dev"));
}

app.use(
  cookieSession({
    signed: false,
  })
);

// Routers
app.use(postsRouter);
app.use(authRouter);

app.all("*", (req, res) => {
  res.status(404).send("No page found");
});

if (!process.env.JWT_KEY) {
  process.exit(1);
}

pool
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Listening on port " + PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
