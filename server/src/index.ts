import express from "express";
import { logger } from "./middlewares/logger";
import { postsRouter } from "./routes/posts";
import { usersRouter } from "./routes/users";
import morgan from "morgan";

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

if (app.get("env") === "development") {
  app.use(morgan("dev"));
}

// Routers
app.use(postsRouter);
app.use(usersRouter);

app.use((req, res) => {
  res.status(404).send("No page found");
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
